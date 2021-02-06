const router = require("express").Router();
const airport = require("../services/airport");
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async function getListAirport(req, res) {

    const listAirport = await airport.getAllAirport();
    res.json({
        listAirport: listAirport
    });
}));

router.get('/:airportCode', asyncHandler(async function getAirport(req, res) {
    const { airportCode } = req.params;
    const airportInfor = await airport.getAirportByAirportCode(airportCode);
    res.json({
        airportInfor: airportInfor,
    });
}));

router.post("/create-airport", asyncHandler(async function createAirport(req, res) {
    const { name, airportCode, address } = req.query;

    airport.createAirport({
        name,
        airportCode,
        address,
    })
        .then(async () => {
            res.json({ message: "Airport created successfully" });
        })
        .catch((err) => {
            res.json({
                error: "Error when create airport.",
                err: err
            });
        });
}));

router.post("/update-airport", asyncHandler(async function updateAirport(req, res) {
    const { name, airportCode, address } = req.query;
console.log(name)
    airport.updateAirport({
        name,
        airportCode,
        address,
    })
        .then(async () => {
            res.json({ message: "Airport update successfully" });
        })
        .catch((err) => {
            res.json({
                error: "Error when update airport.",
                err: err
            });
        });
}));
module.exports = router;