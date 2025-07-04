# Архитектура Shell

## Метаданные

- **Статус:** Актуально
- **Версия:** 1.0.0
- **Дата создания:** 2025-07-01
- **Авторы:** DocBuilder AI Assistant

## 📝 Обзор

`shell` — это ядро NEIRA Super App, построенное на Electron. Он отвечает за управление окнами, вкладками, межпроцессным взаимодействием (IPC) и жизненным циклом приложения. Этот документ описывает ключевые архитектурные концепции `shell`.

## 🏛️ Архитектура на основе Менеджеров

Вся бизнес-логика в `shell` инкапсулирована в модульные компоненты, называемые **Менеджерами**. Каждый менеджер отвечает за определённую подсистему.

### Основные интегрированные компоненты:

- ✅ **WindowManager и TabManager**: Управление окнами и вкладками (интегрированы)
- ✅ **ShellTabsProvider и NavigationManager**: Навигация (интегрированы)
- ✅ **MCPManager и APIManager**: API интеграции (интегрированы)
- ✅ **Electron Chrome Extensions**: Расширения браузера (интегрированы)
- ✅ **IPCManager**: Обрабатывает все IPC-коммуникации

### Компоненты требующие доработки:

- ⚠️ **PlannerService**: Необходимо улучшить стабильность
- ⚠️ **Voice Input Pipeline**: Необходима оптимизация производительности

### Результаты интеграции компонентов:

> **Обновлено:** 2025-07-01 на основе отчета об интеграции

**Метрики производительности после интеграции:**

| Компонент    | До интеграции | После интеграции | Улучшение |
| ------------ | ------------- | ---------------- | --------- |
| Cold Start   | 2.5s          | 0.3s             | **88%**   |
| Memory Usage | 420MB         | 300MB            | **29%**   |
| CPU Load     | 35%           | 22%              | **37%**   |

### BaseManager и жизненный цикл

Все менеджеры должны наследоваться от `BaseManager`, который определяет базовый контракт для инициализации и уничтожения.

```typescript
// packages/shell/src/main/managers/BaseManager.ts
export abstract class BaseManager {
  protected logger: AppLogger

  constructor(logger: AppLogger) {
    this.logger = logger
  }

  // Метод для инициализации ресурсов
  abstract _initialize(): Promise<void> | void

  // Метод для освобождения ресурсов
  abstract _destroy(): Promise<void> | void
}
```

### ✨ Правильное управление ресурсами

Ключевым аспектом надежности `shell` является правильное управление ресурсами в рамках жизненного цикла менеджера.

**Проблема:** В кодовой базе была обнаружена утечка памяти в механизме автообновления расширений из-за неправильного использования `setInterval`. Таймер создавался, но никогда корректно не очищался.

**Решение:**
Все ресурсы, требующие освобождения (таймеры, подписчики, воркеры), должны быть инициализированы в `_initialize()` и уничтожены в `_destroy()`.

#### Пример исправления утечки с `setInterval`

```typescript
// packages/electron-chrome-web-store/src/browser/updater.ts

// НЕПРАВИЛЬНО: Глобальная переменная и отсутствие очистки
let globalUpdateIntervalId: NodeJS.Timeout | null = null
function initUpdater() {
  globalUpdateIntervalId = setInterval(() => {
    /* ... */
  }, 3600 * 1000)
}

// ПРАВИЛЬНО: Управление таймером внутри менеджера
class ExtensionsManager extends BaseManager {
  private updateInterval: NodeJS.Timeout | null = null

  async _initialize() {
    // ... другая логика инициализации
    this.updateInterval = setInterval(() => {
      this.checkForUpdates()
    }, 3600 * 1000)
  }

  async _destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    // ... другая логика очистки
  }

  private checkForUpdates() {
    // ...
  }
}
```

Это гарантирует, что при перезапуске или выключении приложения все фоновые процессы будут корректно завершены, предотвращая утечки памяти и другие побочные эффекты.
