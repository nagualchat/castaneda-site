<template>
  <div id="library">
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
  import TabOne from "@/pages/library-tabs/TabOne";
  import TabTwo from "@/pages/library-tabs/TabTwo";

  export default {
    name: 'LibraryPage',
    metaInfo: {
      title: 'Библиотека',
      meta: [
        { vmid: 'description', name: 'description', content: 'Подборка книг, интервью и лекций Карлоса Кастанеды, Тайши Абеляр и Флоринды Доннер, а также других материалов, которые могут быть интересны изучающим путь знания толтеков.' }
      ]
    },

    components: {
      TabOne,
      TabTwo
    },

    data() {
      return {
        activeTab: 0
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  #library h1.title {
    margin-bottom: 0px !important;
  }

  #library div.subtitle {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
  }

  #library table {
    margin-top: 0.8em;
  }

  #library table tr td:last-child {
    width: 15%;
  }
</style>