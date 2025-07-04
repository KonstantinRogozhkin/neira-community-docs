# 🔐 Принципы безопасности NEIRA Super App

Версия: 1.1
Статус: ✅ **Действующий стандарт**

## ⚡ Философия

Безопасность в NEIRA Super App — это не дополнительная функция, а фундаментальный слой архитектуры. Мы придерживаемся принципа "безопасность по умолчанию" (Security by Default) и "нулевого доверия" (Zero Trust), особенно в точках соприкосновения `shell` с внешним миром и UI.

Связь: [Системный обзор](/03-core-concepts/1-architecture-patterns/01-system-overview), [Архитектура IPC](/03-core-concepts/2-shell-core/06-ipc-architecture).

## 🛡️ Ключевые механизмы защиты

### 1. Песочница (Sandbox)

- **Правило:** Все `BrowserWindow` и `WebContentsView` **должны** работать с `sandbox: true`.
- **Исключение:** Только `neira://vscode` (для Code-OSS) может использовать `sandbox: false` для работы DevTools и расширений. Это исключение строго документировано.
- **Цель:** Изолировать Renderer-процессы от прямого доступа к Node.js API, минимизируя поверхность атаки.

### 2. Content Security Policy (CSP)

NEIRA Super App использует многоуровневую архитектуру CSP: Electron-shell (main), preload-скрипт и статический UI (`neira-app`). CSP применяется на **каждом уровне**.

#### Золотые правила CSP

1. **Никаких `unsafe-*` директив:** Директивы `unsafe-eval` и `unsafe-inline` **полностью запрещены** для `script-src`. Исключение: временно `unsafe-inline` в `style-src` (Next.js ограничение).

2. **`nonce` для inline-контента:** Все inline-скрипты (`<script>`) и стили (`<style>`) **обязаны** иметь атрибут `nonce="{cspNonce}"`. `cspNonce` генерируется в `app/layout.tsx`.

3. **Санитизация пользовательского ввода:** Любой контент от пользователя (особенно Markdown) **должен** проходить через санитизатор (`rehype-sanitize`).

#### Устранение unsafe-eval: Миграция от framer-motion (CSP:UNSAFE_EVAL_REMOVAL)

**Проблема:** Библиотека `framer-motion` требовала директиву `'unsafe-eval'` в CSP, создавая серьезную уязвимость безопасности, особенно критичную для Electron-приложения с доступом к файловой системе.

**Решение — полный отказ от framer-motion:**

1. ✅ **Удалена зависимость** `framer-motion` из `packages/neira-app/package.json`
2. ✅ **Рефакторинг компонентов:** Заменены `motion.div` на стандартные HTML-элементы с CSS-анимациями:
   - `SuggestedPrompts.tsx` — заменены motion-компоненты на CSS с `animate-fade-in`
   - `ChatSidebar.tsx` — удалена `AnimatePresence`, добавлены CSS-переходы
   - `ChatSidebarItem.tsx` — заменены motion-анимации на Tailwind CSS классы

3. ✅ **Расширены CSS-анимации** в `tailwind.config.js`:

   ```js
   keyframes: {
     fadeIn: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
     fadeOut: { '0%': { opacity: '1', transform: 'translateY(0)' }, '100%': { opacity: '0', transform: 'translateY(10px)' } },
     scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } }
   }
   ```

4. ✅ **Обновлена CSP политика:** Полностью удалена директива `'unsafe-eval'` из всех CSP-конфигураций:
   - `packages/neira-app/lib/utils/csp-utils.ts`
   - `packages/neira-app/app/layout.tsx`  
   - `packages/neira-app/pages/_document.tsx`

**Результаты:**

- ✅ **Безопасность:** Устранена критическая уязвимость CSP
- ✅ **Производительность:** Уменьшен размер бандла за счет отказа от тяжелой библиотеки
- ✅ **Совместимость:** Визуальный опыт пользователя сохранен на том же уровне
- ✅ **Стабильность:** CSP работает без `'unsafe-eval'` даже в development режиме

### Комплексная очистка безопасности (SECURITY:REFACTORING)

**Масштабная модернизация кодовой базы для устранения уязвимостей:**

#### Устранение устаревшего кода

