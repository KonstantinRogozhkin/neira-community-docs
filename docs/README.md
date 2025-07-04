# 📚 NEIRA Super App — Центр документации

Добро пожаловать в центр документации NEIRA Super App. Этот документ — ваша отправная точка для изучения архитектуры, гайдов и принципов разработки проекта.

## 🚀 Быстрый старт

- **Новичку:** Начните с [Пути нового разработчика](00-user-journeys/01-for-new-developer.md).
- **Настройка проекта:** [Руководство по установке и настройке](01-getting-started/01-developer-onboarding.md).
- **Ключевые принципы:** [Золотые принципы разработки](05-contributing/01-golden-principles.md).

---

## 🗺️ Структура документации

Ниже представлено описание основных разделов документации.

### 📂 `00-user-journeys`

Ролевые инструкции и сценарии использования для разных членов команды (разработчики, QA, архитекторы). Помогает быстро погрузиться в проект с нужной точки зрения.

### 📂 `01-getting-started`

Все, что нужно для начала работы: инструкции по установке, настройке ключей API и проверке совместимости системы.

### 📂 `02-how-to-guides`

Практические руководства по решению конкретных задач: отладка, использование голосового интерфейса, сборка проекта, работа с логами и расширениями Chrome.

### 📂 `03-core-concepts`

Самый важный раздел, описывающий ядро системы. Разбит на четыре подраздела:

- **`1-architecture-patterns`**: Общие архитектурные паттерны (Polylith, Manager Architecture, Security).
- **`2-shell-core`**: Принципы работы ядра на Electron (`shell`), включая IPC, управление окнами и воркерами.
- **`3-ui-layer`**: Все, что касается UI-слоя на Next.js (`neira-app`).
- **`4-ai-engine`**: Архитектура AI-компонентов, включая интеграцию с Python и gRPC.

### 📂 `04-reference`

Справочные материалы и API-документация.

### 📂 `05-contributing`

Правила разработки, стандарты кода и процессы.

### 📂 `06-api-reference`

Спецификации API и интерфейсов.

---

## 🏗️ Архитектура системы

### 1. Системный обзор

- **[Обзор архитектуры](/03-core-concepts/1-architecture-patterns/01-system-overview)** — Полная картина платформы Super App 2.0
- **[Архитектура менеджеров](/03-core-concepts/1-architecture-patterns/04-manager-architecture)** — Паттерн организации компонентов
- **[Организация кода](/03-core-concepts/1-architecture-patterns/03-code-organization)** — Структура проекта и принципы

### 2. Безопасность и стабильность

- **[Принципы безопасности](/03-core-concepts/1-architecture-patterns/08-security-principles)**
- **[Управление рисками](/03-core-concepts/1-architecture-patterns/14-risk-management-overview)**
- **[Паттерны валидации команд](/03-core-concepts/1-architecture-patterns/14b-command-validation-pattern)**

### 3. Основные подсистемы

- **[Управление окнами и слоями](/03-core-concepts/3-ui-layer/34-layout-and-window-management)**
- **[Навигация и роутинг](/03-core-concepts/3-ui-layer/02-navigation-architecture)**
- **[Управление сессиями](/03-core-concepts/2-shell-core/32-session-management)**
- **[Архитектура Shell](/03-core-concepts/2-shell-core/01-shell-architecture)**
- **[Дизайн и темизация](/03-core-concepts/3-ui-layer/18-design-theming)**
- **[Редактор кода (VS Code Integration)](/03-core-concepts/3-ui-layer/33-code-editor)**

### 4. AI и чат

- **[Архитектура и жизненный цикл чата](/03-core-concepts/3-ui-layer/01-chat-architecture)**
- **[Управление API (APIManager)](/03-core-concepts/2-shell-core/05-api-management)**
- **[Прокси-сервер для AI](/03-core-concepts/4-ai-engine/16-proxy-ai-server)**
- **[Голосовой интерфейс (STT/TTS)](/03-core-concepts/4-ai-engine/15-voice-audio)**
- **[Сервис Планировщика (Planner)](/03-core-concepts/4-ai-engine/02-planner-service)**

### 5. AI-агенты и автоматизация

- **[Master Control Protocol (MCP)](/03-core-concepts/2-shell-core/07-mcp-architecture)**
- **[Интеграция с Python](/03-core-concepts/4-ai-engine/21-python-integration)**
- **[Движок автоматизации](/03-core-concepts/2-shell-core/22-automation-engine)**

