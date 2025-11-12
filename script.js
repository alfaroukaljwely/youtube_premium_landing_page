// =============================
// Set current year in footer
// =============================
document.getElementById("current-year").textContent = new Date().getFullYear();

// =============================
// Smooth scroll for anchor links
// =============================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// =============================
// Add animation to elements on scroll (Intersection Observer)
// =============================
const animateElements = document.querySelectorAll(
  ".pricing-card, .feature-card, .why-us-point, .testimonial-card"
);

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fadeIn");
        observer.unobserve(entry.target); // ما نراقبش تاني بعد ما يتعمل أنيميشن
      }
    });
  },
  { threshold: 0.2 } // يبدأ الأنيميشن لما 20% من العنصر يدخل الشاشة
);

animateElements.forEach((element) => {
  element.style.opacity = "0"; // بداية مخفي
  observer.observe(element);
});

// =============================
// Countdown timer (دورات متكررة كل 14 يوم)
// =============================
const cycleDays = 14;
// تاريخ بداية الدورة الأولى (مثلاً 1 سبتمبر 2025)
const startDate = new Date("2025-09-01T00:00:00");

function getNextCycleEndDate() {
  const now = new Date();
  const msPerCycle = cycleDays * 24 * 60 * 60 * 1000;
  const timeSinceStart = now - startDate;
  const cyclesPassed = Math.floor(timeSinceStart / msPerCycle);
  const nextCycleEnd = new Date(
    startDate.getTime() + (cyclesPassed + 1) * msPerCycle
  );
  return nextCycleEnd;
}

function updateCountdown() {
  const endDate = getNextCycleEndDate();
  const now = new Date().getTime();
  const distance = endDate.getTime() - now;

  if (distance < 0) {
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days.toString().padStart(2, "0");
  document.getElementById("hours").innerHTML = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").innerHTML = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").innerHTML = seconds
    .toString()
    .padStart(2, "0");

  if (days < 1) {
    document.querySelector(".countdown").classList.add("animate-pulse");
  } else {
    document.querySelector(".countdown").classList.remove("animate-pulse");
  }
}

// شغل التايمر أول ما الصفحة تفتح
updateCountdown();
setInterval(updateCountdown, 1000);

// =============================
// Add hover effect to pricing cards
// =============================
const pricingCards = document.querySelectorAll(".pricing-card");

pricingCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    if (!this.classList.contains("featured")) {
      pricingCards.forEach((otherCard) => {
        if (!otherCard.classList.contains("featured")) {
          otherCard.style.transform = "scale(0.98)";
          otherCard.style.opacity = "0.8";
        }
      });
      this.style.transform = "translateY(-10px)";
      this.style.opacity = "1";
    }
  });

  card.addEventListener("mouseleave", function () {
    if (!this.classList.contains("featured")) {
      pricingCards.forEach((otherCard) => {
        if (!otherCard.classList.contains("featured")) {
          otherCard.style.transform = "scale(1)";
          otherCard.style.opacity = "1";
        }
      });
    }
  });
});

// FAQ Accordion
document.addEventListener("DOMContentLoaded", function () {
  const accordionItems = document.querySelectorAll(".accordion-item");

  // Close all accordion items except the first one
  function closeAllItems(exceptItem = null) {
    accordionItems.forEach((item) => {
      if (item !== exceptItem) {
        const header = item.querySelector(".accordion-header");
        const panel = item.querySelector(".accordion-panel");

        item.classList.remove("active");
        header.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      }
    });
  }

  // Toggle accordion item
  function toggleAccordion(header) {
    const item = header.parentElement;
    const panel = header.nextElementSibling;
    const isExpanded = header.getAttribute("aria-expanded") === "true";

    // Close all items first
    closeAllItems(isExpanded ? null : item);

    // Toggle current item if not expanded
    if (!isExpanded) {
      item.classList.add("active");
      header.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  // Initialize accordion
  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const panel = item.querySelector(".accordion-panel");

    // Set initial state
    header.setAttribute("aria-expanded", "false");

    // Add click event
    header.addEventListener("click", () => {
      toggleAccordion(header);
    });

    // Add keyboard navigation
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleAccordion(header);
      }
    });

    // Set initial max-height for open panels
    if (item.classList.contains("active")) {
      header.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });

  // Close all panels by default
  closeAllItems();
});

// Floating Buttons Functionality
const floatingButtons = document.querySelector('.floating-buttons');
const backToTopButton = document.getElementById('backToTop');
const whatsappButton = document.querySelector('.whatsapp-button');

let isScrolling = false;
let lastScrollTop = 0;
const SCROLL_THRESHOLD = 200;

// Toggle buttons visibility based on scroll position
function toggleFloatingButtons() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  const isScrollingDown = scrollPosition > lastScrollTop;
  
  // Only update if scroll position is significant
  if (Math.abs(scrollPosition - lastScrollTop) < 5) return;
  
  // Show/hide based on scroll position and direction
  if (scrollPosition > SCROLL_THRESHOLD) {
    floatingButtons.classList.add('show');
    
    // Add a small delay between button animations
    const buttons = [backToTopButton, whatsappButton];
    buttons.forEach((btn, index) => {
      if (btn) {
        btn.style.transitionDelay = `${index * 0.1}s`;
      }
    });
  } else {
    floatingButtons.classList.remove('show');
    // Reset transition delays when hiding
    [backToTopButton, whatsappButton].forEach(btn => {
      if (btn) btn.style.transitionDelay = '0s';
    });
  }
  
  lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition;
}

// Smooth scroll to top
function scrollToTop(e) {
  e.preventDefault();
  
  if (isScrolling) return;
  isScrolling = true;
  
  // Add a class to disable hover effects during scroll
  backToTopButton.classList.add('scrolling');
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Re-enable button after scroll completes
  setTimeout(() => {
    backToTopButton.classList.remove('scrolling');
    isScrolling = false;
  }, 1000);
}

// Handle WhatsApp button click
function handleWhatsAppClick(e) {
  // Add click animation
  e.currentTarget.classList.add('clicked');
  setTimeout(() => {
    e.currentTarget.classList.remove('clicked');
  }, 300);
  
  // The actual navigation is handled by the anchor tag's href
  // We'll let the default behavior handle the link opening
}

// Throttle scroll events for better performance
let scrollTimeout;
function handleScroll() {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(toggleFloatingButtons);
}

// Initialize
function initFloatingButtons() {
  // Set initial state
  toggleFloatingButtons();
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  if (backToTopButton) {
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Keyboard navigation for back to top
    backToTopButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop(e);
      }
    });
  }
  
  if (whatsappButton) {
    whatsappButton.addEventListener('click', handleWhatsAppClick);
    
    // Keyboard navigation for WhatsApp button
    whatsappButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        whatsappButton.click();
      }
    });
  }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initFloatingButtons);
