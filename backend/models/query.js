const mongoose = require("mongoose")

const querySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  string: String
})

module.exports =  mongoose.model("search_queries", querySchema)