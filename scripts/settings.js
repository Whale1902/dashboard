import { init } from "../script.js";
import { toggleElement, markAs, themePick } from "./helpers.js";
import { WEATHER_API_KEY } from "./config.js";
import dom from "./dom.js";

// Available color themes
export const colorSchemas = {
  colorDefault: ["#a597e9", "#74d68e"],
  colorBeige: ["#ece8dd", "#e1d7c6"],
  colorSage: ["#a6bb8d", "#61876e"],
  colorSky: ["#bfeaf5", "#82aae3"],
  colorSpace: ["#00abb3", "#eaeaea"],
};

// Default profile settings
export let profileSettings = {
  location: ["Kyiv", "Ukraine"],
  measurement: "metric",
  coins: ["bitcoin", "ethereum", "tether"],
  currency: "usd",
  defaultSearch: "google",
  theme: "colorBeige",
};

// Temporary settings holder, before it replace profile settings
export const tempProfileSettings = {
  location: profileSettings.location,
  measurement: profileSettings.measurement,
  coins: profileSettings.coins,
  currency: profileSettings.currency,
  defaultSearch: profileSettings.defaultSearch,
  theme: profileSettings.theme,
};

// Update profile settings if user's settings available
if (window.localStorage.length > 0) {
  profileSettings = JSON.parse(window.localStorage.getItem("profileSettings"));
}

// Fetches
export let listOftokens;
export const getAvailableTokens = function () {
  fetch("https://api.coingecko.com/api/v3/coins/list")
    .then((res) => res.json())
    .then((data) => (listOftokens = data));
};

export let listOfVSCurrencies;
export const getListOfVSCurrencies = function () {
  fetch("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
    .then((res) => res.json())
    .then((data) => {
      listOfVSCurrencies = data;
    });
};

// Render
export const settingsRender = function () {
  // Fetch all needed data
  getListOfVSCurrencies();
  getAvailableTokens();

  // Display Settigs Tab
  toggleElement(dom.settings.settingsTab, "inline-block");

  // Render theme selectors in their colors — settings render
  for (let option of dom.settings.colorOptions) {
    const prim = colorSchemas[option.getAttribute("for")][0];
    const sec = colorSchemas[option.getAttribute("for")][1];

    option.style.background = `linear-gradient(120deg, ${prim} 50%, ${sec} 0%`;
  }

  // Render current data on page — settings render
  dom.settings.locationInput.value = profileSettings.location[0];
  dom.settings.currencyInput.value =
    profileSettings.currency.toLocaleUpperCase();

  for (let i = 0; i < 3; i++) {
    coinsInputArr[i].value =
      profileSettings.coins[i][0].toLocaleUpperCase() +
      profileSettings.coins[i].slice(1);
  }

  document
    .getElementById(`measurement_${profileSettings.measurement}`)
    .setAttribute("checked", "checked");

  for (let element of document.querySelectorAll(
    `input[value=${profileSettings.defaultSearch}]`
  )) {
    element.setAttribute("checked", "checked");
  }

  for (let element of document.querySelectorAll(
    `input[value=${profileSettings.theme}]`
  )) {
    element.setAttribute("checked", "checked");
  }
};

// Saving the settings
export const saveSettings = function () {
  profileSettings.location = tempProfileSettings.location;
  profileSettings.coins = tempProfileSettings.coins;
  profileSettings.currency = tempProfileSettings.currency;

  profileSettings.measurement = document.querySelector(
    "input[name='measurement']:checked"
  ).value;

  profileSettings.defaultSearch = document.querySelector(
    "input[name='default__search']:checked"
  ).value;

  profileSettings.theme = document.querySelector(
    "input[name='colorSchema']:checked"
  ).value;

  window.localStorage.setItem(
    "profileSettings",
    JSON.stringify(profileSettings)
  );

  for (let inp of document.querySelectorAll(".settings__input")) {
    markAs(inp, "neutral");
  }

  themePick(colorSchemas[profileSettings.theme]);

  toggleElement(dom.settings.settingsTab, "inline-block");

  init();
};

// Check if reqested location is available
dom.settings.locationInput.addEventListener("change", function () {
  fetch(
    `https://www.meteosource.com/api/v1/free/find_places?text=${dom.settings.locationInput.value}&key=${WEATHER_API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        markAs(dom.settings.locationInput, "bad");
        dom.settings.saveSettingsBtn.disabled = true;
      } else if (data.length > 0) {
        // Taking the biggest city for the query
        tempProfileSettings.location[0] = data[0].name;
        tempProfileSettings.location[1] = data[0].country;
        markAs(dom.settings.locationInput, "good");
        dom.settings.saveSettingsBtn.disabled = false;
      }
    });
});

// Check if requested vs-currency available
const checkVSCurrency = function (data) {
  if (data.includes(dom.settings.currencyInput.value.toLowerCase())) {
    // marking input as 'good' if currency exists
    markAs(dom.settings.currencyInput, "good");
    tempProfileSettings.currency = dom.settings.currencyInput.value;
    dom.settings.saveSettingsBtn.disabled = false;
  } else {
    //marking input as 'bad' if currency does not exists
    markAs(dom.settings.currencyInput, "bad");
    dom.settings.saveSettingsBtn.disabled = true;
  }
};

// Listening for the vs-currency input to fire check
dom.settings.currencyInput.addEventListener("input", function () {
  checkVSCurrency(listOfVSCurrencies);
});

// Check if requested coins/tokens available
export const checkToken = function (input, awailableTokens) {
  const tokenID = awailableTokens.find(
    (coin) =>
      coin.id === input.value.toLowerCase() ||
      coin.symbol === input.value.toLowerCase()
  )?.id;
  if (!tokenID) {
    markAs(input, "bad");
    dom.settings.saveSettingsBtn.disabled = true;
  } else {
    markAs(input, "good");
    tempProfileSettings.coins[input.id.slice(4) - 1] = tokenID;
    dom.settings.saveSettingsBtn.disabled = false;
  }
};

// Requested by user coins
export const coinsInputArr = [
  dom.settings.coin1Input,
  dom.settings.coin2Input,
  dom.settings.coin3Input,
];

// Listening for the coin/token input to fire check
for (let input of coinsInputArr) {
  input.addEventListener("input", function () {
    checkToken(this, listOftokens);
  });
}

// Preview color theme on select
document.querySelector(".colorTheme").addEventListener("click", function (e) {
  const click = e.target?.closest("label");
  if (!click) return;
  else {
    themePick(colorSchemas[click.getAttribute("for")]);
  }
});

// Listening for the color select to fire preview
dom.settings.saveSettingsBtn.addEventListener("click", function (e) {
  e.preventDefault();
  saveSettings();
});
