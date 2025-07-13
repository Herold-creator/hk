// public/js/menu.js

document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("nav-links");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("show");
    });
  }
});
