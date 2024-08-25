export default class Tooltip {
  constructor() {
    this._tooltips = document.querySelectorAll(".btn-tooltip");
    this.showTooltip();
  }

  showTooltip() {
    const tooltipElement = document.createElement("div");

    this._tooltips.forEach((item) => {
      item.addEventListener("click", (event) => {
        const target = event.currentTarget;
        //console.log(target);

        tooltipElement.classList.add("tooltip");
        tooltipElement.textContent = target.dataset.content;
        document.body.appendChild(tooltipElement);

        const { right, top } = target.getBoundingClientRect();
        tooltipElement.style.top =
          top +
          target.offsetHeight / 2 -
          tooltipElement.offsetHeight / 2 +
          "px";
        tooltipElement.style.left = right + 10 + "px";
      });
    });
  }
}
