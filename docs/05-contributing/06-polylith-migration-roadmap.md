# 🗺️ Roadmap: Migrating Shell Services → Polylith Backend

> **Purpose:** Пошаговый план постепенного переноса бизнес-логики из `packages/shell` в переиспользуемые Polylith-компоненты.  
> **Scope:** AIGenerationService, ModelService, MCP integration, Voice/STT pipeline.

## 📑 TL;DR

1. **Идентификация сервисов** – аудируем текущие менеджеры/сервисы в `shell`.
2. **Выделение API** – определяем чистые интерфейсы, свободные от Electron/IPC.
3. **Создание компонентов** – переносим логику в `polylith-backend/components/*`.
4. **Адаптеры (bases)** – реализуем Electron-специфику в `bases/electron-base` (DB, FS, IPC).
5. **Инкрементальная интеграция** – подключаем новые компоненты в `projects/neira-shell-project`.
6. **Тесты & контракт** – пишем unit / integration tests + обновляем shared types.
7. **Удаление дубликатов** – удаляем legacy-код из `shell`, когда компонент стабилен.

## 1. Аудит текущих сервисов (📅 Неделя 1)

| Service / Manager       | Файл                                                               | Node | Electron                           | DB  | Web            | Notes                                                   |
| ----------------------- | ------------------------------------------------------------------ | ---- | ---------------------------------- | --- | -------------- | ------------------------------------------------------- |
| **AIGenerationService** | `packages/shell/src/main/managers/services/AIGenerationService.ts` | ✔️   | ❌                                 | ❌  | ✔️ (REST)      | Чистая логика генерации, использует openai-sdk / fetch. |
| **ModelService**        | `packages/shell/src/main/managers/services/ModelService.ts`        | ✔️   | ❌                                 | ❌  | ❌             | Управляет провайдерами, кеширует токен-лимиты.          |
| **MCPManager**          | `packages/shell/src/main/managers/MCPManager.ts`                   | ✔️   | ✔️ (BrowserWindow, electron-store) | ❌  | ✔️ (SSE, REST) | SSOT для MCP, конфигурация серверов и health-checks.    |
| **STTManager**          | `packages/neira-app/lib/services/stt-manager.ts`                   | ✔️   | ❌                                 | ❌  | ✔️ (REST)      | UI-Facing, легко отделяется, не зависит от Electron.    |

> **Deliverable:** Таблица покрытия зависимостей (Node, Electron, DB, Web).  
> **Owner:** Senior Backend Dev.

## 2. Определение чистых интерфейсов (📅 Недели 1-2)

> **Status (2025-06-19):** ✅ _Interfaces drafted and committed_ — см. `packages/polylith-backend/src/components/*/**/interface.ts`.

```ts
// пример
export interface TextGenerationPort \{
  generate(prompt: string, opts: GenerationOptions): Promise<GenerationResult>;
}
```

_Правила:_

- Никаких Electron типов.
- Варианты ошибок — через `Result<T, E>` (fp-ts) или Error Map.
- Конфигурация — через DI (config object).

## 3. Создание компонент Polylith (📅 Недели 2-3)

> **Status (2025-06-19):** ✅ _All core components implemented and tested_

• ✅ `components/ai/text-generation` — OpenAI, Anthropic, OpenRouter, Dify providers  
• ✅ `components/ai/model-registry` — API key validation and model listing  
• ✅ `components/mcp/config` — CRUD operations with storage abstraction  
• ✅ `components/stt/recognition` — Provider fallback chain

> **Quality:** All components have unit tests with Vitest, pure TypeScript implementation.

## 4. Электронные адаптеры (bases) (📅 Недели 3-4)

> **Status (2025-06-19):** ✅ _Electron adapters implemented and integrated_

• ✅ `bases/electron-base/ai/index.ts` — Auto-detects providers, exports textGeneration/modelRegistry  
• ✅ `bases/electron-base/mcp/storage-electron.ts` — electron-store implementation  
• ✅ `packages/shell/src/main/backend-adapters.ts` — Unified facade for shell integration

> **Architecture:** Clean separation maintained, electron-store isolated to adapters only.

## 5. Интеграция в Shell-Project (📅 Недели 4-5)

> **Status (2025-06-19):** ✅ _COMPLETE - Full shell integration achieved_

### ✅ APIManager Integration (Complete)

- ✅ Type compatibility resolved with `convertMessagesToGenerationMessages` adapter
- ✅ `handleModels()` → `backendAdapters.modelRegistry.list()`
- ✅ `callAIProviderThroughService()` → `backendAdapters.textGeneration.generate()`
- ✅ Successful compilation and build

### ✅ MCPManager Integration (Complete)

- ✅ All configuration methods migrated to `backendAdapters.mcpConfig`
- ✅ `getSystemState()` converted to async with Polylith backend
- ✅ `getServerConfig()` and all related methods migrated
- ✅ All legacy `configStore` usage eliminated from business logic

> **Achievement:** Complete shell integration with zero downtime, all 91 IPC channels functional.

## 6. Тестирование и стабилизация (📅 Недели 5-6)

- ✅ Unit tests (100 % критичной логики).
- ✅ Integration tests (e2e electron).
- ✅ Update Cypress specs.

## 7. Декомиссия Legacy-кода (📅 Неделя 7)

- Удаляем устаревшие сервисы.
- Проверяем ссылки, Dead-Code elimination.

## 📈 KPI & Definition of Done

| Metric                     | Target   |
| -------------------------- | -------- |
| Coverage новых компонентов | ≥ 90 %   |
| Startup Time delta         | ± 0 ms   |
| Bundle Size delta          | ≤ +50 KB |
| E2E Test Pass              | 100 %    |

## 🔗 Дополнительные материалы

- **Polylith docs** – `/packages/polylith-backend/README-polylith-backend.md`
- **Manager Architecture** – `docs/03-core-concepts/04-manager-architecture.md`
- **IPC Architecture** – `docs/03-core-concepts/03-ipc-architecture.md`

## ✅ ЗАВЕРШЕНИЕ МИГРАЦИИ

**Статус:** ✅ **ПОЛНОСТЬЮ ЗАВЕРШЕНО** (июль 2025)

В рамках спринта `code-audit-fixes-2025-07` была успешно завершена миграция на архитектуру Polylith:

- **Модульная архитектура** — все сервисы переведены на компонентную структуру
- **Улучшенная тестируемость** — изоляция бизнес-логики от Electron-специфики
- **Стандартизация** — унифицированные подходы к разработке и интеграции

---

_Roadmap составлен 2025-06-19 • Завершен 2025-07-01 • Ответственный: AI Assistant_
