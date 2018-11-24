<template>
  <div class="blockquote">
    <div class="divider">* * *</div>
    <slot />
    <router-link :to="url" :title="title" target="_blank"><b-icon size="is-small" icon="redo"></b-icon></router-link>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import config from '@/config';

  export default {
    name: 'BookQuote',
    props: ['book'],

    computed: {
      ...mapState({
        books: state => state.main.books
      }),

      // [1] - id книги, [2] - номер строки
      decode: function() {
        return this.book.match(/(.*):(.*):(.*)/i);
      },

      title: function() {
        let index = this.books.map((el) => el.id).indexOf(this.decode[1]);
        return this.books[index].author + ': ' + this.books[index].title;
      },

      url: function() {
        return '/reader?book=' + this.decode[1] + '&ch=' + this.decode[2] + '&p=' + this.decode[3];
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/variables.scss";

  .blockquote p:last-of-type {
    display: inline;
    margin-right: 5px;
  }

  .title + .blockquote .divider,
  .subtitle + .blockquote .divider {
    display: none;
  }

  .divider {
    display: table;
    margin: 15px auto 10px auto;
  }
</style>