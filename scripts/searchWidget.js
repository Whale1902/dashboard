import { profileSettings } from "./settings.js";
import dom from "./dom.js";

// Select default search engine from profile settings
document
  .getElementById(`search__option__${profileSettings.defaultSearch}`)
  .setAttribute("checked", "checked");

export const setSearchListeners = function () {
  // Search Widget: disabling input while input is clear
  dom.searchWidget.submit.disabled = true;
  // Allow user to search with at least one character in query — dynamic logic
  dom.searchWidget.input.addEventListener("input", function () {
    if (dom.searchWidget.input.value.length === 0) {
      dom.searchWidget.submit.disabled = true;
    } else if (dom.searchWidget.input.value.length > 0) {
      dom.searchWidget.submit.disabled = false;
    }
  });

  // Search
  dom.searchWidget.form.addEventListener("submit", function () {
    // Selecting checked search option
    const searchCheckedOption = document.querySelector(
      'input[name="search__option"]:checked'
    );

    // Open tab for the query via selected engine
    const targetUrl = `${searchCheckedOption.getAttribute("data-url")}${
      dom.searchWidget.input.value
    }`;
    window.open(targetUrl, "_blank");
  });
};
