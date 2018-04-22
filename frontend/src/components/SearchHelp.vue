<template>
  <div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Справка по поиску</p>
        <button class="delete" aria-label="close" @click="$parent.close()"></button>
      </header>

      <section class="modal-card-body">
        <div class="content">
          <ul>
            <li>В параметрах можно выбрать список книг, по которым будет производиться поиск.</li>
            <li>Для нахождения точной фразы используйте кавычки, например, <code>"мясо силы"</code>.</li>
            <li>Знак <code>-</code> указанный перед словом или фразой исключает их из результатов. Например, <code>мясо -силы</code>.</li>
            <li>А всё отмеченное знаком <code>+</code> наоборот будет обязательно содержаться в результатах поиска.</li>
            <li>Для поиска по маске могут быть использованы подстановочные знаки <code>?</code> (0 или 1 символ) и <code>*</code> (0 или более символов). Например, <code>сновид*</code>.</li>
            <li>Слова и фразы могут быть скомбинированы с помощью логических операторов <code>AND</code> и <code>OR</code>. Например, <code>сновид* AND руки</code>.</li>
          </ul>
          <p>Более подробную информацию о синтаксисе поисковых запросов можно найти в справочных материалах
          <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax" target="_blank">Elasticsearch</a>.
          </p>
        </div>
      </section>

      <footer class="modal-card-foot"></footer>

    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex"

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
          this.changeList(value)
        }
      }
    },

    methods: {
      ...mapActions(["createList", "changeList"]),

      renameDialog(list) {
        this.$dialog.prompt({
          message: "Введите новое название:",
          confirmText: "Готово",
          cancelText: "Отмена",
          inputAttrs: {
            value: list.name,
            maxlength: 30
          },
          onConfirm: (value) => this.$store.dispatch("renameList", { id: list.id, name: value })
        })
      },

      deleteDialog(list) {
        this.$dialog.confirm({
          title: "Удаление",
          message: "Вы уверены, что хотите удалить список? Это действие нельзя отменить.",
          confirmText: "Удалить",
          cancelText: "Отмена",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.$store.dispatch("deleteList", list.id)
        })
      },

      exportFile(list) {
        this.$store.dispatch("exportList", list.id)
      },

      importFile() {
        this.$store.dispatch("importList", this.file[0])
      },

    }
  }
</script>