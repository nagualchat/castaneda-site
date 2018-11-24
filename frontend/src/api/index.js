 import axios from 'axios';
 import config from '@/config.js';

 const instance = axios.create({ baseURL: config.apiHost });

 export default {

   async search(query, books, offset) {
    return await instance.get('/search', { params: { query, books, offset } });
   },

   async getChapter(book, chapter) {
    return await instance.get('/get-chapter', { params: { book, chapter } });
  },

  async getBook(id) {
    return await instance.get('/get-book', { params: { id } });
  },

  async getSearchHistory() {
    return await instance.get('/last-queries');
  }
 }