// Profile settings, which will be used before first settings session
let profileSettings = {
  location: ["Odessa", "Ukraine"],
  measurement: "metric",
  coins: ["bitcoin", "ethereum", "tether"],
  currency: "usd",
  defaultSearch: "google",
  theme: "colorBeige",
};

// Profile settings if user saved his own properties
if (window.localStorage.length > 0) {
  const settingsFromLocalStorage = JSON.parse(
    window.localStorage.getItem("profileSettings")
  );

  profileSettings.location[0] = settingsFromLocalStorage.location[0];
  profileSettings.location[1] = settingsFromLocalStorage.location[1];
  profileSettings.coins = settingsFromLocalStorage.coins;
  profileSettings.currency = settingsFromLocalStorage.currency;
  profileSettings.measurement = settingsFromLocalStorage.measurement;
  profileSettings.defaultSearch = settingsFromLocalStorage.defaultSearch;
  profileSettings.theme = settingsFromLocalStorage.theme;
}

// Appearance
const colorSchemas = {
  colorDefault: ["#a597e9", "#74d68e"],
  colorBeige: ["#ece8dd", "#e1d7c6"],
  colorSage: ["#a6bb8d", "#61876e"],
  colorSky: ["#bfeaf5", "#82aae3"],
  colorSpace: ["#00abb3", "#eaeaea"],
};

const themePick = function (schema) {
  document.querySelector(":root").style.setProperty("--primary", schema[0]);
  document.querySelector(":root").style.setProperty("--secondary", schema[1]);
};

document.querySelector(".colorTheme").addEventListener("click", function (e) {
  const click = e.target?.closest("label");
  if (!click) return;
  else {
    themePick(colorSchemas[click.getAttribute("for")]);
  }
});

const colorOptions = document.querySelectorAll(
  'input[name="colorSchema"] + label'
);

for (option of colorOptions) {
  const prim = colorSchemas[option.getAttribute("for")][0];
  const sec = colorSchemas[option.getAttribute("for")][1];

  option.style.background = `linear-gradient(120deg, ${prim} 50%, ${sec} 0%`;
}

themePick(colorSchemas[profileSettings.theme]);

/////////////////////////////////////  WEATHER WIDGET  /////////////////////////////////////
// Helper to know exact time
const timeNow = function () {
  const today = new Date();
  const monthNow = today.toLocaleString("default", {
    month: "short",
  });
  const now = `${monthNow} ${today.getDate()} ${today.getHours()}:${today.getMinutes()}`;
  return now;
};

// Weather DOM Selectors
const weatherLoc = document.querySelector(".weather__loc");
const temperature = document.querySelector(".weather__temperature");
const weatherDescr = document.querySelector(".weather__description");
const weatherIcon = document.querySelector(".weather__icon");

// Weather API Data
const weatherApiKey = "idctje4bnhbwdwoue45keuwv79h51f2hkz63boy7";

