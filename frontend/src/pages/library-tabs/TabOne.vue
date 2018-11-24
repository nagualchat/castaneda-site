<template>
  <div id="lib">

    <p>Не так страшен Кастанеда, как тот, кто прочитал только первые две его книги. Рекомендуется поэтому начинать с третьей и после неё уже браться за остальные.</p>

    <h1 class="title is-4">Книги Кастанеды</h1>
    <div class="subtitle is-6">Рекомендуемые переводы</div>

    <table class="table" >
      <tr>
        <td>
          <span>1. </span>
          <router-link :to="`/reader?book=${rlist[0].id}&ch=0`">{{ rlist[0].title }}</router-link>
          <div style="padding-bottom: 0.8em;"></div>
          <span>2. </span>
          <router-link :to="`/reader?book=${rlist[1].id}&ch=0`">{{ rlist[1].title }}</router-link>
        </td>
        <td>{{ rlist[0].tran }}</td>
        <td>
          <a :href="`/books/cc-general/Карлос Кастанеда - ${rlist[0].title}, ${rlist[1].title} (carlitoska).fb2`">fb2</a>,
          <a :href="`/books/cc-general/Карлос Кастанеда - ${rlist[0].title}, ${rlist[1].title} (carlitoska).mobi`">mobi</a>
        </td>
      </tr>
      <tr v-for="(item, index) in rlist.slice(2)" :key="index">
        <td>
          <span>{{ index + 3 }}. </span>
          <router-link :to="`/reader?book=${item.id}&ch=0`">{{ item.title }}</router-link>
        </td>
        <td>{{ item.tran }}</td>
        <td>
          <a :href="`/books/cc-general/Карлос Кастанеда - ${item.title} (${item.tran}).fb2`">fb2</a>,
          <a :href="`/books/cc-general/Карлос Кастанеда - ${item.title} (${item.tran}).mobi`">mobi</a>
        </td>
      </tr>
    </table>

    <h1 class="title is-4">Книги ведьм</h1>
    <div class="subtitle is-6">Ближайшие соратники Карлоса</div>

    <table class="table">
      <tr>
        <td>
          <router-link to="/reader?book=taisha&ch=0">Тайша Абеляр — Магический переход</router-link>
        </td>
        <td>
          <a href="/books/witches/Тайша Абеляр - Магический переход.fb2">fb2</a>,
          <a href="/books/witches/Тайша Абеляр - Магический переход.mobi">mobi</a>
        </td>
      </tr>
      <tr>
        <td>
          <router-link to="/reader?book=florinda&ch=0">Флоринда Доннер — Жизнь-в-сновидении</router-link>
        </td>
        <td>
          <a href="/books/witches/Флоринда Доннер - Жизнь-в-сновидении.fb2">fb2</a>,
          <a href="/books/witches/Флоринда Доннер - Жизнь-в-сновидении.mobi">mobi</a>
        </td>
      </tr>
    </table>

    <h1 class="title is-4">Тенсёгрити</h1>

    <table class="table">
      <tr>
        <td>Карлос Кастанеда — Магические пассы</td>
        <td>
          <a href="/books/tensegrity/Карлос Кастанеда - Магические пассы.fb2">fb2</a>
        </td>
      </tr>
      <tr>
        <td>Карлос Кастанеда — Магические пассы (на английском)</td>
        <td>
          <a href="/books/tensegrity/Carlos Castaneda - Magical Passes.pdf">pdf</a>
        </td>
      </tr>
      <tr>
        <td>Подборка видеозаписей</td>
        <td>
          <a href="https://rutracker.org/forum/viewtopic.php?t=5174782" target="_blank">rutracker</a>
        </td>
      </tr>
    </table>

    <h1 class="title is-4">Одним файлом</h1>

    <table class="table lib-table">
      <tr>
        <td>Книги Кастанеды с 1 по 9</td>
        <td>Николаев</td>
        <td>
          <a href="/books/compilations/Кастанеда 1-9 (Николаев).fb2">fb2</a>
        </td>
      </tr>
      <tr>
        <td>Книги Кастанеды с 1 по 11</td>
        <td>София</td>
        <td>
          <a href="/books/compilations/Кастанеда 1-11 (София).fb2">fb2</a>
        </td>
      </tr>
      <tr>
        <td>Книги Кастанеды с 1 по 11</td>
        <td>English</td>
        <td>
          <a href="/books/compilations/Кастанеда 1-11 (en).fb2">fb2</a>
        </td>
      </tr>
      <tr>
        <td>Все книги Кастанеды и ведьм (12+3)</td>
        <td>София</td>
        <td>
          <a href="/books/compilations/Кастанеда 1-12 + Тайша и Флоринда .pdf">pdf</a>
        </td>
      </tr>
    </table>

    <h1 class="title is-4">Структурный анализ</h1>
    <div class="subtitle is-6">Научная часть книги «Учение дона Хуана»</div>

    <table class="table">
      <tr>
        <td>Перевод darorla.org</td>
        <td>
          <a href="http://darorla.org/index.php?topic=3717.0" target="_blank">forum</a>,
          <a href="/books/analysis/Структурный анализ (перевод darorla.org, 2016г).doc">doc</a>
        </td>
      </tr>
      <tr>
        <td>Перевод издательства Ковчег</td>
        <td>
          <a href="/books/analysis/Структурный анализ (перевод изд. Ковчег, 1992г).pdf">pdf</a>
        </td>
      </tr>
    </table>

    <h1 class="title is-4">Глава из книги «Дар Орла»</h1>
    <div class="subtitle is-6">Была напечатана только в испанском издании</div>

    <table class="table">
      <tr>
        <td>Перевод darorla.org</td>
        <td>
          <a href="/books/eagles-gift/Шесть поясняющих предложений (darorla.org).doc">doc</a>
        </td>
      </tr>
      <tr>
        <td>Перевод piligrim22</td>
        <td>
          <a href="/books/eagles-gift/Шесть объясняющих предположений (piligrim22).doc">doc</a>
        </td>
      </tr>
      <tr>
        <td>Перевод неустановленного авторства</td>
        <td>
          <a href="/books/eagles-gift/Шесть разъяснительных моментов.doc">doc</a>
        </td>
      </tr>
      <tr>
        <td>На английском</td>
        <td>
          <a href="/books/eagles-gift/Six Explanatory Propositions.doc">doc</a>
        </td>
      </tr>
    </table>

    <h1 class="title is-4">Интервью, статьи и лекции</h1>

    <table class="table">
      <tr>
        <td>Кастанеда и другие — Лекции и интервью</td>
        <td>Народная подборка</td>
        <td>
          <a href="/books/talks/Лекции и интервью (народная подборка).fb2">fb2</a>,
          <a href="/books/talks/Лекции и интервью (народная подборка).mobi">mobi</a>
        </td>
      </tr>
      <tr>
        <td>Кастанеда и другие — Лекции и интервью</td>
        <td>София, 2001 г.</td>
        <td>
          <a href="/books/talks/Лекции и интервью (София, 2001г).pdf">pdf</a>
        </td>
      </tr>
      <tr>
        <td>Кастанеда и другие — Лекции и интервью</td>
        <td>София, 2010 г.</td>
        <td>
          <a href="/books/talks/Лекции и интервью (София, 2010г).fb2">fb2</a>,
          <a href="/books/talks/Лекции и интервью (София, 2010г).mobi">mobi</a>
        </td>
      </tr>
      <tr>
        <td>Карлос Кастанеда и Теодор Розак</td>
        <td>Радиоинтервью, 1968 г.</td>
        <td>
          <a href="https://www.youtube.com/watch?v=oW8NE_5kL44" target="_blank">youtube</a>
        </td>
      </tr>
    </table>

    <div id="download-all" class="has-text-centered">
      <a class="button is-light" href="https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/nagualchat/nagualism-site/tree/master/frontend/lib" target="_blank"><b-icon icon="download"></b-icon><span>Скачать все книги одним архивом</span></a>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        rlist: [
          { title: 'Учение дона Хуана', tran: 'Carlitoska', id: 'cc1c' },
          { title: 'Отдельная реальность', tran: 'Carlitoska', id: 'cc2c' },
          { title: 'Путешествие в Икстлан', tran: 'Николаев', id: 'cc3n' },
          { title: 'Сказки о силе', tran: 'Николаев', id: 'cc4n',  },
          { title: 'Второе кольцо силы', tran: 'Николаев', id: 'cc5n' },
          { title: 'Дар орла', tran: 'Николаев', id: 'cc6n' },
          { title: 'Огонь изнутри', tran: 'Николаев', id: 'cc7n' },
          { title: 'Сила безмолвия', tran: 'Николаев', id: 'cc8n' },
          { title: 'Искусство сновидения', tran: 'Николаев', id: 'cc9n' },
          { title: 'Активная сторона бесконечности', tran: 'София', id: 'cc10s' },
          { title: 'Колесо времени', tran: 'София', id: 'cc11s' },
        ]
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  #download-all {
    margin-top: 2em;
    margin-bottom: -1em;
  }
</style>
