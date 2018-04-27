import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

import SearchPage from "@/pages/SearchPage"
import LibraryPage from "@/pages/LibraryPage"
import ReaderPage from "@/pages/ReaderPage"
import ListPage from "@/pages/ListPage"
import ListInfo from "@/pages/ListInfo"

export default new Router({
  linkActiveClass: "is-active",
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [{
      path: "/",
      redirect: "/search"
    },
    {
      path: "/search",
      component: SearchPage
    },
    {
      path: "/lib",
      component: LibraryPage
    },
    {
      path: "/list",
      component: ListPage
    },
    {
      path: "/list-info",
      component: ListInfo
    },
    {
      path: "/reader",
      component: ReaderPage
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
})