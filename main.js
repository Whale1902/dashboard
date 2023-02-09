import dom from "./scripts/dom.js";

import {
  NEWS_ON_PAGE,
  STATIC_URLS,
  DYNAMIC_URLS,
  colorSchemas,
  keyBinds,
} from "./scripts/config.js";
import {
  timeNow,
  toggleElement,
  markAs,
  getData,
  themePick,
  clearWidget,
  getDataAndDisableinput,
  renderSpinner,
  removeSpinner,
} from "./scripts/helpers.js";

import {
  renderTodosFromLocalStorage,
  saveTodosToLocalStorage,
  saveSettingsToLocalStorage,
} from "./scripts/localStorageLogic.js";

// Default profile settings
let profileSettings = {
  location: ["Odessa", "Ukraine"],
  measurement: "metric",
  coins: ["bitcoin", "ethereum", "tether"],
  currency: "usd",
  defaultSearch: "google",
  theme: "colorBeige",
};
//////////////////////// Initial Render ////////////////////////

const renderPage = function () {
  // Update profile settings if user's settings available
  if (JSON.parse(window.localStorage.getItem("profileSettings"))) {
    profileSettings = JSON.parse(
      window.localStorage.getItem("profileSettings")
    );
  }

  // Apply selected or default color theme
  themePick(colorSchemas[profileSettings.theme]);

  // Disable search button by default
  dom.search.submit.disabled = true;

  renderTodosFromLocalStorage();

  // Keybinds
  document.addEventListener("keydown", function (e) {
    keyBinds(e);
  });
};

renderPage();
/////////////////////////////////////  WEATHER WIDGET  /////////////////////////////////////
const renderWeather = function (data) {
  const location = `${profileSettings.location[0]}, ${
    profileSettings.location[1]
  }, ${timeNow()}`;
  const iconSrc = `weather_icons/set05/small/${data.current.icon_num}.png`;
  const description = data.current.summary;
  const temperature = `${data.current.temperature}${
    profileSettings.measurement === "metric" ? "\u{2103}" : "\u{2109}"
  }`;

  const weatherMarkup = `
    <p class="weather__loc">${location}</p>
    <p class="weather__temperature">${temperature}</p>
    <img
      class="weather__icon"
      src="${iconSrc}"
      alt=""
      srcset=""
    />
    <p class="weather__description">${description}</p>
    `;

  clearWidget(dom.weather.widget);

  dom.weather.widget.insertAdjacentHTML("afterbegin", weatherMarkup);
};

const fetchWeather = function () {
  renderSpinner(dom.weather.widget);
  getData(DYNAMIC_URLS(profileSettings, "weather"), renderWeather);
};

////////////////////////////////////// TODO WIDGET  //////////////////////////////////////

dom.todo.list.addEventListener("click", function (e) {
  const clicked = e.target.classList.value;

  if (clicked === "todo__list") {
    return;
  } else if (clicked.includes("delete")) {
    e.target.closest(".todo__item").remove();
  } else if (clicked.includes("todo__item")) {
    e.target.classList.toggle("todo__item--crossed");
  } else if (!clicked.includes("todo__item")) {
    e.target.closest(".todo__item").classList.toggle("todo__item--crossed");
  }
});

dom.todo.form.addEventListener("submit", function (e) {
  e.preventDefault();

  const todoMarkup = `
    <div class="todo__item">
      <p class="todo__text">${dom.todo.input.value}</p>
      <button class="todo__delete">&#9587;</button>
    </div>
  `;

  if (!dom.todo.input.value) return;

  dom.todo.list.insertAdjacentHTML("beforeend", todoMarkup);

  dom.todo.input.value = "";
  dom.todo.input.focus();
});

dom.todo.clearButton.addEventListener("click", function () {
  for (let el of document.querySelectorAll(".todo__item")) {
    el.remove();
  }
});

////////////////////////////////////// SEARCH WIDGET  //////////////////////////////////////

// Allow user to search with at least one character in query
dom.search.input.addEventListener("input", function () {
  // Global selector has been set on page loading, so I need to update it
  dom.search.input = document.getElementById("search__form__input");

  if (dom.search.input.value.length === 0) {
    dom.search.submit.disabled = true;
  } else if (dom.search.input.value.length > 0) {
    dom.search.submit.disabled = false;
  }
});

