import moment from 'moment';

// to covert camelcase, underscorecase and lowercase words to proper pascle upper case words
export const ToProperCase = string => {
  return string
    .replace(/_/g, ' ')
    .replace(/(^\w|\s\w)/g, firstCharOfWord => firstCharOfWord.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2');
};

// to covert it to proper date format
/*
export const ProperDateFormat = inputDateString => {
  const dateObj = new Date(inputDateString);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[dateObj.getUTCMonth()];
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  let hour = dateObj.getUTCHours();
  const minute = dateObj.getUTCMinutes();
  const amPm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // Convert hour to 12-hour format
  return `${month} ${day}, ${year} at ${hour
    .toString()
    .padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${amPm}`;
}; */

export const ProperDateFormat = inputDateString => {
  return moment(inputDateString).format('MMMM D, YYYY [at] hh:mm A');
};

// to proper money with commas and decimal precision upto 3 decimals
export const ProperMoneyFormat = number => {
  return number.toLocaleString('en-IN', { maximumFractionDigits: 3 });
};
