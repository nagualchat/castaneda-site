const express = require("express");
const elasticsearch = require("elasticsearch");
const SearchQuery = require("../models/search-query");
const config = require("../config");

const router = express.Router()
const elastic = new elasticsearch.Client({ host: config.esUrl, log: "error" });

router.get("/search", (request, response) => {
  let query = request.query.query;
  let books = request.query.books.split(',');
  let offset = request.query.offset || 0;

  elastic.search({
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
  }).then(function(results) {
    response.json(results);
  })

  if (offset == 0) {
    var item = new SearchQuery({ query, books })
    item.save(function(err) { if (err) handleError(err) })
  }
})

router.get("/bot-search", (request, response) => {
  let query = request.query.query;
  let offset = request.query.offset || 0;

  elastic.search({
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
              term: { "content.type": "paragraph" }
            }
          ]
        }
      },
      highlight: {
        pre_tags: [""],
        post_tags: [""],
        fields: {
          "content.text": { number_of_fragments: 1, fragment_size: 120 }
        }
      }
    },
    size: 10,
    from: offset
  }).then(function(results) {
    response.json(results);
  })
})

module.exports = router