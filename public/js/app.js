let forecastDisplayed = false;
// Default temperature to display, DarkSky returns all values in imperial (ferinheight, miles, etc):
let temperatureDisplay = 'F';
let skycons;
let skyconColor = 'black';
const weatherIconWidth = 64;
const weatherIconHeight = 64;
let alertActive = false;

//
// Fake alert data:
//
const simulatedAlertData = {
  alerts: {
    title: 'Flood Watch for Mason, WA',
    time: 1509993360,
    expires: 1510036680,
    description:
      '...FLOOD WATCH REMAINS IN EFFECT THROUGH LATE MONDAY NIGHT...\nTHE FLOOD WATCH CONTINUES FOR\n* A PORTION OF NORTHWEST WASHINGTON...INCLUDING THE FOLLOWING\nCOUNTY...MASON.\n* THROUGH LATE FRIDAY NIGHT\n* A STRONG WARM FRONT WILL BRING HEAVY RAIN TO THE OLYMPICS\nTONIGHT THROUGH THURSDAY NIGHT. THE HEAVY RAIN WILL PUSH THE\nSKOKOMISH RIVER ABOVE FLOOD STAGE TODAY...AND MAJOR FLOODING IS\nPOSSIBLE.\n* A FLOOD WARNING IS IN EFFECT FOR THE SKOKOMISH RIVER. THE FLOOD\nWATCH REMAINS IN EFFECT FOR MASON COUNTY FOR THE POSSIBILITY OF\nAREAL FLOODING ASSOCIATED WITH A MAJOR FLOOD.\n',
    uri:
      'http://alerts.weather.gov/cap/wwacapget.php?x=WA1255E4DB8494.FloodWatch.1255E4DCE35CWA.SEWFFASEW.38e78ec64613478bb70fc6ed9c87f6e6',
    severity: 'advisory'
  }
};

//
// Builds up the weather icon based on what DarkSky API passes to us:
//
const buildWeatherIcon = (icon, element) => {
  //const element = document.getElementById(elementID);

  if (element) {
    element.innerHTML = `<canvas id="${element.id +
      '-skycon'}" width="${weatherIconWidth}" height="${weatherIconHeight}"></canvas>`;
    skycons.add(document.getElementById(element.id + '-skycon'), icon);
  } else {
    console.log('Invalid element passed to buildWeatherIcon().');
  }
};

//
// If there is a weather alert, this sets the required fields and sets it to visible:
//
const processAlertData = alert => {
  const { title, description, uri, severity } = alert;

  document.getElementById('alert-severity').textContent = `Weather ${severity}`;
  document.getElementById('alert-title').textContent = title;
  document.getElementById('alert-message').textContent = description;
  document.getElementById('alert-uri').href = uri;
};

//
// Processes and updates the DOM with the polled daily data and passes alerts if they exist on:
//
const processWeatherData = data => {
  //console.log('processWeatherData:', data.currently);

  skycons = new Skycons({ color: skyconColor });
  skycons.play();

  const { icon } = data.currently;
  const { hourly } = data;

  //console.log('Hourly:', hourly.data);
  //console.log('weather data:', data);

  const diff = Math.abs(new Date().getMilliseconds() - hourly.data[2].time);

  //console.log('diff', diff);

  // Handles either a real weather alert or a simulated one:
  if ('alerts' in data || alertActive === true) {
    if (alertActive === false) {
      processAlertData(data.alerts);
      toggleAlert(true);
    } else {
      processAlertData(simulatedAlertData.alerts);
    }
  } else {
    toggleAlert(false);
  }

  // Build icon for current weather:
  buildWeatherIcon(icon, document.getElementById('current-weather-icon'));
  document.getElementById(
    'current-weather-temperature-value'
  ).onclick = changeTemperatureReadout;

  // Build icons for forecast weather:
  for (let i = 0; i < 7; i++) {
    let element = document.getElementById(`forecast-icon-${i}`);
    if (element) {
      buildWeatherIcon(forecastData[i].icon, element);
    }
    document.getElementById(
      `forecast-temp-high-${i}`
    ).onclick = changeTemperatureReadout;
    document.getElementById(
      `forecast-temp-low-${i}`
    ).onclick = changeTemperatureReadout;
  }
};

//
// Changes between celcius and ferinheight read outs on the main page:
//
const changeTemperatureReadout = () => {
  if (temperatureDisplay === 'F') {
    temperatureDisplay = 'C';
  } else {
    temperatureDisplay = 'F';
  }

  const currentTemp = document.getElementById(
    'current-weather-temperature-value'
  );
  if (currentTemp) {
    const temp = Number(currentTemp.innerHTML.replace(/[^0-9\.]+/g, ''));
    currentTemp.innerHTML = generateTemperatureDisplayText(temp);
  }

  for (let i = 0; i < 7; i++) {
    const high = document.getElementById(`forecast-temp-high-${i}`);
    if (high) {
      const temp = Number(high.innerHTML.replace(/[^0-9\.]+/g, ''));
      high.innerHTML = generateTemperatureDisplayText(temp);
    }
    const low = document.getElementById(`forecast-temp-low-${i}`);
    if (low) {
      const temp = Number(low.innerHTML.replace(/[^0-9\.]+/g, ''));
      low.innerHTML = generateTemperatureDisplayText(temp);
    }
  }
};

//
// Returns, based on temperatureDisplay either celcius or ferinheight with a fixed length of decimal percision:
//
const convertTemperature = temperature => {
  if (temperatureDisplay === 'C') {
    return ((temperature - 32) * (5 / 9)).toFixed(1);
  } else {
    return (temperature * 1.8 + 32).toFixed(1);
  }
};

const generateTemperatureDisplayText = temperature => {
  return `${convertTemperature(temperature)}˚${temperatureDisplay}`;
};

//
// Enables or disables the alert section of the HTML page depending on if there is an alert (simulated or real)
// or not:
//
const toggleAlert = turnOn => {
  if (turnOn) {
    if (document.getElementById('alert-hidden') != null) {
      document.getElementById('alert-hidden').id = 'alert-visible';
      alertActive = true;
    }
  } else {
    if (document.getElementById('alert-visible') != null) {
      document.getElementById('alert-visible').id = 'alert-hidden';
      alertActive = false;
    }
  }
};

//
// Toggles between light and dark themes:
//
const toggleTheme = () => {
  if (document.documentElement.hasAttribute('theme')) {
    document.documentElement.removeAttribute('theme');
  } else {
    document.documentElement.setAttribute('theme', 'dark');
  }
};

//
// Allows the user to simulate an alert to see what it looks like, as hopefully they don't actually have one in their area!
//
const fakeWeatherAlert = () => {
  processAlertData(simulatedAlertData.alerts);
  toggleAlert(!alertActive);
};

processWeatherData(weatherData);
