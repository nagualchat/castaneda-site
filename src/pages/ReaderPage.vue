<template>
  <div id="reader">
    <div class="columns is-centered">
      <div class="column is-9-widescreen is-8-fullhd">

        <b-modal :active.sync="isShowTOC" :canCancel="['escape', 'outside']" has-modal-card>
          <reader-toc/>
        </b-modal>

        <reader @openToc="isShowTOC = true"/>
        <reader-footer @openToc="isShowTOC = true"/>

      </div>
    </div>
  </div>
</template>

<script>
  import Reader from "@/components/reader/Reader";
  import ReaderFooter from "@/components/reader/ReaderFooter";
  import ReaderToc from "@/components/reader/ReaderToc";
  import api from "@/api/index"

  export default {
    components: {
      Reader,
      ReaderFooter,
      ReaderToc
    },

    data() {
      return {
        isShowTOC: false,
      }
    }
  }
</script>