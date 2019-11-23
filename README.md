# The Weather Site

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Michael-Lafreniere/TheWeatherSite/blob/master/LICENCE)
[![GitHub stars](https://img.shields.io/github/stars/Michael-Lafreniere/the-movie-site?style=flat-square)](https://github.com/Michael-Lafreniere/TheWeatherSite/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Michael-Lafreniere/the-movie-site.svg?style=flat-square)](https://github.com/Michael-Lafreniere/TheWeatherSite/network)

![The Weather Site GIF](https://github.com/Michael-Lafreniere/TheWeatherSite/blob/master/docs/TheWeatherSite.gif 'GIF of the site')

The obligatory weather site. I originally wrote this about 6-8 months ago and in this version I cleaned it up but tried to keep the general methods the same so I can look back and see how my coding has improved. I did transition the functions from older style function name() {} style to modern ES6 const name = () => {} styling as I prefer that.

A few of the things I learned with this project was how to work asynchronously with two separate external APIs along with passing copious amounts of data to the front end via [ejs](https://ejs.co). I also learned how to work with [Skycons](https://darkskyapp.github.io/skycons/) for generating and displaying the appropriate weather icon based on the information passed in from [DarkSky](https://darksky.net/poweredby/). I learned how to switch themes using CSS, along with changing all the displayed temperatures between Celsius and Ferinheight (clicking any any temperature read-out will switch between the current and the other). You can also generate a fake weather alert by clicking the provided button in the top right corner and if a real alert is active, it will automatically be displayed.

Some of the early difficulties I had were just being rather green at the time with JavaScript, using external APIs and processing the returned data. I have to say I learned quite a bit from this rather simple project.

## Technology used

I used [ipdata.co](https://ipdata.co) for getting location data, city, state, country, longitude and latitude. The longitude and latitude coordinates are then used to fetch weather data from [DarkSky](https://darksky.net/poweredby/).

| Tool                                             | Description                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [node.js](https://nodejs.org/en/)                | A JavaScript runtime build on Chromes V8 engine                                                   |
| [ejs](https://ejs.co)                            | An embedded JavaScript templating language                                                        |
| [Skycons](https://darkskyapp.github.io/skycons/) | A set of 10 animated weather glyphs, procedurally generated using JavaScript and HTML5 canvas tag |
| [dotenv](https://github.com/motdotla/dotenv)     | Is a zero dependency module that loads environment variables from a .env file into process.env.   |
| [nodemon](https://nodemon.io)                    | A utility that monitors for any changes to your source code and automatically restarts the server |

## Installation/Usage

[node.js](http://nodejs.org/download/) is required to get `npm`. Use the package manager [npm](https://www.npmjs.com) to install and run this code. It is highly recommended to also have [git](https://git-scm.com) installed to make the cloning easier.

You'll need a API key from both [ipdata.co](https://ipdata.co) and [DarkSky](https://darksky.net/poweredby/) which will need to go into a .env file. According to the Terms of Service of both sites I cannot provide my access keys publicly.

```
# Clones the repository:
git clone https://github.com/Michael-Lafreniere/TheWeatherSite.git

# Change into the cloned directory:
cd TheWeatherSite

# Install the required packages:
npm install

# Create the .env file:
touch .env

# Before carrying on, open the .env file in your favorite text editor and add in the API keys you got previously and save the file:
IPDATA_API_KEY = YOUR_IPDATA_API_KEY
DARKSKY_API_KEY = YOUR_DARKSKY_API_KEY

# Run the site:
npm run start

# Open a new browser tab to http://localhost:3000 and the site should be working.
# Please open a ticket for any issues you find so I can resolve them asap.
```

## Possible Future work

I would like to eventually come back to this project and add in hourly weather forecasts to the current day using a timeline. Likely every other hour as space is limited.

## Author

[Michael Lafreniere](https://github.com/Michael-Lafreniere)

## License

[MIT](https://choosealicense.com/licenses/mit/)
