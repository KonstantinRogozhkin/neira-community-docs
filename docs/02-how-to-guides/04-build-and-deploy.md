# 🚀 Сборка и развертывание NEIRA Super App

## Development режимы

### Fast Mode (рекомендуется)

```bash
yarn start:fast              # Быстрый запуск (~200ms вкладки)
DEBUG=1 yarn start:fast      # С debug логами
```

### Full Mode

```bash
yarn start:full              # Полная функциональность (CDP + Workers)
VERBOSE_LOGS=1 yarn start:full  # С verbose логами
```

### Static Mode (VS Code архитектура)

```bash
STATIC_MODE=1 yarn start:fast  # IPC API вместо HTTP (75% быстрее)
```

## Система сборки

### Команды

```bash
yarn install     # Установка зависимостей
yarn build       # Сборка всех пакетов
yarn clean       # Очистка node_modules
yarn type-check  # Проверка TypeScript
```

### Пакеты (5 total)

1. **packages/shell** - Electron main процесс
2. **packages/neira-app** - Next.js AI приложение (502kB bundle)
3. **packages/electron-chrome-extensions** - Chrome API
4. **packages/electron-chrome-context-menu** - Context menu
5. **packages/electron-chrome-web-store** - Web Store

## Production сборка

### Команды

```bash
yarn make        # Полная сборка + упаковка
yarn build && cd packages/shell && yarn build:electron  # Без упаковки
```

### Конфигурация (forge.config.js)

```javascript
module.exports = \{
  packagerConfig: \{
    name: 'NEIRA SUPER APP',
    icon: path.join(__dirname, 'neira-512'),
    appBundleId: 'com.neira.super-app',
    appVersion: '2.2.0',
  },
}
```

**Результат:** DMG в `packages/shell/out/make/`

## Environment Variables

### Development

```bash
# .env в корне
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
OPENROUTER_API_KEY=sk-or-xxx
DIFY_API_KEY=app-xxx

# .env.local в packages/neira-app/
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=xxx
```

### Production

**⚠️ Безопасность:** .env файлы НЕ копируются в production. Пользователь создает файл вручную:

- **macOS**: `~/Library/Application Support/NEIRA SUPER APP/`
- **Windows**: `%APPDATA%\NEIRA SUPER APP\`
- **Linux**: `~/.config/NEIRA SUPER APP/`

## Code-OSS интеграция

### Команды

```bash
yarn build:code-oss        # С кешированием (99.7% ускорение)
yarn build:code-oss:clean  # Принудительная пересборка
yarn build:code-oss:stats  # Статистика кеша
```

**Кеш:** `~/.neira-code-oss-cache/` (основан на git commit hash)
**Версия:** VS Code 1.96.2 + Electron 36.3.2

## Файловая структура Production

```
NEIRA SUPER APP.app/
├── Contents/
│   ├── MacOS/NEIRA SUPER APP    # Исполняемый файл
│   ├── Resources/               # Ресурсы приложения
│   │   ├── app.asar            # Упакованный код
│   │   ├── neira-512.icns      # Иконка приложения
│   │   └── .env                # API ключи (пользователь создает)
│   └── Info.plist              # Метаданные macOS
```

## Запуск Production

### Команды

```bash
# GUI запуск
open "packages/shell/out/NEIRA SUPER APP-darwin-arm64/NEIRA SUPER APP.app"

# Командная строка (экранированные пробелы)
"./packages/shell/out/NEIRA SUPER APP-darwin-arm64/NEIRA SUPER APP.app/Contents/MacOS/NEIRA SUPER APP"
```

**Метрики:**

- **Bundle size**: 459MB production
- **Startup time**: 75% быстрее в Static Mode
- **Memory usage**: 60% меньше без HTTP сервера
- **Build time**: 2-5 минут (с кешированием)

**Статус:** PRODUCTION READY с автоматическим CI/CD pipeline

## Git Hooks (Husky)

NEIRA Super App использует Husky для автоматических проверок на этапе commit.

Как это работает:

1. `node scripts/build/generate-allowed-channels.js` — перед коммитом генерируется актуальный список IPC-каналов.
2. `npx lint-staged` — линт и авто-форматирование только затронутых файлов.

Hook располагается в `.husky/pre-commit`. При ошибке любого из шагов коммит автоматически прерывается.
