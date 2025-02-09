export default class ToggleMenu {
  constructor(btn, nav, activeClass, attribute) {
    this.btn = document.getElementById(btn);
    this.nav = document.getElementById(nav);
    this.activeClass = activeClass;
    this.attribute = attribute;
  }

  toggleMenu(event) {
    if (event.type === "touchstart") event.preventDefault();
    this.nav.classList.toggle(this.activeClass);
    const active = this.nav.classList.contains(this.activeClass);
    event.currentTarget.setAttribute(this.attribute, active);
  }

  Events() {
    this.btn.addEventListener("click", (event) => this.toggleMenu(event));
    this.btn.addEventListener("touchstart", (event) => this.toggleMenu(event));
  }

  init() {
    if (this.btn && this.nav) {
      this.Events();
    }
  }
}
