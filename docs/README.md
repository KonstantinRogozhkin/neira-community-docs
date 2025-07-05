---
title: Центр документации NEIRA Super App
sidebar_position: 1
---

# 📚 NEIRA Super App — Центр документации

Добро пожаловать в центр документации NEIRA Super App. Этот документ — ваша отправная точка для изучения архитектуры, гайдов и принципов разработки проекта.

## 🚀 Быстрый старт

- **Новичку:** Начните с [Пути нового разработчика](/user-journeys/for-new-developer).
- **Настройка проекта:** [Руководство по установке и настройке](/getting-started/developer-onboarding).
- **Ключевые принципы:** [Золотые принципы разработки](/contributing/golden-principles).

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

- **[Обзор архитектуры](/core-concepts/architecture-patterns/system-overview)** — Полная картина платформы Super App 2.0
- **[Архитектура менеджеров](/core-concepts/architecture-patterns/manager-architecture)** — Паттерн организации компонентов
- **[Организация кода](/core-concepts/architecture-patterns/code-organization)** — Структура проекта и принципы

### 2. Безопасность и стабильность

- **[Принципы безопасности](/core-concepts/architecture-patterns/security-principles)**
- **[Управление рисками](/core-concepts/architecture-patterns/risk-management-overview)**
- **[Паттерны валидации команд](/core-concepts/architecture-patterns/14b-command-validation-pattern)**

### 3. Основные подсистемы

- **[Управление окнами и слоями](/core-concepts/ui-layer/layout-and-window-management)**
- **[Навигация и роутинг](/core-concepts/ui-layer/navigation-architecture)**
- **[Управление сессиями](/core-concepts/shell-core/browser-session-and-authentication)**
- **[Архитектура Shell](/core-concepts/shell-core/shell-architecture)**
- **[Дизайн и темизация](/core-concepts/ui-layer/design-theming)**
- **[Редактор кода (VS Code Integration)](/reference/code-editor)**

### 4. AI и чат

- **[Архитектура и жизненный цикл чата](/core-concepts/ui-layer/chat-architecture)**
- **[Управление API (APIManager)](/core-concepts/shell-core/api-management)**
- **[Прокси-сервер для AI](/core-concepts/ai-engine/proxy-ai-server)**
- **[Голосовой интерфейс (STT/TTS)](/core-concepts/ai-engine/voice-audio)**
- **[Сервис Планировщика (Planner)](/core-concepts/ai-engine/planner-service)**

### 5. AI-агенты и автоматизация

- **[Master Control Protocol (MCP)](/core-concepts/shell-core/mcp-architecture)**
- **[Интеграция с Python](/core-concepts/ai-engine/python-integration)**
- **[Движок автоматизации](/core-concepts/shell-core/automation-engine)**

### 6. Сборка, разработка и CI/CD

- **[Процесс разработки](/contributing/CONTRIBUTING)**
- **[Система сборки](/core-concepts/architecture-patterns/build-system)**
- **[Безопасность сборки](/core-concepts/architecture-patterns/build-security)**
- **[Управление конфигурацией](/core-concepts/architecture-patterns/configuration-management)**
- **[Анализ кода и стабильность](/core-concepts/architecture-patterns/code-analysis)**
- **[Совместимость](/core-concepts/architecture-patterns/stability-compatibility)**
- **[Диаграммы взаимодействия](/core-concepts/architecture-patterns/interaction-diagrams)**

---

## 🛠️ Практические руководства (How-to)

- **[Устранение неполадок](/how-to-guides/troubleshooting-common-issues)**
- **[Отладка интеграции MCP](/how-to-guides/debug-mcp-integration)**
- **[Использование голосового интерфейса](/how-to-guides/using-voice-interface)**
- **[Сборка и развертывание](/how-to-guides/build-and-deploy)**
- **[Тестирование воркеров с чатом](/how-to-guides/test-workers-with-chat)**
- **[Запуск и отладка E2E тестов](/how-to-guides/run-and-debug-e2e-tests)**
- **[Оптимизация производительности UI](/how-to-guides/ui-performance-optimization)**
- **[Настройка Reverse SSH для MCP](/how-to-guides/mcp-reverse-ssh-tunnel)**
- **[Работа с хуками чата](/how-to-guides/work-with-chat-hooks)**
- **[Использование GitHub Projects для документации](/how-to-guides/using-github-projects-for-docs)**

---

## 📜 Правила и стандарты

- **[Стандарты качества кода](/contributing/code-quality-standards)**
- **[Style Guide](/contributing/style-guide)**
- **[Чек-лист разработчика](/contributing/development-checklist)**
- **[Жизненный цикл документации](/contributing/documentation-lifecycle)**
- **[Жизненный цикл скриптов](/contributing/managing-scripts-lifecycle)**
- **[Процесс релизов](/contributing/release-notes-process)**
- **[Тестирование](/contributing/test-the-application)**
- **[Генерация правил](/contributing/auto-rules-generation)**
- **[Roadmap миграции на Polylith](/contributing/polylith-migration-roadmap)**
- **[Следующие приоритеты разработки](/contributing/next-development-priorities)**
- **[Дорожная карта QA](/contributing/qa-roadmap)**

---

## 📚 Справочные материалы (Reference)

- **[Web API](/api-reference/web-api)** — Спецификация REST API для веб-клиентов.
- **[Интеграция с OpenRouter](/reference/openrouter-integration)**
- **[Интеграция с Chrome Extensions](/reference/chrome-extensions)**
- **[Интеграция с Code Editor](/reference/code-editor)**
- **[AI и чат](/core-concepts/ai-engine/ai-architecture)**
- **[Интеграция MCP](/reference/mcp-integration)**
- **[Native Messaging Host](/reference/native-messaging-host)**
- **[Управление состоянием](/reference/state-management)**
- **[UI и дизайн](/reference/ui-and-design)**

---

## 👣 Путеводители (User Journeys)

- **[Для нового разработчика](/user-journeys/for-new-developer)**
- **[Для QA-инженера](/user-journeys/for-qa-engineer)**
- **[Для архитектора](/user-journeys/for-architect)**

---

## 🔗 Важные ссылки

- **Changelog** — Полная история изменений в проекте.
- **Roadmap** — План развития продукта.

---

_Этот файл является главным входом в документацию. Поддерживайте его в актуальном состоянии._
