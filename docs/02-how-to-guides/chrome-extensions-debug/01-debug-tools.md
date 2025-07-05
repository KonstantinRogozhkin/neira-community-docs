# Инструменты отладки Chrome расширений

**Родительский документ:** [Руководство по отладке расширений Chrome](/how-to-guides/debugging-chrome-extensions)

## 🔧 DevTools для расширений

NEIRA Super App предоставляет доступ к DevTools для отладки расширений Chrome:

```typescript
// Открытие DevTools для background страницы расширения
async function openExtensionDevTools(extensionId: string) {
  const extensionsManager = getExtensionsManager()
  const extension = extensionsManager.getExtension(extensionId)
  
  if (extension && extension.backgroundPage) {
    extension.backgroundPage.openDevTools()
    return true
  }
  
  console.error('Расширение не найдено или не имеет background страницы')
  return false
}
```

Для открытия DevTools через интерфейс приложения:

1. Откройте раздел "Настройки" > "Расширения"
2. Найдите нужное расширение
3. Нажмите "Дополнительные опции" > "Открыть DevTools"

## 📋 Логирование расширений

Для просмотра логов расширений:

1. **В режиме разработки:**
   - Логи выводятся в консоль Electron
   - Запустите приложение с флагом `--enable-logging`:

     ```bash
     yarn start:full --enable-logging
     ```

2. **В продакшене:**
   - Логи сохраняются в файл `extensions.log`
   - Расположение файла:
     - Windows: `%USERPROFILE%\AppData\Roaming\neira-super-app\logs\extensions.log`
     - macOS: `~/Library/Application Support/neira-super-app/logs/extensions.log`
     - Linux: `~/.config/neira-super-app/logs/extensions.log`

## 🔍 Инспектор расширений

Для детального анализа расширений используйте встроенный инспектор:

1. Откройте раздел "Настройки" > "Расширения"
2. Нажмите "Инспектор расширений"
3. Доступные функции:
   - Просмотр манифеста
   - Анализ используемых API
   - Проверка разрешений
   - Мониторинг потребления ресурсов

## 📊 Профилирование производительности

```typescript
// Получение метрик производительности расширений
const metrics = await extensionsManager.getExtensionsMetrics()
console.table(metrics)
```

Для профилирования background скриптов:

- Откройте DevTools для background страницы
- Используйте вкладку "Performance" для профилирования

---

**Модуль создан DOCBUILDER при рефакторинге больших документов**
