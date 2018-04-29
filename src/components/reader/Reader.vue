<template>
  <div id="reader" v-if="chapterData">

    <div class="book-title">
      <a class="invert-link" @click="$emit('openToc')">{{ chapterData.book.author }} — {{ chapterData.book.title }}</a>
    </div>

    <table>
      <tr class="row" v-for="item in chapterData.paragraphs" :key="item.number">
        <td>
            <div v-if="item.type == 'empty-line'" class="ch-empty-line"></div>
            <div v-else :id="`p${item.number}`"
              :class="[`ch-${item.type}`, highlighted == item.number ? 'ch-hightlight' : null]">
              {{ item.text }}
            </div>
        </td>

        <td class="hidden-menu">
          <b-dropdown class="is-unselectable">
            <a class="is-borderless icon invert-link is-small" slot="trigger">
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
  import api from "@/api/index"
  import config from "@/config.js"

  export default {
    data() {
      return {
        isLoading: true,
        chapterData: null,

        highlighted: null,
        selectedText: null
      }
    },

    created() {
      this.loadChapter();
      document.addEventListener("selectionchange", () => {
        var selection = window.getSelection();
        this.selectedText = selection.toString();
      })
    },

    watch: {
      "$route" () {
        this.loadChapter();
      }
    },

    methods: {
      loadChapter: function() {
        this.chapterData = null;
        var loadingComponent = this.$loading.open();

        api.getChapter(this.$route.query.book, this.$route.query.ch).then((result) => {
          this.chapterData = result.data;
          document.title = result.data.book.title;

          this.$nextTick(() => {
            var _this = this;
            setTimeout(function() {

              loadingComponent.close();
              if (_this.$route.query.p) {
                VueScrollTo.scrollTo("#p" + _this.$route.query.p, { duration: -1, offset: 0 });
                _this.highlighted = _this.$route.query.p;
              }

            }, 1000);
          })
        })
      },

      doCopy: function(item, mode) {
        var copy;
        var rlink = "book=" + this.chapterData.book.id + "&ch=" + this.chapterData.chapter.id + "&p=" + item.number;
        switch (mode) {
          case "link":
            copy = config.selfHost + "reader?" + rlink;
            break;
          case "paragraph":
            copy = item.text + "\n" + config.selfHost + "reader?" + rlink;
            break;
          case "selected":
            copy = this.selectedText + "\n" + config.selfHost + "reader?" + rlink;
            break;
        }
        var _this = this;
        this.$copyText(copy).then(function() {
          _this.$toast.open({
            message: "Скопировано в буфер обмена",
            position: "is-bottom",
            type: 'is-secondary'
          })
        })
      },

    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  .hidden-menu {
    opacity: 0;
    @include desktop {
      padding: 0 10px;
    }
  }

  .row:hover .hidden-menu {
    opacity: 1;
  }

  .hidden-menu .dropdown {
    vertical-align: middle;
  }

 /* Стили книжного текста */

  .book-title {
    font-size: $size-4;
    font-weight: $weight-semibold;
    text-align: center;
    margin-bottom: 10px;
  }

  .ch-title {
    font-size: $size-5;
    font-weight: $weight-semibold;
    text-align: center;
    margin-bottom: 10px;
  }

  .ch-subtitle {
    font-size: 1.05em;
    font-weight: $weight-semibold;
    text-indent: 1.2em;
    margin-top: 10px;
  }

  .ch-paragraph {
    text-indent: 1.2em;
  }

  .ch-empty-line {
    display: block;
    margin-bottom: 0.5em;
  }

  .ch-epigraph {
    margin: 0 auto;
    margin-right: 5em;
    margin-left: 25%;
    font-style: italic;
  }

  .ch-poem {
    display: table;
    margin: 0 auto;
    font-style: italic;
  }

  .ch-hightlight {
    background-color: $highlight;
  }
</style>