# 🌐 Web API Reference

**Версия:** 1.0 (Initial Draft)
**Статус:** 🟡 **В разработке**

## 🎯 Обзор

Этот документ описывает REST API, предоставляемый пакетом `web-api`. API служит "тонким" HTTP-адаптером для `polylith-backend`, предоставляя веб-клиентам доступ к основной бизнес-логике NEIRA Super App.

- **Фреймворк:** Express.js
- **Аутентификация:** JWT Bearer Token
- **Формат данных:** JSON

> ⚠️ **Важно:** В текущей реализации (`packages/web-api/src/routes/chats.ts`) вызовы к `backendApi` заменены на mock-объект. Для полноценной работы требуется восстановить реальную интеграцию с `@neira/polylith-backend`.

---

## 🔐 Аутентификация

Все запросы к эндпоинтам `/api/*` должны содержать заголовок `Authorization`.

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

В режиме разработки (`NODE_ENV=development`) токен не обязателен; используется `userId: 'dev-user-123'`.

---

## ❤️ Health Check

Эндпоинт для проверки состояния сервера. Не требует аутентификации.

### `GET /health`

- **Описание:** Возвращает статус сервера, временную метку и окружение.
- **Ответ `200 OK`:**

  ```json
  {
    "status": "OK",
    "timestamp": "2025-07-26T10:00:00.000Z",
    "environment": "development",
    "version": "1.0.0"
  }
  ```

---

## 💬 Чаты (`/api/chats`)

Эндпоинты для управления чатами пользователя.

### `GET /api/chats`

- **Описание:** Получить список всех чатов текущего пользователя.
- **Ответ `200 OK`:**

  ```json
  {
    "success": true,
    "data": [
      { "id": "chat-1", "title": "My first chat", "messages": [...] },
      { "id": "chat-2", "title": "My second chat", "messages": [...] }
    ],
    "total": 2
  }
  ```

### `GET /api/chats/:id`

- **Описание:** Получить конкретный чат по его ID.
- **Параметры URL:**
  - `id` (string, required): ID чата.
- **Ответ `200 OK`:**

  ```json
  {
    "success": true,
    "data": {
      "id": "chat-1",
      "title": "My first chat",
      "messages": [
        { "role": "user", "content": "Hello" },
        { "role": "assistant", "content": "Hi there!" }
      ]
    }
  }
  ```

- **Ответ `404 Not Found`:**

  ```json
  { "error": "Chat not found" }
  ```

### `POST /api/chats`

- **Описание:** Создать новый чат или обновить существующий. Если `id` в теле запроса отсутствует, создается новый чат.
- **Тело запроса:**

  ```json
  {
    "id": "chat-1", // (string, optional)
    "title": "Updated Chat Title", // (string, optional)
    "messages": [
      // (Message[], required)
      { "role": "user", "content": "Hello again" }
    ]
  }
  ```

- **Ответ `201 Created` (для нового чата):**

  ```json
  {
    "success": true,
    "data": { "id": "new-chat-id" },
    "action": "created"
  }
  ```

- **Ответ `200 OK` (для обновления):**

  ```json
  {
    "success": true,
    "data": { "id": "chat-1" },
    "action": "updated"
  }
  ```

### `DELETE /api/chats/:id`

- **Описание:** Удалить чат по ID.
- **Параметры URL:**
  - `id` (string, required): ID чата.
- **Ответ `200 OK`:**

  ```json
  {
    "success": true,
    "message": "Chat deleted successfully",
    "id": "chat-1"
  }
  ```

---

## 🌊 Стриминг чата (`/api/chat`)

Эндпоинт для получения потоковых ответов от AI.

### `POST /api/chat/stream`

- **Описание:** Инициирует Server-Sent Events (SSE) стрим для ответа AI на последовательность сообщений.
- **Тело запроса:**

  ```json
  {
    "chatId": "chat-1", // (string, optional)
    "model": "gpt-4", // (string, optional)
    "messages": [
      // (Message[], required)
      { "role": "user", "content": "Tell me a story" }
    ]
  }
  ```

- **Ответ `200 OK` (SSE Stream):**
  - **Content-Type:** `text/event-stream`
  - **События (Events):**
    - **`ping`**: Начальное событие для проверки соединения.

      ```
      data: {"type":"ping","timestamp":"..."}
      ```

    - **`chunk`**: Фрагмент ответа от AI.

      ```
      data: {"type":"chunk","id":"stream-id","content":"Once upon a time..."}
      ```

    - **`done`**: Сигнал об успешном завершении стрима.

      ```
      data: {"type":"done","id":"stream-id","timestamp":"..."}
      ```

    - **`error`**: Сообщение об ошибке во время стриминга.

      ```
      data: {"type":"error","id":"stream-id","error":"Something went wrong"}
      ```

  - Каждое событие отправляется в формате `data: <JSON_STRING>\n\n`.
