import { settingsRender } from "./settings.js";
import { init } from "../main.js";
import dom from "./dom.js";

// Handling side buttons clicks
dom.sideButtons.allButtons.addEventListener("click", function (e) {
  if (e.target.classList.value.includes("button__reload")) {
    init();
  } else if (e.target.classList.value.includes("button__settings")) {
    settingsRender();
  } else if (
    e.target.classList.value.includes("button__github") ||
    e.target.classList.value.includes("github__icon")
  ) {
    window.open("https://github.com/Whale1902/dashboard", "_blank");
  } else return;
});
