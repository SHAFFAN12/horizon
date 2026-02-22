(function () {

  var $$ = function (selector, context) {
    var context = context || document;
    var elements = context.querySelectorAll(selector);
    return [].slice.call(elements);
  };

  function _fncSliderInit($slider, options) {
    var prefix = ".fnc-";

    var $slider = $slider;
    var $slidesCont = $slider.querySelector(prefix + "slider__slides");
    var $slides = $$(prefix + "slide", $slider);
    var $controls = $$(prefix + "nav__control", $slider);
    var $controlsBgs = $$(prefix + "nav__bg", $slider);
    var $progressAS = $$(prefix + "nav__control-progress", $slider);

    var numOfSlides = $slides.length;
    var curSlide = 1;
    var sliding = false;
    var slidingAT = +parseFloat(getComputedStyle($slidesCont)["transition-duration"]) * 1000;
    var slidingDelay = +parseFloat(getComputedStyle($slidesCont)["transition-delay"]) * 1000;

    var autoSlidingActive = false;
    var autoSlidingTO;
    var autoSlidingDelay = 5000; // default autosliding delay value
    var autoSlidingBlocked = false;

    var $activeSlide;
    var $activeControlsBg;
    var $prevControl;

    function setIDs() {
      $slides.forEach(function ($slide, index) {
        $slide.classList.add("fnc-slide-" + (index + 1));
      });

      $controls.forEach(function ($control, index) {
        $control.setAttribute("data-slide", index + 1);
        $control.classList.add("fnc-nav__control-" + (index + 1));
      });

      $controlsBgs.forEach(function ($bg, index) {
        $bg.classList.add("fnc-nav__bg-" + (index + 1));
      });
    };

    setIDs();

    function afterSlidingHandler() {
      $slider.querySelector(".m--previous-slide").classList.remove("m--active-slide", "m--previous-slide");
      $slider.querySelector(".m--previous-nav-bg").classList.remove("m--active-nav-bg", "m--previous-nav-bg");

      $activeSlide.classList.remove("m--before-sliding");
      $activeControlsBg.classList.remove("m--nav-bg-before");
      $prevControl.classList.remove("m--prev-control");
      $prevControl.classList.add("m--reset-progress");
      var triggerLayout = $prevControl.offsetTop;
      $prevControl.classList.remove("m--reset-progress");

      sliding = false;
      var layoutTrigger = $slider.offsetTop;

      if (autoSlidingActive && !autoSlidingBlocked) {
        setAutoslidingTO();
      }
    };

    function performSliding(slideID) {
      if (sliding) return;
      sliding = true;
      window.clearTimeout(autoSlidingTO);
      curSlide = slideID;

      $prevControl = $slider.querySelector(".m--active-control");
      $prevControl.classList.remove("m--active-control");
      $prevControl.classList.add("m--prev-control");
      $slider.querySelector(prefix + "nav__control-" + slideID).classList.add("m--active-control");

      $activeSlide = $slider.querySelector(prefix + "slide-" + slideID);
      $activeControlsBg = $slider.querySelector(prefix + "nav__bg-" + slideID);

      $slider.querySelector(".m--active-slide").classList.add("m--previous-slide");
      $slider.querySelector(".m--active-nav-bg").classList.add("m--previous-nav-bg");

      $activeSlide.classList.add("m--before-sliding");
      $activeControlsBg.classList.add("m--nav-bg-before");

      var layoutTrigger = $activeSlide.offsetTop;

      $activeSlide.classList.add("m--active-slide");
      $activeControlsBg.classList.add("m--active-nav-bg");

      setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
    };



    function controlClickHandler() {
      if (sliding) return;
      if (this.classList.contains("m--active-control")) return;
      if (options.blockASafterClick) {
        autoSlidingBlocked = true;
        $slider.classList.add("m--autosliding-blocked");
      }

      var slideID = +this.getAttribute("data-slide");

      performSliding(slideID);
    };

    $controls.forEach(function ($control) {
      $control.addEventListener("click", controlClickHandler);
    });

    // Toggle auto-sliding when clicking anywhere on the slider
    $slider.addEventListener("click", function (e) {
      if (e.target.closest('.fnc-nav__control') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('button')) return; // Ignore clicks on nav controls & form elements

      autoSlidingBlocked = !autoSlidingBlocked;
      $slider.classList.toggle("m--autosliding-blocked");

      if (autoSlidingBlocked) {
        window.clearTimeout(autoSlidingTO);
      } else {
        setAutoslidingTO();
      }
    });

    function setAutoslidingTO() {
      window.clearTimeout(autoSlidingTO);
      var delay = +options.autoSlidingDelay || autoSlidingDelay;
      curSlide++;
      if (curSlide > numOfSlides) curSlide = 1;

      autoSlidingTO = setTimeout(function () {
        performSliding(curSlide);
      }, delay);
    };

    if (options.autoSliding || +options.autoSlidingDelay > 0) {
      if (options.autoSliding === false) return;

      autoSlidingActive = true;
      setAutoslidingTO();

      $slider.classList.add("m--with-autosliding");
      var triggerLayout = $slider.offsetTop;

      var delay = +options.autoSlidingDelay || autoSlidingDelay;
      delay += slidingDelay + slidingAT;

      $progressAS.forEach(function ($progress) {
        $progress.style.transition = "transform " + (delay / 1000) + "s";
      });
    }

    $slider.querySelector(".fnc-nav__control:first-child").classList.add("m--active-control");

  };

  var fncSlider = function (sliderSelector, options) {
    var $sliders = $$(sliderSelector);

    $sliders.forEach(function ($slider) {
      _fncSliderInit($slider, options);
    });
  };

  window.fncSlider = fncSlider;
}());