- **Типы Chrome Extensions**: Удален `chrome-legacy.d.ts`, унифицированы `adm-zip.d.ts` в `shared-types`
- **Deprecated функции**: Замена `getUserIdAsync/getId/updateUserId` → `useUserId()`, миграция на нативные Electron API
- **Полная реализация API**: Замена заглушек `chrome.downloads` и `chrome.debugger` на полнофункциональные реализации

#### Безопасность выполнения команд

- **TaskExecutionService**: Интеграционные тесты для проверки блокировки потенциально опасных команд
- **Контролируемое выполнение**: Валидация разрешенных команд с защитой от инъекций

**Результат:** Актуальная кодовая база без уязвимостей, полная поддержка Chrome Extensions API и защищенное выполнение системных команд.

### Тестирование безопасности TaskExecutionService (SECURITY:CRITICAL_DEFECTS_CLEANUP)

**Проблема:** Отсутствие комплексных тестов безопасности для сервиса выполнения команд, что создавало риски неконтролируемого выполнения потенциально опасных операций.

**Решение:**

1. ✅ **Создан интеграционный тест** `tests/1_integration/task-execution-service.spec.ts`
2. ✅ **Проверка блокировки опасных команд** — тестирование корректного отклонения потенциально вредоносных команд
3. ✅ **Валидация разрешенных команд** — проверка корректной обработки безопасных операций
4. ✅ **Покрытие тестами ≥ 85%** — обеспечение высокого уровня тестирования критических компонентов

**Архитектурные улучшения:**

- Унификация объявлений типов в `shared-types` для устранения дублирования
- Обновление зависимостей `@types/chrome` до актуальных версий
- Замена deprecated функций на современные API (например, `useUserId()` хук)
- Полная реализация Chrome Extensions API (`chrome.downloads`, `chrome.debugger`)

**Результат:** Комплексная система тестирования безопасности с проактивной защитой от инъекций команд и полной совместимостью с Chrome Extensions.

### Устранение критических уязвимостей P0 (SECURITY:CRITICAL_VULNERABILITIES_FIX)

**Масштабная очистка критических проблем безопасности:**

#### Удаление hardcoded API-ключей

- **Проблема:** Критическая уязвимость P0 — hardcoded API-ключ Gladia в `manager.ts`
- **Решение:** Полное удаление hardcoded ключей, переход на безопасное хранение через `ApiKeyStore`
- **Результат:** Устранение риска компрометации API-ключей

#### Исправление утечек памяти

- **Проблема:** Утечка памяти в механизме автообновления расширений через `setInterval`
- **Решение:** Корректная очистка интервалов при завершении процессов
- **Результат:** Стабильная работа без накопления памяти

#### Персистентное хранилище Chrome Extensions

- **Проблема:** `chrome.storage.local` использовал `MemoryStorageArea`, теряя данные при перезапуске
- **Решение:** Реализация персистентного хранилища на основе файловой системы
- **Результат:** Корректная работа расширений с сохранением состояния

#### Где определяется CSP

| Слой                  | Файл/метод                                   | Назначение                                                                       |
| --------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| **Electron (main)**   | `WindowManager.setupContentSecurityPolicy()` | CSP заголовок для всех ресурсов через `session.webRequest.onHeadersReceived`     |
| **Renderer / UI**     | `packages/neira-app/app/layout.tsx`          | `<meta httpEquiv="Content-Security-Policy">` для статически экспортированного UI |
| **Статические сайты** | `scripts/remove-csp-meta.js`                 | Удаляет конфликтующие CSP-метатеги сторонних HTML                                |

#### Текущая политика

```
script-src   'self' 'nonce-${cspNonce}' https: neira: file:;
style-src    'self' 'nonce-${cspNonce}' https: data:;
img-src      'self' data: blob: https: neira: file:;
connect-src  'self' https: wss: data: neira: file:;
object-src   'none';
```

#### CSP хэши и динамическая загрузка

**Проблема автоматической генерации CSP хэшей:**

- Файл `generated/csp-hashes.json` генерируется после сборки Next.js
- Должен быть доступен в runtime по пути `neira://view/generated/csp-hashes.json`
- При отсутствии файла используется fallback CSP с `'unsafe-inline'`

**Последовательность сборки:**

