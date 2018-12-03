import utils from './utils';

export default {

  /*    ====   Дерево  ====    */

  SET_DEBUG_MODE(state, payload) {
    state.isDebug = !state.isDebug;
  },

  SET_START_NOTIFY(state, payload) {
    state.isShowStartNotify = payload;
  },

  SHOW_UNDO_SHACKBAR(state) {
    state.isShowUndoSnack = !state.isShowUndoSnack;
  },

  SAVE_DELETED_ITEM(state, payload) {
    state.deletedItems.push(payload);
  },

  RESTORE_DELETED_ITEM(state, payload) {
    var deleted = state.deletedItems.pop();
    if (deleted.parent == 'root') {
      state.openList.tree.splice(deleted.index, 0, deleted.item);
    } else {
      var node = utils.getNode(state.openList.tree, deleted.parent);
      node.children.splice(deleted.index, 0, deleted.item);
    }
  },

  TOGGLE_MENU_STATE(state) {
    state.isOpenMenu = !state.isOpenMenu;
  },

  SET_SELECTED_ITEM(state, payload) {
    state.selectedItem = payload;
  },

  TOGGLE_ADD_MODE(state, payload) {
    state.addMode = payload;
  },

  SET_ADD_NAME(state, payload) {
    state.addName = payload;
  },

  ADD_NEW_ITEM(state, payload) {
    var parent = utils.getParent(state.openList.tree, payload.id);
    if (!parent) {
      var index = utils.getIndex(state.openList.tree, payload.id);
      state.openList.tree.splice(index + 1, 0, payload.add);
    } else {
      var index = utils.getIndex(parent.children, payload.id);
      parent.children.splice(index + 1, 0, payload.add);
    }
  },

  TOGGLE_RENAME_MODE(state, payload) {
    state.renameMode = payload;
  },

  SET_NAME_BUFFER(state, payload) {
    state.nameBuffer = payload;
  },

  RENAME_ITEM(state, payload) {
    var node = utils.getNode(state.openList.tree, payload);
    node.name = state.nameBuffer;
  },

  TOGGLE_EDIT_NOTE_MODE(state, payload) {
    state.editNoteMode = payload;
  },

  SET_NOTE_BUFFER(state, payload) {
    state.noteBuffer = payload;
  },

  EDIT_NOTE(state, payload) {
    var node = utils.getNode(state.openList.tree, payload);
    node.note = state.noteBuffer;
  },

  DELETE_ITEM(state, payload) {
    var parent = utils.getParent(state.openList.tree, payload);
    if (!parent) {
      var index = utils.getIndex(state.openList.tree, payload);
      state.openList.tree.splice(index, 1);
    } else {
      var index = utils.getIndex(parent.children, payload);
      parent.children.splice(index, 1);
    }
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
    found.color = parseInt(payload);
  },

  TOGGLE_COMPLETE(state) {
    var found = utils.getNode(state.openList.tree, state.selectedItem);
    found.complete = !found.complete;
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