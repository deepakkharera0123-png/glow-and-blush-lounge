document.addEventListener('DOMContentLoaded', () => {

  // WhatsApp Number (Country code + 10-digit number, without + or spaces)
  const BEAUTY_PARLOUR_WHATSAPP = "919876543210"; 

  // ==================== 1. WHATSAPP POPUP MODAL ====================
  const bookingModal = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const waForm = document.getElementById('whatsapp-booking-form');
  let currentServiceIntent = "General Beauty Consultation";

  function openModal(serviceTitle = 'Book an Appointment') {
    currentServiceIntent = serviceTitle;
    if (modalTitle) modalTitle.textContent = serviceTitle;
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  document.querySelectorAll('.trigger-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const intent = btn.getAttribute('data-intent') || 'Beauty Consultation';
      openModal(intent);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('wa-name')?.value.trim() || 'Client';
      const phone = document.getElementById('wa-phone')?.value.trim() || 'N/A';
      const service = document.getElementById('wa-service')?.value || currentServiceIntent;
      const date = document.getElementById('wa-date')?.value || 'Earliest Available';
      const time = document.getElementById('wa-time')?.value || 'Standard Slot';

      const message = `🌸 *GLOW & BLUSH // NEW APPOINTMENT* 🌸\n\n` +
                      `*Client Name:* ${name}\n` +
                      `*Phone:* ${phone}\n` +
                      `*Selected Service / Combo:* ${service}\n` +
                      `*Preferred Date:* ${date}\n` +
                      `*Preferred Time Slot:* ${time}\n\n` +
                      `_Sent via glowandblush website portal_`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${BEAUTY_PARLOUR_WHATSAPP}?text=${encodedMessage}`, '_blank');

      waForm.reset();
      closeModal();
    });
  }

  // ==================== 2. MOBILE MENU ====================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');

  function toggleMobileMenu() {
    navMenu?.classList.toggle('active');
    navBackdrop?.classList.toggle('active');
  }

  function closeMobileMenu() {
    navMenu?.classList.remove('active');
    navBackdrop?.classList.remove('active');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileMenu);

  // ==================== 3. LIVE BRIDAL & BEAUTY BILL CALCULATOR ====================
  const billCheckboxes = document.querySelectorAll('.bill-checkbox');
  const totalPriceText = document.getElementById('total-price-text');
  const totalTimeText = document.getElementById('total-time-text');
  const totalCountText = document.getElementById('total-count-text');
  const bookCalcPackageBtn = document.getElementById('book-calc-package-btn');

  if (billCheckboxes.length > 0) {
    function updateBillCalculation() {
      let totalPrice = 0;
      let totalTime = 0;
      let count = 0;
      let serviceNames = [];

      billCheckboxes.forEach(cb => {
        if (cb.checked) {
          totalPrice += parseInt(cb.getAttribute('data-price') || '0', 10);
          totalTime += parseInt(cb.getAttribute('data-time') || '0', 10);
          serviceNames.push(cb.getAttribute('data-name'));
          count++;
        }
      });

      if (totalPriceText) totalPriceText.textContent = `₹${totalPrice.toLocaleString()}`;
      if (totalTimeText) totalTimeText.textContent = `${totalTime} mins`;
      if (totalCountText) totalCountText.textContent = `${count} item${count === 1 ? '' : 's'}`;

      if (count > 0 && bookCalcPackageBtn) {
        bookCalcPackageBtn.removeAttribute('disabled');
        bookCalcPackageBtn.onclick = () => {
          const summary = serviceNames.join(' + ');
          const formattedIntent = `Custom Parlour Combo (${summary}) - Total: ₹${totalPrice.toLocaleString()}`;
          openModal(formattedIntent);
        };
      } else if (bookCalcPackageBtn) {
        bookCalcPackageBtn.setAttribute('disabled', 'true');
      }
    }

    billCheckboxes.forEach(cb => cb.addEventListener('change', updateBillCalculation));
  }

  // ==================== 4. PRICEBOOK CATEGORY FILTER ====================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const menuRows = document.querySelectorAll('.menu-item-row');

  if (filterTabs.length > 0 && menuRows.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selectedCategory = tab.getAttribute('data-category');

        menuRows.forEach(row => {
          const rowCat = row.getAttribute('data-category');
          if (selectedCategory === 'all' || rowCat === selectedCategory) {
            row.style.display = 'flex';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // ==================== 5. STEPPED PHOTO SLIDER ====================
  const track = document.getElementById('slider-track');
  const cards = document.querySelectorAll('.slider-card');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (track && cards.length > 0) {
    let currentIndex = 0;
    const totalCards = cards.length;
    let autoPlayTimer = null;

    function getVisibleCards() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, totalCards - getVisibleCards());
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateSlider();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const cardWidth = cards[0].offsetWidth;
      const gap = 20;
      const offset = currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;

      const dots = document.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function nextSlide() {
      const maxIdx = getMaxIndex();
      if (currentIndex >= maxIdx) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateSlider();
    }

    function prevSlide() {
      const maxIdx = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = maxIdx;
      } else {
        currentIndex--;
      }
      updateSlider();
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 2500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoPlayTimer);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    createDots();
    updateSlider();
    startAutoPlay();

    window.addEventListener('resize', () => {
      createDots();
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updateSlider();
    });
  }

  // ==================== 6. ONE-TIME POP-IN FADE ====================
  const revealTarget = document.querySelector('.reveal-on-scroll');
  if (revealTarget) {
    const popObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('popped-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    popObserver.observe(revealTarget);
  }

});