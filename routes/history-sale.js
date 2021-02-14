const router = require('express').Router();
const historySale = require('../models/history-sale');
const flight = require('../models/flight');
const asyncHandler = require('express-async-handler');
const { TYPE_SEAT } = require('../constant');
const config = require('../configs');
const { cantBookTicket, restTickets } = require('../helpers/sale');
const _ = require('lodash');

router.get(
  '/',
  asyncHandler(async function getListHistorySale(req, res) {
    const listSale = await historySale.getAllSale();
    res.json({
      listSale: listSale,
    });
  })
);

router.get(
  '/create-data',
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

router.post(
  '/create-sale',
  asyncHandler(async function createSale(req, res) {
    const { flightCode, vipSeats = 0, normalSeats = 0, status } = req.body;
    const stateUser = _.get(req, 'user.dataValues');
    const userID = stateUser.id;

    const flightSale = await flight.getFlightByFlightCode(flightCode);
    const sale = await historySale.getAllTotalSeatByFlightCode(flightCode);
    const restTicket = restTickets(sale);
    console.log('restTicket', restTicket);

    if (!flightSale) {
      return res.status(401).json({
        error: "Flight don't exist",
      });
    }

    if (cantBookTicket(flightSale.dateStart)) {
      return res.status(401).json({
        error: `Tickets must be booked ${config.bookedBeforeHour / 24} day before take off`,
      });
    }

    try {
      if (!!vipSeats) {
        if (restTicket.vipSeats >= vipSeats) {
          await historySale.createHistorySale({
            userID,
            flightCode,
            typeSeat: TYPE_SEAT.VIP,
            numberSeat: vipSeats,
            status,
          });

          // flightSale.vipSeats -= vipSeats;
        } else return res.status(400).json({ message: 'Sold out vip seats' });
      }

      if (!!normalSeats) {
        if (restTicket.normalSeats >= normalSeats) {
          await historySale.createHistorySale({
            userID,
            flightCode,
            typeSeat: TYPE_SEAT.NORMAL,
            numberSeat: normalSeats,
            status,
          });

          // flightSale.normalSeats -= normalSeats;
        } else return res.status(400).json({ message: 'Sold out normal seats' });
      }

      // flightSale.save();

      res.json({ message: 'historySale created successfully' });
    } catch (error) {
      res.status(400).json({
        message: 'Error when create historySale.',
        err: err,
      });
    }
  })
);

router.post(
  '/update-status-sale',
  asyncHandler(async function updateStatusSale(req, res) {
    const { flightCode, status, typeSeat } = req.query;

    flight.getFlightByFlightCode(flightCode);
    if (status == false) {
      console.log('ready');
    }
    if (status == true) {
      console.log('sale');
    } else {
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
  })
);

router.post(
  '/update-type-seat',
  asyncHandler(async function updateStatusSale(req, res) {
    const { flightCode, typeSeat } = req.query;
    const stateUser = _.get(req, 'user.dataValues');
    const userID = stateUser.id;

    await historySale
      .updateTypeSeatHistorySale({ userID, flightCode, typeSeat })
      .then(async () => {
        res.json({ message: 'historySale type seat status successfully' });
      })
      .catch((err) => {
        res.status(401).json({
          error: 'Error when update type seat historySale.',
          err: err,
        });
      });
  })
);

router.get(
  '/get-sale-paid',
  asyncHandler(async function getListHistorySaleUnpaid(req, res) {
    const listSalePaid = await historySale.getHistorySaleByStatus(true);
    res.json({
      listSalePaid: listSalePaid,
    });
  })
);

router.get(
  '/get-sale-unpaid',
  asyncHandler(async function getListHistorySaleUnpaid(req, res) {
    const listSaleUnpaid = await historySale.getHistorySaleByStatus(false);

    listSaleUnpaid.forEach(async (item) => {
      const flight = await flight.getFlightByFlightCode(item.flightCode);

      if (isCancelTicket(flight.dateStart)) {
      }
    });
    res.json({
      listSaleUnpaid: listSaleUnpaid,
    });
  })
);

router.get(
  '/get-sale-canceled',
  asyncHandler(async function getListHistorySaleCanceled(req, res) {
    const listSaleCanceled = await historySale.getHistorySaleByStatus(null);
    res.json({
      listSaleCanceled: listSaleCanceled,
    });
  })
);
module.exports = router;
