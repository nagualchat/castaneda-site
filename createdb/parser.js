const fs = require('fs');
const parseString = require('xml2js').parseString;
const htmlparser = require("htmlparser2");

module.exports = {

  /* -----------------------------------------------------------------
    Поиск автора и названия книги, а также составление оглавления
  ------------------------------------------------------------------ */
  parseBookInfo: function(dir, file) {
    var i = 0;
    var output = { id: '', title: '', author: '', translator: [], toc: [] }

    var book = fs.readFileSync(dir + file, 'utf8');
    var filename = file.substr(0, file.lastIndexOf('.'))

    parseString(book, {
        ignoreAttrs: true,
        explicitRoot: false,
        explicitArray: false,
        explicitCharkey: true,
        charkey: 'text',
      },

      function(err, result) {
        if (err) {
          console.log(err.message, '\n');
        } else {

          var info = result.description['title-info']
          output.id = filename
          output.title = info['book-title'].text
          output.author = info.author['first-name'].text + ' ' + info.author['last-name'].text

          if (info.translator instanceof Array) {
            info.translator.forEach(function(item) {
              if (item['nickname']) {
                output.translator.push(item['nickname'].text)
              } else {
                output.translator.push(item['first-name'].text + ' ' + item['last-name'].text)
              }
            })
          } else {
            output.translator.push(info.translator['first-name'].text + ' ' + info.translator['last-name'].text)
          }

          if (result.body instanceof Array) {
            var body = result.body[0]
          } else {
            var body = result.body
          }

          body.section.forEach(function(item) {
            output.toc.push({ id: i, depth: 0, title: item.title.p.text })
            i++;
            if (item.section) {
              i--; // Чтобы у части и первой её главы был одинаковый номер
              item.section.forEach(function(item) {
                output.toc.push({ id: i, depth: 1, title: item.title.p.text })
                i++;
              })
            }
          })
        }
      })
    return output
  },

  /* -----------------------------------------------------------------
    Извлечение нумерованных параграфов для поискового индекса
    Cноски удаляются, курсив и болд сбрасывается
  ------------------------------------------------------------------ */
  parseParagraphs: function(dir, file, info) {
    var isBody, isTitle, isSubtitle, isEpigraph, isParagraph, isLink;
    var content, contentType, chapterTitle, chapterNum, line = 0;
    var output = [];

    var book = fs.readFileSync(dir + file, 'utf8');
    var filename = file.substr(0, file.lastIndexOf('.'))

    var parser = new htmlparser.Parser({
      onopentag: function(open, attribs) {
        switch (open) {
          case 'body':
            if (attribs.name != 'notes') {
              isBody = true;
            }
            break;
          case 'title':
            isTitle = true;
            break;
          case 'subtitle':
            isSubtitle = true;
            break;
          case 'epigraph':
            isEpigraph = true;
            break;
          case 'p':
          case 'v':
          case 'text-author':
            isParagraph = true;
            break;
          case 'a':
            isLink = true;
            break;
        }
      },

      ontext: function(text) {
        if (isBody && isParagraph) {
          if (!isLink) {
            content += text;
          }
          if (isTitle) {
            chapterTitle = text
          }
        }
      },

      onclosetag: function(close) {
        switch (close) {
          case 'a':
            isLink = false;
            break;
          case 'p':
          case 'v':
          case 'text-author':
            if (isBody && content.length > 0) {
              line++;

              var chapterIndex = info.toc.map(x => x.title).indexOf(chapterTitle)
              if (chapterIndex == -1) {
                chapterId = 0
              } else {
                chapterId = info.toc[chapterIndex].id
              }


              if (isTitle || isSubtitle) {
                contentType = 'heading'
              } else {
                contentType = 'paragraph'
              }
              output.push({ book: { id: filename, title: info.title, author: info.author }, chapter: { id: chapterId, title: chapterTitle }, content: { number: line, type: contentType, text: content } });
            }
            content = '';
            isParagraph = false;
            break;
          case 'epigraph':
            isEpigraph = false;
            break;
          case 'subtitle':
            line++;
            isSubtitle = false;
            break;
          case 'title':
            isTitle = false;
            break;
          case 'body':
            isBody = false;
            break;
        }
      }
    }, { decodeEntities: true });

    parser.write(book);
    parser.end();
    return output;
  },


  /* -----------------------------------------------------------------
    Извлечение текста глав для читалки
  ------------------------------------------------------------------ */
  parseChapters: function(dir, file, info) {
    var isBody, isEpigraph, isTitle, isSubtitle, isPoem, isParagraph, isLink;
    var content, chapterTitle, contentType, line = 0;
    var block = [],
      chapter = [],
      output = [];

    var book = fs.readFileSync(dir + file, 'utf8');
    var filename = file.substr(0, file.lastIndexOf('.'))

    var parser = new htmlparser.Parser({
      onopentag: function(open, attribs) {
        switch (open) {
          case 'body':
            if (attribs.name != 'notes') {
              isBody = true;
            }
            break;
          case 'title':
            isTitle = true;
            break;
          case 'subtitle':
            isSubtitle = true;
            break;
          case 'epigraph':
            isEpigraph = true;
            break;
          case 'poem':
            chapter.push({ type: 'empty-line' });
            isPoem = true;
            break;
          case 'p':
          case 'v':
          case 'text-author':
            isParagraph = true;
            break;
          case 'a':
            isLink = true;
            break;
        }
      },

      ontext: function(text) {
        if (isBody) {
          if (isParagraph) {
            if (!isLink) content += text;
            if (isTitle) chapterTitle = text;
          } else if (isSubtitle) {
            content += text
          }
        }
      },

      onclosetag: function(close) {
        switch (close) {
          case 'a':
            isLink = false;
            break;
          case 'p':
          case 'v':
          case 'text-author':
            if (isBody && content.length > 0) {
              line++;

              if (isTitle) {
                contentType = 'title'
              } else if (isEpigraph) {
                contentType = 'epigraph'
              } else if (isPoem) {
                contentType = 'poem'
              } else {
                contentType = 'paragraph'
              }

              chapter.push({ number: line, type: contentType, text: content });

            }
            content = '';
            isParagraph = false;
            break;
          case 'epigraph':
            chapter.push({ type: 'empty-line' });
            isEpigraph = false;
            break;
          case 'poem':
            chapter.push({ type: 'empty-line' });
            isPoem = false;
            break;
          case 'subtitle':
            line++;
            chapter.push({ number: line, type: 'subtitle', text: content });
            content = '';
            isSubtitle = false;
            break;
          case 'title':
            isTitle = false;
            break;
          case 'section':
            if (chapter.length > 0) {

              var chapterIndex = info.toc.map(x => x.title).indexOf(chapterTitle)
              if (chapterIndex == -1) {
                chapterId = 0
              } else {
                chapterId = info.toc[chapterIndex].id
              }

              output.push({ book: { id: filename, title: info.title, author: info.author }, chapter: { id: chapterId, title: chapterTitle }, paragraphs: chapter });
              chapter = []
            }
            break;
          case 'body':
            isBody = false;
            break;
        }
      }
    }, { decodeEntities: true });

    parser.write(book);
    parser.end();
    return output;
  }
}