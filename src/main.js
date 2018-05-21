import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import Buefy from 'buefy';
import VueShortkey from 'vue-shortkey';
import VueScrollTo from 'vue-scrollto';
import VueClipboard from 'vue-clipboard2';

Vue.use(Buefy);
Vue.use(VueScrollTo);
Vue.use(VueClipboard);
Vue.use(VueShortkey, { prevent: ['input', 'textarea'] })

Vue.filter('truncate', function (text, stop) {
  return text.slice(0, stop) + (stop < text.length ? '...' : '')
})

Vue.directive('focus', {
  inserted: function (el) {
    Vue.nextTick(function() {
      el.focus();
    })
  }
})

new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})