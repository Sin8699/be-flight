const router = require('express').Router();
const historySale = require('../models/history-sale');
const flight = require('../models/flight');
const asyncHandler = require('express-async-handler');
const { TYPE_SEAT } = require('../constant');

router.get('/',
  asyncHandler(async function getListHistorySale(req, res) {
    const listSale = await historySale.getAllSale();
    res.json({
      listSale: listSale,
    });
  })
);

router.get('/create-data',
  asyncHandler(async function (req, res) {
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * Math.floor(5));
      const index1 = Math.floor(Math.random() * Math.floor(Type.length));
      const userID = 5;
      const flightCode = 'F ' + index.toString();
      const typeSeat = Type[index1];
      const status = false;
      const numberSeat = 1;

      const flightSale = await flight.getFlightByFlightCode(flightCode);
      if (typeSeat == TYPE_SEAT.VIP) {
        flightSale.vipSeats -= numberSeat;
      }
      if (typeSeat == TYPE_SEAT.NORMAL) {
        flightSale.normalSeats -= numberSeat;
      }
      flightSale.save();

      await historySale.createHistorySale({
        userID,
        flightCode,
        typeSeat,
        status,
      });
    }
    res.json({
      status: 'done',
    });
  })
);

router.post('/create-sale',
  asyncHandler(async function createSale(req, res) {
    const { userID, flightCode, typeSeat, numberSeat, status } = req.body;

    const flightSale = await flight.getFlightByFlightCode(flightCode);
    if (flightSale == null) {
      res.json({
        error: "flight don't exist",
      });
    }
    if (typeSeat == TYPE_SEAT.VIP) {
      flightSale.vipSeats -= 1;
    }
    if (typeSeat == TYPE_SEAT.NORMAL) {
      flightSale.normalSeats -= 1;
    }
    flightSale.save();
    historySale
      .createHistorySale({
        userID,
        flightCode,
        typeSeat,
        numberSeat,
        status,
      })
      .then(async () => {
        res.json({ message: 'historySale created successfully' });
      })
      .catch((err) => {
        res.json({
          error: 'Error when create historySale.',
          err: err,
        });
      });
  })
);

router.post('/update-status-sale',
  asyncHandler(async function updateStatusSale(req, res) {
    const { userID, flightCode, status, typeSeat } = req.query;
    flight.getFlightByFlightCode(flightCode)
    if (status == false) {
      console.log("ready");
    }
    if (status == true) {
      console.log("sale");
    }
    else {

    }
    // await historySale.updateStatusHistorySale({ userID, flightCode, status })
    //   .then(async () => {
    //     res.json({ message: 'historySale update status successfully' });
    //   })
    //   .catch((err) => {
    //     res.json({
    //       error: 'Error when update status historySale.',
    //       err: err,
    //     });
    //   });
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

router.get('/get-sale-paid',
  asyncHandler(async function getListHistorySaleUnpaid(req, res) {
    const listSalePaid = await historySale.getHistorySaleByStatus(true);
    res.json({
      listSalePaid: listSalePaid,
    });
  })
);

router.get('/get-sale-unpaid',
  asyncHandler(async function getListHistorySaleUnpaid(req, res) {
    const listSaleUnpaid = await historySale.getHistorySaleByStatus(false);
    res.json({
      listSaleUnpaid: listSaleUnpaid,
    });
  })
);

router.get('/get-sale-canceled',
  asyncHandler(async function getListHistorySaleCanceled(req, res) {
    const listSaleCanceled = await historySale.getHistorySaleByStatus(null);
    res.json({
      listSaleCanceled: listSaleCanceled,
    });
  })
);
module.exports = router;
