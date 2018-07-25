const mongoose = require("mongoose")

const chapterSchema = new mongoose.Schema({
  book: { id: String, title: String, author: String },
  chapter: { id: Number, title: String },
  paragraphs: mongoose.Schema.Types.Mixed
})

module.exports = mongoose.model("chapters", chapterSchema)