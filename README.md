# REST API списка товаров

## Описание
В данном REST API реализованы все основые CRUD операции: <br>
- получать список товаров постранично (пагинация) сортировать их по цене от большего к меньшему, фильтровать по цене.
- получения одного товара по uuid <br>
- создания товара <br>
- изменение <br>
- мягкое удаление посредством изменения флага is_deleted <br>
<br>
Все товары имеют обязательное поле price и необязательное discountedPrice, при фильтрации и сортировке работа с ценой всегда ведётся по discountedPrice если она указана, а если нет то по price <br>
То есть используется всегда минимальная доступная для пользователя цена <br>
 <br>
 Так же реализована работа с файлами - изображениями товаров. При добавлении нового изображение сохраняется на сервер а товар сохраняется в БД со ссылкой на этот файл. При изменении товара, если пришла новая картинка, старая удаляется. При мягком удалении товара картинка остаётся т.к. мягкое удаление подразумевает возможность восстановления.
 <br> <br>


## Технологии
- TypeScript
- Node.js
- Nest.js
- TypeORM
- PostgreSQL
- Docker
- Docker Compose
  <br>

## Запуск

Я осознанно оставил .env в репозитории. <br>
Для запуска проекта надо только выполнить команду:
```bash
docker-compose up --build
```
при условии, что Docker и Docker Compose уже установлены на вашем компьютере API будет доступен по адресу: <br>
http://localhost:5000/api
 <br>

## Контакты
Свзязаться со мной можно в Telegram:<br>
@IgorMeshalkin

