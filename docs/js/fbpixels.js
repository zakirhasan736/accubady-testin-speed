function initFacebookPixel(){var e;window.fbq||(window.fbq=function(){window.fbq.callMethod?window.fbq.callMethod.apply(window.fbq,arguments):window.fbq.queue.push(arguments)},window._fbq||(window._fbq=window.fbq),window.fbq.push=window.fbq,window.fbq.loaded=!0,window.fbq.version="2.0",window.fbq.queue=[],(e=document.createElement("script")).async=!0,e.src="https://connect.facebook.net/en_US/fbevents.js",document.getElementsByTagName("script")[0].parentNode.insertBefore(e,document.getElementsByTagName("script")[0]),e.onload=function(){window.fbq("init","1945100175864070"),window.fbq("track","PageView")})}document.addEventListener("scroll",function(){window.fbPixelLoaded||(window.fbPixelLoaded=!0,initFacebookPixel())});