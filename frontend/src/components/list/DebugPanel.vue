<template>
  <div>

    <div class="columns is-centered">
      <div class="column is-narrow">
        <br>
        <div class="level is-mobile example">
          <a class="level-item button is-primary">*</a>
          <a class="level-item button is-secondary">*</a>
          <a class="level-item button is-info">*</a>
          <a class="level-item button is-success">*</a>
          <a class="level-item button is-warning">*</a>
          <a class="level-item button is-danger">*</a>
        </div>
      </div>
    </div>

    <pre>selectedItem = {{ selectedItem }}</pre>
    <pre>deletedItems = {{ deletedItems }}</pre>
    <pre>openList = {{ openList }}</pre>
    <pre>flatTree = {{ flatTree }}</pre>
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
        deletedItems: state => state.list.deletedItems,

        openList: state => state.list.openList,
        flatTree: state => state.list.flatTree,
        listLists: state => state.list.listLists,
      })
    }

  }
</script>

<style lang="scss">
  .example > a {
    width: 2.25em;
  }
</style>