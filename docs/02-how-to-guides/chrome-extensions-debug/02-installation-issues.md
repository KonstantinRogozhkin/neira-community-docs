# Диагностика проблем установки Chrome расширений

**Родительский документ:** [Руководство по отладке расширений Chrome](/how-to-guides/debugging-chrome-extensions)

## 🚨 Расширение не устанавливается

### Симптомы

- Ошибка при установке
- Расширение не появляется в списке установленных

### Диагностика

1. Проверьте логи установки:

   ```typescript
   // В консоли разработчика
   const extensionsManager = getExtensionsManager()
   extensionsManager.setLogLevel('debug')
   extensionsManager.installExtension('extension-id')
   ```

2. Проверьте доступность расширения в Chrome Web Store:

   ```typescript
   // Проверка доступности
   const isAvailable = await extensionsManager.checkExtensionAvailability('extension-id')
   console.log('Доступно:', isAvailable)
   ```

### Решения

1. **Проблема:** Неверный ID расширения
   **Решение:** Проверьте ID расширения в Chrome Web Store (часть URL после `detail/`)

2. **Проблема:** Расширение в черном списке
   **Решение:** Проверьте конфигурацию `denylist` в `ExtensionsManager`

3. **Проблема:** Несовместимая версия манифеста
   **Решение:** Убедитесь, что расширение использует поддерживаемую версию манифеста (v2 или v3)

4. **Проблема:** Ошибка загрузки CRX
   **Решение:** Проверьте сетевое соединение и доступность Chrome Web Store

## 🔍 Проверка CRX файлов

Для ручной проверки CRX файлов:

```typescript
const { validateCrxFile } = require('electron-chrome-web-store/dist/crx3')

async function checkCrxFile(path) {
  try {
    const result = await validateCrxFile(path)
    console.log('CRX валиден:', result)
    return result
  } catch (error) {
    console.error('Ошибка валидации CRX:', error)
    return false
  }
}
```

## 🛡️ Конфликты манифестов

### Проверка совместимости манифеста

```typescript
// Получение разрешений расширения
const extension = extensionsManager.getExtension('extension-id')
const manifest = extension.manifest
console.log('Версия манифеста:', manifest.manifest_version)
console.log('Разрешения:', manifest.permissions)
```

---

**Модуль создан DOCBUILDER при рефакторинге больших документов**
