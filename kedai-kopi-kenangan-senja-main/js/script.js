// Navigasi, pencarian, dan panel keranjang
const navbarNav = document.querySelector('.navbar-nav');
const hamburgerMenu = document.querySelector('#hamburger-menu');
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');
const shoppingCart = document.querySelector('.shopping-cart');
const cartButton = document.querySelector('#shopping-cart-button');

hamburgerMenu?.addEventListener('click', (e) => {
  e.preventDefault();
  navbarNav.classList.toggle('active');
});

searchButton?.addEventListener('click', (e) => {
  e.preventDefault();
  searchForm.classList.toggle('active');
  if (searchForm.classList.contains('active')) searchBox.focus();
});

cartButton?.addEventListener('click', (e) => {
  e.preventDefault();
  shoppingCart.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (hamburgerMenu && !hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }
  if (searchButton && !searchButton.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }
  if (cartButton && !cartButton.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});