dom.search.form.addEventListener("submit", function (e) {
  e.preventDefault();
  // Selecting only checked option
  const searchCheckedOption = document.querySelector(
    'input[name="search__option"]:checked'
  );

  const targetUrl = `${searchCheckedOption.getAttribute("data-url")}${
    dom.search.input.value
  }`;
  window.open(targetUrl, "_blank");
});

////////////////////////////////////// CRYPTO WIDGET  //////////////////////////////////////
const renderCrypto = function (data) {
  const coinName = data[0].id;
  const coinIcon = data[0].image;
  const coinAbr = data[0].symbol.toUpperCase();
  const coinPrice = data[0].current_price.toLocaleString("en", {
    style: "currency",
    currency: `${profileSettings.currency}`,
  });
  const coinPriceChange = data[0].price_change_percentage_24h.toFixed(2);

  const currMarkup = `
    <div class="crypto__crypto">
      <img
        src="${coinIcon}"
        alt=""
        class="crypto__icon"
      />
      <h2 class="crypto__currency">${coinAbr}</h2>
    </div>
    <div class="crypto__rates ${coinName}">
      <p class="crypto__price">${coinPrice}</p>
      <p class="crypto__price__change">${coinPriceChange}%</p>
    </div>
  `;

  if (dom.crypto.widget.querySelector(".loading")) {
    removeSpinner(dom.crypto.widget);
  }

  dom.crypto.widget.insertAdjacentHTML("beforeend", currMarkup);

  const currentCoin = document.querySelector(`.${coinName}`);

  if (coinPriceChange > 0) {
    currentCoin.style.backgroundColor = "#74d68e";
  } else if (coinPriceChange < 0) {
    currentCoin.style.backgroundColor = "#e77777";
  } else return;
};

const fetchCrypto = function () {
  clearWidget(dom.crypto.widget);
  renderSpinner(dom.crypto.widget);
  for (let i = 0; i < 3; i++) {
    getData(DYNAMIC_URLS(profileSettings, "crypto", i), renderCrypto);
  }
};

/////////////////////////////////// NEWS WIDGET ///////////////////////////////////
const renderNews = function (data) {
  clearWidget(dom.news.list);
  for (let i = 0; i < NEWS_ON_PAGE; i++) {
    const newsMarkup = `
      <div class="news">
        <h2 class="news-heading">
          ${data[i].title.rendered}
        </h2>
        <div class="news-additional hidden">
          <p class="news-snippet">
            ${data[i].excerpt.rendered.slice(3, -5)}
          </p>
          <a
            href="${data[i].link}"
            target="_blank"
            ><button class="news-more">Read full</button></a
          >
        </div>
      </div>
    `;
    dom.news.list.insertAdjacentHTML("beforeend", newsMarkup);
  }
  removeSpinner(dom.news.widget);
};

const fetchNews = function () {
  renderSpinner(dom.news.widget);
  getData(STATIC_URLS.news, renderNews);
};

// Expand news on click
dom.news.list.addEventListener("click", function (e) {
  if (!e.target.classList.value === "news-heading") return;
  const clickedNews = e.target.closest(".news");
  clickedNews.querySelector(".news-additional").classList.toggle("hidden");
});

//////////////////////////////////////////  INIT  //////////////////////////////////////////

const init = function () {
  fetchWeather();
  fetchCrypto();
  fetchNews();
};

init();

//////////////////////////////////////  Side Buttons  //////////////////////////////////////
dom.sideButtons.buttonsList.addEventListener("click", function (e) {
  if (e.target.classList.value.includes("button__reload")) {
    init();
  } else if (e.target.classList.value.includes("button__settings")) {
    renderSettings();
  } else return;
});

//////////////////////////////////////  SETTINGS TAB  //////////////////////////////////////
// Temporary settings holder, before it will be inserted into profile settings
const profileSettingsPlaceholder = {
  location: profileSettings.location,
  measurement: profileSettings.measurement,
  coins: profileSettings.coins,
  currency: profileSettings.currency,
  defaultSearch: profileSettings.defaultSearch,
  theme: profileSettings.theme,
};

