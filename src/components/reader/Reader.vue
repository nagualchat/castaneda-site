<template>
  <div id="reader">

    <table>
      <tr v-for="(item, index) in chapterData.paragraphs" :key="index">
        <td>
          <div v-if="item.type == 'empty-line'" class="ch-empty-line"></div>
          <div v-else :id="`p${item.number}`" v-on:mouseover="menuPosition = item.number"
            :class="[`ch-${item.type}`, highlighted == item.number ? 'ch-hightlight' : null]">
            {{ item.text }}
          </div>
        </td>

        <td v-if="menuPosition === item.number">

          <b-dropdown class="is-unselectable">
            <a class="is-borderless icon icon-link is-small" slot="trigger">
              <b-icon icon="arrow-left-thick"></b-icon>
            </a>

            <b-dropdown-item @click="doCopy(item, 'link')">
              <div class="media">
                <b-icon class="media-left" icon="link"></b-icon>
                <div class="media-content">
                  <h3>Скопировать ссылку</h3>
                  <small>{{ `На параграф ${item.number}` }}</small>
                </div>
              </div>
            </b-dropdown-item>

            <b-dropdown-item @click="doCopy(item, 'paragraph')">
              <div class="media">
                <b-icon class="media-left" icon="content-copy"></b-icon>
                <div class="media-content">
                  <h3>Скопировать параграф</h3>
                  <small>Текст + ссылка внизу</small>
                </div>
              </div>
            </b-dropdown-item>

            <b-dropdown-item :disabled="!selectedText" @click="doCopy(item, 'selected')">
              <div class="media">
                <b-icon class="media-left" icon="content-copy"></b-icon>
                <div class="media-content">
                  <h3>Скопировать выделенное</h3>
                  <small>Текст + ссылка внизу</small>
                </div>
              </div>
            </b-dropdown-item>
          </b-dropdown>

        </td>
      </tr>
    </table>

  </div>
</template>

<script>
  import VueScrollTo from "vue-scrollto"
  import config from "@/config.js"

  export default {
    props: ["chapterData"],

    data() {
      return {
        highlighted: null,
        menuPosition: null,
        selectedText: null
      }
    },

    created() {
      document.addEventListener('selectionchange', () => {
        var selection = window.getSelection();
        this.selectedText = selection.toString();
      })
    },

    mounted: function() {
      if (this.$route.query.p) {
        VueScrollTo.scrollTo("#p" + this.$route.query.p, { duration: -1, offset: 0 });
        this.highlighted = this.$route.query.p
        this.menuPosition = parseInt(this.$route.query.p);
      } else {
        this.menuPosition = parseInt(this.chapterData.paragraphs[1].number);
      }
    },

    methods: {
      doCopy: function(item, mode) {
        var copy;
        var rlink = 'book=' + this.chapterData.book.id + '&ch=' + this.chapterData.chapter.id + '&p=' + item.number;
        switch (mode) {
          case "link":
            copy = config.selfHost + 'reader?' + rlink;
            break;
          case "paragraph":
            copy = item.text + '\n\n' + config.selfHost + 'reader?' + rlink;
            break;
          case "selected":
            copy = this.selectedText + '\n\n' + config.selfHost + 'reader?' + rlink;
            break;
        }
        var _this = this;
        this.$copyText(copy).then(function() {
          _this.$toast.open({
            message: `Скопировано в буфер обмена`,
            position: 'is-bottom'
          })
        })
      },

    }
  }
</script>