// ============================================================
// HEADER HIDE/SHOW ON SCROLL
// Hides the header when scrolling down, reveals it on scroll up
// ============================================================
let lastScroll = 0;
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    header.classList.add("hide"); // scrolling down — hide header
  } else {
    header.classList.remove("hide"); // scrolling up — show header
  }

  lastScroll = currentScroll;
});

// ============================================================
// PRODUCT DROPDOWN MENU — Toggle open/close on click
// ============================================================
const dropdown = document.getElementById("productDropdown");

dropdown.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

// ============================================================
// IMAGE ZOOM — Magnifier lens on product main image hover
// Shows a zoomed preview panel when hovering over the image
// ============================================================
const img = document.getElementById("mainImg");
const lens = document.getElementById("lens");
const preview = document.getElementById("zoomPreview");
const container = document.getElementById("mainImageContainer");

const zoom = 3; // zoom multiplier (3x magnification)

container.addEventListener("mousemove", moveLens);
container.addEventListener("mouseenter", () => {
  lens.style.display = "block";
  preview.style.display = "block";
});
container.addEventListener("mouseleave", () => {
  lens.style.display = "none";
  preview.style.display = "none";
});

function moveLens(e) {
  const rect = container.getBoundingClientRect();

  // Get cursor position relative to the image container
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  // Center the lens on the cursor
  x = x - lens.offsetWidth / 2;
  y = y - lens.offsetHeight / 2;

  // Clamp lens so it doesn't overflow the container edges
  if (x > container.offsetWidth - lens.offsetWidth)
    x = container.offsetWidth - lens.offsetWidth;
  if (x < 0) x = 0;

  if (y > container.offsetHeight - lens.offsetHeight)
    y = container.offsetHeight - lens.offsetHeight;
  if (y < 0) y = 0;

  lens.style.left = x + "px";
  lens.style.top = y + "px";

  // Update the zoom preview panel background to match lens position
  preview.style.backgroundImage = `url(${img.src})`;
  preview.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
  preview.style.backgroundPosition = `-${x * zoom}px -${y * zoom}px`;
}

// ============================================================
// FAQ ACCORDION — Toggle open/close, only one item open at a time
// ============================================================
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");

  // Close all open FAQ items first
  document
    .querySelectorAll(".faq-section .faq-item")
    .forEach((el) => el.classList.remove("open"));

  // If the clicked item was not already open, open it
  if (!isOpen) item.classList.add("open");
}

// ============================================================
// APPLICATIONS IMAGE SLIDER — Horizontal card scroll with prev/next arrows
// ============================================================
(function () {
  const track = document.getElementById("appsTrack");
  const prevBtn = document.getElementById("appsPrev");
  const nextBtn = document.getElementById("appsNext");

  if (!track) return;

  const cardWidth = 420 + 16; // card width + gap between cards
  let currentIndex = 0;

  // Calculate how many slides are scrollable based on visible cards
  function getMaxIndex() {
    const cards = track.children.length;
    const visible = Math.floor(track.parentElement.offsetWidth / cardWidth);
    return Math.max(0, cards - visible);
  }

  // Move the track to the given index position
  function slideTo(index) {
    const max = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, max));
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  prevBtn.addEventListener("click", () => slideTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => slideTo(currentIndex + 1));

  // Highlight the clicked card as active
  track.querySelectorAll(".app-card").forEach((card) => {
    card.addEventListener("click", () => {
      track
        .querySelectorAll(".app-card")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
  });
})();

// ============================================================
// MANUFACTURING PROCESS TABS — Switch content panels by step tab
// Prev/Next image arrows also cycle through the step tabs
// ============================================================
(function () {
  const tabs = document.querySelectorAll(".mfg-section .mfg-tab");
  const panels = document.querySelectorAll(".mfg-section .mfg-panel");

  // Activate the clicked tab and show its matching content panel
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Deactivate all tabs, then activate the clicked one
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Hide all panels, then show the matching one
      panels.forEach((p) => {
        p.classList.remove("active");
        if (p.dataset.panel === target) p.classList.add("active");
      });
    });
  });

  const tabList = Array.from(tabs);

  // Clicking the left arrow goes to the previous step tab
  document.querySelectorAll(".mfg-section .mfg-img-prev").forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeTab = document.querySelector(".mfg-section .mfg-tab.active");
      const idx = tabList.indexOf(activeTab);
      const prev = tabList[idx - 1];
      if (prev) prev.click();
    });
  });

  // Clicking the right arrow goes to the next step tab
  document.querySelectorAll(".mfg-section .mfg-img-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeTab = document.querySelector(".mfg-section .mfg-tab.active");
      const idx = tabList.indexOf(activeTab);
      const next = tabList[idx + 1];
      if (next) next.click();
    });
  });
})();

// ============================================================
// TESTIMONIALS SLIDER — Auto-sliding cards with dot navigation
// Auto-advances every 4 seconds; pauses when user clicks a dot
// ============================================================
(function () {
  const track = document.getElementById("testiTrack");
  const dotsContainer = document.getElementById("testiDots");
  if (!track) return;

  const cards = Array.from(track.children);
  const cardWidth = 280 + 20; // card width + gap between cards
  let current = 0;

  // Calculate how many cards are visible at the current viewport width
  function getVisible() {
    return Math.floor((track.parentElement.offsetWidth - 80) / cardWidth) || 1;
  }

  // Total number of dot indicators needed
  function totalDots() {
    return Math.ceil(cards.length / getVisible());
  }

  // Rebuild dot indicators (called on load and on resize)
  function buildDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalDots(); i++) {
      const dot = document.createElement("button");
      dot.className = "testi-dot" + (i === current ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Scroll the track to the given dot/page index
  function goTo(index) {
    const max = totalDots() - 1;
    current = Math.max(0, Math.min(index, max));
    track.style.transform = `translateX(-${current * getVisible() * cardWidth}px)`;

    // Sync active state on all dots
    document.querySelectorAll(".testi-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  // Auto-advance slides every 4 seconds
  let autoSlide = setInterval(() => {
    goTo(current + 1 < totalDots() ? current + 1 : 0);
  }, 4000);

  // Stop auto-slide when user manually clicks a dot
  dotsContainer.addEventListener("click", () => {
    clearInterval(autoSlide);
  });

  buildDots();

  // Recalculate dots and reset position on window resize
  window.addEventListener("resize", () => {
    buildDots();
    goTo(0);
  });
})();

// ============================================================
// MODALS — Open and close popup dialogs
// Used for: "Download Catalogue" and "Request a Quote" modals
// ============================================================

// Open a modal by its ID and lock page scroll
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

// Close a modal by its ID and restore page scroll
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Close modal when clicking on the dark backdrop (outside the modal box)
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
});

// Close any open modal when the Escape key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.open").forEach((modal) => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    });
  }
});
