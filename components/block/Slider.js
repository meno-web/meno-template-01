// Slider.js - Swiper-based slider
// el and props are automatically available via defineVars

var container = el.querySelector('[data-el="swiper"]');
var wrapper = el.querySelector('[data-el="swiper-wrapper"]');
var pagination = el.querySelector('[data-el="pagination"]');

if (!container || !wrapper) return;

container.classList.add('swiper');
wrapper.classList.add('swiper-wrapper');
Array.from(wrapper.children).forEach(function (c) { c.classList.add('swiper-slide'); });
if (pagination) pagination.classList.add('swiper-pagination');

var columns = parseInt(props.columns) || 3;
var gap = parseInt(props.gap) || 24;

var peek = props.cropped === false ? 0.2 : 0;

var config = {
  slidesPerView: 1 + peek,
  spaceBetween: gap,
  loop: props.loop !== false,
  pagination: { el: pagination, clickable: true },
  navigation: {
    prevEl: el.querySelector('[data-el="prev"]'),
    nextEl: el.querySelector('[data-el="next"]')
  },
  breakpoints: {
    541: { slidesPerView: Math.min(columns, 2) + peek },
    1025: { slidesPerView: columns + peek }
  }
};

if (props.autoplay === true) {
  config.autoplay = { delay: 4000, disableOnInteraction: false };
}

function init() {
  container.style.overflow = props.cropped === false ? 'visible' : 'hidden';
  wrapper.style.display = 'flex';
  wrapper.style.gridAutoFlow = 'initial';
  wrapper.style.gridAutoColumns = 'initial';
  wrapper.style.gap = '0px';
  wrapper.style.overflowX = 'initial';
  new Swiper(container, config);
}

// Wait for Swiper library if not yet loaded
if (typeof Swiper !== 'undefined') {
  init();
} else {
  var tries = 0;
  var poll = setInterval(function () {
    if (typeof Swiper !== 'undefined') { clearInterval(poll); init(); }
    else if (++tries > 50) clearInterval(poll);
  }, 100);
}
