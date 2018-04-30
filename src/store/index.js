import Vue from 'vue';
import Vuex from 'vuex';
import main from './modules/main';
import list from './modules/list';

Vue.use(Vuex);

export default () => new Vuex.Store({
  modules: {
    main,
    list
  }
})