```bash
# Правильный порядок команд
next build && next export  # Создаем статические файлы
generate-csp-hashes.js     # Анализируем и создаем хэши в out/
```

**DynamicCSP загрузка:**

```typescript
// Проверка доступности хэшей в runtime
const hashesResponse = await fetch('/generated/csp-hashes.json')
if (hashesResponse.ok) \{
  // Применяем строгую CSP с хэшами
  applyStrictCSP(hashes)
} else \{
  // Используем базовую CSP с 'unsafe-inline'
  logger.warn('CSP hashes not available, using fallback CSP')
}
```

### 3. Защита кастомного протокола (`neira://`)

Протокол `neira://` используется для загрузки внутренних ресурсов приложения (`neira-app`, `docs-site`). Он защищен от атак **Path Traversal**.

#### Механизм защиты

- **Никаких `..`:** Простейшие попытки обхода блокируются.
- **Рекурсивное декодирование:** URL-кодированные последовательности (`%2e%2e%2f`) рекурсивно декодируются, чтобы выявить скрытые попытки обхода.
- **Канонизация путей:** `path.resolve()` используется для преобразования запрошенного пути в абсолютный, системный путь.
- **Проверка границ:** Финальный разрешенный путь **строго** проверяется на нахождение внутри разрешенной корневой директории (`resources`).

```typescript
// packages/shell/src/main/protocol-handler.ts

// 1. Рекурсивно декодируем URL
let decodedPathname = decodeURIComponent(pathname);
// ... (цикл до полного декодирования)

// 2. Разрешаем пути до абсолютных
const baseStaticResolved = path.resolve(baseStatic);
const requestedPathResolved = path.resolve(baseStatic, decodedPathname);

// 3. Проверяем, что разрешенный путь находится внутри базового
if (!requestedPathResolved.startsWith(baseStaticResolved)) \{
  // ❌ Блокируем запрос
  return callback(\{ error: -6 });
}
```

**Результат:** Этот многоуровневый подход эффективно предотвращает доступ к файловой системе за пределами каталога `resources`.

### 4. Межпроцессное взаимодействие (IPC)

- **Принцип "IPC-First"**: Никакого прямого доступа к `shell` из `neira-app`, кроме как через `window.neiraAPI`.
- **Список разрешенных каналов**: Все `invoke`-каналы должны быть явно перечислены в `allowed-channels.json`, который генерируется автоматически при сборке из `shared-types`. Попытка вызова незарегистрированного канала блокируется.
- **Никаких `executeJavaScript`**: Этот метод не используется для вызова функций в `shell`.

### 5. Хранение API-ключей (устранение fallback на `localStorage`)

- **Правило:** Секреты (API-ключи, токены) **никогда** не сохраняются в `localStorage`/`sessionStorage`.
- **Точка истинны:** Ключи передаются через IPC и хранятся в безопасном хранилище main-процесса (`ApiKeyStore`). UI-слой получает ключи только по требованию через `window.neiraAPI`.
- **История изменения:** В спринте **SEC-02** (июль 2025) полностью удалён fallback-механизм `localStorage` в компоненте `ApiKeyManager`. Подробнее см. пункт «Phase 1 — Консолидация» в отчетах DOCBUILDER.
- **Валидация:** Юнит-тест `api-manager.spec.ts` и ручные проверки в Electron-сборке подтверждают отсутствие обращений к `localStorage`, что исключает XSS-риски кражи ключей.

## 🔧 Процесс изменения безопасности

### Изменение CSP

1. Обсуди изменение в PR — тег `security`.
2. Измени **оба** места: `WindowManager` (заголовок) и `layout.tsx` (мета-тег).
3. Обнови этот документ — раздел _Changelog_.
4. Запусти регресс-тесты: `yarn test:ci tests/regression/csp-*`

### Добавление новых IPC каналов

1. Добавь типы в `shared-types/ipc.ts`
2. Сгенерируй `allowed-channels.json`: `yarn build:types`
3. Добавь обработчик в соответствующий менеджер
4. Добавь тесты в `tests/0_unit/ipc/`

---

Эти четыре столпа — **Sandbox, CSP, защита протокола и безопасный IPC** — формируют основу надежной и безопасной архитектуры NEIRA Super App.
