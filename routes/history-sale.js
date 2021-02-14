const router = require('express').Router();
const historySale = require('../models/history-sale');
const flight = require('../models/flight');
const user = require('../models/user');
const asyncHandler = require('express-async-handler');
const { TYPE_SEAT, ROLE_USER, STATUS_TICKET } = require('../constant');
const config = require('../configs');
const { cantBookTicket, restTickets, getStatusTicket } = require('../helpers/sale');
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
    const restTicket = restTickets(sale, flightSale);

    if (!flightSale) {
      return res.status(401).json({
        error: "Flight don't exist",
      });
    }

    if (status === false && cantBookTicket(flightSale.dateStart)) {
      return res.status(401).json({
        message: `Tickets must be booked ${config.bookedBeforeHour / 24} day before take off`,
      });
    }

    const totalPrize = vipSeats * flightSale.vipPrice + normalSeats * flightSale.normalPrice;

    if (status && totalPrize > stateUser.accountBalance) {
      return res.status(401).json({
        message: "Account balance don't enough",
      });
    }

    try {
      if (restTicket.vipSeats < vipSeats) return res.status(400).json({ message: 'Sold out vip seats' });

      if (restTicket.normalSeats < normalSeats) return res.status(400).json({ message: 'Sold out normal seats' });

      if (!!vipSeats)
        await historySale.createHistorySale({
          userID,
          flightCode,
          typeSeat: TYPE_SEAT.VIP,
          numberSeat: vipSeats,
          status,
        });

      if (!!normalSeats)
        await historySale.createHistorySale({
          userID,
          flightCode,
          typeSeat: TYPE_SEAT.NORMAL,
          numberSeat: normalSeats,
          status,
        });

      if (status) await user.updateMoney(userID, stateUser.accountBalance - totalPrize);

      res.json({ message: 'historySale created successfully' });
    } catch (error) {
      res.status(400).json({
        message: 'Error when create historySale.',
        err: err,
      });
    }
  })
);

// router.post(
//   '/update-status-sale',
//   asyncHandler(async function updateStatusSale(req, res) {
//     const { flightCode, status, typeSeat } = req.query;

//     flight.getFlightByFlightCode(flightCode);
//     if (status == false) {
//       console.log('ready');
//     }
//     if (status == true) {
//       console.log('sale');
//     } else {
//     }
//     await historySale
//       .updateStatusHistorySale({ userID, flightCode, status })
//       .then(async () => {
//         res.json({ message: 'historySale update status successfully' });
//       })
//       .catch((err) => {
//         res.json({
//           error: 'Error when update status historySale.',
//           err: err,
//         });
//       });
//   })
// );

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

// router.get(
//   '/get-sale-paid',
//   asyncHandler(async function getListHistorySaleUnpaid(req, res) {
//     const listSalePaid = await historySale.getHistorySaleByStatus(true);
//     res.json({
//       listSalePaid: listSalePaid,
//     });
//   })
// );

router.get(
  '/get-sale-by-status/:status',
  asyncHandler(async function getListHistorySaleUnpaid(req, res) {
    const { status } = req.params;
    const stateUser = _.get(req, 'user.dataValues');
    const userID = stateUser.id;

    const statusMap = getStatusTicket(status);
    const listSaleUnpaid = await historySale.getHistorySaleByStatus(
      !!statusMap,
      stateUser.role === ROLE_USER.ADMIN ? null : userID
    );

    if (status === STATUS_TICKET.PAID)
      return res.json({
        [`${status}List`]: listSaleUnpaid,
      });

    let listCancel = [];

    //cant get flight by code === cant book ticket === cancel tickets booked after
    await Promise.all((listSaleUnpaid || []).map((item) => flight.getFlightByFlightCode(item.flightCode))).then(
      (values) => {
        listSaleUnpaid.forEach((itemSale, i) => {
          if (!values[i]) {
            listCancel.push(itemSale);
          }
        });
      },
      (reason) => {
        console.log('reason', reason);
      }
    );

    await Promise.all(
      (listCancel || []).map((item) =>
        historySale.updateStatusHistorySale({ userID, flightCode: item.flightCode, status: null })
      )
    ).then(
      () => {
        console.log('update history for ticket booked after success');
      },
      (reason) => {
        console.log('reason', reason);
      }
    );

    if (status === STATUS_TICKET.CANCELED) {
      const listSaleCancelUpdated = await historySale.getHistorySaleByStatus(
        statusMap,
        stateUser.role === ROLE_USER.ADMIN ? null : userID
      );

      return res.json({
        [`${status}List`]: listSaleCancelUpdated,
      });
    }

    res.json({
      [`${status}List`]: _.differenceBy(listSaleUnpaid, listCancel, 'id'),
    });
  })
);

// router.get(
//   '/get-sale-canceled',
//   asyncHandler(async function getListHistorySaleCanceled(req, res) {
//     const listSaleCanceled = await historySale.getHistorySaleByStatus(null);
//     res.json({
//       listSaleCanceled: listSaleCanceled,
//     });
//   })
// );
module.exports = router;
