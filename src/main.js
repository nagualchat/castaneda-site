import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Buefy from 'buefy'
import VueShortkey from 'vue-shortkey'


Vue.use(Buefy)
Vue.use(VueShortkey)

new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
