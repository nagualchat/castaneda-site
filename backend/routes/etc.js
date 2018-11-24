const express = require("express");

const msg =
"examples: \n\n" +
"/get-book?id=cc1c \n" +
"/get-chapter?book=cc1c&chapter=0 \n" +
"/search?query=дымок&books=cc1c,cc2c&offset=0";

const router = express.Router();

router.get("", (request, response) => {
  response.set("Content-Type", "text/plain");
  response.send(msg);
})

router.get("/", (request, response) => {
  response.set("Content-Type", "text/plain");
  response.send(msg);
})


module.exports = router