# 🏗️ Путеводитель для архитектора

Этот документ даст обзор ключевых решений и направит к глубоким материалам.

## 1. Главное за 5 минут

- **System Overview** – [01-system-overview.md](/core-concepts/architecture-patterns/system-overview)
- **Manager Architecture** – [04-manager-architecture.md](/core-concepts/architecture-patterns/manager-architecture)
- **IPC-first Boundary** – [06-ipc-architecture.md](/core-concepts/shell-core/ipc-architecture)

## 2. Карта пакетов монорепо

| Пакет              | Назначение                                  |
| ------------------ | ------------------------------------------- |
| `shell`            | Ядро Electron, менеджеры, IPC, безопасность |
| `neira-app`        | UI на Next.js (client-only, static)         |
| `polylith-backend` | Легковесный backend для AI-инструментов     |
| `docs-generator`   | Статическая документация (Docusaurus SPA)   |

## 3. Ключевые решения

1. **Shell = SSOT** – renderer не хранит состояние.
2. **Workers** – всё тяжёлое выносится в utility процесс.
3. **SemVer + Conventional Commits** – строгая история изменений.
4. **Design Tokens** – семантические цвета, темы через CSS vars.

## 4. Глубокое чтение

- Безопасность: [07-security-principles.md](/core-concepts/architecture-patterns/security-principles)
- AI-интеграция: [05-api-management.md](/core-concepts/shell-core/api-management)
- Расширения Chrome: [02-chrome-extensions.md](/reference/chrome-extensions)

## 5. TODO & Roadmap

Смотрите [ROADMAP.md](/../ROADMAP) и план `docs/plans/documentation-improvement-2025-07.md`.
