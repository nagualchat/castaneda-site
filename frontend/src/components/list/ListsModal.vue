<template>
  <div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Управление списками</p>
        <button class="delete" aria-label="close" @click="$parent.close()"></button>
      </header>

      <section class="modal-card-body">
        <div class="level lists-element is-mobile" v-for="(list, index) in listLists" :key="index">

          <div class="level-left">
            <div class="level-item">
              <b-radio v-model="selected" :native-value="list.id">{{ list.title }}</b-radio>
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              <a class="button is-small is-secondary" title="Переименовать" @click="renameDialog(list)">
                <b-icon custom-size="mdi-18px" icon="pencil"></b-icon>
              </a>
            </div>
            <div class="level-item">
              <a class="button is-small is-secondary" title="Экспортировать" @click="exportFile(list)">
                <b-icon custom-size="mdi-18px" icon="download"></b-icon>
              </a>
            </div>
            <div class="level-item">
              <a class="button is-small is-danger" title="Удалить" @click="deleteDialog(list)">
                <b-icon custom-size="mdi-18px" icon="delete"></b-icon>
              </a>
            </div>
          </div>

        </div>
      </section>

      <footer class="modal-card-foot">
        <a class="button is-secondary" @click="createList()">
          <b-icon icon="plus"></b-icon>
          <span>Создать новый</span>
        </a>

        <b-upload accept=".json" v-model="file" @input="importFile()">
          <a class="button is-secondary">
            <b-icon icon="import"></b-icon>
            <span>Импортировать</span>
          </a>
        </b-upload>
      </footer>

    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    data() {
      return {
        file: [],
      }
    },

    computed: {
      ...mapState({
        listLists: state => state.list.listLists
      }),

      selected: {
        get() {
          return this.$store.state.list.openListId;
        },
        set(value) {
          this.changeList(value);
        }
      }
    },

    methods: {
      ...mapActions(['createList', 'changeList']),

      renameDialog(list) {
        this.$dialog.prompt({
          message: 'Введите новое название:',
          confirmText: 'Готово',
          cancelText: 'Отмена',
          inputAttrs: {
            value: list.title,
            maxlength: 30
          },
          onConfirm: (value) => this.$store.dispatch('renameList', { id: list.id, title: value })
        })
      },

      deleteDialog(list) {
        this.$dialog.confirm({
          title: 'Удаление',
          message: 'Вы уверены, что хотите удалить список? Это действие нельзя отменить.',
          confirmText: 'Удалить',
          cancelText: 'Отмена',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.$store.dispatch('deleteList', list.id)
        })
      },

      exportFile(list) {
        this.$store.dispatch('exportList', list.id);
      },

      importFile() {
        this.$store.dispatch('importList', this.file);
      },

    }
  }
</script>

<style lang="scss">
  .lists-element {
    margin: 10px 0 !important;
  }
</style>