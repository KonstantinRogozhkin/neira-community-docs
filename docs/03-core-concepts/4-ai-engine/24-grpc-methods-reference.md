---
id: 24-grpc-methods-reference
title: 24. gRPC Methods Reference
description: Справочник методов gRPC API с примерами.
---

**Версия:** 1.0 **Статус:** ✅ Действующий стандарт

## ⚡ Обзор

Этот документ — справочник по gRPC API для взаимодействия с Python-агентами.

## 1. Proto-контракты

Все контракты определены в файле `packages/proto/agent.proto`. Здесь приведены только ключевые для понимания структуры.

- **`PromptRequest`**: Используется для `ProcessPrompt` и `ProcessStreamingPrompt`. Содержит `prompt`, `model`, `parameters`, `context` и др.
- **`PromptResponse`**: Ответ для `ProcessPrompt`. Содержит `response`, `success`, `error`.
- **`PromptStreamResponse`**: Потоковый ответ для `ProcessStreamingPrompt`. Содержит `chunk`, `is_final`.
- **`ContextRequest`**: Используется для `SetContext`. Содержит `session_id`, `context`.
- **`FileRequest`**: Используется для `ProcessFile`. Содержит `file_path`, `operation`, `content`.
- **`DesktopClickRequest`**, **`DesktopTypeRequest`**: Запросы для управления рабочим столом.
- **`BrowserNavigateRequest`**, **`BrowserClickRequest`**, **`BrowserGetHTMLRequest`**: Запросы для управления браузером.

## 2. Описание методов

| Метод | Описание | Запрос | Ответ |
| :--- | :--- | :--- | :--- |
| `HealthCheck` | Проверка здоровья сервиса | `HealthCheckRequest` | `HealthCheckResponse` |
| `ProcessPrompt` | Обработка текстового промпта | `PromptRequest` | `PromptResponse` |
| `ProcessStreamingPrompt` | Потоковая обработка промпта | `PromptRequest` | `stream PromptStreamResponse` |
| `SetContext` | Установка контекста для агента | `ContextRequest` | `ContextResponse` |
| `GetContext` | Получение текущего контекста | `GetContextRequest` | `ContextResponse` |
| `ProcessFile` | Обработка файла | `FileRequest` | `FileResponse` |
| `ListFiles` | Получение списка файлов | `ListFilesRequest` | `ListFilesResponse` |
| `CallCustomFunction` | Вызов кастомной функции | `CustomFunctionRequest` | `CustomFunctionResponse` |
| `DesktopClick` | Клик мышью на рабочем столе | `DesktopClickRequest` | `DesktopClickResponse` |
| `DesktopType` | Ввод текста на рабочем столе | `DesktopTypeRequest` | `DesktopTypeResponse` |
| `BrowserNavigate` | Навигация в браузере | `BrowserNavigateRequest` | `BrowserNavigateResponse` |
| `BrowserClick` | Клик по элементу в браузере | `BrowserClickRequest` | `BrowserClickResponse` |
| `BrowserGetHTML` | Получение HTML страницы | `BrowserGetHTMLRequest` | `BrowserGetHTMLResponse` |

### 2.1. Обработка промптов

- **`ProcessPrompt`**: Отправляет промпт и получает один полный ответ.
- **`ProcessStreamingPrompt`**: Отправляет промпт и получает ответ по частям (stream).

**Пример использования `ProcessStreamingPrompt`:**

```typescript
const stream = pythonAPIManager.processStreamingPrompt({ prompt: "..." });

stream.on('data', (chunk) => {
  if (chunk.is_final) {
    console.log('Stream completed');
  } else {
    console.log('Received chunk:', chunk.chunk);
  }
});
```

### 2.2. Управление рабочим столом и браузером

Эти методы позволяют агенту взаимодействовать с рабочим столом и браузером.

- **`DesktopClick(x, y)`**: Клик мышью по координатам.
- **`DesktopType("text")`**: Ввод текста.
- **`BrowserNavigate("url")`**: Переход на страницу в браузере.
- **`BrowserClick("selector")`**: Клик по CSS-селектору на странице.
- **`BrowserGetHTML()`**: Получение HTML-кода текущей страницы.

---

**Верификация документа**

- **Дата создания:** 2025-06-30
- **Создал:** DocBuilder AI Assistant
- **Источник:** Анализ `proto/agent.proto`
- **Проверка актуальности:** Документ отражает текущие proto-определения на 30.06.2025
