 import axios from "axios";
 import config from "@/config.js"

 const instance = axios.create({ baseURL: config.apiHost })

 export default {
   async search(query, filter, offset) {
     return await instance.get("/api/search", { params: { query, filter, offset } })
   },

   async getChapter(book, chapter) {
    return await instance.get("/api/get-chapter", { params: { book, chapter } })
  },

  async getBook(id) {
    return await instance.get("/api/get-book", { params: { id } })
  }
 }