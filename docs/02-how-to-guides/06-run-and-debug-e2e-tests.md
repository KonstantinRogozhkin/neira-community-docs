# 🧪 Запуск и отладка E2E тестов

**Статус:** ✅ **Действующий гайд**  
**Применимо к:** NEIRA Super App v2+

## 🎯 Краткий обзор

E2E тесты в NEIRA Super App используют Playwright для автоматизации пользовательских сценариев. Система поддерживает тестирование на реальном Electron приложении с полным стеком: Shell → neira-app → MCP агенты.

**Связи:** [Системный обзор](/core-concepts/architecture-patterns/system-overview), [Troubleshooting](/how-to-guides/troubleshooting-common-issues)

## ⚡ Быстрый старт

### Запуск MVP тестов

```bash
# Запуск базового smoke теста
npx playwright test tests/3_smoke/comprehensive-health.spec.ts

# Запуск MVP Demo Scenario
npx playwright test tests/2_e2e/agent-mom-mvp.spec.ts
```

### Запуск всех E2E тестов

```bash
# Полный прогон (займет 10-15 минут)
yarn test:e2e

# Быстрая проверка основных сценариев
npx playwright test tests/2_e2e/ --grep="core"
```

## 📊 Структура тестов

### Категории тестов (41 активный тест)

| Категория         | Файлы                                   | Описание                              |
| ----------------- | --------------------------------------- | ------------------------------------- |
| **Smoke Tests**   | `tests/3_smoke/`                        | Базовая проверка запуска (3 теста)    |
| **E2E Scenarios** | `tests/2_e2e/`                          | Пользовательские сценарии (14 тестов) |
| **Integration**   | `tests/1_integration/`                  | Компонентная интеграция (26 тестов)   |
| **Visual Tests**  | `tests/2_e2e/visual-regression.spec.ts` | Визуальная регрессия (8 тестов)       |

### Ключевые тестовые сценарии

```gherkin
# MVP Demo Scenario (КРИТИЧЕСКИЙ)
GIVEN пользователь открывает NEIRA Super App
WHEN выбирает агента "Мама"
AND вводит цель "найти курс BTC"
WHEN запускает агента
THEN агент использует browser.navigate
AND выполняет поиск
AND возвращает результат с курсом
```

## 🔧 Настройка тестового окружения

### Требования

- Node.js 18+
- Playwright браузеры установлены
- Electron app собран и готов к запуску

### Установка зависимостей

```bash
# Установка Playwright
npx playwright install

# Проверка готовности
npx playwright --version
```

### Конфигурация тестового сервера

Тесты используют специальный тестовый режим приложения:

```typescript
// playwright.config.ts
export default defineConfig(\{
  webServer: \{
    command: 'yarn start:test-server',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  }
})
```

## 🐛 Отладка тестов

### Режим отладки

```bash
# Запуск с интерактивным браузером
npx playwright test --headed

# Пошаговая отладка конкретного теста
npx playwright test tests/2_e2e/agent-mom-mvp.spec.ts --debug

# Генерация кода теста
npx playwright codegen
```

### Проверка селекторов

```bash
# Инспектор селекторов
npx playwright test --ui

# Проверка data-testid в браузере
# DevTools Console:
document.querySelector('[data-testid="chat-input"]')
```

### Логирование

```typescript
// Включение детального логирования в тестах
test.beforeEach(async (\{ page }) => \{
  page.on('console', msg => console.log('BROWSER:', msg.text()))
  page.on('pageerror', err => console.error('PAGE ERROR:', err))
})
```

## 🚨 Решение типичных проблем

### Проблема: WebServer не запускается

**Симптомы:** `Error: server did not start at http://localhost:3000`

**Решение:**

```bash
# 1. Убедиться что порт свободен
lsof -ti:3000 | xargs kill -9

# 2. Запуск тестового сервера вручную
yarn start:test-server

# 3. Проверка в браузере
open http://localhost:3000
```

### Проблема: Нестабильные селекторы

**Симптомы:** Тесты падают на изменениях UI

**Решение:**

```typescript
// ❌ Нестабильно
await page.click('.MuiButton-root:nth-child(2)')

// ✅ Стабильно
await page.click('[data-testid="send-message-button"]')
```

### Проблема: gRPC ошибки в тестах

**Симптомы:** `Error: gRPC server connection failed`

**Решение:**

```bash
# Отключить gRPC в тестовом режиме
TEST_MODE=true yarn start:test-server
```

## 📋 Добавление новых тестов

### Структура нового теста

```typescript
import \{ test, expect } from '@playwright/test'

test.describe('New Feature Tests', () => \{
  test.beforeEach(async (\{ page }) => \{
    // Базовая настройка
    await page.goto('/')
    await expect(page).toHaveTitle(/NEIRA Super App/)
  })

  test('should test new feature', async (\{ page }) => \{
    // 1. Arrange - подготовка данных
    await page.fill('[data-testid="input-field"]', 'test data')

    // 2. Act - выполнение действия
    await page.click('[data-testid="submit-button"]')

    // 3. Assert - проверка результата
    await expect(page.locator('[data-testid="result"]')).toContainText('expected result')
  })
})
```

### Лучшие практики

- Используйте `data-testid` вместо CSS классов
- Группируйте связанные тесты в `describe` блоки
- Добавляйте ожидания для async операций
- Очищайте данные после каждого теста

## 🎯 Критерии качества

### Целевые метрики

- **Стабильность:** &gt;95% pass rate
- **Скорость:** Smoke тесты менее 2 минут
- **Покрытие:** Все критические пути покрыты

### Обязательные проверки

- [ ] Smoke тест проходит локально
- [ ] MVP Demo Scenario работает
- [ ] Нет падений на gRPC ошибках
- [ ] Все селекторы используют data-testid

## 🩹 Критические фиксы E2E (январь 2025)

В ходе стабилизации тестовой матрицы были устранены первые P0-проблемы:

| Категория             | Что сделано                                                                 | Результат              |
| --------------------- | --------------------------------------------------------------------------- | ---------------------- |
| **API Channels**      | Исправлен формат ответа в тесте `api-models` (`Array.isArray(result.data)`) | ✅ Тест проходит       |
| **Chat UI селекторы** | Добавлены `data-testid` (`chat-interface`, `message-input`, `message-list`) | ✅ Селекторы стабильны |

Оставшиеся задачи:

- Добавить селекторы для AI-Tools (`data-role="assistant"`, etc.)
- Метки агентов (`data-testid="agent-mom"`) и другие
- Исследовать причину `Target page, context or browser has been closed`

> Подробный отчёт: `docs/archive/2025-07/e2e-tests-critical-fixes-initial.md`

---

**Верификация документа**

- **Дата проверки:** 2025-01-08
- **Проверил:** Doc Builder
- **Обоснование актуальности:** Создан на основе E2E_CRISIS_REPORT.md и актуального состояния тестов
