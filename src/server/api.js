// @TODO: node-fetch from v3 is an ESM-only, move v2 -> v3
const fetch = require('node-fetch');
const env = require('dotenv');
env.config();

const GEONAMES_API = 'http://api.geonames.org/searchJSON';
const WEATHER_API = 'https://api.weatherbit.io/v2.0/forecast/daily';
const PIXABAY_API = 'https://pixabay.com/api/';
const GEONAMES_API_ACC = process.env.API_GEONAMES_ACCOUNT || 'luqu0501';
const WEATHER_API_KEY =
  process.env.API_WEATHERBIT_KEY || 'a3d1c86e9f744fd6a6a332e19351b41d';
const PIXABAY_API_KEY =
  process.env.API_PIXABAY_KEY || '29149827-23d37e30a5ca78f3eaaacc25a';
const MAX_DAYS = 3;

const getTripInfo = async (location) => {
  if (!location) {
    return {
      status: 400,
      message: 'Bad request',
    };
  }

  try {
    const geoEndpoint = `${GEONAMES_API}?q=${location}&username=${GEONAMES_API_ACC}&maxRows=1`;
    const geoResponse = await fetch(geoEndpoint);
    const geoData = await geoResponse.json();
    const [place] = geoData?.geonames;

    if (geoData?.geonames.length) {
      const { countryName, lat, lng, name } = place;
      const weatherEnpoint = `${WEATHER_API}?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lng}&days=${MAX_DAYS}`;
      const pixabayEnpoint = `${PIXABAY_API}?key=${PIXABAY_API_KEY}&q=${name}&per_page=${MAX_DAYS}&image_type=photo&orientation=horizontal&order=popular&pretty=true`;
      const [weatherRes, pixabayRes] = await Promise.all([
        fetch(weatherEnpoint),
        fetch(pixabayEnpoint),
      ]);
      let placeToGo = '';
      if (name === countryName) {
        placeToGo = name;
      } else {
        placeToGo = countryName ? `${name}, ${countryName}` : name;
      }
      // Docs: https://www.weatherbit.io/api/weather-current
      const weather = await weatherRes.json();
      const pixabay = await pixabayRes.json();

      //  All valid 3rd res information
      if (placeToGo && weather?.data && pixabay?.hits) {
        const { data } = weather;
        const weatherResponse = data.map((item) => {
          return {
            date: item?.valid_date,
            icon: item?.weather?.icon,
            description: item?.weather?.description,
            minTemp: item?.min_temp,
            maxTemp: item?.max_temp,
            uv: item?.uv,
          };
        });

        const { hits } = pixabay;
        let imageResponse = { author: '', src: '', tags: '', url: '' };
        if (hits?.length) {
          const [resImage] = hits;
          const { webformatURL, user, pageURL, tags } = resImage;
          imageResponse = {
            author: user,
            src: webformatURL,
            tags,
            url: pageURL,
          };
        }

        return {
          status: 200,
          message: 'Success',
          data: {
            placeToGo,
            weather: weatherResponse,
            image: imageResponse,
          },
        };
      }

      return {
        status: 501,
        message: 'External Request Error',
        error: {
          geoData,
          weather,
          pixabay,
        },
      };
    }

    return {
      status: 404,
      message:
        'Sorry! We could not found your location.\nPlease try with diffirent one',
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: 'Internal Server Error',
      error: err,
    };
  }
};

module.exports = getTripInfo;
