const router = require("express").Router();
const historySale = require("../services/history-sale");
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async function getListHistorySale(req, res) {
    const listSale = await historySale.getAllSale();
    res.json({
        listSale: listSale
    });
}));

router.get('/get-sale/:year', asyncHandler(async function getSaleByYear(req, res) {
    const {year} = req.params
    console.log(year)
    const listSale = historySale.getHistorySaleByYear(year);
    res.json({
        listSale : listSale
    });
}));

router.post("/create-sale", asyncHandler(async function createSale(req, res) {
    let { userID,
        flightCode,
        typeSeat,
        dateSale, 
        status } = req.query;

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

module.exports = router;
