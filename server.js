const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 3000;
let temperatureDisplay = 'F';

const app = express();

//
// Converts from celcius and ferinheight otherwise changes decimal places to 1:
//
function convertTemperature(temperature) {
  if (temperatureDisplay === 'C') {
    return ((temperature - 32) * (5 / 9)).toFixed(1);
  }
  return temperature.toFixed(1);
}

//
// Gathers and converts to JSON the IP data from ipdata.co:
//
async function getIPData() {
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
}

//
// Grabs and converts to JSON all the local weather reported for the browsers location:
//
async function getWeatherData(lat, long) {
  const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
  const DARKSKY_QUERY = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${long}`;
  try {
    const response = await fetch(DARKSKY_QUERY);
    return response.json();
  } catch (error) {
    console.log('Fetch error in getWeatherData():', error);
  }
}

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

  //console.log(weatherData);

  res.render('index', {
    pageTitle: 'The Weather App',
    countryName: country_name,
    regionName: region,
    cityName: city,
    flagURL: flag,
    temperatureDisplay: temperatureDisplay,
    currentShortWeatherSummary: weatherData.currently.summary,
    currentLongWeatherSummary: weatherData.daily.summary,
    currentWeatherTemperature: weatherData.currently.apparentTemperature,
    weather: weatherData
  });
});

app.listen(app.get('port'));
