import { settingsRender } from "./settings.js";
import { init } from "../script.js";
import dom from "./dom.js";

// Handling side buttons clicks
dom.sideButtons.allButtons.addEventListener("click", function (e) {
  if (e.target.classList.value.includes("button__reload")) {
    init();
  } else if (e.target.classList.value.includes("button__settings")) {
    settingsRender();
  } else if (e.target.classList.value.includes("button__github")) {
    window.open("https://github.com/Whale1902/dashboard", "_blank");
  } else return;
});
