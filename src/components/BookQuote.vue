<template>
  <blockquote class="book">
    <slot/>
    <footer>
      <cite class="has-text-weight-normal">
        <a :href="url" target="_blank">&mdash; {{ title }}</a>
      </cite>
    </footer>
  </blockquote>
</template>

<script>
  import { mapState } from "vuex"
  import config from "@/config"

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
        let index = this.books.map((el) => el.id).indexOf(this.decode[1])
        return this.books[index].author + ": " + this.books[index].title
      },

      url: function() {
          return "/#/reader?book=" + this.decode[1] + "&ch=" + this.decode[2] + "&p=" + this.decode[3]
      }
    }
  }
</script>