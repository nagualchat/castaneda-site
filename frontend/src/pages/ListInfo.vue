<template>
  <div id="info">
    <div class="columns is-centered">
      <div class="column is-10-tablet is-9-desktop is-8-widescreen is-7-fullhd">
        <b-tabs v-model="activeTab" :animated="false">

          <b-tab-item label="О приложении">
            <div class="content">
              <app-info/>
            </div>
          </b-tab-item>

          <b-tab-item label="Книга Тайши">
            <div class="content">
              <tab-one/>
            </div>
          </b-tab-item>

          <b-tab-item label="Книги Кастанеды">
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
  import AppInfo from '@/pages/info-tabs/AppInfo';
  import TabOne from '@/pages/info-tabs/TabOne';
  import TabTwo from '@/pages/info-tabs/TabTwo';

  export default {
    name: 'ListInfo',
    metaInfo: {
      title: 'Справка по перепросмору'
    },

    components: {
      AppInfo,
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

<style>
</style>