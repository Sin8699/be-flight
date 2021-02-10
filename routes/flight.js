const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const flight = require('../models/flight');

router.get(
  '/create-data',
  asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * Math.floor(5));
      const index1 =Math.floor(Math.random() * Math.floor(5));
      const flightCode = "F " + i ;
      const airportFrom = "A " + index.toString();
      const airportTo = "A " + index1.toString();
      const dateStart = Date.now();
      const timeStart = "15:30:00";
      const status = "Ready";
      const vipSeats = 20;
      const normalSeats = 30;
      const vipPrice = 2000 ;
      const normalPrice = 1000;

      await flight.createFlight({
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
    }
    res.json({
      status: "Done"
    })
  })
);

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
    console.log(req.body);
    let { flightCode,
      airportFrom,
      airportTo,
      dateStart,
      timeStart,
      status,
      vipSeats,
      normalSeats,
      vipPrice,
      normalPrice, } = req.body;

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
    console.log(req.body);
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
    } = req.body;

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
