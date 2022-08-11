import dayjs from './helpers/day';

export const validate = (formData) => {
  const { location, start, end } = formData;
  if (!location || !start || !end) {
    return 'Trip info cannot be blank. Please try again.';
  }
  if (!isValidTripDates(start, end)) {
    return 'Please enter valid date\nCheck your start date / end date then try again';
  }
  if (isExistedTrip(location, start, end)) {
    return 'You already have this trip!\n Please try to add new one';
  }

  return false;
};

const isValidTripDates = (start, end) => {
  const { $y, $M, $D } = dayjs();
  const today = `${$y}-${$M + 1}-${$D}`;
  const isValidStartDate = dayjs(start).isSameOrAfter(today);
  const isValidEndDate = dayjs(start).isSameOrBefore(dayjs(end));

  return isValidStartDate && isValidEndDate;
};

const isExistedTrip = (location, start, end) => {
  const tripStoraged = window.localStorage.getItem('tripsPlanner');
  if (!tripStoraged) {
    return false;
  }
  const inputLocation = location.trim().toLowerCase();
  const inputStart = start.trim().toLowerCase();
  const inputEnd = end.trim().toLowerCase();
  const existedTrips = JSON.parse(tripStoraged);

  return !!existedTrips.find(
    (item) =>
      inputLocation === item?.inputLocation.trim().toLowerCase() &&
      inputStart === item?.start.trim().toLowerCase() &&
      inputEnd === item?.end.trim().toLowerCase(),
  );
};
