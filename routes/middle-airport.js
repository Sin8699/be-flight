const router = require('express').Router();
const middleAirport = require('../models/middle-airport');

router.get(
    '/',
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
        const {flightCode} = req.params;
        const flightInfor = await middleAirport.getMiddleAirportByFlightCode(flightCode);
    })
);

router.get(
    '/create-data',
    asyncHandler(async function (req, res) {
        for (let i = 0; i < 5; i++){
            const index = Math.floor(Math.random() * Math.floor(5));
            const index1 =Math.floor(Math.random() * Math.floor(5));
            const flightCode  = "F " + index;
            const airportCode = "A " + index1;
            const timeDelay = "01:00:00";

            await middleAirport.createMiddleAirport({
                flightCode,
                airportCode,
                timeDelay
            });
        }
        res.json({
            status: "done"
        })
    })
);

router.post(
    '/create-middle-airport',
    asyncHandler(async function getListMiddleAirport(req, res) {
        const { flightCode, airportCode, timeDelay } = req.query;
        await middleAirport.createMiddleAirport({
            flightCode,
            airportCode,
            timeDelay
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


module.exports = router;
