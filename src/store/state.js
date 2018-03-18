export default {

  isDebug: false,
  isDarkTheme: false,

  selectedId: null,
  renamingId: null,
  addPosition: null,
  listMap: [],

  listNumber: 0,
  listId: null,
  list: { tree: [] },
  lists: [],

  defaultList: {
    id: null,
    name: null,
    created: null,
    tree: [{
      id: "840034a1-c9ad-4e8e-9e36-01cd4abc23dd",
      name: "Категория 1",
      collapsed: false,
      node: [{
        id: "e3ab93b2-b7e6-4419-ba1a-a7e220271f91",
        name: "Джон Смит 1",
        collapsed: false,
        node: []
        },
        {
          id: "1c3fcc65-5254-4405-8406-6a22aed3dc37",
          name: "Джон Смит 2",
          collapsed: false,
          node: []
        }
      ]
    }]
  }

}