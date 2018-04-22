import uuid from "uuid/v4";
import localforage from "localforage";

localforage.config({
  name: "recapitulation-list",
  storeName: "data"
})

export default {

  /*    ====   Дерево  ====    */

  // Перемещение выделения вверх и вниз
  // Ухищрения нужны чтобы корректно обрабатывались свёрнутые ветви
  selectUp({ state, commit }) {
    let index = state.flatTree.map((el) => el.id).indexOf(state.selectedItem)
    let prev = state.flatTree[index - 1]

    if (prev && prev.parent) {
      let prevParent = state.flatTree.find(x => x.id === prev.parent);
      if (prevParent.expand === false) {
        if (index - 1 > 0) commit("SET_SELECTED_ITEM", prevParent.id)
      } else {
        if (index - 1 > 0) commit("SET_SELECTED_ITEM", prev.id)
      }
    } else {
      if (index > 0) commit("SET_SELECTED_ITEM", prev.id)
    }

  },

  selectDown({ state, commit }) {
    let index = state.flatTree.map((el) => el.id).indexOf(state.selectedItem)
    let selected = state.flatTree[index]
    let next = state.flatTree[index + 1]

    if (selected.expand === false) {
      for (let i = index + 1; i < state.flatTree.length; ++i) {
        if (!state.flatTree[i].parent) {
          commit("SET_SELECTED_ITEM", state.flatTree[i].id)
          break
        }
      }
    } else {
      if (index + 1 < state.flatTree.length) {
        commit("SET_SELECTED_ITEM", next.id)
      }
    }
  },

  // Переименование
  async editItem({ state, commit }, payload) {
    function findItem(array, id) {
      for (let item of array) {
        if (item.id === id) return item
        let result = findItem(item.children, id)
        if (result) return result
      }
    }
    let found = await findItem(state.openList.tree, payload)
    commit("SET_EDIT_NAME", found.name)
    commit("TOGGLE_EDIT_MODE", true)
  },

  editDone({ state, commit }) {
    commit("SET_EDIT_NAME", state.editName.trim())
    if (!state.editName) {
      commit("DELETE_ITEM", state.selectedItem)
    } else {
      commit("RENAME_ITEM", state.selectedItem)
    }
    commit("TOGGLE_EDIT_MODE", null)
  },

  editCancel({ commit }) {
    commit("TOGGLE_EDIT_MODE", null)
  },

  // Добавление нового элемента
  addDone({ state, commit }) {
    let item = { id: uuid(), name: state.addName, expand: true, children: [] }
    commit("ADD_NEW_ITEM", { id: state.selectedItem, add: item })
    console.log("add")
    commit("TOGGLE_ADD_MODE", false)
    commit("SET_ADD_NAME", null)
  },

  addCancel({ commit }) {
    commit("TOGGLE_ADD_MODE", false)
    commit("SET_ADD_NAME", null)
  },

  // Создание ссылки
  createLink({ commit }, payload) {
    let item = { id: uuid(), name: "[LINK]", link: payload, expand: true, children: [] }
    console.log(payload)
    commit("ADD_NEW_ITEM", { id: payload, add: item })
  },


  removeItem({ state, commit }) {

    function findItem(array, id) {
      for (let item of array) {
        if (item.id === id) return item
        let result = findItem(item.children, id)
        if (result) return result
      }
    }
    let found = findItem(state.openList.tree, state.selectedItem)

    console.log(found)
    //commit("SAVE_DELETED_ITEM", found)
    commit("DELETE_ITEM", state.selectedItem)
    //commit("SET_DELETE_SHACKBAR", true)
  },

  //undoRemove({ state, commit }) { },

  /*    ====   Списки  ====    */

  async getLists({ commit }) {
    commit("CLEAR_LISTS")
    await localforage.iterate((value, key, idx) => {
      if (/list-/.test(key)) {
        let list = JSON.parse(value)
        commit("ADD_LISTS", { id: list.id, name: list.name, created: list.created })
      }
    })
  },

  async nameCount({ commit }) {
    let counter = await localforage.getItem("name-number")
    if (counter) {
      counter = counter + 1
    } else {
      counter = 1
    }
    await localforage.setItem("name-number", counter);
    commit("SET_LIST_NUMBER", counter)
  },

  async createList({ state, dispatch }) {
    let list = state.defaultList
    list.id = uuid()
    list.created = new Date().getTime()

    await dispatch("nameCount")
    list.name = `Список ${state.newListNum}`

    await localforage.setItem("list-" + list.id, JSON.stringify(list));
    await dispatch("getLists")
  },

  async initList({ state, commit, dispatch }) {
    let def = await localforage.getItem("default")
    if (def) {
      commit("SET_LIST_ID", def)
      let value = await localforage.getItem("list-" + def)
      let list = JSON.parse(value)
      commit("SET_LIST", list)
      commit("COMPILE_FLAT_TREE")
      await dispatch("getLists")
    } else {
      commit("SET_START_NOTIFY", true)
      await dispatch("createList")
      await dispatch("changeList", state.listLists[0].id)
    }
    await commit("SET_SELECTED_ITEM", state.openList.tree[0].id)
  },

  async changeList({ state, commit }, payload) {
    commit("SET_LIST_ID", payload)
    let list = await localforage.getItem("list-" + payload)
    commit("SET_LIST", JSON.parse(list))
    await localforage.setItem("default", state.openListId)
  },

  async renameList({ state, dispatch }, payload) {
    let value = await localforage.getItem("list-" + payload.id)
    let list = JSON.parse(value)
    list.name = payload.name
    if (state.openListId === payload.id) {
      state.openList.name = payload.name
    }
    await localforage.setItem("list-" + payload.id, JSON.stringify(list))
    await dispatch("getLists")
  },

  async deleteList({ state, dispatch }, payload) {
    await localforage.removeItem("list-" + payload)
    await dispatch("getLists")
    if (state.openListId === payload) {
      if (state.listLists[0]) {
        await dispatch("changeList", state.listLists[0].id)
      } else {
        await dispatch("createList")
        await dispatch("changeList", state.listLists[0].id)
      }
    }
  },

  async exportList({ state }, payload) {
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

  async importList({ dispatch }, payload) {
    const reader = new FileReader()
    reader.onloadend = async function(e) {
      let list = JSON.parse(e.target.result)
      list.id = uuid()
      await localforage.setItem("list-" + list.id, JSON.stringify(list));
      await dispatch("getLists")
    }
    reader.readAsText(payload, "utf-8");
  },

  saveList({ state, commit }) {
    commit("COMPILE_FLAT_TREE")
    localforage.setItem("list-" + state.openListId, JSON.stringify(state.openList));
  }

}