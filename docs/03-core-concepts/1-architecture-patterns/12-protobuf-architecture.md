# 📦 Protobuf Architecture

**Версия:** 2025-08-05 **Статус:** ✅ Canonical

Этот документ описывает архитектуру использования Protocol Buffers (protobuf) в NEIRA Super App для типизированного межпроцессного взаимодействия и сериализации данных.

---

## 1. Философия и принципы

Protocol Buffers используются в NEIRA Super App для:

1. **Типизированное gRPC-взаимодействие** между Node.js и Python-агентом
2. **Структурированные данные** для Chrome Extensions
3. **Кроссплатформенная сериализация** с гарантией совместимости
4. **Единый источник правды** для всех схем данных

**Принцип SSOT (Single Source of Truth):** Все proto-файлы хранятся в директории `proto/` и являются единственным источником правды для генерации кода.

---

## 2. Структура проекта

```
proto/
├── agent.proto                # gRPC-сервисы для Python-агента
├── chrome-extensions.proto    # Структуры данных для Chrome Extensions
└── README.md                  # Документация по протоколам

packages/
├── shell/                     # Потребители gRPC-сервисов
├── electron-chrome-web-store/ # Потребители chrome-extensions типов
└── python_api/               # Python-реализация gRPC-сервисов
```

---

## 3. Генерация кода

### 3.1 Автоматизированная генерация

Все TypeScript-типы генерируются автоматически из `.proto` файлов с помощью скриптов:

```bash
# Генерация типов для Chrome Extensions
yarn proto:gen:chrome-extensions

# Генерация gRPC-клиентов/серверов
yarn proto:gen:agent
```

### 3.2 Chrome Extensions

**Источник:** `proto/chrome-extensions.proto`  
**Генерация:** `packages/electron-chrome-web-store/src/types/crx3-generated.ts`

```typescript
// Автоматически сгенерированные типы
export interface SignedData {
  crxId?: Uint8Array;
  publicKeyInfo?: AsymmetricKeyProof[];
  signature?: Uint8Array;
}
```

### 3.3 Python Agent gRPC

**Источник:** `proto/agent.proto`  
**Генерация:** TypeScript клиенты в `packages/shell/` и Python серверы в `python_api/`

---

## 4. Миграция к SSOT (2025-07)

### 4.1 Проблема дублирования

**Проблема:** Дублирование proto-файлов (`packages/electron-chrome-web-store/src/browser/crx3.proto` дублировал `proto/chrome-extensions.proto`), ручное редактирование сгенерированных файлов, отсутствие единого процесса генерации кода.

**Решение:**

1. Консолидированы все определения в `proto/chrome-extensions.proto`
2. Помечен исходный `crx3.proto` как устаревший
3. Добавлен скрипт автоматической генерации TypeScript кода
4. Создан переходный файл с полной реализацией
5. Обновлены импорты в зависимых модулях

### 4.2 Результаты унификации

- ✅ **Единый источник правды** для всех определений
- ✅ **Типобезопасность** через автоматически сгенерированные типы
- ✅ **Упрощение поддержки** и версионирования
- ✅ **Стандартизация процесса** генерации кода

---

## 5. Лучшие практики

### 5.1 Паттерны использования

| Контекст | Источник | Генерация | Импорт |
|----------|----------|-----------|---------|
| Chrome Extensions | `proto/chrome-extensions.proto` | `crx3-generated.ts` | `import { SignedData } from '@/types/crx3-generated'` |
| Python gRPC | `proto/agent.proto` | Авто через protoc | `import agent_pb2` |
| TypeScript gRPC | `proto/agent.proto` | Авто через @grpc/tools | `import { AgentClient } from '@/grpc/agent'` |

### 5.2 Антипаттерны (устранены)

| ❌ Плохо (до рефакторинга) | ✅ Хорошо (после SSOT) |
|----------------------------|-------------------------|
| Дублирование .proto файлов | Единый источник в `proto/` |
| Ручное редактирование сгенерированного кода | Только автоматическая генерация |
| Рассинхронизация схем | Единая схема для всех потребителей |
| Отсутствие версионирования | Централизованное управление версиями |

---

## 6. Troubleshooting

### 6.1 Частые проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| Типы не найдены | Не запущена генерация | Выполнить `yarn proto:gen:*` |
| Несовместимые типы | Старые сгенерированные файлы | Перегенерировать из актуальных .proto |
| Import ошибки | Некорректные пути | Проверить импорты в сгенерированных файлах |

### 6.2 Валидация схем

```bash
# Проверка синтаксиса .proto файлов
protoc --proto_path=proto --lint_out=. proto/*.proto

# Проверка совместимости изменений
buf breaking --against='.git#branch=main'
```

---

## 7. Revision History

| Дата | Версия | Изменение | ID Знания |
|------|--------|-----------|-----------|
| 2025-08-05 | 1.0 | Создание канонического документа на основе SSOT-миграции | PROTO:SSOT_CONSOLIDATION |

---

## 8. Связанные документы

- [Manager Architecture](/core-concepts/architecture-patterns/manager-architecture) — Использование gRPC в менеджерах
- [Python Integration](/core-concepts/ai-engine/python-integration) — gRPC-взаимодействие с Python
- [Chrome Extensions](/reference/chrome-extensions) — Использование protobuf-структур