### 6. Сборка, разработка и CI/CD

- **[Процесс разработки](/05-contributing/CONTRIBUTING)**
- **[Система сборки](/03-core-concepts/1-architecture-patterns/24-build-system)**
- **[Безопасность сборки](/03-core-concepts/1-architecture-patterns/23-build-security)**
- **[Управление конфигурацией](/03-core-concepts/1-architecture-patterns/24-configuration-management)**
- **[Анализ кода и стабильность](/03-core-concepts/1-architecture-patterns/26-code-analysis)**
- **[Совместимость](/03-core-concepts/1-architecture-patterns/27-stability-compatibility)**
- **[Диаграммы взаимодействия](/03-core-concepts/1-architecture-patterns/25-interaction-diagrams)**

---

## 🛠️ Практические руководства (How-to)

- **[Устранение неполадок](/02-how-to-guides/01-troubleshooting-common-issues)**
- **[Отладка интеграции MCP](/02-how-to-guides/02-debug-mcp-integration)**
- **[Использование голосового интерфейса](/02-how-to-guides/03-using-voice-interface)**
- **[Сборка и развертывание](/02-how-to-guides/04-build-and-deploy)**
- **[Тестирование воркеров с чатом](/02-how-to-guides/05-test-workers-with-chat)**
- **[Запуск и отладка E2E тестов](/02-how-to-guides/06-run-and-debug-e2e-tests)**
- **[Оптимизация производительности UI](/02-how-to-guides/07-ui-performance-optimization)**
- **[Настройка Reverse SSH для MCP](/02-how-to-guides/08-mcp-reverse-ssh-tunnel)**
- **[Работа с хуками чата](/02-how-to-guides/09-work-with-chat-hooks)**
- **[Использование GitHub Projects для документации](/02-how-to-guides/10-using-github-projects-for-docs)**

---

## 📜 Правила и стандарты

- **[Стандарты качества кода](/05-contributing/05-code-quality-standards)**
- **[Style Guide](/05-contributing/00-style-guide)**
- **[Чек-лист разработчика](/05-contributing/02-development-checklist)**
- **[Жизненный цикл документации](/05-contributing/04-documentation-lifecycle)**
- **[Жизненный цикл скриптов](/05-contributing/06-managing-scripts-lifecycle)**
- **[Процесс релизов](/05-contributing/08-release-notes-process)**
- **[Тестирование](/05-contributing/07-test-the-application)**
- **[Генерация правил](/05-contributing/05-auto-rules-generation)**
- **[Roadmap миграции на Polylith](/05-contributing/06-polylith-migration-roadmap)**
- **[Следующие приоритеты разработки](/05-contributing/07-next-development-priorities)**
- **[Дорожная карта QA](/05-contributing/08-qa-roadmap)**

---

## 📚 Справочные материалы (Reference)

- **[Web API](/06-api-reference/01-web-api)** — Спецификация REST API для веб-клиентов.
- **[Интеграция с OpenRouter](/04-reference/02-openrouter-integration)**
- **[Интеграция с Chrome Extensions](/04-reference/02-chrome-extensions)**
- **[Интеграция с Code Editor](/04-reference/03-code-editor)**
- **[AI и чат](/03-core-concepts/4-ai-engine/01-ai-architecture)**
- **[Интеграция MCP](/04-reference/04-mcp-integration)**
- **[Native Messaging Host](/04-reference/05-native-messaging-host)**
- **[Управление состоянием](/04-reference/06-state-management)**
- **[UI и дизайн](/04-reference/07-ui-and-design)**

---

## 👣 Путеводители (User Journeys)

- **[Для нового разработчика](/00-user-journeys/01-for-new-developer)**
- **[Для QA-инженера](/00-user-journeys/02-for-qa-engineer)**
- **[Для архитектора](/00-user-journeys/03-for-architect)**

---

## 🔗 Важные ссылки

- **[Release Notes v0.3.1](./changelog/2025-06-25-release-notes-v0.3.1.md)** — Краткий обзор ключевых изменений последнего релиза.
- **[Changelog](https://github.com/neira-org/neira-super-app/blob/main/CHANGELOG.md)** — Полная история изменений в проекте.
- **[Roadmap](https://github.com/neira-org/neira-super-app/blob/main/ROADMAP.md)** — План развития продукта.

---

_Этот файл является главным входом в документацию. Поддерживайте его в актуальном состоянии._
