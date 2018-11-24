Небольшой ресурс в помощь изучающим наследие Карлоса Кастанеды. О реализованном функционале и текущих задачах можно прочитать в [вики](https://github.com/nagualchat/nagualism-site/wiki).

## Сборка и запуск

В `frontend/src/config.js` должен быть указан адрес бэкэнда, а в `backend/config.js` необходимо прописать пути к mongodb и elasticsearch.

``` bash
### frontend ###

# установка зависимостей
npm install

# запуск сервера для разработки
npm run serve

# сборка для production с минификацией
npm run build


### backend ###

# установка зависимостей
npm install

# запуск
npm start
