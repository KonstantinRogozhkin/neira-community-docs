# 📂 File Watching Architecture

**Версия:** 2025-07-01 **Статус:** ✅ Canonical

Архитектура отслеживания файловых изменений в NEIRA Super App для интеграции с VS Code и файловых операций.

---

## 1. Философия и принципы

Файловое отслеживание построено на принципах:

1. **Кроссплатформенность** — единый API для всех ОС
2. **Производительность** — оптимальный выбор между нативными событиями и polling
3. **Надежность** — graceful fallback при проблемах с нативными API
4. **Ресурсоэффективность** — минимальное потребление CPU и памяти

**Основа:** Библиотека `chokidar` как универсальная абстракция.

---

## 2. Архитектура компонентов

```mermaid
graph TD
    subgraph "Shell (Main Process)"
        CM[CodeOSSManager]
        FW[File Watcher]
    end
    
    subgraph "Chokidar Backends"
        FS[fsevents (macOS)]
        RW[ReadDirectoryChanges (Windows)]
        IN[inotify (Linux)]
        PL[Polling (Universal)]
    end
    
    subgraph "VS Code Integration"
        VSC[VS Code Instance]
        EXT[File Explorer]
    end
    
    CM --> FW
    FW --> FS
    FW --> RW
    FW --> IN
    FW --> PL
    FW --> VSC
    VSC --> EXT
    
    style FS fill:#e1f5fe
    style PL fill:#f3e5f5
    style FW fill:#e8f5e8
```

---

## 3. Ключевые компоненты

### 3.1 CodeOSSManager Integration

File Watcher реализован в `CodeOSSManager` с конфигурацией:

```typescript
// Базовая конфигурация
const watcherConfig = {
  useFsEvents: false,    // Отключено для стабильности на macOS
  usePolling: false,     // Автоматический fallback
  ignored: ['**/node_modules/**', '**/.git/**'],
  persistent: true,
  awaitWriteFinish: { stabilityThreshold: 100 }
}
```

### 3.2 Обработка событий

- **add** — новый файл создан
- **change** — файл изменен
- **unlink** — файл удален
- **error** — ошибка watcher (с автоматическим восстановлением)

---

## 4. Решенные проблемы

### 4.1 Ошибка fsevents SinceNow (FSEVENTS:SINCENOW_ERROR_FIX)

**Проблема:** Ошибка `Cannot read properties of undefined (reading 'SinceNow')` на macOS.

**Решение:** Отключение fsevents через `useFsEvents: false` с fallback на polling.

**Результат:** Стабильная работа на всех платформах.

### 4.2 Оптимизация производительности

- Исключение служебных директорий (`node_modules`, `.git`)
- Настройка интервалов polling
- Debouncing для избежания дублирования событий

---

## 5. Платформо-специфичные особенности

| Платформа | Механизм | Особенности |
|-----------|----------|-------------|
| **macOS** | fsevents → polling | Отключен fsevents из-за ошибок SinceNow |
| **Windows** | ReadDirectoryChanges | Нативная поддержка, стабильная работа |
| **Linux** | inotify | Системные лимиты на количество файлов |

---

## 6. Паттерны использования

### 6.1 Правильные паттерны

| Сценарий | Подход |
|----------|--------|
| Отслеживание проекта | Исключение служебных папок |
| Обработка ошибок | Graceful fallback на polling |
| Производительность | Настройка интервалов |
| Интеграция с IDE | Уведомление через события |

### 6.2 Troubleshooting

| Проблема | Решение |
|----------|---------|
| SinceNow ошибка | `useFsEvents: false` |
| Высокое потребление CPU | Добавить в `ignored` служебные папки |
| Пропуск изменений | Настроить `awaitWriteFinish` |
| Docker | Установить `usePolling: true` |

---

## 7. Интеграция с VS Code

File Watcher синхронизирует состояние с VS Code:

- **Автоматическое обновление** файлового дерева
- **Отслеживание изменений** в активных редакторах  
- **Управление конфликтами** одновременных изменений

---

## 8. Связанные документы

- [File Watching Implementation](/03-core-concepts/2-shell-core/09-file-watching-implementation) — Детальная реализация

- [CodeOSS Integration](/04-reference/03-code-editor) — Интеграция с VS Code
- [Manager Architecture](/03-core-concepts/1-architecture-patterns/04-manager-architecture) — Роль CodeOSSManager

---

**Revision History**

| Дата | Версия | Изменение |
|------|--------|-----------|
| 2025-07-01 | 2.0 | Рефакторинг документа, разделение на модули |
| 2025-08-05 | 1.0 | Создание канонического документа |
