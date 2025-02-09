export default class Slider {
  constructor(manualBtn, radio1) {
    this.manualBtn = document.querySelector(manualBtn);
    this.radio1 = document.getElementById(radio1);
  }
  initSlider() {
    var cont = 1;

    if (this.manualBtn) {
      this.radio1.checked = true;

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
    }
  }
  init() {
    this.initSlider;
  }
}
