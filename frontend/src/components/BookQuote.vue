<template>
  <blockquote class="book">
    <slot/>
    <footer>
      <cite class="has-text-weight-normal">
        <router-link :to="url" target="_blank">&mdash; {{ title }}</router-link>
      </cite>
    </footer>
  </blockquote>
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

  blockquote.book {
    padding: 0 0.75em;
    border-left: 2px solid $border;
    margin-bottom: 1.5em !important;
    background-color: $white !important;
  }

  blockquote.book p {
    margin-bottom: 0.5em !important;
  }

  blockquote.book cite {
    font-style: normal;
    margin-left: 0.75em;
  }
</style>