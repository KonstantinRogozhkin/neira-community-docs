# 📦 Управление зависимостями

**Версия:** 2025-08-05 **Статус:** ✅ Canonical

Этот документ описывает лучшие практики управления зависимостями в NEIRA Super App.

---

## 1. Философия

- **Контролируемые обновления:** Мажорные версии обновляются только вручную после ревью.
- **Минимизация:** Используются только строго необходимые пакеты.
- **Регулярная очистка:** Неиспользуемые зависимости удаляются.
- **Фиксация версий:** Критические версии фиксируются для стабильности.

---

## 2. Основные инструменты

- **Установка:** `yarn install`
- **Добавление:** `yarn workspace @neira/shell add <package>`
- **Проверка неиспользуемых:** `yarn depcheck`
- **Аудит безопасности:** `yarn audit`

Для автоматизации проверок в CI используются скрипты `lint:deps` и `deps:check`.

---

## 3. Решенные проблемы

### 3.1 Процесс регулярной очистки (DEPENDENCIES:MAINTENANCE_PROCESS)

**Проблема:** Накопление неиспользуемых зависимостей.
**Решение:** Внедрен процесс ежемесячного аудита, автоматические проверки `yarn depcheck` в CI и контролируемые обновления через Renovate.
**Результат:** `package.json` очищены, процесс автоматизирован.

### 3.2 Исправление ESM совместимости (ESM:PBF_COMPATIBILITY)

**Проблема:** Ошибка `ERR_REQUIRE_ESM` из-за `pbf@4+` (ESM-only) в CommonJS окружении.
**Решение:** Версия `pbf` была зафиксирована на `3.2.1` через `resolutions` в `package.json`.
**Результат:** Стабильная сборка, предотвращение будущих ESM-конфликтов.

```json
// package.json
"resolutions": {
  "pbf": "^3.2.1"
}
```

---

## 4. Обработка конфликтов зависимостей

### 4.1 ESM vs CommonJS

**Стратегии решения:**

1. **Фиксация версии** — используйте последнюю CommonJS версию
2. **Замена библиотеки** — найдите CommonJS альтернативу
3. **Собственная реализация** — для простых случаев
4. **Dynamic imports** — для ESM-only модулей

### 4.2 Peer Dependencies

Конфликты `peerDependencies` решаются путем приведения версий в разных `package.json` к общему знаменателю.

---

## 5. CI/CD интеграция

### 5.1 GitHub Actions для проверки зависимостей

Workflow `.github/workflows/dependencies.yml` автоматически выполняет `yarn deps:check` и `yarn audit` для каждого pull request и еженедельно по расписанию.

### 5.2 Renovate конфигурация

Renovate используется для автоматического создания PR на обновление зависимостей. Конфигурация находится в файле `renovate.json`.

---

## 6. Troubleshooting

### 6.1 Частые проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| ESM import errors | Конфликт ESM/CommonJS | Фиксация версии или замена |
| Peer dependency warnings | Несоответствие версий | Обновление или resolutions |
| Duplicate packages | Разные версии в workspace | yarn dedupe |
| Security vulnerabilities | Устаревшие зависимости | yarn audit fix |

### 6.2 Диагностические команды

```bash
# Анализ дерева зависимостей
yarn why package-name

# Поиск дубликатов
yarn list --pattern "package-name"

# Проверка целостности
yarn check

# Очистка кэша
yarn cache clean

# Пересоздание lock файла
rm yarn.lock && yarn install
```

---

## 7. Лучшие практики

### 7.1 Правила добавления зависимостей

- **Оцените необходимость** — можно ли обойтись без новой зависимости?
- **Проверьте размер** — влияние на bundle size
- **Проверьте безопасность** — есть ли известные уязвимости?
- **Проверьте поддержку** — активно ли развивается проект?
- **Проверьте лицензию** — совместима ли с проектом?

### 7.2 Мониторинг зависимостей

```typescript
// Скрипт для анализа размера зависимостей
const bundleAnalyzer = require('webpack-bundle-analyzer')

async function analyzeDependencies() {
  const report = await bundleAnalyzer.analyzeBundle('./dist/bundle.js')
  
  // Находим самые тяжелые зависимости
  const heavyDependencies = report.modules
    .filter(module => module.size > 100000) // > 100KB
    .sort((a, b) => b.size - a.size)
  
  console.log('Heavy dependencies:', heavyDependencies)
}
```

---

## 8. Revision History

| Дата | Версия | Изменение | ID Знания |
|------|--------|-----------|-----------|
| 2025-08-05 | 1.0 | Создание документа, интеграция практик очистки и ESM решений | DEPS:CLEANUP_JANUARY_2025, FIX:ERR_REQUIRE_ESM_PBF |

---

## 9. Связанные документы

- [Repository Management](/05-contributing/06-repository-management) — Управление репозиторием
- [Code Quality Standards](/05-contributing/05-code-quality-standards) — Стандарты качества кода
- [Development Checklist](/05-contributing/02-development-checklist) — Чек-лист для разработчиков
