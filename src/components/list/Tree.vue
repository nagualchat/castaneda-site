<template>
  <ul>
    <draggable class="drop-zone" :list="treeData" :options="{ animation: 150, group: 'node', forceFallback: false }">
      <tree-item :item="item" v-for="(item) in treeData" :key="item.id">
        <tree v-if="item.expand == true" :treeData="item.children"/>
      </tree-item>
    </draggable>
  </ul>
</template>

<script>
  import Draggable from "vuedraggable";
  import TreeItem from "@/components/list/TreeItem"

  export default {
    name: "tree",
    props: ["treeData"],

    components: {
      Draggable,
      TreeItem
    },

    watch: {
      treeData: {
        handler: function() {
          this.$store.dispatch("saveList")
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
</style>