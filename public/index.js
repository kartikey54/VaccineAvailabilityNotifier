const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const form = document.querySelector(".form-container");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  form.classList.toggle("margin-extra");
}
