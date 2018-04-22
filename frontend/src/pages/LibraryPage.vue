<template>
  <div id="info">
    <div class="columns is-centered">
      <div class="column is-9-tablet is-8-desktop is-7-widescreen is-6-fullhd">
        <b-tabs v-model="activeTab">

          <b-tab-item label="Основные источники">
            <div class="content">
              <tab-one/>
            </div>
          </b-tab-item>

          <b-tab-item label="Книги других авторов">
            <div class="content">
              <tab-two/>
            </div>
          </b-tab-item>

        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import TabOne from "@/pages/library-tabs/TabOne"
  import TabTwo from "@/pages/library-tabs/TabTwo"

  export default {
    components: {
      TabOne,
      TabTwo
    },

    data() {
      return {
        activeTab: 0
      }
    },

    created: function() {
      document.title = "Библиотека"
    },
  }
</script>

<style>
</style>