/* not part of the slider scripts */

/* Slider initialization
options:
autoSliding - boolean
autoSlidingDelay - delay in ms. If audoSliding is on and no value provided, default value is 5000
blockASafterClick - boolean. If user clicked any sliding control, autosliding won't start again
*/
fncSlider(".example-slider", { autoSlidingDelay: 4000 });

/* Custom Navigation Logic */
var $portfolioBtn = document.querySelector(".fnc-slide__action-btn"); // Selects the first one (Home slide)
if ($portfolioBtn) {
  $portfolioBtn.addEventListener("click", function () {
    // Navigate to Slide 3 (Projects)
    // We can trigger a click on the 3rd control or use internal function if exposed. 
    // Since _fncSliderInit is internal, we can simulate click on nav control 3.
    var navControl3 = document.querySelector(".fnc-nav__control:nth-child(3)");
    if (navControl3) navControl3.click();
  });
}

/* --- PROJECT MODAL LOGIC --- */
var projectsData = [
  {
    "location": "Johar Chowrangi (Mega & Dual Signboards)",
    "display_type": "Panaflex",
    "dimensions": "71x35 & 60x35",
    "material": "Panaflex",
    "direction": "Johar Mor Towards Johar Chowrangi",
    "images": [
      "data/Johar Chowrangi (Mega & Dual Signboards)/1.jpeg",
      "data/Johar Chowrangi (Mega & Dual Signboards)/2.jpeg",
      "data/Johar Chowrangi (Mega & Dual Signboards)/3.jpeg"
    ]
  },
  {
    "location": "Johar Chowrangi",
    "display_type": "Panaflex",
    "dimensions": "71x35",
    "material": "Panaflex",
    "direction": "Johar Chowrangi Towards Munawar Chowrangi",
    "images": [
      "data/Johar Chowrangi Towards Munawar Chowrangi/1.jpeg",
      "data/Johar Chowrangi Towards Munawar Chowrangi/2.jpeg"
    ]
  },
  {
    "location": "Munawar Chowrangi Gulistane Johar",
    "display_type": "Panaflex",
    "dimensions": "65x30",
    "material": "Panaflex",
    "direction": "Kamran Chowrangi Towards Johar Chowrangi",
    "images": [
      "data/Munawar Chowrangi/1.jpeg",
      "data/Munawar Chowrangi/2.jpeg",
      "data/Munawar Chowrangi/3.jpeg",
      "data/Munawar Chowrangi/4.jpeg",
      "data/Munawar Chowrangi/5.jpeg"
    ]
  },
  {
    "location": "PIDC",
    "display_type": "Panaflex",
    "dimensions": "61x30",
    "material": "Panaflex",
    "direction": "Bahria Complex Towards PC Hotel",
    "images": [
      "data/PIDC/1.jpeg"
    ]
  },
  {
    "location": "Rashid Minhas Road at Millennium Mall",
    "display_type": "Panaflex",
    "dimensions": "30x70",
    "material": "Panaflex",
    "direction": "Millennium Towards Johar Mor",
    "images": [
      "data/Rashid Minhas Road at Millenium Mall/1.jpeg",
      "data/Rashid Minhas Road at Millenium Mall/2.jpeg",
      "data/Rashid Minhas Road at Millenium Mall/3.jpeg",
      "data/Rashid Minhas Road at Millenium Mall/4.jpeg",
      "data/Rashid Minhas Road at Millenium Mall/5.jpeg",
      "data/Rashid Minhas Road at Millenium Mall/6.jpeg"
    ]
  },
  {
    "location": "Shahra Faisal Nursery Towards Airport",
    "display_type": "Vinyl",
    "dimensions": "25x85",
    "material": "Vinyl",
    "direction": "Nursery Towards Airport",
    "images": [
      "data/Shahra Faisal Nursery Towards Airport/1.jpeg",
      "data/Shahra Faisal Nursery Towards Airport/2.jpeg",
      "data/Shahra Faisal Nursery Towards Airport/3.jpeg",
      "data/Shahra Faisal Nursery Towards Airport/4.jpeg"
    ]
  },
  {
    "location": "Shahrah Faisal (Mega & Dual Signboards)",
    "display_type": "Panaflex",
    "dimensions": "90x30 Roof Top & 120x20 Wall Panel",
    "material": "Panaflex",
    "direction": "Metropole Towards Airport",
    "images": [
      "data/Shahre Faisal (Mega & Dual Signboards)/1.jpeg",
      "data/Shahre Faisal (Mega & Dual Signboards)/2.jpeg",
      "data/Shahre Faisal (Mega & Dual Signboards)/3.jpeg",
      "data/Shahre Faisal (Mega & Dual Signboards)/4.jpeg",
      "data/Shahre Faisal (Mega & Dual Signboards)/5.jpeg"
    ]
  },
  {
    "location": "Shahra Faisal Airport Towards Nursery",
    "display_type": "Panaflex",
    "dimensions": "30x90",
    "material": "Panaflex",
    "direction": "Airport Towards Nursery",
    "images": [
      "data/shahra e faisal airport towards nursery/1.jpeg",
      "data/shahra e faisal airport towards nursery/2.jpeg",
      "data/shahra e faisal airport towards nursery/3.jpeg",
      "data/shahra e faisal airport towards nursery/4.jpeg"
    ]
  }
];

