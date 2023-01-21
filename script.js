import { updateWeather } from "./scripts/weatherWidget.js";
import { updateCrypto } from "./scripts/cryptoWidget.js";
import { updateNews } from "./scripts/newsWidget.js";
import { setSearchListeners } from "./scripts/searchWidget.js";
import {
  setTodoListeners,
  loadTodosFromLocalStorage,
} from "./scripts/todoWidget.js";
import { themePick } from "./scripts/helpers.js";
import dom from "./scripts/dom.js";
import { colorSchemas, profileSettings } from "./scripts/settings.js";
import "./scripts/sideButtons.js";

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.code === "KeyI" && e.metaKey) {
    e.preventDefault();
    dom.searchWidget.input.focus();
  } else if (e.code === "KeyO" && e.metaKey) {
    e.preventDefault();
    dom.todoWidget.input.focus();
  } else if (e.code === "KeyU" && e.metaKey) {
    e.preventDefault();
    init();
  }
});

export const init = function () {
  updateWeather();
  updateCrypto();
  updateNews();
  loadTodosFromLocalStorage();
  setSearchListeners();
  setTodoListeners();
  themePick(colorSchemas[profileSettings.theme]);
};

init();
