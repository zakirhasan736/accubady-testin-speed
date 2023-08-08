let scriptLoaded = false;

async function loadTidioChat() {
  const script = document.createElement('script');
  script.src = "//code.tidio.co/8vx06zmtbydc9kmrytjhab82vjpsegi2.js";
  document.head.append(script);
  return new Promise((resolve) => {
      script.onload = resolve;
  });
}

function executeTidioChat() {
  loadTidioChat().then(() => {
      console.log("Tidio Chat script loaded!");
      // Add any additional code here that needs to run after the script has loaded
  });
}

function handleScroll() {
  if (!scriptLoaded) {
    executeTidioChat();
    scriptLoaded = true; // prevent the script from being loaded multiple times
    window.removeEventListener('scroll', handleScroll); // remove the listener since we no longer need it
  }
}

window.addEventListener('scroll', handleScroll);



/*async function loadTidioChat() {
  const script = document.createElement('script');
  script.src = "//code.tidio.co/8vx06zmtbydc9kmrytjhab82vjpsegi2.js";
  document.head.append(script);
  return new Promise((resolve) => {
      script.onload = resolve;
  });
}

function executeTidioChat() {
  loadTidioChat().then(() => {
      console.log("Tidio Chat script loaded!");
      // Add any additional code here that needs to run after the script has loaded
  });
}

window.addEventListener('DOMContentLoaded', executeTidioChat);
*/