const express = require('express');
const bodyParser = require('body-parser');
const db = require('./services/database');
const port = process.env.PORT || 3030;

const app = express();


// app.use("/register", require("./routes/register"));
// app.use("/login", require("./routes/login"));
// app.use("/user", require("./routes/user"));
app.use("/flight", require("./routes/flight"));
app.use("/airport", require("./routes/airport"));

db.sync()
  .then(() => {
    app.listen(port);
    console.log("server running at : ", port);
    console.log(`http://localhost:${port}/`);
  })
  .catch((err) => {
    console.log(err);
  });