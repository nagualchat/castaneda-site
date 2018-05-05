import utils from './utils';

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
    var node = utils.getNode(state.openList.tree, payload);
    node.name = state.editName;


    function renameLinks(tree, id) {
      for (let i = 0; i < tree.length; ++i) {
        if (tree[i].link === id) {
          tree[i].name = state.editName;
        } else {
          renameLinks(tree[i].children, id);
        }
      }
    }

    renameLinks(state.openList.tree, payload);
  },

  TOGGLE_ADD_MODE(state, payload) {
    state.addMode = payload;
  },

  SET_ADD_NAME(state, payload) {
    state.addName = payload;
  },

  ADD_NEW_ITEM(state, payload) {
    var parent = utils.getParent(state.openList.tree, payload.id);
    var index = utils.getIndex(parent.children, payload.id);
    parent.children.splice(index+1, 0, payload.add);
  },


  DELETE_ITEM(state, payload) {
    var parent = utils.getParent(state.openList.tree, payload);
    var index = utils.getIndex(parent.children, payload);
    parent.children.splice(index, 1);

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
    //delLinks(state.openList.tree, payload);
  },

  SET_EXPAND(state, payload) {
    if (payload.id) {
      var found = utils.getNode(state.openList.tree, payload.id);
      found.expand = !found.expand;

    } else {
      var found = utils.getNode(state.openList.tree, state.selectedItem);
      found.expand = payload.state;
    }
  },

  SET_ITEM_COLOR(state, payload) {
    var found = utils.getNode(state.openList.tree, state.selectedItem);
    if (!found.link) {
      found.color = parseInt(payload);
    }
  },

  TOGGLE_COMPLETE(state, payload) {
    var found = utils.getNode(state.openList.tree, state.selectedItem);
    if (!found.link) {
      found.complete = !found.complete;
    }
  },

  // Расскладывает дерево в плоский массив
  COMPILE_FLAT_TREE(state) {
    state.flatTree = [];

    function findItemID(array, parent, depth) {
      for (var item of array) {
        state.flatTree.push({ id: item.id, name: item.name, expand: item.expand, depth: depth || 0, parent });
        findItemID(item.children, item.id, (depth || 0) + 1);
      }
    }
    findItemID(state.openList.tree, 'root');
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