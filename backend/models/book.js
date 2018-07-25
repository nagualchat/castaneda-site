const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  translator: Array,
  toc: mongoose.Schema.Types.Mixed
})

module.exports = mongoose.model("books", bookSchema)