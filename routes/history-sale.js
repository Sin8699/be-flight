const router = require("express").Router();
const historySale = require("../models/history-sale");
const flight = require("../models/flight");
const asyncHandler = require('express-async-handler');
const Type = ["vip", "normal"];

router.get('/', asyncHandler(async function getListHistorySale(req, res) {
    const listSale = await historySale.getAllSale();
    res.json({
        listSale: listSale
    });
}));

router.get('/create-data', asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * Math.floor(5));
        const index1 = Math.floor(Math.random() * Math.floor(Type.length));
        const userID = 5;
        const flightCode = "F " + index.toString();
        const typeSeat = Type[index1];
        const dateSale = Date.now();
        const status = false;

        const flightSale = await flight.getFlightByFlightCode(flightCode);
        if (typeSeat == Type[0]) {
            flightSale.vipSeats -= 1;
        }
        else if (typeSeat == Type[1]) {
            flightSale.normalSeats -= 1;
        }
        flightSale.save();

        await historySale.createHistorySale({
            userID,
            flightCode,
            typeSeat,
            dateSale,
            status
        });
    };
    res.json({
        status: "done"
    });
}));

router.get('/get-sale/:year', asyncHandler(async function getSaleByYear(req, res) {
    const { year } = req.params
    console.log(year)
    const listSale = historySale.getHistorySaleByYear(year);
    res.json({
        listSale: listSale
    });
}));

router.post("/create-sale", asyncHandler(async function createSale(req, res) {
    let { userID,
        flightCode,
        typeSeat,
        dateSale,
        status } = req.query;

    const flightSale = await flight.getFlightByFlightCode(flightCode);
    if (flightSale == null) {
        res.json({
            error: "flight don't exist"
        })
    }
    if (typeSeat == Type[0]) {
        flightSale.vipSeats -= 1;
    }
    else if (typeSeat == Type[1]) {
        flightSale.normalSeats -= 1;
    }
    flightSale.save();
    historySale.createHistorySale({
        userID,
        flightCode,
        typeSeat,
        dateSale,
        status
    })
        .then(async () => {
            res.json({ message: "historySale created successfully" });
        })
        .catch((err) => {
            res.json({
                error: "Error when create historySale.",
                err: err
            });
        });
}));

router.post('/update-status-sale', asyncHandler(async function updateStatusSale(req, res) {
    const { userID, flightCode, status } = req.query
    await historySale.updateStatusHistorySale({ userID, flightCode, status })
    .then(async () => {
        res.json({ message: "historySale update status successfully" });
    })
    .catch((err) => {
        res.json({
            error: "Error when update status historySale.",
            err: err
        });
    });
}));

router.post('/update-type-seat', asyncHandler(async function updateStatusSale(req, res) {
    const { userID, flightCode, typeSeat } = req.query
    
    await historySale.updatetypeSeatHistorySale({ userID, flightCode, typeSeat })
    .then(async () => {
        res.json({ message: "historySale type seat status successfully" });
    })
    .catch((err) => {
        res.json({
            error: "Error when update type seat historySale.",
            err: err
        });
    });
}));

module.exports = router;
