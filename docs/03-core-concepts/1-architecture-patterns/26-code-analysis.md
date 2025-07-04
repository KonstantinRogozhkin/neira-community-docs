# 🔍 Инструкция по использованию фильтров NEIRA Super App

## 📋 Обзор

Настроены оптимальные фильтры для анализа кода проекта NEIRA Super App. Конфигурация находится в файле `.neira-filters.json`.

## 🎯 Основные результаты

- **Оригинальный размер**: 434,841 токенов
- **Оптимизированный размер**: 242,661 токенов
- **Экономия**: 192,180 токенов (44.2%)
- **Фокус**: Только основной код без тестов, документации, примеров

## 📊 Доступные пресеты

### 1. `core-only` (рекомендуется)

**Размер**: 242,661 токенов  
**Описание**: Только основной код проекта  
**Включает**:

- `packages/shell/src/**/*.js,*.ts` - Electron shell код
- `packages/neira-app/**/*.tsx,*.ts,*.js` - Next.js приложение
- `packages/shared-types/src/**/*.ts` - Общие типы
- `*.json` - Конфигурационные файлы

### 2. `all-code`

**Размер**: 360,871 токенов  
**Описание**: Весь код проекта включая CSS, HTML  
**Включает**: `*.js`, `*.ts`, `*.tsx`, `*.jsx`, `*.json`, `*.css`, `*.html`

### 3. `shell-only`

**Описание**: Только Electron shell код  
**Включает**: `packages/shell/src/**/*`, `packages/shared-types/**/*`

### 4. `neira-app-only`

**Описание**: Только Next.js приложение  
**Включает**: `packages/neira-app/**/*`, `packages/shared-types/**/*`

### 5. `managers-only`

**Описание**: Только Manager Architecture  
**Включает**: `packages/shell/src/main/managers/**/*`, `super-app.js`

## 🚀 Команды для анализа

### Полный анализ кода (рекомендуется)

```bash
# Используя preset core-only (242,661 токенов)
mcp_neira-code-analyzer_code_review \
  --path /Users/konstantin/Projects/neira-super-app \
  --include_patterns packages/shell/src/**/*.js packages/shell/src/**/*.ts packages/neira-app/**/*.tsx packages/neira-app/**/*.ts packages/neira-app/**/*.js packages/shared-types/src/**/*.ts *.json \
  --exclude_patterns "*/node_modules/**" "**/node_modules/**" "node_modules/**" "dist/**" "out/**" "build/**" "*.log" "*.tmp" ".git/**" "yarn.lock" "package-lock.json" "*.min.js" "*.min.css" "playwright-report/**" "tests/**" "coverage/**" "tmp.iconset/**" "drizzle/migrations/**" "docs/**" "extensions/**" "certificates/**" "public/**" "*.md" "script/**" "spec/**" "examples/**" "fixtures/**" "*.lock" ".vscode/**" ".cursor/**" "tmp-*/**" "**/*.test.*" "**/*.spec.*" "**/migrations/**" "**/meta/**"
```

### Анализ архитектуры Super App 2.0

```bash
# Только Manager Architecture
mcp_neira-code-analyzer_code_review \
  --path /Users/konstantin/Projects/neira-super-app \
  --include_patterns packages/shell/src/main/managers/**/*.js packages/shell/src/main/managers/**/*.ts packages/shell/src/main/super-app.js packages/shared-types/src/**/*.ts \
  --exclude_patterns "node_modules/**" "**/*.test.*" "**/*.spec.*" \
  --template_name architecture-analysis
```

### Анализ AI интеграции

```bash
# Только neira-app с AI функциями
mcp_neira-code-analyzer_code_review \
  --path /Users/konstantin/Projects/neira-super-app \
  --include_patterns packages/neira-app/**/*.tsx packages/neira-app/**/*.ts packages/neira-app/**/*.js packages/neira-app/*.json packages/shared-types/src/**/*.ts \
  --exclude_patterns "node_modules/**" "dist/**" "out/**" "build/**" "*.log" "*.tmp" ".git/**" "drizzle/migrations/**" "drizzle/meta/**" "tests/**" "spec/**" "examples/**" "**/*.test.*" "**/*.spec.*" "public/**" "certificates/**" \
  --template_name api-documentation
```

## 📁 Исключенные категории

### Полностью исключены

- **Документация**: `docs/**`, `*.md`
- **Тесты**: `tests/**`, `**/*.test.*`, `**/*.spec.*`
- **Сборка**: `dist/**`, `out/**`, `build/**`, `node_modules/**`
- **Примеры**: `examples/**`, `fixtures/**`, `spec/**`
- **Ресурсы**: `public/**`, `certificates/**`, `tmp.iconset/**`
- **Миграции**: `drizzle/migrations/**`, `drizzle/meta/**`
- **Extensions**: `extensions/**` (Chrome extensions)
- **Конфигурация**: `.vscode/**`, `.cursor/**`, `*.lock`

### Типы файлов исключены

- Логи: `*.log`, `*.tmp`
- Минифицированные: `*.min.js`, `*.min.css`
- Отчеты: `playwright-report/**`, `coverage/**`
- Временные: `tmp-*/**`

## 🎯 Рекомендации по использованию

### Для анализа кода

1. **Используйте `core-only`** для общего анализа
2. **Используйте `managers-only`** для архитектурного анализа
3. **Используйте `neira-app-only`** для анализа AI функций

### Для отладки

1. **Добавьте конкретные файлы** в include_patterns при необходимости
2. **Временно уберите исключения** если нужны тесты или документация
3. **Используйте `all-code`** если нужны CSS/HTML файлы

### Для производительности

- `core-only` (242k токенов) - оптимальный размер для большинства анализов
- `shell-only` + `neira-app-only` раздельно - для специфичного анализа
- Избегайте `all-code` без необходимости

## 🔧 Кастомизация фильтров

Для создания собственных фильтров отредактируйте `.neira-filters.json`:

```json
\{
  "custom-preset": \{
    "description": "Мой кастомный пресет",
    "include_patterns": ["your/specific/path/**/*.ts"],
    "exclude_patterns": ["specific/excludes/**"]
  }
}
```

## 📊 Статистика оптимизации

| Категория           | Токенов сэкономлено | Процент   |
| ------------------- | ------------------- | --------- |
| Документация        | ~50,000             | 11.5%     |
| Тесты               | ~45,000             | 10.4%     |
| Примеры/Fixtures    | ~30,000             | 6.9%      |
| Build артефакты     | ~25,000             | 5.7%      |
| Статические ресурсы | ~20,000             | 4.6%      |
| Прочее              | ~22,180             | 5.1%      |
| **Итого**           | **192,180**         | **44.2%** |

---

_Конфигурация оптимизирована для проекта NEIRA Super App Super App 2.0 архитектуры_
