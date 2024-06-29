// Nav
function initNav() {
  const bntMobile = document.getElementById("btn-mobile");

  function toggleMenu(event) {
    if (event.type === "touchstart") event.preventDefault();
    const nav = document.getElementById("nav");
    nav.classList.toggle("active");
    const active = nav.classList.contains("active");
    event.currentTarget.setAttribute("aria-expanded", active);
  }

  bntMobile.addEventListener("click", toggleMenu);
  bntMobile.addEventListener("touchstart", toggleMenu);
}
initNav();

// Slider
var radio = document.querySelector(".manual-btn");
var cont = 1;

document.getElementById("radio1").checked = true;

setInterval(() => {
  proximaImg();
}, 5000);

function proximaImg() {
  cont++;
  if (cont > 4) {
    cont = 1;
  }
  document.getElementById("radio" + cont).checked = true;
}
