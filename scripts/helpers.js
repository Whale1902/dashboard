import { MILLISECONDS_TO_UPDATE_DATA } from "./config.js";

// Get current time
export const timeNow = function () {
  const today = new Date();
  const monthNow = today.toLocaleString("default", {
    month: "short",
  });
  const now = `${monthNow} ${today.getDate()} ${today.getHours()}:${today.getMinutes()}`;
  return now;
};

// Show or hide element
// As arguments it takes element and its "show" css property (Grid, Inline-block or other)
export const toggleElement = function (element, showValue) {
  if (element.style.display === "none") {
    element.style.display = showValue;
  } else if (element.style.display === showValue) {
    element.style.display = "none";
  }
};

// Enable or disable input field or input fields
const toggleDasabled = function (elements) {
  if (elements.length > 0) {
    for (let el of elements) {
      el.disabled = el.disabled ? false : true;
    }
  } else {
    elements.disabled = elements.disabled ? false : true;
  }
};

// Mark element as good or bad by UI
export const markAs = function (element, mood) {
  if (mood === "good") {
    element.classList.remove("settings__input--bad");
    element.classList.add("settings__input--good");
  } else if (mood === "bad") {
    element.classList.remove("settings__input--good");
    element.classList.add("settings__input--bad");
  } else if (mood === "neutral") {
    element.classList.remove("settings__input--good");
    element.classList.remove("settings__input--bad");
  }
};

export const getData = function (url, callback) {
  if (!isNeedToUpdate(url)) {
    callback(JSON.parse(window.sessionStorage.getItem(url))[1]);
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        window.sessionStorage.setItem(url, JSON.stringify([Date.now(), data]));
        callback(JSON.parse(window.sessionStorage.getItem(url))[1]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const isNeedToUpdate = function (data) {
  if (!JSON.parse(window.sessionStorage.getItem(data))) return true;

  const now = Date.now();
  const lastUpdate = JSON.parse(window.sessionStorage.getItem(data))[0];
  const sinceLastUpdate = now - lastUpdate;

  if (sinceLastUpdate > MILLISECONDS_TO_UPDATE_DATA) {
    return true;
  } else {
    return false;
  }
};

export const getDataAndDisableinput = function (url, elements) {
  if (!isNeedToUpdate(url)) return;
  toggleDasabled(elements);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      window.sessionStorage.setItem(url, JSON.stringify([Date.now(), data]));
      toggleDasabled(elements);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Apply defined theme from settings
export const themePick = function (schema) {
  document.querySelector(":root").style.setProperty("--primary", schema[0]);
  document.querySelector(":root").style.setProperty("--secondary", schema[1]);
};

export const clearWidget = function (widget) {
  if (widget.innerHTML) {
    widget.innerHTML = "";
  }
};
