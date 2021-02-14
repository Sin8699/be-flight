const config = require('../configs');
const dayjs = require('dayjs');

const cantBookTicket = (dateStart) => {
  const now = dayjs();
  const date1 = dayjs(dateStart);

  return date1.diff(now, 'hour', true) < config.bookedBeforeHour;
};

const isCancelTicket = (dateStart) => {
  const now = dayjs();
  const date1 = dayjs(dateStart);

  return date1.diff(now, 'hour', true) < 0.1;
};

module.exports = { cantBookTicket, isCancelTicket };
