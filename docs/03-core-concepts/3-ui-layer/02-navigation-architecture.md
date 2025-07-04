---
title: Архитектура навигации
sidebar_position: 2
---

# 🧭 Navigation & Deep Linking (Canonical)

**Version:** 2025-06-26 v1.0  
**Status:** ✅ Canonical

> Консолидирует:
>
> - `17-navigation-routing.md`
> - `20-deep-linking.md`
>   Архив: `docs/archive/2025-06-26/`

## 1. In-App Navigation (Next.js)

- `<Link>` для внутренних путей.
- IPC `navigation:navigate` для переходов из других процессов.
- Таблица соответствия `pathname` → `view`.

## 2. Deep Linking (neira:// URL Scheme)

- Регистрация протокола в `WindowManager`.
- Примеры: `neira://view/chat?chatId=123`, `neira://settings/profile`.
- Обработка в Preload: перенаправление на `<Link>` внутри.

## 3. Cross-Window Navigation

…

## 4. Security & Validation

…

## Решенные проблемы и рефакторинги

### SPA-навигация в браузере (NAVIGATION:SPA_FIX)

**Проблема:** В браузере навигация ломала SPA-парадигму — `createBrowserNavigationManager` использовал `window.location.href = url`, вызывая полную перезагрузку страницы и уничтожая состояние React и Zustand.

**Решение:**

- Создан хук `useNavigationManager` с унифицированным интерфейсом: в Electron использует IPC-каналы, в браузере — Next.js Router для SPA-навигации
- Обновлены `BrowserToolbar.tsx` и `TabsBar.tsx` для использования хука вместо прямого `navigationAPI.navigate`
- Добавлены предупреждающие комментарии в `navigation.ts` и тесты для нового хука

**Результат:** Устранена полная перезагрузка страниц в neira-app вне Electron, улучшено DX для разработчиков, архитектурная чистота соответствует Next.js App Router.

### Исправления навигации в Electron (NAVIGATION:ELECTRON_FIXES)

**Проблема:** Ошибки навигации `ERR_FILE_NOT_FOUND` при переходе на страницы настроек (`/settings`, `/settings/mcp`) и проблемы запуска Python Agent из-за поиска бинарного файла и proto-файлов.

**Решение:**

- Добавлен алиас `settings` в `AppRegistry` и исправлен метод `resolveUrl` в `NavigationManager.ts` для правильной обработки путей к settings
- Создан файл `index.html` в `packages/neira-app/out/settings/` для обработки запросов к корневому пути настроек
- Улучшена обработка ошибок в `PythonAPIManager.ts`: проверка прав на исполнение, подробное логирование, поиск proto-файлов в нескольких местах

**Результат:** Корректная навигация на страницы настроек, успешный запуск и инициализация Python Agent, подробное логирование для диагностики.

---

## Revision History

| Date       | Version | Change        | Author |
| ---------- | ------- | ------------- | ------ |
| 2025-08-05 | 2.0 | Интеграция знаний из Phase 2: SPA-навигация, Electron-фиксы | @docbuilder |
| 2025-06-26 | 1.0 | Initial merge | @docs-team |

## Основные концепции

### NavigationManager

`NavigationManager` — это абстракция, которая предоставляет унифицированный интерфейс для навигации. Он имеет две реализации:

- `createElectronNavigationManager` — для Electron-окружения, использует IPC-каналы для навигации
- `createBrowserNavigationManager` — для браузерного окружения, использует стандартные API браузера

### Хук useNavigationManager

Для компонентов React мы предоставляем хук `useNavigationManager`, который автоматически выбирает правильную реализацию в зависимости от окружения:

```tsx
import { useNavigationManager } from '@/hooks/useNavigationManager'

function MyComponent() {
  const navigation = useNavigationManager()
  
  const handleClick = () => {
    // Работает как в Electron, так и в браузере
    navigation.navigateTo('/settings')
  }
  
  return `<button onClick={handleClick}>`Go to Settings</button>
}
```

В Electron-окружении хук использует IPC-каналы для навигации, а в браузере — Next.js Router для SPA-навигации без перезагрузки страницы.

### Преимущества использования useNavigationManager

1. **SPA-навигация в браузере**: Вместо полной перезагрузки страницы через `window.location.href`, хук использует `router.push()` из Next.js для клиентской навигации.
2. **Единый интерфейс**: Один и тот же код работает как в Electron, так и в браузере.
3. **Типизация**: Все методы и параметры полностью типизированы.
4. **Тестируемость**: Легко мокается для тестирования.

## Архитектура навигации

### В Electron

```
React Component → useNavigationManager → navigationAPI.navigate → IPC → NavigationManager → TabManager → WebContentsView
```

### В браузере

```
React Component → useNavigationManager → Next.js Router → SPA-навигация
```

## Примеры использования

### Базовая навигация

```tsx
const navigation = useNavigationManager()

// Навигация на новый URL
navigation.navigateTo('/settings')

// Навигация назад/вперед
navigation.goBack()
navigation.goForward()

// Получение текущего пути
const currentPath = navigation.getCurrentPath()

// Подписка на изменение пути
useEffect(() => {
  const unsubscribe = navigation.onNavigationChange((path) => {
    console.log('Path changed:', path)
  })
  
  return unsubscribe
}, [navigation])
```

### Навигация с параметрами

```tsx
// Навигация с query-параметрами
navigation.navigateTo('/chat?id=123')

// Навигация с динамическими параметрами
navigation.navigateTo(`/user/${userId}`)
```

## Важные замечания

1. **Всегда используйте useNavigationManager** вместо прямых вызовов `getNavigationManager()` или `window.location.href` в React-компонентах.

2. **Не используйте напрямую navigationAPI** в компонентах, так как это обходит унифицированный слой навигации.

3. **Для ссылок внутри приложения** используйте компонент `Link` из Next.js, который автоматически использует клиентскую навигацию:

```tsx
import Link from 'next/link'

function MyComponent() {
  return `<Link href="/settings">`Settings</Link>
}
```

## Отладка навигации

Для отладки навигации можно использовать логи в консоли:

```tsx
const navigation = useNavigationManager()

navigation.navigateTo('/settings').catch(error => {
  console.error('Navigation failed:', error)
})
```

В Electron-окружении все события навигации логируются в консоль Main-процесса с префиксом `[NavigationManager]`.
