<template>
  <div id="search">
    <div class="columns is-centered">
      <div class="column is-9-tablet is-8-desktop is-7-widescreen is-6-fullhd">

        <div v-if="isShowTitle" class="search-title is-hidden-mobile">
          <h1 class="is-size-1 has-text-centered">Поиск по книгам</h1>
          <h2 class="is-size-5 has-text-centered">Карлоса Кастанеды и его соратников</h2>
        </div>

        <search @searching="isShowTitle = false"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from "@/components/Search"

  export default {
    components: {
      Search
    },

    data() {
      return {
        isShowTitle: true
      }
    },

    created: function() {
      document.title = "Поиск"
    },

  }
</script>

<style>
</style>