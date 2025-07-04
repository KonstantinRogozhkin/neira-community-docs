# 🧪 Инструкция для Reviewer по поддержанию тестовой системы NEIRA Super App

Версия: 2025-06-15  
Ответственный за актуализацию: QA-Lead / Tech-Writer Team Lead

## 🎯 Цель документа

Дать Reviewer (исполнителю, проверяющему папку `tests/`) единый, исчерпывающий алгоритм, который:

1. Поддерживает целевую структуру каталога `tests/`.
2. Обеспечивает актуальность и полноту автотестов (unit/integration/e2e и др.).
3. Конвертирует debug-скрипты в формальные тесты, уничтожая «технический мусор».
4. Постоянно улучшает процесс за счёт **self-learning** и метрик.

> ⚠️ Документ генерируется AI-скриптом, но финальная ответственность — за QA-Lead.

---

## 1. Концепция «Зелёный master»

• **Нулевая толерантность к хаосу** — PR не мержится, пока pipeline ✅.  
• Любой debug-скрипт → системный тест ≤ 7 дней.  
• Каталог `tests/_archive/YYYY-MM/` хранит устаревшие тесты и скрипты (исключён из CI).

---

## 2. Целевая структура `tests/`

```
tests/
├─ 0_unit/           # менее 200 ms
├─ 1_integration/    # менее 2 s
├─ 2_e2e/            # менее 30 s
├─ 3_smoke/          # критич. маршруты (`<10` s)
├─ regression/       # защита от багов (`<5` s)
├─ performance/      # бенчмарки (`<60` s)
├─ helpers/          # mocks, utils
├─ _archive/         # устаревшие тесты
└─ README.md + INSTRUCTIONS_FOR_REVIEWER.md
```

---

## 3. Еженедельный цикл «S-A-C-V-C»

| №   | Шаг                                        | Команда / инструмент                      | Цель / Выход          |
| --- | ------------------------------------------ | ----------------------------------------- | --------------------- |
| 1   | **Scan** — поиск новых/изменённых скриптов | `node scripts/test-suite-manager.js scan` | список кандидатов     |
| 2   | **Analyze** — определить тип, приоритет    | `… analyze`                               | meta-jsonper test     |
| 3   | **Convert** — скрипт → тест                | `… convert`                               | файл `*.spec.ts`      |
| 4   | **Validate** — запустить suite + линтеры   | `… validate`                              | все тесты pass        |
| 5   | **Clean** — архивировать скрипты           | `… clean`                                 | `scripts/debug/` пуст |
| 6   | **Coverage update**                        | `yarn test:coverage`                      | отчёт `coverage/`     |
| 7   | **CI pipeline** — проверить лимиты         | `yarn test`                               | build ✅              |
| 8   | **Changelog inject**                       | добавить строку в `CHANGELOG.md`          | traceability          |
| 9   | **Commit & Push**                          | `git commit -m "tests: cycle 2025-06-15"` | PR                    |

⏱️ Ориентир: ≤ 2 ч на цикл.

---

## 4. Ежемесячный аудит

### 4.1 Приоритеты

A. **Покрытие regression** — все баги имеют тест.  
B. **Flaky tests** — выявить, изолировать, исправить.  
C. **Performance baseline** — контроль деградаций.  
D. **CI скорость** — pipeline PR < 8 мин.

### 4.2 Методика

1. **Inventory** — `tree -L 2 tests` + `yarn test:coverage`.
2. **Verify** — запустить `yarn test` в отрыве от сети; сравнить baseline.
3. **Update** — конвертировать скрипты, удалить/архивировать legacy.

### 4.3 Критерии Done

• Покрытие критических путей ≥ 95 %.  
• Flaky tests ≤ 2 на suite.  
• Время `yarn test` PR ≤ 8 мин.  
• Папки `scripts/debug/` и `tests/_archive/` пусты или обновлены. Также нужно проверить главную папку проекта от тестовых скриптов.  
• Все тесты именованы по шаблону.

---

## 5. Стандарты тестов

| Категория   | Timeout | Coverage      | Имя файла                                         |
| ----------- | ------- | ------------- | ------------------------------------------------- |
| Unit        | 5 s     | ≥ 90 % stmt   | `unit.api-manager.provider-factory.spec.ts`       |
| Integration | 15 s    | ≥ 80 % path   | `integration.mcp.super-app.spec.ts`               |
| E2E         | 30 s    | 100 % критич. | `e2e.browser.tab-creation.spec.ts`                |
| Regression  | 5 s     | 100 % bug     | `regression.mcp-tools.connection-failure.spec.ts` |

---

## 6. Правила коммитов и PR

Формат: `test(<scope>): <action>`  
Примеры: `test(regression): add MCP connection failure test`  
Один PR = логический блок (weekly-cycle **или** audit).  
CI-job **tests-check** обязателен (run + coverage + lint).

---

## 7. Чек-лист Reviewer-а

- [ ] Структура папки соответствует `2.`
- [ ] Все новые тесты проходят локально `yarn test`
- [ ] Coverage ≥ target
- [ ] Время pipeline соблюдено (< 8 мин)
- [ ] Flaky threshold не превышен
- [ ] Скрипты в `scripts/debug/` удалены/архивированы
- [ ] Семантический commit-message

---

## 8. Self-Learning & Improvement

1. **Review insights** — после PR добавь запись в `tests/_reports/review-insights.md` (дата, инсайт, действие).
2. **Pattern library** — повторяющийся анти-паттерн → файл в `tests/helpers/patterns/` (≤ 80 стр.).
3. **Metrics dashboard** — ежеквартально: среднее время pipeline, flaky-rate, coverage-delta.
4. **Automation wishlist** — новые идеи → `scripts/README.md#wishlist-tests`.

➡️ **Цель self-learning** — ускорять тест-цикл ≥ 10 % каждый квартал без потери качества.

---

## 9. Быстрый старт для новичка

```bash
npm i
npm run bootstrap                # install workspace deps

# выполнить полный suite локально
yarn test

# разработка TDD
yarn test:watch --filter path/to/file.spec.ts
```

---

_Файл обновляется автоматически, но подписывается QA-Lead._
