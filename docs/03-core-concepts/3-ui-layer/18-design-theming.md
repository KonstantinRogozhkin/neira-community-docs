# 🎨 Дизайн-система и темизация

> **Сводка:** NEIRA Super App использует **семантическую дизайн-систему** на базе Tailwind CSS и CSS-переменных с цветовой моделью `oklch()` для обеспечения визуальной консистентности, легкой поддержки и автоматической адаптации тем.

## Принцип №1: Отказ от жестко закодированных значений

Использование конкретных значений (например, `color: #1a2b3c`, `padding: 13px`) напрямую в стилях компонентов является **анти-паттерном**. Это ведет к несогласованности, трудностям при редизайне и делает невозможной полноценную и гибкую темизацию.

## ✅ Решение: Семантическая система на CSS-переменных

### 1. Определение переменных в globals.css

В `packages/neira-app/app/(core)/globals.css` определены базовые переменные для каждой темы (light, dark и др.).

```css
/* Пример для :root (dark theme) */
:root,
.dark \{
  --background: oklch(20% 0.01 275);
  --foreground: oklch(95% 0.005 280);
  --card: oklch(22% 0.01 280);
  --primary: oklch(57% 0.22 283);
  --primary-foreground: oklch(98% 0 0);
  --border: oklch(30% 0.01 280);
  /* ... и так далее */
}

/* Пример для .light (light theme) */
.light \{
  --background: oklch(98% 0.005 280);
  --foreground: oklch(20% 0.01 275);
  /* ... и так далее */
}
```

### 2. Использование в tailwind.config.js

Ключевое отличие: вместо `hsl(var(...))` используется `oklch(var(...))`, чтобы Tailwind правильно интерпретировал значения.

```javascript
// tailwind.config.js
theme: \{
  extend: \{
    colors: \{
      background: 'oklch(var(--background))',
      foreground: 'oklch(var(--foreground))',
      primary: \{
        DEFAULT: 'oklch(var(--primary))',
        foreground: 'oklch(var(--primary-foreground))',
      },
      card: \{
        DEFAULT: 'oklch(var(--card))',
        foreground: 'oklch(var(--card-foreground))',
      },
      border: 'oklch(var(--border))',
      accent: \{
        DEFAULT: 'oklch(var(--accent))',
        foreground: 'oklch(var(--accent-foreground))',
      },
      // Кастомные цвета
      sidebar: 'oklch(var(--sidebar))',
      'chart-1': 'oklch(var(--chart-1))',
    },
  },
},
```

### 3. Преимущества цветовой модели OKLCH

- **Перцептивная равномерность**: Изменения в значениях соответствуют визуальному восприятию
- **Широкий цветовой охват**: Поддержка современных дисплеев с широкой цветовой гаммой
- **Предсказуемость**: Легче создавать гармоничные цветовые палитры
- **Будущее CSS**: Современный стандарт, который заменит HSL

## 3. Семантическое использование цветов

**✅ Правильно:**

```jsx
<div className="bg-background text-foreground border border-border">
  <h1 className="text-primary">Заголовок</h1>
  <p className="text-muted-foreground">Описание</p>
</div>
```

**❌ Неправильно:**

```jsx
<div style=\{\{ backgroundColor: '#0a0a0a', color: '#fafafa' }}>
  <h1 style=\{\{ color: '#6366f1' }}>Заголовок</h1>
</div>
```

## 4. Реализация переключения тем

Для управления темами используется библиотека `next-themes` с атрибутом `class`. Это автоматически добавляет класс `.dark` или `.light` к элементу `<html>`.

### Устранение "мигания" (FOUC)

Чтобы избежать мигания страницы при загрузке (когда сначала рендерится одна тема, а потом быстро переключается на другую), в `layout.tsx` добавлен inline-скрипт. Он выполняется **до** рендеринга React и немедленно применяет класс темы из `localStorage`.

```html
<!-- packages/neira-app/app/layout.tsx -->
`<script id="theme-init" strategy="beforeInterractive">`
  ;(function () \{
    /* ... код для применения темы ... */
  })()
</script>
```

### Простой ThemeProvider

```tsx
// packages/neira-app/components/common/ThemeProvider.tsx
export function ThemeProvider(\{ children, ...props }: ThemeProviderProps) \{
  return (
    `<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem \{...props}>`
      {children}
    </NextThemesProvider>
  )
}
```

## 5. Расширенные токены дизайн-системы

### Кастомные тени

```css
:root \{
  --shadow-2xs: 0px 6px 12px -3px #0000000a;
  --shadow-xs: 0px 6px 12px -3px #0000000a;
  --shadow-sm: 0px 6px 12px -3px #00000017, 0px 1px 2px -4px #00000017;
  --shadow: 0px 6px 12px -3px #00000017, 0px 1px 2px -4px #00000017;
  --shadow-md: 0px 6px 12px -3px #00000017, 0px 2px 4px -4px #00000017;
  --shadow-lg: 0px 6px 12px -3px #00000017, 0px 4px 6px -4px #00000017;
  --shadow-xl: 0px 6px 12px -3px #00000017, 0px 8px 10px -4px #00000017;
  --shadow-2xl: 0px 6px 12px -3px #00000038;
}
```

Использование: `className="shadow-lg"` или `className="drop-shadow-xl"`

### Sidebar-специфичные цвета

```css
--sidebar: oklch(15% 0.015 280);
--sidebar-foreground: oklch(93% 0.005 280);
--sidebar-primary: oklch(57% 0.22 283);
--sidebar-accent: oklch(49% 0.17 282);
```

Использование: `className="bg-sidebar text-sidebar-foreground"`

### Chart-цвета для графиков

```css
--chart-1: oklch(74% 0.16 34.71);
--chart-2: oklch(83% 0.11 58);
--chart-3: oklch(88% 0.08 54.93);
--chart-4: oklch(82% 0.11 40.89);
--chart-5: oklch(64% 0.13 32.07);
```

Использование: `className="fill-chart-1"` в SVG-элементах

## 6. Лучшие практики

### ✅ DO

- Используйте семантические названия цветов (`primary`, `secondary`, `muted`)
- Применяйте CSS-переменные для всех цветовых значений
- Тестируйте дизайн в обеих темах (light/dark)
- Используйте `oklch()` для определения новых цветов

### ❌ DON'T

- Не используйте жестко заданные hex-цвета в компонентах
- Не полагайтесь на `hsl()` — переходите на `oklch()`
- Не создавайте тени с помощью `box-shadow` напрямую — используйте токены
- Не забывайте про контрастность и доступность

---

**Верификация документа**

- **Дата проверки:** 2025-06-18
- **Проверил:** AI-Reviewer
- **Обоснование актуальности:** Гайд обновлен для использования цветовой модели `oklch()` и отражает текущую, исправленную архитектуру дизайн-системы.

---
