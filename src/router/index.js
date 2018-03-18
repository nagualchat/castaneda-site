import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

function route(path, component) {
  return {
    path,
    name: path,
    component: () => import(`@/pages/info/${component}`)
  }
}

import MainPage from "@/pages/MainPage"
import InfoPage from "@/pages/InfoPage"

export default new Router({
  mode: "history",
  linkActiveClass: "is-active",
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPage
    },
    {
      path: "/info",
      name: "info",
      redirect: "/info/flo",
      component: InfoPage,
      children: [
        route("ref", "InfoRef"),
        route("flo", "InfoFlo"),
        route("cla", "InfoCla")
      ]
    },
    { path: "*", redirect: "/" }
  ]
})
