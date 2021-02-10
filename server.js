require('dotenv').config();
const cors = require('cors');
const express = require('express');
const db = require('./db');
const PORT = process.env.PORT || 3000;
require('express-async-errors');

const app = express();
app.use(express.static('public'));
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// // middlewares
// app.use(passport.initialize());
// require("./middlewares/passport")(passport);
// app.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     res.json({
//       message: "Okay.",
//     });
//   }
// );

app.get('/', (req, res) => {
  res.send('HI GUY');
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/user', require('./routes/user'));
app.use('/airport', require('./routes/airport'));
app.use('/flight', require('./routes/flight'));

app.use(function (req, res) {
  res.status(404).json({ message: 'Not found' });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ code: 0, message: 'the server is maintenance' });
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
