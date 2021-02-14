const isWrongDateStartEnd = (dateStart, dateEnd) => {
  const date1 = dayjs(dateStart);
  const date2 = dayjs(dateEnd);

  return date1.isBefore(date2);
};

module.exports = { isWrongDateStartEnd };
