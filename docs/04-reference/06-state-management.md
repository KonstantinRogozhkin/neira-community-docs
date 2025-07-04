# 🏗️ Архитектура управления состоянием

**Версия:** 2.0 | **Статус:** ✅ Стандарт | **Дата обновления:** 2025-07-01

## ⚡ Философия

NEIRA Super App использует **трехуровневую архитектуру** состояния, чтобы гарантировать, что `shell` (main-процесс) является **единственным источником правды (SSOT)**, в то время как `neira-app` (UI) остается легковесным, производительным и предсказуемым.

## 🏛️ Трехуровневая архитектура

1.  **`shell` (Main Process) State**: Абсолютный источник правды для всего, что касается бэкенд-логики, конфигураций и состояния системы (например, `MCPManager`, `APIManager`).
2.  **`neira-app` Cached Server State (React Query)**: Кэшированное состояние данных, полученных из `shell` по асинхронным IPC-каналам. Используется для данных, которые не требуют синхронизации в реальном времени (например, история чатов).
3.  **`neira-app` UI State (Zustand)**: Эфемерное, синхронное состояние UI (например, открыта ли боковая панель, текущая тема).

---

## 1. Main Process: The Single Source of Truth (SSOT)

Вся бизнес-логика и персистентное состояние находятся в `shell`.

- **Пример: `MCPManager`**
  - Хранит список серверов, статус подключения, активные инструменты.
  - Персистит данные в `electron-store`.
  - Уведомляет UI об изменениях через `webContents.send()`.

UI **никогда** не изменяет это состояние напрямую. Он лишь отправляет команды (`invoke`) для его изменения.

## 2. React Query: Кэширование асинхронных IPC-данных

React Query — стандарт для работы с данными, которые запрашиваются у `shell`.

### Типизированные клиенты

```typescript
// lib/ipc-api.ts
export const chatsAPI = \{
  getList: () => window.neiraAPI.invoke('chats:list'),
  getMessages: (chatId: string) => window.neiraAPI.invoke('chats:messages', chatId)
}
```

### Хуки с кешированием

```typescript
export const useChats = () => \{
  return useQuery(\{
    queryKey: ['chats'],
    queryFn: chatsAPI.getList,
    staleTime: 5 * 60 * 1000,  // 5 мин кеш
    gcTime: 10 * 60 * 1000,  // 10 мин garbage collection
  })
}
```

## 3. Zustand: Синхронное UI-состояние

Zustand используется для легковесного, быстрого состояния, специфичного для UI.

### Пример: `useUIStore`

```typescript
// lib/store/uiStore.ts
const useUIStore = create<UIState>()(
  persist(
    (set) => (\{
      sidebar: \{ isOpen: true },
      // ...
    }),
    \{
      name: 'ui-store',
      // ✅ Сохраняем только конфигурацию UI
      partialize: (state) => (\{
        sidebar: \{ isOpen: state.sidebar.isOpen },
        theme: state.theme
      })
    }
  )
)
```

### Пассивный UI-стор для MCP

Для отображения состояния из `shell`, мы используем специальный "пассивный" стор, который только слушает события.

```typescript
// features/mcp/hooks/useMCPPassiveStore.ts
// ...
export const useMCPPassiveStore = create<MCPState>((set) => (\{
  // ... начальное состояние ...
  initializeListener: () => \{
    window.neiraAPI.on('mcp:state-update', (newState) => \{
      set(newState); // Просто обновляем стор данными из main
    });
    // Запрашиваем начальное состояние
    window.neiraAPI.invoke('mcp:getSystemState').then(set);
    return () => window.neiraAPI.off('mcp:state-update');
  }
}));
```

Этот хук **не имеет actions** для изменения состояния. Он — пассивное зеркало `MCPManager`.

## 🌟 Продвинутая реализация: Композиция хуков

Для очень сложных фич, таких как чат, мы применяем **композицию хуков**, чтобы избежать "God Hooks".

