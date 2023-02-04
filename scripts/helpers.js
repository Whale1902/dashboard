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
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      callback(data);
    });
};

export const getDataAndStoreInSessionStorage = function (url, callback) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      saveToSessionStorage(url, [Date.now(), data]);
    });
};

const saveToSessionStorage = function (key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
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
