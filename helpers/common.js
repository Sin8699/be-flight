const findById = (id, list) => {
  return list.find((item) => +item.id === +id);
};

module.exports = { findById };
