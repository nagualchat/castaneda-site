const express = require("express");
const elasticsearch = require("elasticsearch");
const Query = require("../models/query");
const config = require("../config");

const router = express.Router()
const elastic = new elasticsearch.Client({ host: config.esUrl, log: "error" });

searchText = function(query, books, offset) {
  return elastic.search({
    index: "paragraphs",
    type: "doc",
    body: {
      query: {
        bool: {
          must: [{
              query_string: {
                fields: ["content.text"],
                default_operator: "AND",
                query: query
              }
            },
            {
              terms: { "book.id": books }
            },
            {
              term: { "content.type": "paragraph" }
            }
          ]
        }
      },
      highlight: {
        pre_tags: ["<span class='highlight'>"],
        post_tags: ["</span>"],
        fields: {
          "content.text": { number_of_fragments: 0 }
        }
      }
    },
    size: 10,
    from: offset
  })
}

router.get("/api/search", (request, response) => {
  var query = request.query.query;
  var books = request.query.filter.split(',');
  var offset = request.query.offset;

  searchText(query, books, offset).then(function(results) {
    response.json(results);
  })

  var query = new Query({ string: query });
  query.save();
})

module.exports = router