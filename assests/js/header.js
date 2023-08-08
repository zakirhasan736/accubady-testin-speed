// Get references to the buttons and mobile navigation
const button1 = document.getElementById("triggerBtn");
const button2 = document.getElementById("closeBtn");
const mobileNav = document.querySelector(".mobilenav");

// Function to show the mobile navigation and add the "open" class
function showMobileNav() {
  mobileNav.classList.add("open");
}

// Function to hide the mobile navigation and remove the "open" class
function hideMobileNav() {
  mobileNav.classList.remove("open");
}

// Add click event listeners to the buttons
button1.addEventListener("click", showMobileNav);
button2.addEventListener("click", hideMobileNav);