- **Декомпозиция "God Hook"**: Основной хук (`useChatCore`) разбивается на несколько более мелких, специализированных хуков.
- **Оркестратор**: `useChatCore` становится "оркестратором", который вызывает эти хуки и передает зависимости между ними.

### Пример на `useChatCore`

Композиция хуков — **золотой стандарт** для сложных фич в `neira-app`. Она обеспечивает максимальную поддерживаемость и масштабируемость.

```typescript
// packages/features/chat/hooks/useChatCore.ts

// 1. Импортируем специализированные хуки
import \{ useChatState } from './useChatState';
import \{ useMCPIntegration } from './useMCPIntegration';
import \{ useChatSession } from './useChatSession';
import \{ useChatInputHandlers } from './useChatInputHandlers';

// 2. useChatCore становится оркестратором
export const useChatCore = (props) => \{
  // Каждый хук решает одну задачу
  const chatState = useChatState(props);             // UI состояние (Zustand)
  const mcpIntegration = useMCPIntegration();        // MCP данные (из пассивного стора)
  const chatSession = useChatSession(props);         // История, кеш (React Query)
  const inputHandlers = useChatInputHandlers(/* ... */); // Обработчики ввода

  // 3. Возвращаем единый, простой API для компонента
  return \{ /* ... объединенные props и хендлеры ... */ };
}
```

## 🛠️ Практические правила

1.  **SSOT в `shell`**: Вся бизнес-логика, требующая персистентности или доступа к системным ресурсам, живет в `shell` и управляется через `Manager`.
2.  **IPC для команд**: UI отправляет команды в `shell` через `window.neiraAPI.invoke()`.
3.  **IPC для обновлений**: `shell` пушит обновления в UI через `window.neiraAPI.on()`.
4.  **React Query для асинхронных данных**: Используйте `useQuery` для получения "статичных" данных из `shell` (например, список чатов).
5.  **Zustand для состояния UI**: Используйте Zustand для всего, что касается только отображения (темы, состояние модалок, и т.д.).

## 🔑 Критические анти-паттерны

❌ **Дублирование состояния**: Хранить состояние MCP (например, список серверов) в `neira-app`.
❌ **Прямые вызовы из UI**: Пытаться управлять файлами или системными ресурсами напрямую из React-компонента.
❌ **Runtime в `persist`**: Сохранять в `localStorage` временные данные, вроде `status: 'connected'`.
❌ **useState для глобального состояния**: Использовать `useState` для данных, нужных в нескольких несвязанных компонентах.

---

**Примечание:** Эта архитектура — результат масштабного рефакторинга (Phase 3 Legacy Migration) и является обязательной для всего нового кода.

## 💎 Золотые правила Zustand (Daebak 2.0)

> Эти правила сформулированы после расследования **"Zustand SSR & Infinite Loop"** (2025-06-18) и являются обязательными для всего нового кода.

| №   | Правило                                                                                                           | Почему важно                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | **SSR-безопасность**: любой доступ к `window` / `document` должен быть обернут в `typeof window !== 'undefined'`. | Избегает крэшей при static export / prerender.                      |
| 2   | **Примитивные селекторы**: подписывайтесь только на примитивы (`state => state.field`).                           | Стабильные ссылки → меньше ререндеров → нет "stale closure" ошибок. |
| 3   | **Нет "self-update" эффектов**: не включайте значения из стора в `useEffect` если этот эффект сам меняет стор.    | Предотвращает `Maximum update depth exceeded`.                      |

### Шаблон примитивных селекторов

```typescript
// ✅ Правильно: селекторы примитивов
const input = useChatSessionStore((s) => s.input)
const inputMode = useChatSessionStore((s) => s.inputMode)

// ❌ НЕ делайте так: создаёт новый объект каждый рендер
// const { input, inputMode } = useChatSessionStore(s => ({ input: s.input, inputMode: s.inputMode }))
```

Эти правила должны проверяться во время ревью и линтиться при помощи `eslint-plugin-zustand` (см. раздел Contributing).
