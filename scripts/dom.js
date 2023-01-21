const dom = {
  weatherWidget: {
    location: document.querySelector(".weather__loc"),
    temperature: document.querySelector(".weather__temperature"),
    description: document.querySelector(".weather__description"),
    icon: document.querySelector(".weather__icon"),
  },
  cryptoWidget: {
    widget: document.querySelector(".crypto__container"),
  },
  searchWidget: {
    input: document.getElementById("search__form__input"),
    submit: document.getElementById("search__form__submit"),
    form: document.getElementById("search__form"),
  },
  todoWidget: {
    list: document.querySelector(".todo__list"),
    clearBtn: document.querySelector(".todo__clear__btn"),
    form: document.querySelector(".todo__form"),
    input: document.querySelector(".todo__form__input"),
  },
  newsWidget: {
    list: document.querySelector(".news__list"),
  },
  sideButtons: {
    allButtons: document.querySelector(".buttons"),
  },
  settings: {
    settingsTab: document.querySelector(".settings"),
    locationInput: document.getElementById("loc"),
    currencyInput: document.getElementById("curr"),
    coin1Input: document.getElementById("coin1"),
    coin2Input: document.getElementById("coin2"),
    coin3Input: document.getElementById("coin3"),
    colorOptions: document.querySelectorAll(
      'input[name="colorSchema"] + label'
    ),
    saveSettingsBtn: document.querySelector(".settings__submit"),
  },
};
export default dom;
