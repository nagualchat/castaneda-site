<template>
  <div id="tree">
    <ul>
      <draggable class="drop-zone" :list="treeData" :options="{ disabled: isDragDisabled, group: 'node', forceFallback: false, group: 'node', animation: 150 }">
        <tree-item :item="item" v-for="(item) in treeData" :key="item.id">
          <tree v-if="item.expand == true" :treeData="item.children"/>
        </tree-item>
      </draggable>
    </ul>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable';
  import TreeItem from '@/components/list/TreeItem';

  export default {
    name: 'tree',
    props: ['treeData'],

    components: {
      Draggable,
      TreeItem
    },

    computed: {
      isDragDisabled() {
        return this.$store.state.list.editMode || this.$store.state.list.addMode
      }
    },

    watch: {
      treeData: {
        handler: function() {
          this.$store.dispatch('saveList');
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  .drop-zone {
    min-height: 5px;
  }

  #tree {
    padding-left: 0.5em;
  }
</style>