// Weather fetch
const updateWeather = function () {
  fetch(
    `https://www.meteosource.com/api/v1/free/point?place_id=${profileSettings.location[0]}&sections=current&units=${profileSettings.measurement}&key=${weatherApiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      weatherLoc.textContent = `${profileSettings.location[0]}, ${
        profileSettings.location[1]
      }, ${timeNow()}`;
      weatherDescr.textContent = data.current.summary;
      weatherIcon.src = `weather_icons/set05/small/${data.current.icon_num}.png`;

      // Rendering temperature and correct symbol
      const measurementSymbol =
        profileSettings.measurement === "metric" ? "\u{2103}" : "\u{2109}";
      temperature.textContent = `${data.current.temperature}${measurementSymbol}`;
    });
};

////////////////////////////////////// CRYPTO WIDGET  //////////////////////////////////////
// Currency API Data
const allCryptos = [];

const updateCrypto = function () {
  const cryptoWidget = document.querySelector(".crypto__container");

  for (let i = 0; i < 3; i++) {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${profileSettings.coins[i]}`
    )
      .then((res) => res.json())
      .then((data) => {
        const coinName = data[0].id;
        const coinIcon = data[0].image;
        const coinAbr = data[0].symbol.toUpperCase();
        const coinPrice = data[0].current_price;
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
          <p class="crypto__price">$${coinPrice}</p>
          <p class="crypto__price__change">${coinPriceChange}%</p>
        </div>
      `;

        cryptoWidget.insertAdjacentHTML("beforeend", currMarkup);

        const currentCoin = document.querySelector(`.${coinName}`);

        if (coinPriceChange > 0) {
          currentCoin.style.backgroundColor = "#74d68e";
        } else if (coinPriceChange < 0) {
          currentCoin.style.backgroundColor = "#e77777";
        } else return;
      });
  }
};

//////////////////////////////////////  SEARCH WIDGET  //////////////////////////////////////
// DOM Selectors
let searchInput = document.getElementById("search__form__input");
const searchSubmit = document.getElementById("search__form__submit");
const searchForm = document.getElementById("search__form");

// Disable ability to search without any query
searchSubmit.disabled = true;

// Allow user to search with at least one character in query
searchInput.addEventListener("input", function () {
  // Global selector has been set on page loading, so I need to update it
  searchInput = document.getElementById("search__form__input");

  if (searchInput.value.length === 0) {
    searchSubmit.disabled = true;
  } else if (searchInput.value.length > 0) {
    searchSubmit.disabled = false;
  }
});

searchForm.addEventListener("submit", function () {
  // Selecting only checked option
  const searchCheckedOption = document.querySelector(
    'input[name="search__option"]:checked'
  );

  const targetUrl = `${searchCheckedOption.getAttribute("data-url")}${
    searchInput.value
  }`;
  window.open(targetUrl, "_blank");
});

////////////////////////////// TODO WIDGET /////////////////////////////
const todoList = document.querySelector(".todo__list");
const todoClear = document.querySelector(".todo__clear__btn");

todoList.addEventListener("click", function (e) {
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

const todoForm = document.querySelector(".todo__form");

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const todoInput = document.querySelector(".todo__form__input");
  const todoMarkup = `
    <div class="todo__item">
      <p class="todo__text">${todoInput.value}</p>
      <button class="todo__delete">&#9587;</button>
    </div>
  `;

  if (!todoInput.value) return;

  todoList.insertAdjacentHTML("beforeend", todoMarkup);

  todoInput.value = "";
  todoInput.focus();
});

todoClear.addEventListener("click", function () {
  for (el of document.querySelectorAll(".todo__item")) {
    el.remove();
  }
});

/////////////////////////////////// NEWS WIDGET ///////////////////////////////////
const createMarkup = function (heading, snippet, link) {
  const newsMarkup = `
<div class="news">
  <h2 class="news-heading">
    ${heading}
  </h2>
  <div class="news-additional hidden">
    <p class="news-snippet">
      ${snippet}
    </p>
    <a
      href="${link}"
      target="_blank"
      ><button class="news-more">Read full</button></a
    >
  </div>
</div>
`;
  newsList.insertAdjacentHTML("beforeend", newsMarkup);
};

// Fetching
const newsLoading = function () {
  fetch("https://forklog.com/wp-json/wp/v2/posts/#")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 10; i++) {
        const title = data[i].title.rendered;
        const snippet = data[i].excerpt.rendered.slice(3, -5);
        const link = data[i].link;

        createMarkup(title, snippet, link);
      }
    });
};

// Display news
const newsList = document.querySelector(".news__list");
const newsHeading = document.querySelector(".news-heading");
const newsSnippet = document.querySelector(".news-snippet");
const newsBtn = document.querySelector(".news-more");
const news = document.querySelector(".news");

newsList.addEventListener("click", function (e) {
  if (!e.target.classList.value === "news-heading") return;
  const clickedNews = e.target.closest(".news");
  clickedNews.querySelector(".news-additional").classList.toggle("hidden");
});

//////////////////////////////////////////  INIT  //////////////////////////////////////////

const init = function () {
  const thingsToRemove = [
    ...document.querySelectorAll(".crypto-crypto"),
    ...document.querySelectorAll(".currency-rates"),
    ...document.querySelectorAll(".news"),
  ];

  for (thing of thingsToRemove) {
    thing.remove();
  }

  updateWeather();
  updateCrypto();
  newsLoading();
};

// init();

//////////////////////////////////////  Side Buttons  //////////////////////////////////////
const sideBtn = document.querySelector(".buttons");
const settings = document.querySelector(".settings");
const currentLocation = document.querySelector(".current__location");
const currentCoins = document.querySelector(".current__coins");

// Helper function to show or hide element
// As arguments it takes element and value for the "show" state (Grid, Inline-block or other)
const toggleElement = function (element, showValue) {
  if (element.style.display === "none") {
    element.style.display = showValue;
  } else if (element.style.display === showValue) {
    element.style.display = "none";
  }
};

sideBtn.addEventListener("click", function (e) {
  if (e.target.classList.value.includes("button__reload")) {
    init();
  } else if (e.target.classList.value.includes("button__settings")) {
    toggleElement(settings, "inline-block");
  } else return;
});

//////////////////////////////////////  SETTINGS TAB  //////////////////////////////////////

// Temporary settings holder, befor it will be inserted into profile settings
const tempProfileSettings = {
  location: profileSettings.location,
  measurement: profileSettings.measurement,
  coins: profileSettings.coins,
  currency: profileSettings.currency,
  defaultSearch: profileSettings.defaultSearch,
  theme: profileSettings.theme,
};

// Helper function to mark element as good or bad
const markAs = function (element, mood) {
  if (mood === "good") {
    element.classList.remove("settings__input--bad");
    element.classList.add("settings__input--good");
  } else if (mood === "bad") {
    element.classList.remove("settings__input--good");
    element.classList.add("settings__input--bad");
  }
};

// USER LOCATION
// DOM
const locInput = document.getElementById("loc");

locInput.addEventListener("change", function () {
  fetch(
    `https://www.meteosource.com/api/v1/free/find_places?text=${locInput.value}&key=${weatherApiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        markAs(locInput, "bad");
      } else if (data.length > 0) {
        tempProfileSettings.location[0] = data[0].name;
        tempProfileSettings.location[1] = data[0].country;
        markAs(locInput, "good");
      }
    });
});

