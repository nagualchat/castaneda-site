const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./config");
mongoose.Promise = global.Promise;

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.use(require("./routes/search"));
app.use(require("./routes/books"));

mongoose.connect(config.dbURL, config.dbOptions);
mongoose.connection
  .once("open", () => {
    console.log("Mongoose - соединение установлено ...");
    app.listen(config.port, () => console.log(`Сервер запущен (порт ${config.port}) ...`));
  })
  .on("error", error => console.warn(error));
