## Роутинг 
    - POST-запрос на `/api/registration` - создание нового пользователя.
    - POST-запрос на `/api/login` - авторизация после пользователького ввода.
    - POST-запрос на `/api/refresh-token` - обновление access-токена.
    - GET-запрос на `/api/profile` - авторизация при наличии токена.
    - PATCH-запрос на `/api/profile` - обновление информации о пользователе.
    - DELETE-запрос на `/api/users/:id` - удаление пользователя.
    - GET-запрос на `/api/news` - получение списка новостей.
    - POST-запрос на `/api/news` - создание новой новости.
    - PATCH-запрос на `/api/news/:id` - обновление существующей новости.
    - DELETE-запрос на `/api/news/:id` - удаление существующей новости.
    - GET-запрос на `/api/users` - получение списка пользователей.
    - PATCH-запрос на `/api/users/:id/permission` - обновление существующей записи о разрешениях конкретного пользователя.

## socket-подключение обрабатывает следующие события:
- `users:connect`, инициируется при подключении пользователя. 
- `message:add`, инициируется при отправке одним из пользователей сообщения другому.
- `message:history`, инициируется при открытии пользователем чата.
- `disconnect`, инициируется при отключении пользователя.
