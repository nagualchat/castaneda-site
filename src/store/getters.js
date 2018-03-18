import moment from "moment";
moment.locale("ru");

// Склонения вариантов в массиве titles можно определить, приставляя слово к цифрам 1, 3 и 5
function declint(number, titles) {
  let cases = [2, 0, 1, 1, 1, 2];
  return number + ' ' + titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

export default {

  itemsInList: state => {
    let items = 0

    function count(list) {
      for (let item of list) {
        items++
        count(item.node)
      }
      return items
    }
    count(state.list.tree)
    return declint(items, ['запись', 'записи', 'записей'])
  },

  createdDate: state => {
    let date = moment(state.list.created).format("DD.MM.YY");
    let ago = moment(state.list.created).fromNow()
    return `${date} (${ago})`
  }

}
