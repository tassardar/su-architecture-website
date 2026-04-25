// SU Architect — main.js
// SU 건축사 사무소

(function () {
  'use strict';

  // Mark body as JS-enabled for progressive enhancement
  document.body.classList.add('js-enabled');

  // --- Navigation Controller ---
  var isOpen = false;
  var hamburgerBtn = document.querySelector('.hamburger-btn');
  var navOverlay = document.querySelector('.nav-overlay');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sidebar = document.querySelector('.sidebar');

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isOpen = true;
    hamburgerBtn.classList.add('is-active');
    navOverlay.classList.add('is-open');
    if (sidebar) {
      sidebar.classList.add('is-open');
    }
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    isOpen = false;
    hamburgerBtn.classList.remove('is-active');
    navOverlay.classList.remove('is-open');
    if (sidebar) {
      sidebar.classList.remove('is-open');
    }
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });

  // --- Project Filter Tabs ---
  var filterTabs = document.querySelectorAll('.filter-tab');
  var galleryItems = document.querySelectorAll('#projectGallery .gallery-item');

  if (filterTabs.length > 0 && galleryItems.length > 0) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // Update active tab
        filterTabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');

        // Filter gallery items
        galleryItems.forEach(function (item) {
          if (filter === '전체' || item.getAttribute('data-category') === filter) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // --- Project Modal ---
  var projectModal = document.getElementById('projectModal');
  if (projectModal) {
    var modalImages = document.getElementById('modalImages');
    var modalTitle = document.getElementById('modalTitle');
    var modalCategory = document.getElementById('modalCategory');
    var modalDesc = document.getElementById('modalDesc');
    var modalSpecs = document.getElementById('modalSpecs');
    var modalClose = projectModal.querySelector('.project-modal-close');
    var modalBackdrop = projectModal.querySelector('.project-modal-backdrop');

    document.querySelectorAll('.gallery-item[data-modal="true"]').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var title = this.getAttribute('data-title');
        var cat = this.getAttribute('data-category-label');
        var images = this.getAttribute('data-images').split(',');
        var desc = this.getAttribute('data-desc');
        var specs = this.getAttribute('data-specs');

        modalTitle.textContent = title;
        modalCategory.textContent = cat;
        modalImages.innerHTML = '';

        // Main large image
        var mainImg = document.createElement('img');
        mainImg.src = images[0].trim();
        mainImg.alt = title;
        mainImg.className = 'project-modal-main-img';
        mainImg.addEventListener('click', function() { openLightbox(this.src); });
        modalImages.appendChild(mainImg);

        // Thumbnail strip
        var thumbStrip = document.createElement('div');
        thumbStrip.className = 'project-modal-thumbs';
        images.forEach(function(src, idx) {
          var thumb = document.createElement('img');
          thumb.src = src.trim();
          thumb.alt = title + ' ' + (idx + 1);
          if (idx === 0) thumb.classList.add('is-active');
          thumb.addEventListener('click', function() {
            mainImg.src = this.src;
            thumbStrip.querySelectorAll('img').forEach(function(t) { t.classList.remove('is-active'); });
            this.classList.add('is-active');
          });
          thumbStrip.appendChild(thumb);
        });
        modalImages.appendChild(thumbStrip);
        modalDesc.innerHTML = '';
        desc.split('\\n\\n').forEach(function (p) {
          if (p.trim()) {
            var el = document.createElement('p');
            el.textContent = p.trim();
            modalDesc.appendChild(el);
          }
        });
        modalSpecs.innerHTML = '<p><span class="spec-label">' + specs.split(':')[0] + ':</span>' + specs.split(':').slice(1).join(':') + '</p>';

        projectModal.classList.add('is-open');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      projectModal.classList.remove('is-open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // --- Contact Form Validation ---
  var contactForm = document.getElementById('contactForm');
  var formConfirmation = document.getElementById('formConfirmation');

  if (contactForm) {
    var fields = {
      name: {
        input: document.getElementById('contact-name'),
        error: document.getElementById('error-name'),
        required: true
      },
      phone: {
        input: document.getElementById('contact-phone'),
        error: document.getElementById('error-phone'),
        required: false
      },
      message: {
        input: document.getElementById('contact-message'),
        error: document.getElementById('error-message'),
        required: true
      }
    };

    // Clear error when user starts typing
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (field.input) {
        field.input.addEventListener('input', function () {
          clearError(field);
        });
      }
    });

    function clearError(field) {
      field.input.classList.remove('is-invalid');
      field.error.textContent = '';
    }

    function showError(field, message) {
      field.input.classList.add('is-invalid');
      field.error.textContent = message;
    }

    function validateForm() {
      var isValid = true;

      // Name
      if (fields.name.input.value.trim() === '') {
        showError(fields.name, '이 필드는 필수입니다');
        isValid = false;
      } else {
        clearError(fields.name);
      }

      // Message
      if (fields.message.input.value.trim() === '') {
        showError(fields.message, '이 필드는 필수입니다');
        isValid = false;
      } else {
        clearError(fields.message);
      }

      return isValid;
    }

    function showConfirmation() {
      contactForm.style.display = 'none';
      formConfirmation.classList.add('is-visible');
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        showConfirmation();
      }
    });
  }
  // --- Lightbox ---
  function openLightbox(src) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  }

  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    lightboxClose.addEventListener('click', function() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    });
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- Blog Modal ---
  var blogModal = document.getElementById('blogModal');
  if (blogModal) {
    var blogModalImages = document.getElementById('blogModalImages');
    var blogModalDate = document.getElementById('blogModalDate');
    var blogModalTitle = document.getElementById('blogModalTitle');
    var blogModalText = document.getElementById('blogModalText');
    var blogModalClose = blogModal.querySelector('.blog-modal-close');
    var blogModalBackdrop = blogModal.querySelector('.blog-modal-backdrop');

    document.querySelectorAll('.blog-card[data-blog="true"]').forEach(function (card) {
      card.addEventListener('click', function () {
        var title = this.getAttribute('data-title');
        var date = this.getAttribute('data-date');
        var imagesStr = this.getAttribute('data-images');
        var body = this.getAttribute('data-body');

        var images = imagesStr ? imagesStr.split(',') : [];

        blogModalDate.textContent = date;
        blogModalTitle.textContent = title;
        blogModalImages.innerHTML = '';

        images.forEach(function (src) {
          var img = document.createElement('img');
          img.src = src.trim();
          img.alt = title;
          blogModalImages.appendChild(img);
        });

        blogModalText.innerHTML = '';
        body.split('\\n\\n').forEach(function (p) {
          if (p.trim()) {
            var el = document.createElement('p');
            el.textContent = p.trim();
            blogModalText.appendChild(el);
          }
        });

        blogModal.classList.add('is-open');
        blogModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeBlogModal() {
      blogModal.classList.remove('is-open');
      blogModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    blogModalClose.addEventListener('click', closeBlogModal);
    blogModalBackdrop.addEventListener('click', closeBlogModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && blogModal.classList.contains('is-open')) {
        closeBlogModal();
      }
    });
  }
})();
