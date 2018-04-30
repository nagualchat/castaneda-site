function findLink(array, id) {
  for (var item of array) {
    if (item.id === id) return item
    var result = findLink(item.children, id)
    if (result) return result
  }
}

export default {

  /*    ====   Дерево  ====    */

  SET_DEBUG_MODE(state, payload) {
    state.isDebug = payload;
  },

  SET_START_NOTIFY(state, payload) {
    state.isShowStartNotify = payload;
  },

  SET_DELETE_SHACKBAR(state) {
    state.isShowDeleteSnack = !state.isShowDeleteSnack;
  },

  SET_SELECTED_ITEM(state, payload) {
    state.selectedItem = payload;
  },

  TOGGLE_EDIT_MODE(state, payload) {
    state.editMode = payload;
  },

  SET_EDIT_NAME(state, payload) {
    state.editName = payload;
  },

  RENAME_ITEM(state, payload) {
    function findNode(tree, id) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].id === id) {
          tree[i].name = state.editName;
          break;
        } else {
          findNode(tree[i].children, id);
        }
      }
    }
    findNode(state.openList.tree, payload);
  },

  TOGGLE_ADD_MODE(state, payload) {
    state.addMode = payload;
  },

  SET_ADD_NAME(state, payload) {
    state.addName = payload;
  },

  ADD_NEW_ITEM(state, payload) {
    function findNode(tree, id, add) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].id === id) {
          tree.splice(i + 1, 0, add);
          break;
        } else {
          findNode(tree[i].children, id, add);
        }
      }
    }
    findNode(state.openList.tree, payload.id, payload.add);
  },

  // SAVE_DELETED_ITEM(state, payload) {
  //   state.deleted = payload;
  // },

  DELETE_ITEM(state, payload) {
    function delLinks(tree, id) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].link === id) {
          tree.splice(i, 1);
        } else {
          delLinks(tree[i].children, id);
        }
      }
    }

    function delItem(tree, id) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].id === id) {
          tree.splice(i, 1);
          break;
        } else {
          delItem(tree[i].children, id);
        }
      }
    }

    delLinks(state.openList.tree, payload);
    delItem(state.openList.tree, payload);
  },

  TOGGLE_EXPAND(state, payload) {
    function findItem(tree, payload) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].id === payload) {
          tree[i].expand = !tree[i].expand;
          break;
        } else {
          findItem(tree[i].children, payload);
        }
      }
    }
    findItem(state.openList.tree, payload);
  },

  SET_EXPAND(state, payload) {
    function findItem(tree, id, stat) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].id === id) {
          if (tree[i].children.length > 0) tree[i].expand = stat;
          break;
        } else {
          findItem(tree[i].children, id, stat);
        }
      }
    }
    //console.log(payload)
    findItem(state.openList.tree, state.selectedItem, payload);
  },

  // Расскладывает дерево в плоский массив (заодно обрабатывает найденные ссылки)
  COMPILE_FLAT_TREE(state) {
    state.flatTree = []

    function findItemID(array, parent, exp) {
      var expanded;
      for (var item of array) {
        if (item.expand === false) expanded = 'false';

        if (item.link) {
          let linked = findLink(state.openList.tree, item.link);
          state.flatTree.push({ id: item.id, name: linked.name, expand: item.expand, parent });
        } else {
          state.flatTree.push({ id: item.id, name: item.name, expand: item.expand, parent });
        }
        findItemID(item.children, item.id, item.expand);
      }
    }
    findItemID(state.openList.tree);
  },

  /*    ====   Списки  ====    */

  SET_LIST_ID(state, payload) {
    state.openListId = payload;
  },

  INSERT_ID_LIST(state, payload) {
    state.openList.id = payload;
  },

  SET_LIST(state, payload) {
    state.openList = payload;
  },

  CLEAR_LISTS(state) {
    state.listLists = [];
  },

  ADD_LISTS(state, payload) {
    state.listLists.push(payload);
    state.listLists.sort((a, b) => {
      if (a.created > b.created) return 1;
      if (a.created < b.created) return -1;
    });
  },

  SET_LIST_NUMBER(state, payload) {
    state.newListNum = payload;
  }

}