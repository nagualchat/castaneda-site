<template>
  <div id="reader">
    <div class="columns is-centered">
      <div class="column is-9-widescreen is-8-fullhd">
        <div v-if="chapterData">
          <b-modal :active.sync="isShowTOC" :canCancel="['escape', 'outside']" has-modal-card>
            <reader-toc/>
          </b-modal>

          <div class="book-title">
            <a class="invert-link" @click="isShowTOC = true">{{ chapterData.book.author }} — {{ chapterData.book.title }}</a>
          </div>

          <reader :chapterData="chapterData"/>
          <reader-nav @openToc="isShowTOC = true" :chapterData="chapterData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Reader from "@/components/reader/Reader";
  import ReaderNav from "@/components/reader/ReaderNav";
  import ReaderToc from "@/components/reader/ReaderToc";
  import api from "@/api/index"

  export default {
    components: {
      Reader,
      ReaderNav,
      ReaderToc
    },

    data() {
      return {
        isShowTOC: false,
        chapterData: null
      }
    },

    methods: {
      loadChapter: async function() {
        await api.getChapter(this.$route.query.book, this.$route.query.ch).then((result) => {
          this.chapterData = result.data
          document.title = result.data.book.title
        })
      }
    },

    created() {
      this.loadChapter();
    }

  }
</script>

<style>
</style>