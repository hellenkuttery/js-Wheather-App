const form = document.querySelector("form");
const input = document.querySelector("form input");
const msgSpan = form.querySelector(".msg");
const list = document.querySelector(".container .cities");

localStorage.setItem(
  "apiKey",
  EncryptStringAES("be82f27c418b2db61311299d002e474e")
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherApi();
  e.target.reset();
});

const getWeatherApi = async () => {
  const ApiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  console.log(ApiKey);
  const cityName = input.value;
  console.log(cityName);
  const units = "metric";
  const lang = "tr";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${ApiKey}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url).then((res) => res.json());
    console.log(response);
    const { main, name, sys, weather } = response;
    // const iconUrl=`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    // console.log(iconUrl);
    /* -------------------------------------------------------------------------- */
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
    console.log(iconUrlAWS);

    /* -------------------------------------------------------------------------- */

    const cityNameSpan = list.querySelectorAll("span");
    if (cityNameSpan.length > 0) {
      const filteredArray = [...cityNameSpan].filter(
        (span) => span.innerHTML == name
      );
      if (filteredArray.length > 0) {
        msgSpan.innerText = ` You have already listed this city`;
        setTimeout(() => {
          msgSpan.innerText = ``;
        }, 3000);
        return;
      }
    }
    /* -------------------------------------------------------------------------- */
    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `
        <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
                <img class="city-icon" src="${iconUrlAWS}">
                <figcaption>${weather[0].description}</figcaption>
          </figure>
        `;
    list.prepend(createdLi);
    /* -------------------------------------------------------------------------- */
  } catch (error) {
    console.log(error);
    msgSpan.innerText = "City not found";
    setTimeout(() => {
      msgSpan.innerText = ``;
    }, 3000);
  }
};
