const config = require('../configs');
const dayjs = require('dayjs');
const { TYPE_SEAT, STATUS_TICKET } = require('../constant');

const cantBookTicket = (dateStart) => {
  const now = dayjs();
  const date1 = dayjs(dateStart);

  return date1.diff(now, 'hour', true) < config.bookedBeforeHour;
};

const cantCancelTicket = (dateStart) => {
  const now = dayjs();
  const date1 = dayjs(dateStart);

  return date1.diff(now, 'hour', true) < config.cancelBeforeHour;
};

const getStatusTicket = (status) => {
  switch (status) {
    case STATUS_TICKET.PAID:
      return true;

    case STATUS_TICKET.UNPAID:
      return false;

    default:
      return null;
  }
};

const restTickets = (listSale, flight) => {
  if (!flight)
    return {
      normalSeats: 0,
      vipSeats: 0,
    };

  let normalSeats = flight.normalSeats;
  let vipSeats = flight.vipSeats;

  listSale.forEach((item) => {
    if (item.typeSeat === TYPE_SEAT.NORMAL) {
      normalSeats -= item.total_seat || 0;
    }
    if (item.typeSeat === TYPE_SEAT.VIP) {
      vipSeats -= item.total_seat || 0;
    }
  });

  return {
    normalSeats: +normalSeats,
    vipSeats: +vipSeats,
  };
};

module.exports = { cantBookTicket, cantCancelTicket, restTickets, getStatusTicket };
