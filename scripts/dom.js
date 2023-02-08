const dom = {
  weather: {
    widget: document.querySelector(".weather__container"),
    location: document.querySelector(".weather__loc"),
    temperature: document.querySelector(".weather__temperature"),
    description: document.querySelector(".weather__description"),
    icon: document.querySelector(".weather__icon"),
  },
  crypto: {
    widget: document.querySelector(".crypto__container"),
  },
  search: {
    input: document.getElementById("search__form__input"),
    submit: document.getElementById("search__form__submit"),
    form: document.getElementById("search__form"),
  },
  todo: {
    list: document.querySelector(".todo__list"),
    clearButton: document.querySelector(".todo__clear__btn"),
    form: document.querySelector(".todo__form"),
    input: document.querySelector(".todo__form__input"),
  },
  news: {
    widget: document.querySelector(".news__container"),
    list: document.querySelector(".news__list"),
  },
  sideButtons: {
    buttonsList: document.querySelector(".buttons"),
  },
  settings: {
    settingsTab: document.querySelector(".settings"),
    locationInput: document.getElementById("loc"),
    vsCurrencyInput: document.getElementById("curr"),
    coin1Input: document.getElementById("coin1"),
    coin2Input: document.getElementById("coin2"),
    coin3Input: document.getElementById("coin3"),
    colorOptions: document.querySelectorAll(
      'input[name="colorSchema"] + label'
    ),
    saveButton: document.querySelector(".settings__submit"),
  },
};
export default dom;
