import ToggleMenu from "./ToggleMenu.js";
const toggleNav = new ToggleMenu(
  "btn-mobile",
  "nav",
  "active",
  "aria-expanded"
);
toggleNav.init();

import Slider from "./Slider.js";
const slider = new Slider(".manual-btn", "radio1");
slider.initSlider();

import cart from "./cart.js";
cart();
