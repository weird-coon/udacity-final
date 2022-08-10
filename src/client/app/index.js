import dayjs from 'dayjs';
import { renderTripInfo } from './renderView';
import { validate } from './validation';

const baseAppUrl = 'http://localhost:8000';

export const id = (elmID) => document.getElementById(elmID);
const location = id('location');
const startDate = id('start');
const endDate = id('end');
const loading = id('loading');
export const resultElement = id('travel-result');

export const init = () => {
  // Set input date min date is Today
  startDate.min = new Date().toISOString().split('T')[0];
  endDate.min = new Date().toISOString().split('T')[0];

  // Get trips from local storage if any
  const existed = window.localStorage.getItem('tripsPlanner');
  if (existed) {
    const existedTrips = JSON.parse(existed);
    renderTripInfo(existedTrips);
  }
};

export const handleTripPlanner = (e) => {
  e.preventDefault();

  const formData = {
    location: location?.value,
    start: startDate?.value,
    end: endDate?.value,
  };

  const formError = validate(formData);
  if (formError) {
    alert(formError);
    return;
  }

  // @TODO: make scroll to section

  // Enabled loading state
  loading.style.display = 'flex';

  postData('/trip-planner', { location: location?.value })
    .then((res) => {
      // result.innerHTML = generateResultHTML(res);
      if (res.status === 200 && res.data) {
        const trip = {
          ...res.data,
          id: Date.now(),
          start: dayjs(startDate?.value, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          end: dayjs(endDate?.value, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          // For client side check existed purpose
          inputLocation: location?.value,
        };

        const existedTrips = window.localStorage.getItem('tripsPlanner');
        // Init trips incase empty existed trips
        if (!existedTrips) {
          window.localStorage.setItem('tripsPlanner', JSON.stringify([trip]));
          renderTripInfo([trip]);
          clearInputState();
          resultElement.scrollIntoView({
            behavior: 'smooth',
          });
          return;
        }

        // Push new trip to existed trips
        const existedTripsObj = JSON.parse(existedTrips);
        existedTripsObj.push(trip);
        renderTripInfo(existedTripsObj);
        window.localStorage.setItem(
          'tripsPlanner',
          JSON.stringify(existedTripsObj),
        );
        clearInputState();
        resultElement.scrollIntoView({
          behavior: 'smooth',
        });
      } else {
        if (res?.status && res?.status === 404) {
          alert(res?.message);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          location.focus();
        }
        console.error(`Oops! ${res?.status}`, res?.message);
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.style.display = 'none';
    });
};

export const deleteTrip = (tripID) => {
  if (confirm('Are you sure to delete this item?')) {
    const existed = window.localStorage.getItem('tripsPlanner');
    if (!existed) {
      return false;
    }
    // Remove from UI
    id(`card-${tripID}`)?.remove();
    // Remove from local storage
    const existedTrips = JSON.parse(existed);
    const tripIndex = existedTrips.findIndex((trip) => trip.id === tripID);
    existedTrips.splice(tripIndex, 1);

    if (existedTrips.length) {
      window.localStorage.setItem('tripsPlanner', JSON.stringify(existedTrips));
    } else {
      renderTripInfo([]);
      window.localStorage.setItem('tripsPlanner', JSON.stringify([]));
    }
  }
};

const clearInputState = () => {
  location.value = '';
  startDate.value = '';
  endDate.value = '';
};

/**
 * Post data to /api endpoint then recive response result
 * @param {String} url
 * @param {Object} data
 * @returns
 */
const postData = async (url, data) => {
  try {
    const res = await fetch(baseAppUrl + url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    return Promise.reject(new Error('Error', error));
  }
};