var currentProjectIndex = 0;
var currentImageIndex = 0;
var $modal = document.getElementById('projectModal');

function openProjectModal(index) {
  currentProjectIndex = index;
  currentImageIndex = 0;
  updateModalContent();
  $modal.style.display = 'flex';
  setTimeout(function () {
    $modal.classList.add('m--active');
  }, 10);
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeProjectModal() {
  $modal.classList.remove('m--active');
  setTimeout(function () {
    $modal.style.display = 'none';
  }, 500);
  document.body.style.overflow = ''; // Restore scroll
}

function updateModalContent() {
  var project = projectsData[currentProjectIndex];
  var images = project.images;

  document.getElementById('modalImage').src = images[currentImageIndex];
  document.getElementById('modalTitle').innerText = project.location.split('(')[0].trim();
  document.getElementById('modalLocation').innerText = project.location;
  document.getElementById('modalFormat').innerText = project.display_type;
  document.getElementById('modalDimensions').innerText = project.dimensions;
  document.getElementById('modalDirection').innerText = project.direction;
  document.getElementById('modalMaterial').innerText = project.material;

  // Update image counter if element exists
  var counter = document.getElementById('modalImageCounter');
  if (counter) {
    counter.innerText = (currentImageIndex + 1) + ' / ' + images.length;
  }
}

function nextProject() {
  currentProjectIndex = (currentProjectIndex + 1) % projectsData.length;
  currentImageIndex = 0;
  updateModalContent();
}

function prevProject() {
  currentProjectIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
  currentImageIndex = 0;
  updateModalContent();
}

function nextImage() {
  var images = projectsData[currentProjectIndex].images;
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateModalContent();
}

function prevImage() {
  var images = projectsData[currentProjectIndex].images;
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateModalContent();
}

// Keyboard nav
document.addEventListener('keydown', function (e) {
  if (!$modal.classList.contains('m--active')) return;

  if (e.key === 'Escape') closeProjectModal();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'n' || e.key === 'N') nextProject();
  if (e.key === 'p' || e.key === 'P') prevProject();
});
