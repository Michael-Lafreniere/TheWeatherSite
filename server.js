const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 3000;
let temperatureDisplay = 'F';

const app = express();

//
// Gathers and converts to JSON the IP data from ipdata.co:
//
const getIPData = async () => {
  const IPDATA_API_KEY = process.env.IPDATA_API_KEY;
  const IPDATA_DATA_QUERY = `https://api.ipdata.co?api-key=${IPDATA_API_KEY}`;

  try {
    const response = await fetch(IPDATA_DATA_QUERY);
    const data = await response.json();
    const { country_name } = data;

    // If we're not in the US, display celcius and update the readout:
    if (country_name !== 'United States') {
      temperatureDisplay = 'C';
    }

    return data;
  } catch (error) {
    console.log('Fetch error in getIPData():', error);
  }
};

//
// Grabs and converts to JSON all the local weather reported for the browsers location:
//
const getWeatherData = async (lat, long) => {
  const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
  const DARKSKY_QUERY = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${long}`;
  try {
    const response = await fetch(DARKSKY_QUERY);
    return response.json();
  } catch (error) {
    console.log('Fetch error in getWeatherData():', error);
  }
};

//
// Helper function that returns the name of the week based on the language and date provided (default English):
//
const getDayOfWeekName = (date, locale = 'en-EN') => {
  const name = new Date(date);
  return name.toLocaleDateString(locale, { weekday: 'long' });
};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.set('port', port);
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res, next) => {
  const {
    country_name,
    region,
    flag,
    city,
    longitude,
    latitude
  } = await getIPData();

  const weatherData = await getWeatherData(latitude, longitude);

  // Build the list of days for forecasts:
  let day = 'Tomorrow';
  let dayList = [];
  for (let i = 0; i < 7; i++) {
    if (i != 0) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + i + 1);
      day = getDayOfWeekName(nextDay);
    }
    dayList.push(day);
  }

  // Extract out 7 days worth of forecast data:
  let forecastData = [];
  for (let i = 0; i < 7; i++) {
    forecastData.push({
      day: dayList[i],
      summary: weatherData.daily.data[i].summary,
      high: weatherData.daily.data[i].temperatureHigh,
      low: weatherData.daily.data[i].temperatureLow,
      icon: weatherData.daily.data[i].icon
    });
  }

  res.render('index', {
    pageTitle: 'The Weather App',
    countryName: country_name,
    regionName: region,
    cityName: city,
    flagURL: flag,
    dayList: dayList,
    temperatureDisplay: temperatureDisplay,
    currentShortWeatherSummary: weatherData.currently.summary,
    currentLongWeatherSummary: weatherData.daily.summary,
    currentWeatherTemperature: weatherData.currently.apparentTemperature,
    weather: weatherData,
    forecastData
  });
});

app.listen(app.get('port'));
