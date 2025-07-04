# Интеграция с Polylith Backend

## 1. Концепция

**Polylith Backend (`@neira/polylith-backend`)** — это реализация микросервисной архитектуры внутри монорепозитория. Её цель — инкапсулировать сложную бизнес-логику, особенно связанную с AI, в изолированные, переиспользуемые и тестируемые компоненты.

Пакет `shell` не должен содержать сложной AI-логики. Его задача — управлять окнами, процессами и IPC, а всю тяжелую работу делегировать специализированным компонентам в Polylith.

## 2. Процесс миграции: от `APIManager` к Polylith

Ранее `APIManager` в `shell` был монолитным классом, который отвечал за всё: от обработки IPC-запросов до генерации текста и управления моделями. Это приводило к дублированию кода и усложняло поддержку.

Процесс рефакторинга включал следующие шаги:

1. **Выявление дублирующей логики:** Была определена логика (например, генерация текста, управление промптами), которая должна находиться в Polylith, а не в `shell`.
2. **Делегирование вызовов:** `APIManager` был изменен так, чтобы вместо выполнения логики самостоятельно, он вызывал соответствующие сервисы из `@neira/polylith-backend`.
3. **Удаление устаревшего кода:** После успешного делегирования устаревшие методы и feature-флаги (например, `USE_POLYLITH_AI_PIPELINE`) были полностью удалены из `APIManager`.

## 3. Результаты и текущее состояние

- **Четкое разделение ответственности:** `APIManager` теперь является "тонким" оркестратором, который только маршрутизирует запросы. Вся AI-логика находится в Polylith.
- **Устранение дублирования:** Код, связанный с AI, больше не разбросан по разным частям системы.
- **Улучшение тестируемости:** Изолированные компоненты Polylith гораздо проще тестировать, чем монолитный `APIManager`.

**Принцип для дальнейшей разработки:** Любая новая функциональность, связанная с AI или другой сложной бизнес-логикой, должна реализовываться как новый компонент или сервис в `@neira/polylith-backend`, а не добавляться в менеджеры `shell`.
