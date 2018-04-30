<template>
  <div>
    <div class="columns is-centered">
      <div class="column is-narrow">
        <br>
        <a class="button is-primary">Primary</a>
        <a class="button is-secondary">Dark</a>
        <a class="button is-info">Info</a>
        <a class="button is-success">Success</a>
        <a class="button is-warning">Warning</a>
        <a class="button is-danger">Danger</a>
      </div>
    </div>
    <pre>selectedItem = {{ selectedItem }}</pre>
    <pre>flatTree = {{ flatTree }}</pre>
    <pre>openList = {{ openList }}</pre>
    <pre>listLists = {{ listLists }}</pre>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'DebugPanel',

    computed: {
      ...mapState({
        selectedItem: state => state.list.selectedItem,
        openList: state => state.list.openList,
        flatTree: state => state.list.flatTree,
        listLists: state => state.list.listLists,
      })
    }

  }
</script>