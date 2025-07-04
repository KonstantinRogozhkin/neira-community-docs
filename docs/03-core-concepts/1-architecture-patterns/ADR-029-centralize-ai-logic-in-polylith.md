---
id: adr-029-centralize-ai-logic-in-polylith
title: ADR-029 Централизация AI-логики в polylith-backend
sidebar_label: ADR-029 AI Logic Centralization
---

# ADR-029: Централизация AI-логики в `polylith-backend`

## 1. Контекст

Изначально логика генерации AI-ответов и исполнения инструментов (tool calls) была частично дублирована между пакетами `shell` и `polylith-backend`. `AIGenerationService` в `shell` отвечал за прямые вызовы к AI-провайдерам, в то время как `polylith-backend` также развивал свою логику генерации. Это приводило к дублированию кода, усложняло поддержку и масштабирование, а также потенциально могло вызывать расхождения в поведении.

## 2. Решение

Принять `polylith-backend` как единственный источник истины (Single Source of Truth, SSOT) для всей логики генерации AI-ответов, включая обработку `tool_calls`. Пакет `shell` должен стать тонким фасадом, который делегирует запросы на генерацию в `polylith-backend` и предоставляет ему необходимый `ToolExecutor` для выполнения инструментальных вызовов.

### 2.1. Изменения в `polylith-backend`

- **Интерфейс `ToolExecutor`**: Добавлен опциональный интерфейс `ToolExecutor { execute(toolCalls: any[]): Promise<any[]> }` в `packages/polylith-backend/src/components/ai/text-generation/interface.ts`.
- **Интеграция в `TextGenerationComponent`**: В `packages/polylith-backend/src/components/ai/text-generation/index.ts` (и `core.ts`) логика генерации обновлена для приема `toolExecutor` в `GenerationConfig`. Если провайдер возвращает `tool_calls` и `toolExecutor` передан, `toolExecutor.execute()` будет вызван автоматически. Это касается как OpenAI, так и OpenRouter провайдеров.

### 2.2. Изменения в `shell`

- **`ToolExecutorAdapter`**: Создан новый адаптер `packages/shell/src/main/managers/services/ToolExecutorAdapter.ts`, который реализует интерфейс `ToolExecutor` и проксирует вызовы `execute` в существующий `TaskExecutionService`.
- **`APIManager`**:
  - Удалена прямая зависимость от `AIGenerationService`.
  - Вся логика генерации теперь делегируется `backendAdapters.textGeneration.generateText`, которому передается экземпляр `ToolExecutorAdapter`.
  - Введена переменная окружения `USE_POLYLITH_AI_PIPELINE`, которая при значении `true` активирует этот новый централизованный поток генерации AI. Это позволяет безопасно переключаться между старой и новой логикой во время миграции и тестирования.

## 3. Последствия

### 3.1. Положительные

- **Устранение дублирования**: Единый источник логики генерации AI-ответов.
- **Упрощение архитектуры**: `shell` становится более "тонким" и фокусируется на системных задачах, а бизнес-логика AI перемещается в `polylith-backend`.
- **Улучшение тестирования**: Логика `text-generation` в `polylith-backend` становится легче тестируемой в изоляции.
- **Масштабируемость**: Проще добавлять новые AI-провайдеры и управлять их поведением в одном месте.

### 3.2. Отрицательные

- **Зависимость `polylith-backend` от `shell`**: Введение интерфейса `ToolExecutor` в `polylith-backend` создает слабую зависимость от `shell`-слоя (поскольку `ToolExecutor` реализуется в `shell`). Однако это интерфейсная зависимость, которая минимизирует жесткую связь и сохраняет чистоту `polylith-backend` от Electron-специфичной логики.

## 4. Решение и статус

Принято. Внедрено и протестировано. `USE_POLYLITH_AI_PIPELINE` позволяет контролировать активацию новой логики. После полного перехода старый код `AIGenerationService` будет удален.

## 5. Дальнейшие шаги

1. Полное удаление `AIGenerationService.ts` и всех его ссылок после подтверждения стабильности.
2. Обновление других частей документации, касающихся AI-пайплайна.
3. Развитие `text-generation` компонента в `polylith-backend` как основного места для всех AI-операций.
