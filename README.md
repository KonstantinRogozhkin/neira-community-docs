# 📚 NEIRA Community Documentation

Добро пожаловать в техническую документацию экосистемы **NEIRA Super App** — комплексной платформы для создания, развертывания и управления ИИ-приложениями на десктопе и мобильных устройствах.

## 🎯 О документации

Эта документация охватывает все аспекты работы с NEIRA: от быстрого старта для новых разработчиков до глубоких архитектурных решений для системных архитекторов.

## 📖 Оглавление

### 🚀 [Пользовательские сценарии](docs/00-user-journeys/)
- **[Глоссарий](docs/00-user-journeys/00-glossary.md)** — основные термины и определения
- **[Для нового разработчика](docs/00-user-journeys/01-for-new-developer.md)** — с чего начать
- **[Для QA-инженера](docs/00-user-journeys/02-for-qa-engineer.md)** — тестирование и качество
- **[Для архитектора](docs/00-user-journeys/03-for-architect.md)** — системное проектирование

### 🏁 [Быстрый старт](docs/01-getting-started/)
- **[Онбординг разработчика](docs/01-getting-started/01-developer-onboarding.md)** — первые шаги
- **[Настройка API ключей](docs/01-getting-started/02-api-keys-configuration.md)** — подключение к сервисам
- **[Совместимость системы](docs/01-getting-started/03-system-compatibility.md)** — требования и поддержка

### 🛠️ [Практические руководства](docs/02-how-to-guides/)
- **[Устранение неполадок](docs/02-how-to-guides/01-troubleshooting-common-issues.md)** — решение частых проблем
- **[Отладка MCP интеграции](docs/02-how-to-guides/02-debug-mcp-integration.md)** — работа с протоколом
- **[Голосовой интерфейс](docs/02-how-to-guides/03-using-voice-interface.md)** — настройка и использование
- **[Сборка и развертывание](docs/02-how-to-guides/04-build-and-deploy.md)** — процесс релиза
- **[Chrome расширения](docs/02-how-to-guides/04-installing-chrome-extensions.md)** — установка и настройка
- **[Тестирование с чатом](docs/02-how-to-guides/05-test-workers-with-chat.md)** — проверка функций
- **[Работа с логами](docs/02-how-to-guides/05-working-with-logs.md)** — мониторинг и отладка
- **[E2E тестирование](docs/02-how-to-guides/06-run-and-debug-e2e-tests.md)** — сквозное тестирование
- **[Оптимизация UI](docs/02-how-to-guides/07-ui-performance-optimization.md)** — производительность интерфейса
- **[SSH туннели для MCP](docs/02-how-to-guides/08-mcp-reverse-ssh-tunnel.md)** — удаленная разработка
- **[Хуки чата](docs/02-how-to-guides/09-work-with-chat-hooks.md)** — кастомизация поведения
- **[GitHub Projects](docs/02-how-to-guides/10-using-github-projects-for-docs.md)** — управление документацией
- **[Экспорт кода](docs/02-how-to-guides/11-export-code-dumps.md)** — создание дампов
- **[Отладка расширений](docs/02-how-to-guides/15-debugging-chrome-extensions.md)** — Chrome DevTools

### 🏗️ [Основные концепции](docs/03-core-concepts/)

#### 🎯 [Архитектурные паттерны](docs/03-core-concepts/1-architecture-patterns/)
- **[Обзор системы](docs/03-core-concepts/1-architecture-patterns/01-system-overview.md)**
- **[Организация кода](docs/03-core-concepts/1-architecture-patterns/03-code-organization.md)**
- **[Архитектура менеджера](docs/03-core-concepts/1-architecture-patterns/04-manager-architecture.md)**
- **[Стратегия логирования](docs/03-core-concepts/1-architecture-patterns/05-logging-strategy.md)**
- **[Polylith интеграция](docs/03-core-concepts/1-architecture-patterns/06-polylith-backend-integration.md)**
- **[Кроссплатформенность](docs/03-core-concepts/1-architecture-patterns/07-cross-platform-compatibility.md)**
- **[Принципы безопасности](docs/03-core-concepts/1-architecture-patterns/08-security-principles.md)**

