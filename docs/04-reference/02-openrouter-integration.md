# 🤖 OpenRouter API интеграция

**Статус:** ✅ **Готово к использованию**  
**Покрытие:** 319 моделей с ценами и характеристиками

## 🎯 Обзор системы

NEIRA Super App интегрируется с OpenRouter API для предоставления доступа к 319 AI моделям от 12+ провайдеров с автоматическим управлением ценами и категоризацией.

**Связи:** [AI и чат](/03-core-concepts/4-ai-engine/01-ai-architecture), [Системный обзор](/03-core-concepts/1-architecture-patterns/01-system-overview)

## 📊 Статистика моделей

### Общие данные

- **Всего моделей:** 319
- **Бесплатных:** 59 моделей
- **Платных:** 260 моделей
- **С поддержкой vision:** 96 моделей
- **С поддержкой tools:** 143 модели

### Ценовые категории

- **Free:** $0 (59 моделей)
- **Budget:** < $0.001/1K токенов (95 моделей)
- **Balanced:** $0.001-$0.01/1K токенов (64 модели)
- **Premium:** > $0.01/1K токенов (14 моделей)

### Топ провайдеры

1. **OpenAI:** 35 моделей
2. **Mistral AI:** 33 модели
3. **Qwen:** 29 моделей
4. **Google:** 26 моделей
5. **Anthropic:** 25 моделей

## 🏗️ Архитектура интеграции

### Основные компоненты

#### 1. OpenRouterModelService

```typescript
class OpenRouterModelService \{
  async getModels(): Promise<EnhancedOpenRouterModel[]>
  async searchModels(filters: ModelSearchFilters): Promise<ModelSearchResult>
  async calculateModelCost(modelId: string, inputTokens: number, outputTokens: number): Promise<number>
  async getRecommendedModels(criteria: RecommendationCriteria): Promise<EnhancedOpenRouterModel[]>
}
```

#### 2. ModelUtils

```typescript
class ModelUtils \{
  static categorizeModel(model: OpenRouterModel): ModelCategory
  static enhanceModel(model: OpenRouterModel): EnhancedOpenRouterModel
  static calculateCost(model: OpenRouterModel, inputTokens: number, outputTokens: number): number
  static getTopModelsByCategory(models: EnhancedOpenRouterModel[], category: ModelCategory): EnhancedOpenRouterModel[]
}
```

#### 3. Типизация

```typescript
interface OpenRouterModel \{
  id: string
  name: string
  pricing: \{
    prompt: string        // USD per token
    completion: string    // USD per token
    request: string       // USD per request
    image: string         // USD per image
  }
  context_length: number
  supported_parameters: string[]
  architecture: \{
    input_modalities: string[]
    output_modalities: string[]
    tokenizer: string
  }
}

type ModelCategory = 'free' | 'budget' | 'balanced' | 'premium' | 'vision' | 'coding'
```

## 💡 Практические примеры

### Поиск бесплатных моделей с vision

```typescript
const result = await openRouterService.searchModels(\{
  freeOnly: true,
  supportsVision: true,
  sortBy: 'context_length',
  sortOrder: 'desc'
})
// Результат: Mistral Small 3.2 24B (free), DeepSeek R1 (free)
```

### Расчет стоимости запроса

```typescript
const cost = await openRouterService.calculateModelCost(
  'openai/gpt-4o',
  1000, // input tokens
  500, // output tokens
)
// Результат: $0.0125 (1000 * $0.005 + 500 * $0.015)
```

### Получение рекомендаций по бюджету

```typescript
const models = await openRouterService.getRecommendedModels(\{
  budget: 'low',
  needsVision: true,
  taskType: 'general'
})
// Возвращает подходящие модели с объяснением выбора
```

## 🔄 Автоматическое обновление

### Скрипт синхронизации

```bash
# Обновление данных о моделях
node scripts/update-openrouter-models-full.js

# Результат: обновленный packages/shell/resources/openrouter-models.json
```

### Кэширование

- **TTL:** 24 часа
- **Формат:** JSON с полными данными моделей
- **Размер:** ~500KB (319 моделей)
- **Валидация:** автоматическая проверка структуры

## 📋 Рекомендации по использованию

### Для бесплатных пользователей

