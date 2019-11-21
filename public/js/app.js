let forecastDisplayed = false;
// Default temperature to display, DarkSky returns all values in imperial (ferinheight, miles, etc):
let temperatureDisplay = 'F';

//
// Fake alert data:
//
let simulatedAlert = false;
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
const buildWeatherIcon = (icon, elementID) => {
  const element = document.getElementById(elementID);

  if (element) {
    let timeOfDay = 'day';
    let weatherType = 'clear';

    if (icon.includes('night')) {
      timeOfDay = 'night';
    }

    if (icon.includes('clear')) {
      if (timeOfDay === 'night') {
        weatherType = 'clear';
      } else {
        weatherType = 'sunny';
      }
    } else if (icon.includes('rain')) {
      weatherType = 'rain-mix';
    } else if (icon.includes('snow')) {
      weatherType = 'snow';
    } else if (icon.includes('sleet')) {
      weatherType = 'hail';
    } else if (icon.includes('wind')) {
      weatherType = 'wind';
    } else if (icon.includes('fog')) {
      weatherType = 'fog';
    } else if (icon.includes('cloudy')) {
      weatherType = 'cloudy';
    }

    element.className = `wi wi-${timeOfDay}-${weatherType}`;
  } else {
    console.log('Unable to find:', elementID);
  }
  console.log('icon:', icon);
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
  console.log('processWeatherData:', data.currently);

  const { icon } = data.currently;
  //const { summary } = data.hourly;

  // Handles either a real weather alert or a simulated one:
  if ('alerts' in data || simulatedAlert === true) {
    toggleAlert(true);
    if (simulatedAlert === false) {
      processAlertData(data.alerts);
    } else {
      processAlertData(simulatedAlertData.alerts);
    }
  } else {
    toggleAlert(false);
  }

  console.log('here');

  buildWeatherIcon(icon, 'current-weather-icon');
  document.getElementById(
    'current-weather-temperature-value'
  ).onclick = changeTemperatureReadout;
};

//
// Changes between celcius and ferinheight read outs on the main page:
//
function changeTemperatureReadout() {
  if (temperatureDisplay === 'F') {
    temperatureDisplay = 'C';
  } else {
    temperatureDisplay = 'F';
  }
  //getWeatherData();
}

//
// Enables or disables the alert section of the HTML page depending on if there is an alert (simulated or real)
// or not:
//
const toggleAlert = turnOn => {
  if (turnOn) {
    if (document.getElementById('alert-hidden') != null) {
      document.getElementById('alert-hidden').id = 'alert-visible';
    }
  } else {
    if (document.getElementById('alert-visible') != null) {
      document.getElementById('alert-visible').id = 'alert-hidden';
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
  if (simulatedAlert === true) {
    simulatedAlert = false;
  } else {
    simulatedAlert = true;
  }
  //getWeatherData();
};

processWeatherData(weatherData);
