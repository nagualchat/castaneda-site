 export default {

  setDebugMode (state, payload) {
    state.isDebug = payload
  },

  setDarkTheme (state, payload) {
    state.isDarkTheme = payload
  },

  // Дерево
  setSelectedId (state, payload) {
    state.selectedId = payload
  },

  setRenamingId (state, payload) {
    state.renamingId = payload
  },

  setAddPosition (state, payload) {
    state.addPosition = payload
  },

  // Списки
  incListsCounter (state, payload) {
    state.listsCounter = payload
  },

  setListId (state, payload) {
    state.listId = payload
  },

  insertListId (state, payload) {
    state.list.id = payload
  },

  setList (state, payload) {
    state.list = payload;
  },

  updateListMap (state) {
    state.listMap = []
    function findItemID (array) {
      for (var item of array) {
        state.listMap.push(item.id)
        findItemID(item.node)
      }
    }
    findItemID(state.list.tree)
  },

  clearLists (state) {
    state.lists = []
  },

  addLists (state, payload) {
    state.lists.push(payload)
    state.lists.sort((a, b) => {
      if (a.created > b.created) return 1
      if (a.created < b.created) return -1
    });
  },

  setListNumber (state, payload) {
    state.listNumber = payload
  }

}