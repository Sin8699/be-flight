const router = require('express').Router();
const middleAirport = require('../models/middle-airport');
const asyncHandler = require('express-async-handler');

router.get('/',
    asyncHandler(async function getListMiddleAirport(req, res) {
        const listMiddleAirport = await middleAirport.getAllMiddleAirport();
        res.json({
            listMiddleAirport: listMiddleAirport,
        });
    })
);

router.get('/middle-airport-by-flight-code/:flightCode',
    asyncHandler(async function getListMiddleAirportByCode(req, res) {
        const {flightCode} = req.params;
        const listMiddleAirport = await middleAirport.getMiddleAirportByFlightCode(flightCode);
        res.json({
            listMiddleAirport:listMiddleAirport,
        })
    })
);

router.get('/create-data',
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

router.post('/update-middle-airport',
    asyncHandler(async function updateMiddleAirport(req, res) {
        const { flightCode, airportCode, timeDelay } = req.body;
        await middleAirport.updateMiddleAirport({
            flightCode,
            airportCode,
            timeDelay
        })
            .then(async () => {
                res.json({ message: 'middle airport update successfully' });
            })
            .catch((err) => {
                res.json({
                    error: 'Error when update middle airport.',
                    err: err,
                });
            });
    })
);

router.post('/create-middle-airport',
    asyncHandler(async function getListMiddleAirport(req, res) {
        const { flightCode, airportCode, timeDelay } = req.body;
        await middleAirport.createMiddleAirport({
            flightCode,
            airportCode,
            timeDelay
        })
            .then(async () => {
                res.json({ message: 'middle airport created successfully' });
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
