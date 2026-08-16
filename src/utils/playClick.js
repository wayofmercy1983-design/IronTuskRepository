import clickSound from "../assets/sounds/click.mp3";


const click = new Audio(clickSound);

click.volume = 0.18;
click.preload = "auto";

export function playClick() {
  click.currentTime = 0;
  click.play().catch(() => {});
}