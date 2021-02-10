require('dotenv').config();

const cors = require('cors');
const express = require('express');
const passport = require('passport');
const db = require('./db');
const PORT = process.env.PORT || 3000;

require('express-async-errors');

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('HI GUY');
});

// // middlewares
app.use(passport.initialize());
require('./middlewares/passport')(passport);

// app.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
//   res.json({
//     user: req.user,
//   });
// });

app.use('/user', require('./routes/user'));
app.use('/airport', require('./routes/airport'));
app.use('/flight', require('./routes/flight'));
app.use('/middle-airport', require('./routes/middle-airport'));

app.use(function (req, res) {
  res.status(404).json({ code: 1, message: 'Not found' });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ code: 1, message: 'the server is maintenance' });
});

db.sync()
  .then(() => {
    app.listen(PORT);
    console.log('🚀 Server on. PORT : ', PORT);
  })
  .catch((err) => {
    console.log('❌ Setup db failed: ' + err);
    console.error(err);
  });
