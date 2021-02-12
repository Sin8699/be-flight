const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const flight = require('../models/flight');
const { ROLE_USER } = require('../constant');
const passport = require('passport');

router.get(
  '/create-data',
  asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * Math.floor(5));
      const index1 = Math.floor(Math.random() * Math.floor(5));
      const flightCode = 'F ' + i;
      const airportFrom = 'A ' + index.toString();
      const airportTo = 'A ' + index1.toString();
      const dateStart = Date.now();
      const goingTime = '15:30:00';
      const status = 'Ready';
      const vipSeats = 20;
      const normalSeats = 30;
      const vipPrice = 2000;
      const normalPrice = 1000;

      await flight.createFlight({
        flightCode,
        airportFrom,
        airportTo,
        dateStart,
        status,
        vipSeats,
        normalSeats,
        vipPrice,
        normalPrice,
      });
    }
    res.json({
      status: 'Done',
    });
  })
);

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const stateUser = _.get(req, 'user.dataValues');

  try {
    if (stateUser.role === ROLE_USER.ADMIN) {
      const listFlight = await flight.getAllFlight();
      return res.json({
        ...listFlight,
      });
    }

    const listFlight = await flight.getAllFlightYetDepart();
    res.json({
      ...listFlight,
    });
  } catch (error) {
    console.log(err);
    return res.status(401).json({
      message: 'Something not right',
    });
  }
});

router.get('/:flightCode', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const stateUser = _.get(req, 'user.dataValues');
  const { flightCode } = req.params;

  try {
    if (stateUser.role === ROLE_USER.ADMIN) {
      const listFlight = await flight.getFlightByFlightCode(flightCode);
      return res.json({
        ...listFlight,
      });
    }

    const listFlight = await flight.getFlightByFlightCodeYetDepart(flightCode);
    res.json({
      ...listFlight,
    });
  } catch (error) {
    console.log(err);
    return res.status(401).json({
      message: 'Flight not found',
    });
  }
});

router.post('/create-flight', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const stateUser = _.get(req, 'user.dataValues');
  if (stateUser.role !== ROLE_USER.ADMIN) return res.status(403).json({ message: 'Forbidden' });

  const {
    flightCode,
    airportFrom,
    airportTo,
    dateStart,
    goingTime,
    status,
    vipSeats,
    normalSeats,
    vipPrice,
    normalPrice,
  } = req.body;

  flight
    .createFlight({
      flightCode,
      airportFrom,
      airportTo,
      dateStart,
      goingTime,
      status,
      vipSeats,
      normalSeats,
      vipPrice,
      normalPrice,
    })
    .then(async () => {
      res.json({ message: 'Flight created successfully' });
    })
    .catch((err) => {
      res.json({
        error: 'Error when create flight.',
        err: err,
      });
    });
});

router.post('/update-flight', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const stateUser = _.get(req, 'user.dataValues');
  if (stateUser.role !== ROLE_USER.ADMIN) return res.status(403).json({ message: 'Forbidden' });

  const {
    flightCode,
    airportFrom,
    airportTo,
    dateStart,
    goingTime,
    status,
    vipSeats,
    normalSeats,
    vipPrice,
    normalPrice,
  } = req.body;

  goingTime = goingTime;
  console.log(goingTime);
  dateStart = dateStart;
  console.log(dateStart);
  vipSeats = parseInt(vipSeats);
  normalSeats = parseInt(normalSeats);
  vipPrice = parseInt(vipPrice);
  normalPrice = parseInt(normalPrice);

  flight
    .updateFlight({
      flightCode,
      airportFrom,
      airportTo,
      dateStart,
      goingTime,
      status,
      vipSeats,
      normalSeats,
      vipPrice,
      normalPrice,
    })

    .then(async () => {
      res.json({ message: 'Flight update successfully' });
    })
    .catch((err) => {
      res.json({
        error: 'Error when update flight.',
        err: err,
      });
    });
});

module.exports = router;
