import { profileSettings } from "./settings.js";
import { WEATHER_API_KEY } from "./config.js";
import dom from "./dom.js";
import { timeNow } from "./helpers.js";

// Fetch
export const updateWeather = function () {
  try {
    fetch(
      `https://www.meteosource.com/api/v1/free/point?place_id=${profileSettings.location[0]}&sections=current&units=${profileSettings.measurement}&key=${WEATHER_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => renderWeather(data))
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error.message);
  }
};

// Render
export const renderWeather = function (data) {
  // Weather Widget: render current time and selected location
  dom.weatherWidget.location.textContent = `${profileSettings.location[0]}, ${
    profileSettings.location[1]
  }, ${timeNow()}`;
  dom.weatherWidget.icon.src = `weather_icons/set05/small/${data.current.icon_num}.png`;
  dom.weatherWidget.description.textContent = data.current.summary;
  dom.weatherWidget.temperature.textContent = `${data.current.temperature}${
    profileSettings.measurement === "metric" ? "\u{2103}" : "\u{2109}"
  }`;
};
