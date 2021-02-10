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


router.get('/create-data',
  asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
      const name = "Airport " + i.toString();
      const airportCode = "A " + i.toString();
      const address = "address " + i.toString();
      await airport.createAirport({
        name,
        airportCode,
        address,
      })
    }
    res.json({
      status: "Done"
    })
  })
);

router.get(
  '/:airportCode',
  asyncHandler(async function getAirport(req, res) {
    const { airportCode } = req.params;
    const airportInfor = await airport.getAirportByAirportCode(airportCode);
    res.json({
      airportInfor: airportInfor,
    });
  })
);

router.post(
  '/create-airport',
  asyncHandler(async function createAirport(req, res) {
    const { name, airportCode, address } = req.query;

    airport
      .createAirport({
        name,
        airportCode,
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
  '/update-airport',
  asyncHandler(async function updateAirport(req, res) {
    const { name, airportCode, address } = req.query;
    console.log(name);
    airport
      .updateAirport({
        name,
        airportCode,
        address,
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
