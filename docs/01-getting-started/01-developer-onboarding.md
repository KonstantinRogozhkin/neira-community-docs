# 👋 01-Developer Onboarding

> **Цель**: настроить окружение, запустить Super App и отправить первый PR — за **≤ 30 мин**.

## ⚡ Философия

- **Time-to-Value ≤ 5 мин**. Чем раньше вы увидите пользующуюся прогресс-бар, тем быстрее пойдёт работа.
- **Single Source of Truth**: этот гайд заменяет `01-installation.md`, `01-running-the-project.md`, `04-onboarding-guide.md`.

---

## 1. TL;DR — 5 шагов

```bash
# 1. Клонировать и установить зависимости
git clone https://github.com/your-org/neira-super-app.git
cd neira-super-app && yarn install

# 2. Настроить API-ключи
cp .env.example .env.local && nano .env.local

# 3. Запустить Fast Mode (разработка)
yarn start:fast

# 4. Открыть DevTools (Cmd+Alt+I) и вкладку *neira-app*

# 5. Запустить тесты
yarn test
```

> Если видите главный экран NEIRA с приветственным баннером — всё готово.

---

## 2. Предварительные требования

| Софт    | Версия                                |
| ------- | ------------------------------------- |
| Node.js | ≥ 20 LTS                              |
| Yarn    | 1.x (classic)                         |
| OS      | macOS 11+, Windows 10+, Ubuntu 18.04+ |

Линукс/Windows: `export YARN_IGNORE_PLATFORM=true && yarn install` (из-за `macos-alias`).

---

## 3. Конфигурация API-ключей (.env.local)

```dotenv
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
# Optional
OPENROUTER_API_KEY=sk-or-...
DIFY_API_KEY=app-...
DIFY_BASE_URL=https://api.dify.ai/v1
```

Полная справка → `02-api-keys-configuration.md`.

---

## 4. Режимы запуска

| Команда              | Назначение                                            |
| -------------------- | ----------------------------------------------------- |
| `yarn start:fast`    | ⚡ Dev-режим. менее 200 ms вкладка, минимум логов     |
| `yarn start:full`    | 🔧 Production-like. Utility Processes + CDP + Workers |
| `yarn dev:neira-app` | 🚀 Только UI (Next.js hot-reload)                     |

Доп. переменные: `DEBUG=1`, `VERBOSE_LOGS=1`, `SIMPLE_MODE=1`.

---

## 5. Ключевые директории

| Слой               | Путь                 | Особенности                      |
| ------------------ | -------------------- | -------------------------------- |
| **Shell**          | `packages/shell`     | Менеджеры, IPC, Workers          |
| **UI (neira-app)** | `packages/neira-app` | Next.js 15, Zustand, React Query |
| **Backend**        | `polylith-backend`   | Полилиф-компоненты               |

Подробнее → `00-architecture-overview.md`.

---

## 6. Частые задачи

### Добавить IPC-канал

1. Тип в `packages/shared-types/src/index.ts`.
2. `yarn build:shell` → появляется `allowed-channels.json`.
3. Хэндлер в `packages/shell/src/main/managers/channels/*`.
4. Использование в UI через `lib/ipc-api.ts`.

### Добавить Zustand-стор

1. `lib/store/<name>Store.ts`.
2. Экспорт через `rootStore.ts`.
3. Кросс-взаимодействие только в `rootStore`.

---

## 7. Debug & Troubleshooting

| Симптом                 | Решение                                                        |
| ----------------------- | -------------------------------------------------------------- |
| Electron не запускается | `yarn clean && yarn install && yarn start:fast`                |
| IPC-канала нет          | Проверь `allowed-channels.json` / ESLint rule `no-unknown-ipc` |
| UI не обновляется       | Используйте `ReactQuery.invalidateQueries()`                   |

Полный гайд → `../02-how-to-guides/01-troubleshooting-common-issues.md`.

---

## 8. Первый PR: «Hello, NEIRA!»

1. Создать компонент `HelloBanner.tsx` в `packages/neira-app/components/hello`.
2. Добавить в `app/(core)/page.tsx`.
3. `yarn start:fast` — убедиться, что баннер виден.
4. `yarn test`.
5. PR с тегом `chore: hello banner` + `yarn changeset`.

---

## 9. Полезные скрипты

```bash
yarn build          # Сборка всех пакетов
yarn format         # Prettier + ESLint fix
yarn analyze:size   # Анализ бандла Electron
```

---

_Гайд объединён 2025-06-22. Старые файлы удалены._