// USER CURRENCY
// DOM Selector
const currInput = document.getElementById("curr");

currInput.addEventListener("input", function () {
  // Asking CG for the list of available currencies
  fetch("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
    .then((res) => res.json())
    .then((data) => {
      if (data.includes(currInput.value.toLowerCase())) {
        // marking input as 'good'
        markAs(currInput, "good");
        tempProfileSettings.currency = currInput.value;
      } else {
        //marking input as 'bad'
        markAs(currInput, "bad");
      }
    });
});

// USER CRYPTO-TOKENS
// DOM Selectors
const coin1Input = document.getElementById("coin1");
const coin2Input = document.getElementById("coin2");
const coin3Input = document.getElementById("coin3");

const tokenCheckBtn = document.querySelector(".settings__coins__check");

const coinsInputArr = [coin1Input, coin2Input, coin3Input];

tokenCheckBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Request to the CoinGecko API to get list of available tokens
  fetch("https://api.coingecko.com/api/v3/coins/list")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 3; i++) {
        // if user left empty value we will take placeholder value as user input
        if (!coinsInputArr[i].value) {
          coinsInputArr[i].value = coinsInputArr[i].placeholder;
        }

        // searching api data to check if token exists
        const tokenID = data.find(
          (coin) =>
            coin.id === coinsInputArr[i].value.toLowerCase() ||
            coin.symbol === coinsInputArr[i].value.toLowerCase()
        )?.id;

        // pre-saving user input
        tempProfileSettings.coins[i] = tokenID;
        // mark input as 'good'
        coinsInputArr[i].style.border = "3px solid #45fc03";

        // mark input as 'bad'
        if (!tokenID) coinsInputArr[i].style.border = "3px solid #fc1c03";
      }
    });
});

// Render current data on page
locInput.value = profileSettings.location[0];
currInput.value = profileSettings.currency;

for (let i = 0; i < 3; i++) {
  coinsInputArr[i].value = profileSettings.coins[i];
}

document
  .getElementById(`measurement_${profileSettings.measurement}`)
  .setAttribute("checked", "checked");

for (element of document.querySelectorAll(
  `input[value=${profileSettings.defaultSearch}]`
)) {
  element.setAttribute("checked", "checked");
}

for (element of document.querySelectorAll(
  `input[value=${profileSettings.theme}]`
)) {
  element.setAttribute("checked", "checked");
}

// Saving the settings
const settingsSaveButton = document.querySelector(".settings__submit");

settingsSaveButton.addEventListener("click", function (e) {
  e.preventDefault();

  profileSettings = tempProfileSettings;

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

  init();

  themePick(colorSchemas[profileSettings.theme]);
  toggleElement(settings, "inline-block");
});

// Rendering todos from local storage NEED TO BE MUCH UPPER ON CODE
const renderTodosFromLocalStorage = function () {
  for (todo of document.querySelectorAll(".todo__item")) {
    todo.remove();
  }

  const todosFromLocalStorage = JSON.parse(
    window.localStorage.getItem("todos")
  );

  for (todo of todosFromLocalStorage) {
    todoList.insertAdjacentHTML(
      "beforeend",
      `
        <div class="todo__item ${todo[1] === "" ? "" : "todo__item--crossed"}">
          <p class="todo__text">${todo[0]}</p>
          <button class="todo__delete">&#9587;</button>
        </div>
      `
    );
  }
};
renderTodosFromLocalStorage();

// Saving todos and its state in local storage before closing or reloading the tab
const saveTodosToLocalStorage = function () {
  const currListOfTodos = [];

  const listOfTodos = document.querySelectorAll(".todo__text");

  for (todo of listOfTodos) {
    if (todo.closest(".todo__item").classList.value.includes("crossed")) {
      currListOfTodos.push([todo.textContent, "crossed"]);
    } else {
      currListOfTodos.push([todo.textContent, ""]);
    }
  }

  window.localStorage.setItem("todos", JSON.stringify(currListOfTodos));
};

window.addEventListener("beforeunload", saveTodosToLocalStorage);
