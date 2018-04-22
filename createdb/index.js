const fs = require('fs')
const mongoose = require("mongoose")
const elasticsearch = require('elasticsearch')
const parser = require('./parser')

const Book = require("./models/book");
const Chapter = require("./models/chapter");
const config = require('./config')

const dir = './books/'

const elastic = new elasticsearch.Client({ host: config.esUrl })
mongoose.connect(config.dbURL, config.dbOptions);

// Функция асинхронного ForEach
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function indexingParagraphs() {
  fs.readdir(dir, async function(err, files) {
    var body = [];

    try {
      await elastic.indices.delete({ index: 'paragraphs' });
    } catch (err) {
      console.log('Ошибка во время удаления:', err.message);
    }

    await elastic.indices.create({ index: 'paragraphs' });
    console.log('Индекс пересоздан\n');

    await asyncForEach(files, async (file, index) => {
      var filename = file.substr(0, file.lastIndexOf("."));
      var info = parser.parseBookInfo(dir, file);
      var paragraphs = parser.parseParagraphs(dir, file, info);

      await asyncForEach(paragraphs, async (item, index) => {
        var id = item.book.id + '_' + item.chapter.id + '_' + index;
        body.push({ index: { _index: 'paragraphs', _type: 'doc', _id: id } });
        body.push(item);
      })
      console.log('Извлечено', body.length / 2, 'параграфов (' + file + ')');

      try {
        let response = await elastic.bulk({ body });
        console.log('[ items: ' + response.items.length + ', took: ' + response.took + ', errors: ' + response.errors + ' ]\n');
      } catch (err) {
        console.log('Ошибка во время загрузки:', err.message);
      }

      body = [];
    })

    console.log('Заполнение индекса завершено');

  })
}


function createBooksDb() {
  fs.readdir(dir, async function(err, files) {
    var body = [];
    var count = 0;

    await Book.remove({}, function(err) {
      if (err) return handleError(err);
      console.log('Коллекция очищена\n');
    });

    files.forEach(function(file) {
      count++
      var filename = file.substr(0, file.lastIndexOf("."));
      var info = parser.parseBookInfo(dir, file);
      console.log('Обрабатывается:', file);

      var out = new Book(info).save();
    })

    console.log('Файлов обработано: ' + count + '\n');
  })
}

function createChaptersDb() {
  fs.readdir(dir, async function(err, files) {
    var body = [];
    var count = 0;

    await Chapter.remove({}, function(err) {
      if (err) return handleError(err);
      console.log('Коллекция очищена\n');
    });

    await asyncForEach(files, async (file) => {
      count++
      var filename = file.substr(0, file.lastIndexOf("."));
      var info = parser.parseBookInfo(dir, file);
      var chapters = parser.parseChapters(dir, file, info)
      console.log(file);
      await asyncForEach(chapters, async (item) => {
        var out = await new Chapter(item).save()
      })

    })
    console.log('Файлов обработано: ' + count + '\n');
  })
}

indexingParagraphs()

//createBooksDb()

//createChaptersDb();