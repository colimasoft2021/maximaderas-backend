const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const port = process.env.PORT || 3977;
const IP_SERVER = process.env.HOST;
const PORT_DB = process.env.PORT_DB;

mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/agustinnavarrogaldon`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      app.listen(port, () => {
        console.log("######################");
        console.log("###### API REST ######");
        console.log("######################");
        console.log(`http://${IP_SERVER}:${port}/api/`);
      });
    }
  }
);
