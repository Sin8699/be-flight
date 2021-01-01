require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./services/database");
const passport = require("passport");
const PORT = process.env.PORT || 3030;

const app = express();
app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/user", require("./routes/user"));
app.use("/airport", require("./services/airport"));
app.use("/flight", require("./services/flight"));
app.use("/middle-airport", require("./services/middle-airport"));
app.use("/history-sale", require("./services/history-sale"));

db.sync()
  .then(() => {
    app.listen(PORT);
    console.log("server running at : ", PORT);
    console.log(`http://localhost:${PORT}/`);
  })
  .catch((err) => {
    console.log(err);
  });
