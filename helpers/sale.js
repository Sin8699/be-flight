const config = require('../configs');
const dayjs = require('dayjs');
const { TYPE_SEAT } = require('../constant');

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

const restTickets = (listSale) => {
  let normalSeats = 0;
  let vipSeats = 0;
  listSale.forEach((item) => {
    if (item.typeSeat === TYPE_SEAT.NORMAL) {
      normalSeats = item.total_seat;
    }
    if (item.typeSeat === TYPE_SEAT.VIP) {
      vipSeats = item.total_seat;
    }
  });

  return {
    normalSeats: +normalSeats,
    vipSeats: +vipSeats,
  };
};

module.exports = { cantBookTicket, isCancelTicket, restTickets };
