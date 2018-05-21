import moment from "moment";
moment.locale("ru");

// Склонения вариантов в массиве titles можно определить, приставляя слово к цифрам 1, 3 и 5
function declint(number, titles) {
  let cases = [2, 0, 1, 1, 1, 2];
  return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

export default {

  searchInfo: state => {
    if (state.searchStats) {
      let hits = declint(state.searchStats.total, ['результат', 'результата', 'результатов']);
      return hits + ' (' + state.searchStats.took + ' мс)';
    }
  },

  // Статистика списка
  totalItems: state => {
    let items = 0;

    function count(list) {
      for (let item of list) {
        items++;
        count(item.children);
      }
      return items;
    }
    count(state.openList.tree);
    return declint(items, ['запись', 'записи', 'записей']);
  },

  completeItems: state => {
    let items = 0;

    function count(list) {
      for (let item of list) {
        if (item.complete) items++;
        count(item.children);
      }
      return items;
    }
    count(state.openList.tree);
    return items ? items : false;
  },

  createdDate: state => {
    let date = moment(state.openList.created).format("DD.MM.YY");
    let ago = moment(state.openList.created).fromNow();
    return `${date} (${ago})`;
  }

}