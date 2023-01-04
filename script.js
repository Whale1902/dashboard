// Profile settings, which will be used before first settings session
let profileSettings = {
  location: ["Odessa", "Ukraine"],
  measurement: "metric",
  coins: ["bitcoin", "ethereum", "tether"],
  currency: "usd",
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

  settingsFromLocalStorage.measurement === "imperial"
    ? (profileSettings.measurement = "us")
    : (profileSettings.measurement = "metric");
}

//////////////////////////////////////  WEATHER TAB  //////////////////////////////////////

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
      weatherLoc.textContent = `${profileSettings.location[0]}, ${profileSettings.location[1]}`;
      temperature.textContent = `${data.current.temperature}℃`;
      weatherDescr.textContent = data.current.summary;
      weatherIcon.src = `weather_icons/set05/small/${data.current.icon_num}.png`;
    });
};

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

// Search Section
const search = [
  { name: "tiktok", url: "https://www.tiktok.com/search/video", query: "q" },
  {
    name: "youtube",
    url: "https://www.youtube.com/results",
    query: "search_query",
  },
  { name: "google", url: "https://www.google.com/search", query: "q" },
  { name: "wiki", url: "https://en.wikipedia.org/wiki/", query: "search" },
  { name: "reddit", url: "https://www.reddit.com/search", query: "q" },
];

// Search DOM Selectors
const formInput = document.querySelector("#form-input");
const searchBtn = document.querySelector("#form-submit");
const radioOption = document.querySelectorAll("input[type='radio']");
const list = document.querySelector(".list-choice-objects");

// CSS function to show input and button once one of the radials was selectod
const showInputForm = function () {
  formInput.classList.remove("form-input");
  searchBtn.classList.remove("form-submit");

  formInput.classList.add("form-input_active");
  searchBtn.classList.add("form-submit_active");
};

// Defining some global variables to avoid multiple values for the target of button event
let target;
let targetUrl;

// Event listener for the radio buttons
list.addEventListener("change", function (e) {
  showInputForm();
  target = e.target.value;
});

// Event listener for the pseudo submit button
searchBtn.addEventListener("click", () => {
  if (target === "everywhere") {
    for (let i = 0; i < search.length; i++) {
      targetUrl = `${search[i].url}?${search[i].query}=${formInput.value}`;
      window.open(targetUrl, "_blank");
    }
  } else {
    const targetSearch = search.find((el) => el.name === target);
    targetUrl = `${targetSearch.url}?${targetSearch.query}=${formInput.value}`;
    window.open(targetUrl, "_blank");
  }
});

////////////////////////////// TODO WIDGET /////////////////////////////

// Selecting DOM elements
const todoBtn = document.querySelector(".todo-form-btn");
const todoClearBtn = document.querySelector(".todo-btn");

const todoList = document.querySelector(".todo-list");
const todoInput = document.querySelector(".todo-form-input");
const todoForm = document.querySelector(".todo-form");
const clearWarning = document.querySelector(".todo-clear-warning");

// Adding new task
todoForm.addEventListener("submit", function (e) {
  e.preventDefault;
  if (!todoInput.value) return;
  todoList.insertAdjacentHTML(
    "afterbegin",
    `<div class="todo-item"><p>${todoInput.value}</p><div class="delete-todo-item"></div></div>`
  );
  todoInput.value = "";
});

// Just a few helper functions to show or hide warning window
const showWarning = function () {
  todoList.style.display = "none";
  todoForm.style.display = "none";
  clearWarning.style.display = "grid";
};

const hideWarning = function () {
  todoList.style.display = "flex";
  todoForm.style.display = "block";
  clearWarning.style.display = "none";
};

// Clearing the list
todoClearBtn.addEventListener("click", function () {
  showWarning();
});

// Clearing the list of items by one button
clearWarning.addEventListener("click", function (e) {
  const pressedBtn = e.target.classList.value;
  if (pressedBtn.includes("yes")) {
    const allTodos = document.querySelectorAll(".todo-item");
    for (todo of allTodos) {
      todo.remove();
      hideWarning();
    }
  } else if (pressedBtn.includes("no")) {
    hideWarning();
  } else {
    return;
  }
});

// Crossing list item aka "done" or deleting selected item
todoList.addEventListener("click", function (e) {
  const item = e.target.closest(".todo-item");

  if (!item) return;
  else if (e.target.classList.value.includes("delete")) {
    item.remove();
  } else {
    item.classList.toggle("todo-item-crossed");
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

///////////////////////////////////////////  INIT  ///////////////////////////////////////////

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

// Saving the settings
const settingsSaveButton = document.querySelector(".settings__submit");

settingsSaveButton.addEventListener("click", function (e) {
  e.preventDefault();

  profileSettings = tempProfileSettings;

  profileSettings.measurement = document.querySelector(
    "input[name='measurement']:checked"
  ).value;

  window.localStorage.setItem(
    "profileSettings",
    JSON.stringify(profileSettings)
  );

  init();
});
