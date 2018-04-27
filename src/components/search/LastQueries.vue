<template>
  <div id="last-queries">

    <b-taglist class="search-options">
       <b-tag style="padding-right: 0em;" type="is-white" class="queries-tag">Недавние запросы:</b-tag>
        <b-tag style="padding-left: 0em; padding-right: 0em;" type="is-white" class="queries-tag" v-for="(item, index) in queries" :key="index">
           <router-link :to="`/search?query=${item._id}&books=${item.books}`">{{ truncate(item._id) }}</router-link>
           <span>{{ index+1 >= queries.length ? '' : ',' }}</span>
        </b-tag>
    </b-taglist>

  </div>
</template>

<script>
  import api from "@/api/index"

  export default {
    data() {
      return {
        queries: []
      }
    },

    created: function() {
      this.loadHistory();
    },

    methods: {
      loadHistory: function($state) {
        api.getSearchHistory().then((result) => {
          this.queries = result.data;
        })
      },

      truncate: function(query) {
        var max = 50;
        var str = query.substring(0, max);

        if (str.length < max) {
          return str;
        } else {
          return str.substr(0, Math.min(str.length, str.lastIndexOf(' '))) + "…"
        }

      }
    }

  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  #search-queries {
    margin-top: 1vh;
  }
</style>