#### 🖥️ [Ядро Shell](docs/03-core-concepts/2-shell-core/)
- **[Архитектура Shell](docs/03-core-concepts/2-shell-core/01-shell-architecture.md)**
- **[Принципы Electron](docs/03-core-concepts/2-shell-core/04-electron-principles.md)**
- **[Управление API](docs/03-core-concepts/2-shell-core/05-api-management.md)**
- **[Архитектура IPC](docs/03-core-concepts/2-shell-core/06-ipc-architecture.md)**
- **[Безопасность команд](docs/03-core-concepts/2-shell-core/07-command-security.md)**
- **[MCP архитектура](docs/03-core-concepts/2-shell-core/07-mcp-architecture.md)**
- **[Chrome Web Store](docs/03-core-concepts/2-shell-core/08-chrome-web-store-integration.md)**

#### 🎨 [UI слой](docs/03-core-concepts/3-ui-layer/)
- **[Архитектура чата](docs/03-core-concepts/3-ui-layer/01-chat-architecture.md)**
- **[Навигация](docs/03-core-concepts/3-ui-layer/02-navigation-architecture.md)**
- **[Дизайн и темизация](docs/03-core-concepts/3-ui-layer/18-design-theming.md)**
- **[Индикатор мышления](docs/03-core-concepts/3-ui-layer/30-thinking-indicator.md)**
- **[Архитектура NEIRA App](docs/03-core-concepts/3-ui-layer/31-neira-app-architecture.md)**
- **[Жизненный цикл стриминга](docs/03-core-concepts/3-ui-layer/32-chat-streaming-lifecycle.md)**

#### 🤖 [ИИ движок](docs/03-core-concepts/4-ai-engine/)
- **[Архитектура ИИ](docs/03-core-concepts/4-ai-engine/01-ai-architecture.md)**
- **[Сервис планировщика](docs/03-core-concepts/4-ai-engine/02-planner-service.md)**

### 📋 [Справочники](docs/04-reference/)
- **[Chrome расширения](docs/04-reference/02-chrome-extensions.md)** — API и возможности
- **[OpenRouter интеграция](docs/04-reference/02-openrouter-integration.md)** — подключение к LLM
- **[Редактор кода](docs/04-reference/03-code-editor.md)** — функции и настройки
- **[MCP интеграция](docs/04-reference/04-mcp-integration.md)** — протокол контекста модели
- **[Chrome Web Store](docs/04-reference/05-chrome-web-store.md)** — публикация расширений
- **[Native Messaging](docs/04-reference/05-native-messaging-host.md)** — связь с системой
- **[Управление состоянием](docs/04-reference/06-state-management.md)** — архитектура данных
- **[UI и дизайн](docs/04-reference/07-ui-and-design.md)** — компоненты и стили

### 🤝 [Участие в разработке](docs/05-contributing/)
- **[Руководство по стилю](docs/05-contributing/00-style-guide.md)** — код и документация
- **[Золотые принципы](docs/05-contributing/01-golden-principles.md)** — философия проекта
- **[Чеклист разработки](docs/05-contributing/02-development-checklist.md)** — что проверить
- **[Проверки качества](docs/05-contributing/03-code-quality-checks.md)** — стандарты кода
- **[Жизненный цикл документации](docs/05-contributing/04-documentation-lifecycle.md)** — процессы
- **[Стандарты качества](docs/05-contributing/05-code-quality-standards.md)** — требования
- **[Управление зависимостями](docs/05-contributing/08-dependency-management.md)** — библиотеки
- **[Лучшие практики безопасности](docs/05-contributing/13-security-best-practices.md)** — защита

### 🔌 [API справочник](docs/06-api-reference/)
- **[Web API](docs/06-api-reference/01-web-api.md)** — HTTP интерфейсы

## 🚀 Локальная разработка

Эта документация построена с помощью [Docusaurus](https://docusaurus.io/).

### Установка
```bash
yarn install
```

### Запуск в режиме разработки
```bash
yarn start
```

### Сборка
```bash
yarn build
```

## 🤝 Участие

Мы приветствуем вклад в документацию! Пожалуйста, ознакомьтесь с [руководством по участию](docs/05-contributing/CONTRIBUTING.md) перед созданием Pull Request.

## 📄 Лицензия

Документация распространяется под лицензией [CC BY 4.0](LICENSE).

---

<div align="center">
  <p><strong>Создано с ❤️ командой NEIRA</strong></p>
  <p>
    <a href="https://github.com/KonstantinRogozhkin/neira-super-app-2">🏠 Основной проект</a> •
    <a href="https://github.com/KonstantinRogozhkin/neira-cli-mcp">🛠️ CLI инструменты</a> •
    <a href="https://github.com/KonstantinRogozhkin/neira-community-docs">📚 Документация</a>
  </p>
</div>

