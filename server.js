require('dotenv').config();

const cors = require('cors');
const express = require('express');
const passport = require('passport');
const db = require('./db');
const PORT = process.env.PORT || 3000;

const expressSession = require('express-session');
require('express-async-errors');

const app = express();

app.use(expressSession({ secret: 'keyboard cat' }));
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// // middlewares
app.use(passport.initialize());
app.use(passport.session());
require('./middlewares/passport')(passport);

app.get('/', (req, res) => {
  res.send('HI GUY');
});

app.use('/user', require('./routes/user'));

//auth.
app.use(passport.authenticate('jwt', { session: false }));

app.use('/airport', require('./routes/airport'));
app.use('/flight', require('./routes/flight'));
app.use('/middle-airport', require('./routes/middle-airport'));
app.use('/history-sale', require('./routes/history-sale'));

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
