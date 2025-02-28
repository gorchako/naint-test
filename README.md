# naint-test
Решение тестового задания

## Перед запуском
```
yarn install
```

### Компиляция и запуск приложения в development-режиме с поддержкой автоматической перезагрузки страницы при внесении изменений
```
yarn serve
```
После запуска сборки приложение будет доступно для просмотра на локальном сервере: http://localhost:8080/

### Тестирование работоспособности
Для тестирования необходимо завести аккаунт в одном из сервисов обмена сообщениями, работающих по протоколу Matrix, например [Element.io](https://element.io/) и создать комнаты  
При входе указать сервер (по умолчанию стоит https://matrix.org), логин и пароль

После успешного входа доступен следующий функционал:
1. Сортировка комнат по алфавиту или последнему событию
2. Просмотр листинга комнат (элемент листинга состоит из названия, кол-ва непрочитанных уведомлений в скобках, аватара комнаты (если он есть) и последнего сообщения)
3. По клику на элемент листинга справа выводятся сообщения выбранной комнаты (если они есть)

При создании новой комнаты или отправке нового сообщения в клиенте, они тут же подгрузятся в приложении
