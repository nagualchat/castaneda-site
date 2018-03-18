<template>
  <div id="info">
    <div class="columns is-centered">
      <div class="column is-9-widescreen is-9-fullhd">

        <div class="columns">
          <div class="column info-sidebar is-2">
            <sidebar-info/>
          </div>

          <div class="column info-content">
            <div class="content">
              <router-view/>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import SidebarInfo from "@/components/Sidebar";

  export default {
    name: 'InfoPage',

    components: {
      SidebarInfo
    },
  }
</script>

<style scoped>

  .info-sidebar {
    margin-top: 0.5em;
  }

  .info-content {
    margin-top: 0.25em;
  }

</style>
