const express = require("express");
const Book = require("../models/book");
const Chapter = require("../models/chapter");
const config = require("../config");

const router = express.Router()

router.get("/api/get-chapter", (request, response) => {
  var book = request.query.book;
  var chapter = parseInt(request.query.chapter);

  Chapter.findOne({ "book.id": book, "chapter.id": chapter }, function(err, result) {
    if (err) return console.log(err);
    response.json(result);
  });
})

router.get("/api/get-book", (request, response) => {
  var id = request.query.id;

  Book.findOne({ "id": id }, function(err, result) {
    if (err) return console.log(err);
    response.json(result);
  });
})

module.exports = router