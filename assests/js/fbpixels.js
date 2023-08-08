// Function to initialize the Facebook Pixel
function initFacebookPixel() {
  if (window.fbq) return;

  window.fbq = function() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
  };
  
  if (!window._fbq) window._fbq = window.fbq;

  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = '2.0';
  window.fbq.queue = [];

  let script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  
  document.getElementsByTagName('script')[0].parentNode.insertBefore(script, document.getElementsByTagName('script')[0]);

  script.onload = function() {
      window.fbq('init', '1945100175864070');
      window.fbq('track', 'PageView');
  };
}

// Scroll listener
document.addEventListener('scroll', function() {
  // Load the Facebook Pixel once on the first scroll
  if(!window.fbPixelLoaded) {
      window.fbPixelLoaded = true;
      initFacebookPixel();
  }
});
