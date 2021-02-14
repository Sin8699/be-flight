const router = require('express').Router();
const airport = require('../models/airport');
const asyncHandler = require('express-async-handler');

router.get(
  '/',
  asyncHandler(async function getListAirport(req, res) {
    const listAirport = await airport.getAllAirport();
    res.json({
      listAirport: listAirport,
    });
  })
);

router.get(
  '/create-data',
  asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
      const name = 'Airport ' + i.toString();
      const address = 'address ' + i.toString();
      await airport.createAirport({
        name,
        address,
      });
    }
    res.json({
      status: 'Done',
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async function getAirport(req, res) {
    const { id } = req.params;
    const airportInfo = await airport.getAirportByAirportCode(airportCode);
    res.json({
      airportInfo: airportInfo,
    });
  })
);

router.post(
  '/create-airport',
  asyncHandler(async function createAirport(req, res) {
    const { name, address } = req.body;

    airport
      .createAirport({
        name,
        address,
      })
      .then(async () => {
        res.json({ message: 'Airport created successfully' });
      })
      .catch((err) => {
        res.json({
          error: 'Error when create airport.',
          err: err,
        });
      });
  })
);

router.post(
  '/update-airport/:id',
  asyncHandler(async function updateAirport(req, res) {
    const { name, address } = req.body;
    const { id } = req.params;

    airport
      .updateAirport({
        name,
        address,
        id,
      })
      .then(async () => {
        res.json({ message: 'Airport update successfully' });
      })
      .catch((err) => {
        res.json({
          error: 'Error when update airport.',
          err: err,
        });
      });
  })
);
module.exports = router;
