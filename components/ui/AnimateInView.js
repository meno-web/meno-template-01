// AnimateInView.js - Animate children into view on scroll
// el and props are automatically available

var duration = '0.6s';
var delay = (props.delay || 0) + 's';

// Set initial hidden state via JS so content stays visible in the editor
el.style.opacity = '0';
el.style.transform = 'translateY(20px)';
el.style.transition = 'opacity ' + duration + ' ease-out ' + delay + ', transform ' + duration + ' ease-out ' + delay;

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      observer.unobserve(el);
    }
  });
}, { threshold: 0.15 });

observer.observe(el);
