<template>
  <div id="reader-navbar">
    <nav class="level reader-nav is-mobile">
      <p class="level-item has-text-centered">
        <a v-if="prevChapter != null" :href="`/reader?book=${chapterData.book.id}&ch=${prevChapter}`" class="link is-info">Назад</a>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info" @click="$emit('openToc')">Оглавление</a>
      </p>
      <p class="level-item has-text-centered">
        <a v-if="nextChapter != null" :href="`/reader?book=${chapterData.book.id}&ch=${nextChapter}`" class="link is-info">Вперёд</a>
      </p>
    </nav>
  </div>
</template>

<script>
  import api from "@/api/index"

  export default {
    props: ["chapterData"],
    data() {
      return {
        bookData: false,
        prevChapter: null,
        nextChapter: null
      }
    },

    created() {
      this.loadBookInfo().then(() => {
        var thisId = this.chapterData.chapter.id;
        var toc = this.bookData.toc;

        var index = toc.map((el) => el.id).indexOf(thisId);
        toc[index - 1] ? this.prevChapter = thisId - 1 : null;
        toc[index + 1] ? this.nextChapter = thisId + 1 : null;
      })
    },

    methods: {
      loadBookInfo: async function() {
        await api.getBook(this.chapterData.book.id).then((result) => {
          this.bookData = result.data;
        })
      }
    }
  }
</script>