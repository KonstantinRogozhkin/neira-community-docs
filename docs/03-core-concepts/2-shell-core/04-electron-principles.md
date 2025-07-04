# ⚡ Принципы Electron

Этот документ собирает ключевые best-practices и архитектурные принципы, применяемые к процессам **Main** и **Renderer** в NEIRA Super App.

---

## 1. Изоляция и безопасность

- **Строгая изоляция контекста:** no `remote`, no `nodeIntegration` ✅
- **Web Security:** `true` по умолчанию, `sandbox` — `true` для всех WebContents, кроме utility-processes
- **IPC-first:** `ipcMain/Renderer` вместо `executeJavaScript` ❌

---

## 2. Стабильность и обработка ошибок

### 2.1 Глобальная обработка ошибок (STABILITY:GLOBAL_ERROR_HANDLING)

**Проблема:** UnhandledPromiseRejection крэшили main-процесс, двойной запуск Python API, потеря истории чатов.

**Решение:**

- Глобальная обработка ошибок `process.on('unhandledRejection')` в main-процессе
- Фикс инициализации менеджеров для предотвращения двойного запуска
- Единый источник IPC-каналов через `allowed-channels.json`

**Результат:** Стабильная инициализация приложения, сохранение истории чатов, корректная работа Python-бэкенда.

```typescript
// packages/shell/src/main/index.ts
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', reason)
  // Логирование stack trace для диагностики
})
```

### 2.2 Критические исправления стабильности ядра (CORE:STABILITY_FIXES)

**Комплексная стабилизация основных компонентов системы:**

#### Python Agent стабилизация

- **Таймауты**: Увеличение таймаутов в `performHealthCheck` с экспоненциальной задержкой
- **Надежность**: Более устойчивая логика повторных попыток для предотвращения сбоев

#### Улучшенная диагностика ошибок

- **Детальное логирование**: Модификация обработчика `unhandledRejection` для логирования полного `reason.stack`
- **Контекст ошибок**: Расширенная информация для диагностики проблем

#### TabManager защита от ошибок

- **Безопасное закрытие**: Проверка `!tabData.view.webContents.isDestroyed()` перед `closeTab()`
- **Предотвращение крашей**: Защита от попыток закрытия уже уничтоженных вкладок при выходе

#### MCP инструменты надежность

- **IPC отладка**: Исправление канала `mcp:get-tools` в `MCPChannels.ts` и `MCPManager.ts`
- **Корректный парсинг**: Валидация формирования запросов и обработки ответов

**Результат:** Устранение критических сбоев, предсказуемая работа всех основных сервисов и значительно улучшенная диагностика проблем.

---

## 3. Архитектурные принципы

- **Одно ответственное место загрузки UI:** `WindowManager`
- **Менеджеры для бизнес-логики:** Вся логика инкапсулируется в специализированных менеджерах
- **Единый источник правды:** Критические конфигурации имеют единую точку определения
