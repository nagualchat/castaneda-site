const mongoose = require("mongoose")

const querySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  query: String,
  books: String
})

module.exports =  mongoose.model("search_queries", querySchema)