- **Лучшие модели:** Mistral Small 3.2, DeepSeek R1, Llama 3.1 8B
- **Лимиты:** 20 req/min, 50-1000/day
- **Контекст:** до 256K токенов

### Для платных пользователей

- **Budget задачи:** Llama 3.2, Mistral Nemo (< $0.001/1K)
- **Production:** GPT-4o mini, Claude Haiku ($0.001-$0.01/1K)
- **Premium:** GPT-4o, Claude Opus (> $0.01/1K)

### Vision задачи

- **Бесплатно:** Qwen2-VL-7B, Llama 3.2 Vision
- **Платно:** GPT-4 Vision, Claude 3.5 Sonnet, Gemini Pro Vision

### Coding задачи

- **Специализированные:** CodeLlama, DeepSeek Coder
- **Универсальные:** Claude 3.5 Sonnet, GPT-4o

## 🔧 Конфигурация

### API ключи

```bash
# .env
OPENROUTER_API_KEY=sk-or-v1-xxxx
```

### Лимиты и ограничения

```typescript
// Настройки по умолчанию
const DEFAULT_LIMITS = \{
  maxTokensPerRequest: 4096,
  requestsPerMinute: 60,
  maxConcurrentRequests: 5
}
```

## 🚨 Troubleshooting

### Типичные ошибки

- **402 Payment Required:** недостаточно средств
- **429 Rate Limit:** превышен лимит запросов
- **401 Unauthorized:** неверный API ключ

### Решения

```typescript
// Обработка ошибок в ModelService
try \{
  const models = await this.fetchModels()
} catch (error) \{
  if (error.status === 429) \{
    // Использовать кэшированные данные
    return this.getCachedModels()
  }
  throw error
}
```

---

**Верификация документа**

- **Дата проверки:** 2025-01-08
- **Проверил:** Doc Builder
- **Обоснование актуальности:** Создан на основе завершенного OpenRouter Enhancement Project

### OpenRouter Models API

**Endpoint**: `https://openrouter.ai/api/v1/models`

**Формат ответа**: JSON массив объектов моделей.

### OpenRouter Context Window

- Контекстное окно (context window) для моделей OpenRouter определяется параметром `max_tokens` в запросе.
- Размер контекстного окна включает в себя как токены запроса, так и токены ответа.

### **Исправление парсинга моделей OpenRouter под новый формат JSON**

#### Проблема

Файл `openrouter-models.json` изменил свой формат, перейдя от простого массива строк к объекту, который включает поля `lastUpdated`, `expiresAt`, `totalModels` и `models` (массив объектов моделей с расширенными полями, такими как `isFree`, `provider`, `costPer1KTokens`, `supportsVision`, `supportsTools`, `category`).

#### Решение

1.  **Обновлен `ModelUtils.enhanceModel()` (packages/shell/src/utils/model-utils.ts)**:
    - Добавлена поддержка готовых полей из нового JSON формата.
    - Реализован fallback на вычисление полей для обратной совместимости со старым форматом (например, `modelWithFields.isFree ?? model.id.endsWith(':free')`).
2.  **Обновлены типы `OpenRouterModel` (packages/shared-types/src/openrouter-types.ts)**:
    - Добавлены опциональные поля в интерфейс `OpenRouterModel` (`hugging_face_id?`, `isFree?`, `provider?`, `costPer1KTokens?` и т.д.) для поддержки как старого, так и нового формата.
3.  **Исправлен парсинг в `polylith-backend` (packages/polylith-backend/src/components/ai/model-registry/core.ts)**:
    - Внедрена поддержка нового формата, где модели находятся в поле `models` (`\{ models: [...] }`).
    - Обеспечена обратная совместимость со старым форматом (простой массив).
    - Используется расширенная информация (name, provider, description) для лучшей категоризации и отображения.

#### Архитектура парсинга

Новый подход включает `OpenRouterModelService.loadCacheFromFile()` для чтения всего объекта с `models[]`, `lastUpdated`, `expiresAt` и т.д., `ModelUtils.enhanceModel()` для использования готовых полей или вычисления fallback, и `polylith-backend/model-registry` для парсинга как `объект.models[]` или старого массива.

#### Результат

Система теперь поддерживает оба формата JSON, что обеспечивает гибкость и лучшую производительность за счет использования предвычисленных полей.

---

## 📝 Заметки
