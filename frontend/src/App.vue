<template>
  <div id="app">
    <app-navbar/>

    <section class="section is-fullheight" style="padding-top: 1em">
      <router-view/>
    </section>
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar';

  export default {
    name: 'App',

    metaInfo: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { vmid: 'description', name: 'description', content: 'Инструменты, облегчающие изучение пути знания толтеков, изложенного в текстах Карлоса Кастанеды: полнотекстовый поиск по книгам, цитирование фрагмента с обратной ссылкой на главу, приложение для составления списка перепросмотра.' }
      ],
      title: 'Главная',
      titleTemplate: '%s — Путь знания'
    },

    components: {
      'app-navbar': Navbar,
    }
  }
</script>

<style lang="scss">
  @import './assets/variables.scss';
  @import '~bulma';
  @import '~buefy/src/scss/buefy';
  @import './assets/main.scss';
  .is-fullheight {
    min-height: 90vh;
  }
</style>