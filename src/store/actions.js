import { uuid } from "vue-uuid";
import localforage from "localforage";

localforage.config({
  name: "recapitulation-app",
  storeName: "data"
})

function findItemID (array, id) {
  for (var item of array) {
    if (item.id === id) return item.id
    var result = this.findItemID(item.node, id)
    if (result) return result.id
  }
}

export default {

  // Списки
  async getLists ({ commit }) {
    commit("clearLists")
    await localforage.iterate((value, key, idx) => {
      if (/list-/.test(key)) {
        let list = JSON.parse(value)
        commit("addLists", { id: list.id, name: list.name, created: list.created })
      }
    })
  },

  async nameCount ({ commit }) {
    let counter = await localforage.getItem("name-number")
    if (counter) {
      counter = counter + 1
    } else {
      counter = 1
    }
    await localforage.setItem("name-number", counter);
    commit("setListNumber", counter)
  },

  async addList ({ state, dispatch }) {
    let list = state.defaultList
    list.id = uuid.v4()
    list.created = new Date().getTime()

    await dispatch("nameCount")
    list.name = `Список ${state.listNumber}`

    await localforage.setItem("list-" + list.id, JSON.stringify(list));
    await dispatch("getLists")
  },

  async initList ({ state, commit, dispatch}) {
    let def = await localforage.getItem("default")
    if (def) {
      commit("setListId", def)
      let value = await localforage.getItem("list-" + def)
      let list = JSON.parse(value)
      commit("setList", list)
      commit("updateListMap")
      await dispatch("getLists")
    } else {
      await dispatch("addList")
      await dispatch("changeList", state.lists[0].id)
    }
    await commit("setSelectedId", state.list.tree[0].id)
  },

  async changeList ({ state, commit }, payload) {
    commit("setListId", payload)
    let list = await localforage.getItem("list-" + payload)
    commit("setList", JSON.parse(list))
    await localforage.setItem("default", state.listId)
  },

  async renameList ({ state, dispatch }, payload) {
    let value = await localforage.getItem("list-" + payload.id)
    let list = JSON.parse(value)
    list.name = payload.name
    if (state.listId === payload.id) {
      state.list.name = payload.name
    }
    await localforage.setItem("list-" + payload.id, JSON.stringify(list))
    await dispatch("getLists")
  },

  async deleteList ({ state, dispatch }, payload) {
    await localforage.removeItem("list-" + payload)
    await dispatch("getLists")
    if (state.listId === payload) {
      if (state.lists[0]) {
        await dispatch("changeList", state.lists[0].id)
      } else {
        await dispatch("addList")
        await dispatch("changeList", state.lists[0].id)
      }
    }
  },

  async exportList ({ state }, payload) {
    let value = await localforage.getItem("list-" + payload)
    let list = JSON.parse(value)
    const blob = new Blob([JSON.stringify(list)], { type: 'text/plain;charset=utf-8' });
    const downloadLink = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${list.name} (${new Date().getTime()}).json`
    a.href = downloadLink;
    a.click();
    window.URL.revokeObjectURL(downloadLink);
  },

  async importList ({ dispatch }, payload) {
    const reader = new FileReader()
    reader.onloadend = async function (e) {
      let list = JSON.parse(e.target.result)
      list.id = uuid.v4()
      await localforage.setItem("list-" + list.id, JSON.stringify(list));
      await dispatch("getLists")
    }
    reader.readAsText(payload, "utf-8");
  },

  saveList ({ state, commit }) {
    commit("updateListMap")
    localforage.setItem("list-" + state.listId, JSON.stringify(state.list));
  }

}