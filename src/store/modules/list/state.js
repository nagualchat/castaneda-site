export default {

  // tree
  isDebug: false,
  isShowStartNotify: false,
  isShowDeleteSnack: false,

  selectedItem: null,
  deletedItem: {},

  editMode: false,
  editName: '',

  addMode: false,
  addName: '',

  // lists
  openListId: null,
  openList: { tree: [] },
  flatTree: [],

  newListNum: 0,
  listLists: [],

  defaultList: {
    id: null,
    name: null,
    created: null,
    tree: [{
      id: '840034a1-c9ad-4e8e-9e36-01cd4abc23dd',
      name: 'Категория 1',
      color: 0,
      complete: false,
      expand: true,
      children: [{
          id: 'e3ab93b2-b7e6-4419-ba1a-a7e220271f91',
          name: 'Джон Смит 1',
          color: 0,
          complete: false,
          expand: true,
          children: []
        },
        {
          id: '1c3fcc65-5254-4405-8406-6a22aed3dc37',
          name: 'Джон Смит 2',
          color: 0,
          complete: false,
          expand: true,
          children: []
        }
      ]
    }]
  }

}