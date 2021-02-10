const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const flight = require('../models/flight');

router.get(
  '/',
  asyncHandler(async function getListFlight(req, res) {
    const listFlight = await flight.getAllFlight();
    res.json({
      listFlight: listFlight,
    });
  })
);

router.get(
  '/:flightCode',
  asyncHandler(async function getFlight(req, res) {
    const { flightCode } = req.params;
    const flightInfor = await flight.getFlightByFlightCode(flightCode);
    res.json({
      flightInfor: flightInfor,
    });
  })
);

router.post(
  '/create-flight',
  asyncHandler(async function createFlight(req, res) {
    let { flightCode, normalPrice } = req.query;

    timeStart = timeStart;
    console.log(timeStart);
    dateStart = dateStart;
    console.log(dateStart);
    vipSeats = parseInt(vipSeats);
    normalSeats = parseInt(normalSeats);
    vipPrice = parseInt(vipPrice);
    normalPrice = parseInt(normalPrice);

    flight
      .createFlight({
        flightCode,
        airportFrom,
        airportTo,
        dateStart,
        timeStart,
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
  })
);

router.post(
  '/update-flight',
  asyncHandler(async function updateFlight(req, res) {
    let {
      flightCode,
      airportFrom,
      airportTo,
      dateStart,
      timeStart,
      status,
      vipSeats,
      normalSeats,
      vipPrice,
      normalPrice,
    } = req.query;

    timeStart = timeStart;
    console.log(timeStart);
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
        timeStart,
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
  })
);

module.exports = router;
