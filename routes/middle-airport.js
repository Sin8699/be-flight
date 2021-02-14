const router = require('express').Router();
const middleAirport = require('../models/middle-airport');
const asyncHandler = require('express-async-handler');
const requireRole = require('../middlewares/require-role');
const { ROLE_USER } = require('../constant');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get(
  '/',
  requireRole(ROLE_USER.ADMIN),
  asyncHandler(async function getListMiddleAirport(req, res) {
    const listMiddleAirport = await middleAirport.getAllMiddleAirport();
    res.json({
      listMiddleAirport: listMiddleAirport,
    });
  })
);

router.get(
  '/middle-airport-by-flight-code/:flightCode',
  asyncHandler(async function getListMiddleAirportByCode(req, res) {
    const { flightCode } = req.params;
    const listMiddleAirport = await middleAirport.getMiddleAirportByFlightCode(flightCode);
    res.json({
      listMiddleAirport: listMiddleAirport,
    });
  })
);

router.get(
  '/create-data',
  asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * Math.floor(5));
      const index1 = Math.floor(Math.random() * Math.floor(5));
      const flightCode = index;
      const order = index;
      const airportCode = index1;
      const timeDelay = '01:00:00';

      await middleAirport.createMiddleAirport({
        flightCode,
        airportCode,
        timeDelay,
        order,
      });
    }
    res.json({
      status: 'done',
    });
  })
);

router.post(
  '/update-middle-airport/:id',
  requireRole(ROLE_USER.ADMIN),
  asyncHandler(async function updateMiddleAirport(req, res) {
    const { flightCode, airportCode, timeDelay, order = 0 } = req.body;
    const { id } = req.params;

    const checkMiddleAirportIsExisted = await middleAirport.findMiddleAirport({
      flightCode,
      airportCode,
      id: {
        [Op.ne]: id,
      },
    });

    if (checkMiddleAirportIsExisted) {
      return res.status(401).json({ message: 'Middle airport existed' });
    }

    await middleAirport
      .updateMiddleAirport({
        flightCode,
        airportCode,
        timeDelay,
        order,
        id,
      })
      .then(async () => {
        res.json({ message: 'Middle airport update successfully' });
      })
      .catch((err) => {
        res.json({
          error: 'Error when update middle airport.',
          err: err,
        });
      });
  })
);

router.post(
  '/create-middle-airport',
  requireRole(ROLE_USER.ADMIN),
  asyncHandler(async function getListMiddleAirport(req, res) {
    const { flightCode, airportCode, timeDelay, order = 0 } = req.body;

    const checkMiddleAirportIsExisted = await middleAirport.findMiddleAirport({
      flightCode,
      airportCode,
    });

    if (checkMiddleAirportIsExisted) {
      return res.status(401).json({ message: 'Middle airport existed' });
    }

    await middleAirport
      .createMiddleAirport({
        flightCode,
        airportCode,
        timeDelay,
        order,
      })
      .then(async () => {
        res.json({ message: 'Middle airport created successfully' });
      })
      .catch((err) => {
        res.json({
          error: 'Error when create middle airport.',
          err: err,
        });
      });
  })
);

module.exports = router;
