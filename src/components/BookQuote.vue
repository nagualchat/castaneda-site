<template>
  <blockquote class="book-quote">
    <slot/>
    <footer>
      <cite class="has-text-weight-normal"><a :href="url" target="_blank">&mdash; {{title}}</a></cite>
    </footer>
  </blockquote>
</template>

<script>
  export default {
    name: 'BookQuote',
    props: ['book'],

    data() {
      return {
        library: {
          // Буква после номера книги указывает на вариант перевода:
          // [s] - София, [n] - Николаев, [c] - carlitoska
          "1c": "Карлос Кастанеда: Учение дона Хуана",
          "2c": "Карлос Кастанеда: Отдельная реальность",
          "1n": "Карлос Кастанеда: Учение дона Хуана",
          "2n": "Карлос Кастанеда: Отдельная реальность",
          "3n": "Карлос Кастанеда: Путешествие в Икстлан",
          "4n": "Карлос Кастанеда: Сказки о силе",
          "5n": "Карлос Кастанеда: Второе кольцо силы",
          "6n": "Карлос Кастанеда: Дар орла",
          "7n": "Карлос Кастанеда: Огонь изнутри",
          "8n": "Карлос Кастанеда: Сила безмолвия",
          "9n": "Карлос Кастанеда: Искусство сновидения",
          "10s": "Карлос Кастанеда: Активная сторона бесконечности",
          "11s": "Карлос Кастанеда: Колесо времени",
          "12s": "Карлос Кастанеда: Магические пассы",
          "t": "Тайша Абеляр: Магический переход",
        }
      }
    },

    computed: {
      res: function () {
        let val = []
        if (/:/.test(this.book)) {
          val = this.book.match(/(.*):(.*)/i);
        } else {
          val[1] = this.book;
        }
        return val
      },

      title: function () {
        return this.library[this.res[1]]
      },

      url: function () {
        let bn = this.library[this.res[1]].replace(":", " -")
        if (this.res[2]) {
         return "https://nagualchat.github.io/" + bn + ".html#L" + this.res[2]
        } else {
          return "https://nagualchat.github.io/" + bn + ".html"
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables.scss';

  blockquote {
    padding: 0 0.75em;
    border-left: 2px solid $border;
    margin-bottom: 1.5em !important;
    background-color: $white !important;
  }

  p {
    margin-bottom: 0.5em !important;
  }

  cite {
    font-style: normal;
    margin-left: 0.75em;
  }
</style>
