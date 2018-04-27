<template>
  <div id="reader-toc">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Оглавление</p>
        <button class="delete" aria-label="close" @click="$parent.close()"></button>
      </header>

      <section class="modal-card-body">
        <div  v-for="(item, index) in bookData.toc" :key="index">
          <router-link :to="`?book=${bookData.id}&ch=${item.id}`" v-if="item.depth >= 1" class="toc-child">{{ item.title }}</router-link>
          <router-link :to="`?book=${bookData.id}&ch=${item.id}`" v-else>{{ item.title }}</router-link>
        </div>
      </section>

      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>

<script>
  import api from "@/api/index"

  export default {
    data() {
      return {
        bookData: {}
      }
    },

    created() {
      this.loadBookInfo();
    },

    watch: {
      '$route' () {
        this.$parent.close();
      }
    },

    methods: {
      loadBookInfo: async function() {
        await api.getBook(this.$route.query.book).then((result) => {
          this.bookData = result.data;
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  .toc-child {
    margin-left: 1em;
  }
</style>