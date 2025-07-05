# ⚡ Оптимизация производительности UI

**Статус:** ✅ **Действующий гайд**  
**Применимо к:** AppShell, Layout Stability, Performance

**Связи:** [Дизайн и темизация](/core-concepts/ui-layer/design-theming)

## 🎯 Ключевые проблемы и решения

### 1. Устранение Layout Shift (CLS)

Layout Shift возникает из-за асинхронной подгрузки компонентов, меняющих раскладку.

**Решение:** Используйте CSS Grid для резервирования места и определяйте окружение (`isShell`) синхронно, без `useState` или `useEffect`, чтобы избежать двойного рендера.

```tsx
// ✅ globals.css: Стабильная сетка, резервирующая место
.app-shell-grid \{
  display: grid;
  grid-template-rows: auto 1fr; /* Ряд для хедера, 1fr для контента */
}

// ✅ useEnvironment.ts: Синхронное определение
export function useEnvironment() \{
  const isShell = typeof window !== 'undefined' && window.location.protocol === 'neira:';
  // ❌ НЕ используйте useState/useEffect - это вызывает двойной рендер
  return \{ isShell };
}
```

### 2. Декомпозиция компонентов

Большие "божественные" компоненты (&gt;200 строк) приводят к избыточным ре-рендерам.

**Решение:** Разделяйте компоненты по принципу единой ответственности (Single Responsibility Principle).

```tsx
// 👎 Плохо: AppShell (400+ строк) делает всё
function AppShell(\{ children }) \{
  const [isOpen, setIsOpen] = useState(false); // ...и другая логика
  return (/* ...сложный рендер с сайдбаром, тулбаром и т.д. */);
}

// 👍 Хорошо: Компоненты разделены
function AppShell(\{ children }) \{
  return (
    <div className="app-shell-grid">
      `<BrowserToolbar />`
      `<SidebarLayout />` 
      <main>{children}</main>
    </div>
  );
}
```

### 3. Виртуализация списков

Рендеринг сотен элементов в списке (например, чатов) блокирует UI.

**Решение:** Используйте `react-window` или `react-virtualized` для списков, содержащих более 50 элементов.

```tsx
import \{ FixedSizeList } from 'react-window';

// ✅ Виртуализация для длинных списков
export function ChatList(\{ chats }) \{
  if (chats.length < 50) \{
    return chats.map(chat => `<ChatItem key={chat.id} chat={chat} />`);
  }
  return (
    `<FixedSizeList height={400} itemCount={chats.length} itemSize={60}>`
      {VirtualizedChatItem}
    </FixedSizeList>
  );
}
```

## 📋 Чек-лист и метрики производительности

- **CLS (Layout Shift):** `< 0.1`. Используйте CSS Grid, избегайте `padding-top` для динамических элементов.
- **First Render:** `< 100ms`.
- **Component Render Time:** `< 16ms` (для 60fps). Используйте React.memo и `useCallback`.
- **Размер компонента:** `< 200 строк`.
- **Bundle Size:** `< 500KB` (gzipped). Используйте ленивую загрузку (`next/dynamic`).
- **Виртуализация:** Обязательна для списков `> 50` элементов.
- **Порядок хуков:** Всегда вызывайте хуки на верхнем уровне, до любых условий или `return`.

## 🔧 Инструменты

- **React DevTools Profiler:** `yarn dev:profile` для анализа времени рендера и причин обновлений.
- **Lighthouse:** `npx lighthouse http://localhost:3000` для общей оценки производительности.
- **Web Vitals:** Используйте библиотеку `web-vitals` для отслеживания CLS и других метрик в реальном времени.
