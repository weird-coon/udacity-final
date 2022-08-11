import dayjs from 'dayjs';
import { renderTripInfo } from './renderView';
import { validate } from './validation';

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
  const storageTrips = storagedTrips();
  if (storageTrips) {
    const existedTrips = JSON.parse(storageTrips);
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

  // Enabled loading state
  loading.style.display = 'flex';

  postData('/trip-planner', { location: location?.value })
    .then((res) => {
      if (res.status === 200 && res.data) {
        const trip = {
          ...res.data,
          id: Date.now(),
          start: dayjs(startDate?.value, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          end: dayjs(endDate?.value, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          inputLocation: location?.value, // For client side check existed purpose
        };

        const storageTrips = storagedTrips();
        // Init trips incase empty existed trips
        if (!storageTrips) {
          handleTripRerender([trip]);
          return;
        }

        // Push new trip to existed trips
        const existedTrips = JSON.parse(storageTrips);
        existedTrips.push(trip);

        handleTripRerender(existedTrips);
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
    const storageTrip = storagedTrips();
    if (!storageTrip) {
      return false;
    }
    // Remove from UI
    id(`card-${tripID}`)?.remove();
    // Remove from local storage
    const existedTrips = JSON.parse(storageTrip);
    const tripIndex = existedTrips.findIndex((trip) => trip.id === tripID);
    existedTrips.splice(tripIndex, 1);

    if (existedTrips.length) {
      setTrips(existedTrips);
    } else {
      renderTripInfo([]);
      setTrips([]);
    }
  }
};

const clearInputState = () => {
  location.value = '';
  startDate.value = '';
  endDate.value = '';
};

const handleTripRerender = (trips) => {
  setTrips(trips);
  renderTripInfo(trips);
  clearInputState();
  resultElement.scrollIntoView({
    behavior: 'smooth',
  });
};

const storagedTrips = () => {
  return window.localStorage.getItem('tripsPlanner');
};

const setTrips = (trips) => {
  window.localStorage.setItem('tripsPlanner', JSON.stringify(trips));
};

/**
 * Post data to /api endpoint then recive response result
 * @param {String} url
 * @param {Object} data
 * @returns
 */
const postData = async (url, data) => {
  try {
    console.log('url', url);
    const res = await fetch(url, {
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
