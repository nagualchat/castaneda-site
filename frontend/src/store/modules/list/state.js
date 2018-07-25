export default {

  // tree
  isDebug: false,
  isShowStartNotify: false,

  isShowUndoSnack: false,
  deletedItems: [],

  selectedItem: null,

  addMode: false,
  addName: '',

  renameMode: false,
  nameBuffer: '',

  editNoteMode: false,
  noteBuffer: '',

  // lists
  openListId: null,
  openList: { tree: [] },
  flatTree: null,

  newListNum: 0,
  listLists: [],

  defaultList: {
    id: null,
    title: null,
    created: null,
    tree: [{
      id: '840034a1-c9ad-4e8e-9e36-01cd4abc23dd',
      name: 'Категория первая',
      note: '',
      color: 0,
      complete: false,
      expand: true,
      children: [{
          id: 'e3ab93b2-b7e6-4419-ba1a-a7e220271f91',
          name: 'Джон Смит 1',
          note: '',
          color: 0,
          complete: false,
          expand: true,
          children: []
        },
        {
          id: '1c3fcc65-5254-4405-8406-6a22aed3dc37',
          name: 'Джон Смит 2',
          note: '',
          color: 0,
          complete: false,
          expand: true,
          children: []
        }
      ]
    },
    {
      id: '994f0fc6-65d0-41ab-ab73-39efc07a2a86',
      name: 'Категория вторая',
      note: '',
      color: 0,
      complete: false,
      expand: true,
      children: [{
          id: '3f4d12dc-24c9-4297-afbb-58b218ceebb8',
          name: 'Джон Смит 3',
          note: '',
          color: 0,
          complete: false,
          expand: true,
          children: []
        }
      ]
    }]
  }

}