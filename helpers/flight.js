const dayjs = require('dayjs');

const isWrongDateStartEnd = (dateStart, dateEnd) => {
  const date1 = dayjs(dateEnd);
  const date2 = dayjs(dateStart);

  return date1.isBefore(date2);
};

module.exports = { isWrongDateStartEnd };
