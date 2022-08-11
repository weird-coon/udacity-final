import { deleteTrip, id, resultElement } from './index';

import dayjs from 'dayjs';
import { getUVColor } from './helpers/uv';

const renderTripCard = (trip) => {
  const diffDate = dayjs(trip.end).diff(trip.start, 'day');
  const timeFromNowToStartDate = dayjs(trip.start).fromNow(true);

  return `
    <div class="weather-card" id="card-${trip.id}">
      <div
        class="weather-card__image${
          !trip.image.src ? ' weather-card__image--default' : ''
        }"
        style="background-image: url(${trip.image.src})"
      >
        <div class="layer"></div>
        <div class="location-icon"></div>
        <small class="place">
          IN NEXT ${timeFromNowToStartDate}
        </small>
      </div>
      <div class="weather-card__content">
        <div class="wave-effect">
          <div class="wave"></div>
          <div class="layer--1"></div>
          <div class="layer--2"></div>
          <div class="layer--3"></div>
        </div>

        <div class="contents">
          <h3>${trip.placeToGo}</h3>
          <small>
          ${
            trip.start === trip.end
              ? dayjs(trip.start).format('MMM DD - YYYY')
              : `${dayjs(trip.start).format('MMM DD')} - ${dayjs(
                  trip.end,
                ).format('MMM DD - YYYY')}`
          } | Duration: ${Number(diffDate) !== 0 ? `${diffDate}` : '1'} days
          </small>
          <div class="forecast">
            ${trip?.weather
              .map((forecast) => renderWeatherItem(forecast))
              .join('')}
          </div>
          <div class="delete-icon" id="item-${trip.id}">
            <span class="delete-icon__img"></span>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderWeatherItem = (forecast) => {
  return `
    <div class="forecast__item">
      <span class="forecast__item-date">
        ${dayjs(forecast.date).format('ddd DD')}
      </span>
      <img
        src="https://www.weatherbit.io/static/img/icons/${forecast.icon}.png"
        title="${forecast.description}"
        alt="weather icon"
      />
      <span class="forecast__item-temp">
        ${Math.round(forecast.minTemp)}° - ${Math.round(forecast.maxTemp)}°
      </span>
      <span class="forecast__item-uv" >UV:
        <span style="color: ${getUVColor(forecast.uv)}">
        ${forecast.uv}
        </span>
      </span>
    </div>
  `;
};

export const renderTripInfo = (plannerTrips) => {
  resultElement.style.display = 'block';

  if (!plannerTrips.length) {
    resultElement.innerHTML = renderEmptyTripResult();
    return;
  }

  resultElement.innerHTML = `
    <div class="travel-result__container container">
      <h2>Your Planner Trips</h2>
      <div class="travel-result__trips">
        ${plannerTrips.map((trip) => renderTripCard(trip)).join('')}
      </div>
    </div>
  `;

  // Attach delete trip event to remove button elm
  plannerTrips.forEach((trip) => {
    id(`item-${trip.id}`).addEventListener('click', () => {
      deleteTrip(trip.id);
    });
  });
};

const renderEmptyTripResult = () => {
  return `
    <div class="travel-result__container container">
      <h2>Your Planner Trips</h2>
      <div class="empty-planner">
        <div class="empty-planner__icon"></div>
        <div class="empty-planner__text">
          Oops! Empty trips here. <br>
          Let's back to top & plan your new trips
        </div>
      <div/>
    </div>
  `;
};
