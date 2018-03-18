<template>
  <aside class="menu">
    <p class="menu-label">Общие сведения</p>
    <ul class="menu-list">
      <li>
        <router-link to="/info/ref">Определение</router-link>
      </li>
      <li><a>Краткая инструкция</a></li>
    </ul>

    <p class="menu-label">Книги Кастанеды</p>
    <ul class="menu-list">
      <li>
        <router-link to="/info/flo">История Флоринды</router-link>
      </li>
    </ul>

    <p class="menu-label">Книги Тайши</p>
    <ul class="menu-list">
      <li>
        <router-link to="/info/cla">Рассказ Клары</router-link>
      </li>
    </ul>
  </aside>
</template>

<script>

  export default {
    data() {
      return {
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/variables.scss';

  li > .is-active {
    background-color: $dark !important;
  }
</style>