// USER CRYPTO-TOKENS
const coinsInputArr = [
  dom.settings.coin1Input,
  dom.settings.coin2Input,
  dom.settings.coin3Input,
];

const renderSettings = function () {
  // Fetch API data and store it in sesstion storage
  getDataAndDisableinput(
    STATIC_URLS.vsCurrencies,
    dom.settings.vsCurrencyInput
  );
  getDataAndDisableinput(STATIC_URLS.listOfCryptos, coinsInputArr);

  // "Paint" theme selectors into their colors
  for (let option of dom.settings.colorOptions) {
    const primaryColor = colorSchemas[option.getAttribute("for")][0];
    const secondaryColor = colorSchemas[option.getAttribute("for")][1];

    option.style.background = `linear-gradient(120deg, ${primaryColor} 50%, ${secondaryColor} 0%`;
  }

  // Putting values according to profile settings
  dom.settings.locationInput.value = profileSettings.location[0];
  dom.settings.vsCurrencyInput.value =
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

  document
    .querySelector(`input[value=${profileSettings.theme}]`)
    .setAttribute("checked", "checked");

  toggleElement(dom.settings.settingsTab, "inline-block");
};

// USER LOCATION SETUP
const checkUserLocationInput = function (data) {
  if (data.length === 0) {
    markAs(dom.settings.locationInput, "bad");
  } else if (data.length > 0) {
    profileSettingsPlaceholder.location[0] = data[0].name;
    profileSettingsPlaceholder.location[1] = data[0].country;
    markAs(dom.settings.locationInput, "good");
  }
};

dom.settings.locationInput.addEventListener("change", function () {
  getData(DYNAMIC_URLS(profileSettings, "locations"), checkUserLocationInput);
});

// USER "VS"-CURRENCY SETUP
const checkUserVsCurrencyInput = function (data) {
  if (data.includes(dom.settings.vsCurrencyInput.value.toLowerCase())) {
    // marking input as 'good'
    markAs(dom.settings.vsCurrencyInput, "good");
    profileSettingsPlaceholder.currency = dom.settings.vsCurrencyInput.value;
  } else if (!data.includes(dom.settings.vsCurrencyInput.value.toLowerCase())) {
    //marking input as 'bad'
    markAs(dom.settings.vsCurrencyInput, "bad");
  }
};

dom.settings.vsCurrencyInput.addEventListener("input", function () {
  checkUserVsCurrencyInput(
    JSON.parse(window.sessionStorage.getItem(STATIC_URLS.vsCurrencies))[1]
  );
});

// USER COINS SETUP
const checkUserCoinInput = function () {
  const currentCoinInput = document.activeElement;
  const listOfCoins = JSON.parse(
    window.sessionStorage.getItem(STATIC_URLS.listOfCryptos)
  )[1];

  const tokenID = listOfCoins.find(
    (coin) =>
      coin.id === currentCoinInput.value.toLowerCase() ||
      coin.symbol === currentCoinInput.value.toLowerCase()
  )?.id;
  if (!tokenID) {
    markAs(currentCoinInput, "bad");
  } else {
    markAs(currentCoinInput, "good");
    profileSettingsPlaceholder.coins[currentCoinInput.id.slice(4) - 1] =
      tokenID;
  }
};

for (let input of coinsInputArr) {
  input.addEventListener("input", function () {
    checkUserCoinInput();
  });
}

// Preview theme on seclect event
document.querySelector(".colorTheme").addEventListener("click", function (e) {
  const click = e.target?.closest("label");
  if (!click) return;
  else {
    themePick(colorSchemas[click.getAttribute("for")]);
  }
});

// Saving the settings
dom.settings.saveButton.addEventListener("click", function (e) {
  e.preventDefault();

  saveSettingsToLocalStorage(profileSettings, profileSettingsPlaceholder);

  for (let inp of document.querySelectorAll(".settings__input")) {
    markAs(inp, "neutral");
  }

  renderPage();

  init();

  toggleElement(dom.settings.settingsTab, "inline-block");
});

window.addEventListener("beforeunload", saveTodosToLocalStorage);
