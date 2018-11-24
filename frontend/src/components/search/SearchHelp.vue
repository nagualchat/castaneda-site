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
            <li>Символ минуса, указанный перед словом или фразой в кавычках исключает их из поиска. Например, <code>мясо -силы</code>.
            <li>Для поиска слов с разными окончаниями используется символ <code>*</code>. К примеру, <code>сил*</code>будет искать слова «сила», «силами», «сильный», «силуэт» и так далее.</li>
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
</script>