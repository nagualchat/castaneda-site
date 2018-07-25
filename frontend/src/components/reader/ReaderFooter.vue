<template>
  <div id="reader-footer" v-if="bookData">
    <nav class="level is-mobile">
      <p class="level-item has-text-centered">
        <router-link class="link is-info" v-if="prevChapter != null" :to="`/reader?book=${bookId}&ch=${prevChapter}`">Назад</router-link>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info" @click="$emit('openToc')">Оглавление</a>
      </p>
      <p class="level-item has-text-centered">
        <router-link class="link is-info" v-if="nextChapter != null" :to="`/reader?book=${bookId}&ch=${nextChapter}`">Вперёд</router-link>
      </p>
    </nav>
  </div>
</template>

<script>
  import api from '@/api/index';

  export default {
    data() {
      return {
        bookId: null,
        bookData: null,
        prevChapter: null,
        nextChapter: null
      }
    },

    created() {
      this.loadBookInfo();
    },

    watch: {
      '$route' () {
        this.loadBookInfo();
      }
    },

    methods: {
      loadBookInfo: function() {
        this.bookId = this.$route.query.book;
        this.bookData = null;
        this.prevChapter = null;
        this.nextChapter = null;

        api.getBook(this.bookId).then((result) => {
          this.bookData = result.data;
        }).then(() => {
          var thisId = parseInt(this.$route.query.ch);
          var toc = this.bookData.toc;

          var index = toc.map((el) => el.id).indexOf(thisId);
          toc[index - 1] ? this.prevChapter = thisId - 1 : null;
          toc[index + 1] ? this.nextChapter = thisId + 1 : null;
        })

      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  #reader-footer {
    margin-top: 1em;
    padding-top: 0.2em;
    border-top: 1px solid $border;
  }
</style>