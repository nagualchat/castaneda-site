import uuid from 'uuid/v4';
import moment from 'moment';
import localforage from 'localforage';
import utils from './utils';

localforage.config({
  name: 'recapitulation-list',
  storeName: 'data'
})

export default {

  /*    ====   Дерево  ====    */

  // Перемещение выделения вверх
  // Требует доработки: при разнице в 2 и больше уровней заходит в свёрнутые ноды
  selectUp({ state, commit }) {
    var index = state.flatTree.map((el) => el.id).indexOf(state.selectedItem);
    if (index == 0) return;
    var prev = state.flatTree[index - 1];

    var prevParent = state.flatTree.find(x => x.id === prev.parent);
    if (prevParent) {
      if (!prevParent.expand) {
        commit('SET_SELECTED_ITEM', prevParent.id);
      } else {
        commit('SET_SELECTED_ITEM', prev.id);
      }
    } else {
      commit('SET_SELECTED_ITEM', prev.id);
    }
  },

  // Перемещение выделения вниз
  selectDown({ state, commit }) {
    var index = state.flatTree.map((el) => el.id).indexOf(state.selectedItem);
    var current = state.flatTree[index];

    if (!current.expand) {
      for (var i = index + 1; i < state.flatTree.length; ++i) {
        if (state.flatTree[i].depth <= current.depth) {
          commit('SET_SELECTED_ITEM', state.flatTree[i].id);
          break;
        }
      }
    } else {
      var next = state.flatTree[index + 1];
      if (index + 1 < state.flatTree.length) commit('SET_SELECTED_ITEM', next.id);
    }
  },

  // Сдвиг вправо
  // Требует доработки: когда между сдвигаемым и предыдущим разница в несколько уровней, они пропускаются
  indentItem({ state, commit }) {
    var index = state.flatTree.map((el) => el.id).indexOf(state.selectedItem);
    if (index == 0) return;
    var current = state.flatTree[index];
    var prev = state.flatTree[index - 1];

    var prevNode = utils.getNode(state.openList.tree, prev.id);
    if (prevNode.children[0] && prevNode.children[0].id == state.selectedItem) return;

    var currentNode = utils.getNode(state.openList.tree, state.selectedItem);
    var parentNode = utils.getParent(state.openList.tree, state.selectedItem);

    prevNode.children.push(currentNode);

    if (!parentNode) {
      var currentIndex = state.openList.tree.map((el) => el.id).indexOf(state.selectedItem);
      state.openList.tree.splice(currentIndex, 1);
    } else {
      var currentIndex = parentNode.children.map((el) => el.id).indexOf(state.selectedItem);
      parentNode.children.splice(currentIndex, 1);
    }
  },

  // Сдвиг влево
  unindentItem({ state, commit }) {
    var current = state.flatTree.find(x => x.id === state.selectedItem);
    if (current.depth == 0) return;

    var parent = utils.getParent(state.openList.tree, current.id);
    var index = parent.children.map((el) => el.id).indexOf(current.id);
    var newParent = utils.getParent(state.openList.tree, parent.id);

    if (!newParent) {
      var newIndex = state.openList.tree.map((el) => el.id).indexOf(parent.id);
      state.openList.tree.splice(newIndex + 1, 0, parent.children[index]);
    } else {
      var newIndex = newParent.children.map((el) => el.id).indexOf(parent.id);
      newParent.children.splice(newIndex + 1, 0, parent.children[index]);
    }

    parent.children.splice(index, 1);
  },

  // Переименование
  async editItem({ state, commit }, payload) {
    var found = utils.getNode(state.openList.tree, payload);
    if (!found.link) {
      commit('SET_EDIT_NAME', found.name);
      commit('TOGGLE_EDIT_MODE', true);
    }
  },

  editDone({ state, commit }) {
    commit('SET_EDIT_NAME', state.editName.trim());
    if (!state.editName) {
      commit('DELETE_ITEM', state.selectedItem);
    } else {
      commit('RENAME_ITEM', state.selectedItem);
    }
    commit('TOGGLE_EDIT_MODE', false);
  },

  editCancel({ commit }) {
    commit('TOGGLE_EDIT_MODE', false);
  },

  // Добавление нового элемента
  addDone({ state, commit }) {
    var name = state.addName.trim();
    if (name) {
      var item = { id: uuid(), name: name, expand: true, color: 0, complete: false, children: [] };
      commit('ADD_NEW_ITEM', { id: state.selectedItem, add: item });
    }
    commit('TOGGLE_ADD_MODE', false);
    commit('SET_ADD_NAME', '');
  },

  addCancel({ commit }) {
    commit('TOGGLE_ADD_MODE', false);
    commit('SET_ADD_NAME', '');
  },

  // Создание ссылки
  createLink({ commit }, payload) {
    var item = { id: uuid(), name: payload.name, link: payload.id, expand: true, color: 0, complete: false, children: [] };
    console.log(payload);
    commit('ADD_NEW_ITEM', { id: payload.id, add: item });
  },


  removeItem({ state, commit }) {
    var found = utils.getNode(state.openList.tree, state.selectedItem);

    console.log(found);
    //commit('SAVE_DELETED_ITEM', found);
    commit('DELETE_ITEM', state.selectedItem);
    //commit('SET_DELETE_SHACKBAR', true);
  },

  //undoRemove({ state, commit }) { },

  /*    ====   Списки  ====    */

  async getLists({ commit }) {
    commit('CLEAR_LISTS');
    await localforage.iterate((value, key, idx) => {
      if (/list-/.test(key)) {
        var list = JSON.parse(value);
        commit('ADD_LISTS', { id: list.id, name: list.name, created: list.created });
      }
    })
  },

  async nameCount({ commit }) {
    var counter = await localforage.getItem('name-number');
    if (counter) {
      counter = counter + 1;
    } else {
      counter = 1;
    }
    await localforage.setItem('name-number', counter);
    commit('SET_LIST_NUMBER', counter);
  },

  async createList({ state, dispatch }) {
    var list = state.defaultList;
    list.id = uuid();
    list.created = new Date().getTime();

    await dispatch('nameCount');
    list.name = `Список ${state.newListNum}`;

    await localforage.setItem('list-' + list.id, JSON.stringify(list));
    await dispatch('getLists');
  },

  async initList({ state, commit, dispatch }) {
    var def = await localforage.getItem('default');
    if (def) {
      commit('SET_LIST_ID', def);
      var value = await localforage.getItem('list-' + def);
      var list = JSON.parse(value);
      commit('SET_LIST', list);
      commit('COMPILE_FLAT_TREE');
      await dispatch('getLists');
    } else {
      commit('SET_START_NOTIFY', true);
      await dispatch('createList');
      await dispatch('changeList', state.listLists[0].id);
    }
    await commit('SET_SELECTED_ITEM', state.openList.tree[0].id);
  },

  async changeList({ state, commit }, payload) {
    commit('SET_LIST_ID', payload);
    var list = await localforage.getItem('list-' + payload);
    commit('SET_LIST', JSON.parse(list));
    await localforage.setItem('default', state.openListId);
  },

  async renameList({ state, dispatch }, payload) {
    var value = await localforage.getItem('list-' + payload.id);
    var list = JSON.parse(value);
    list.name = payload.name;
    if (state.openListId === payload.id) {
      state.openList.name = payload.name;
    }
    await localforage.setItem('list-' + payload.id, JSON.stringify(list));
    await dispatch('getLists');
  },

  async deleteList({ state, dispatch }, payload) {
    await localforage.removeItem('list-' + payload);
    await dispatch('getLists');
    if (state.openListId === payload) {
      if (state.listLists[0]) {
        await dispatch('changeList', state.listLists[0].id);
      } else {
        await dispatch('createList');
        await dispatch('changeList', state.listLists[0].id);
      }
    }
  },

  async exportList({ state }, payload) {
    var value = await localforage.getItem('list-' + payload);
    var list = JSON.parse(value);
    const blob = new Blob([JSON.stringify(list)], { type: 'text/plain;charset=utf-8' });
    const downloadLink = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${list.name} (${moment().format('DD-MM-YY hh-mm')}).json`
    a.href = downloadLink;
    a.click();
    window.URL.revokeObjectURL(downloadLink);
  },

  async importList({ dispatch }, payload) {
    const reader = new FileReader();
    reader.onloadend = async function(e) {
      var list = JSON.parse(e.target.result);
      list.id = uuid();
      await localforage.setItem('list-' + list.id, JSON.stringify(list));
      await dispatch('getLists');
    }
    reader.readAsText(payload, 'utf-8');
  },

  saveList({ state, commit }) {
    commit('COMPILE_FLAT_TREE');
    localforage.setItem('list-' + state.openListId, JSON.stringify(state.openList));
  }

}