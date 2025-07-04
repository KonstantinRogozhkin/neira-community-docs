# Руководство по установке расширений Chrome

## Метаданные

- **Статус:** Актуально
- **Версия:** 1.0.0
- **Дата обновления:** 2025-06-30
- **Авторы:** DocBuilder AI Assistant

## Введение

NEIRA Super App поддерживает установку и использование расширений Chrome из Chrome Web Store. Это руководство описывает процесс установки, обновления и управления расширениями как для пользователей, так и для разработчиков.

## Для пользователей

### Установка расширений

Существует несколько способов установить расширение Chrome в NEIRA Super App:

#### 1. Через интерфейс приложения

1. Откройте NEIRA Super App
2. Перейдите в раздел "Настройки" > "Расширения"
3. Нажмите кнопку "Установить расширение"
4. Введите ID расширения или выберите из списка рекомендуемых
5. Подтвердите установку

#### 2. Через Chrome Web Store

1. Откройте Chrome Web Store в NEIRA Super App (chrome.google.com/webstore)
2. Найдите нужное расширение
3. Нажмите кнопку "Установить"
4. Подтвердите установку в диалоговом окне

### Управление расширениями

#### Просмотр установленных расширений

1. Откройте раздел "Настройки" > "Расширения"
2. Здесь отображается список всех установленных расширений с возможностью:
   - Включить/отключить расширение
   - Удалить расширение
   - Просмотреть детали расширения

#### Обновление расширений

Расширения обновляются автоматически каждые 5 часов. Для ручного обновления:

1. Откройте раздел "Настройки" > "Расширения"
2. Нажмите кнопку "Проверить обновления"

#### Удаление расширений

1. Откройте раздел "Настройки" > "Расширения"
2. Найдите расширение, которое хотите удалить
3. Нажмите кнопку "Удалить"
4. Подтвердите удаление

## Для разработчиков

### Программный API для управления расширениями

NEIRA Super App предоставляет API для программного управления расширениями через объект `ExtensionsManager`.

#### Установка расширения

```typescript
import { ExtensionsManager } from '@neira/shell'

// Получение экземпляра ExtensionsManager
const extensionsManager = getExtensionsManager()

// Установка расширения по ID
async function installExtension(extensionId: string) {
  try {
    const extension = await extensionsManager.installExtension(extensionId)
    console.log('Расширение установлено:', extension.id)
    return extension
  } catch (error) {
    console.error('Ошибка установки расширения:', error)
    throw error
  }
}
```

#### Удаление расширения

```typescript
async function uninstallExtension(extensionId: string) {
  try {
    await extensionsManager.uninstallExtension(extensionId)
    console.log('Расширение удалено:', extensionId)
  } catch (error) {
    console.error('Ошибка удаления расширения:', error)
    throw error
  }
}
```

#### Проверка обновлений

```typescript
async function checkForUpdates() {
  try {
    await extensionsManager.updateAllExtensions()
    console.log('Все расширения обновлены')
  } catch (error) {
    console.error('Ошибка обновления расширений:', error)
    throw error
  }
}
```

#### Получение списка установленных расширений

```typescript
async function getInstalledExtensions() {
  try {
    const extensions = await extensionsManager.getExtensions()
    console.log('Установленные расширения:', extensions)
    return extensions
  } catch (error) {
    console.error('Ошибка получения списка расширений:', error)
    throw error
  }
}
```

### Настройка белого и черного списков расширений

Для контроля устанавливаемых расширений можно настроить белый и черный списки:

```typescript
// В конфигурации ExtensionsManager
const config = {
  allowedExtensions: [
    'extension-id-1', // Например, uBlock Origin
    'extension-id-2', // Например, React Developer Tools
  ],
  blockedExtensions: [
    'malicious-extension-id-1',
    'malicious-extension-id-2',
  ],
  autoUpdate: true,
}

// Применение конфигурации
extensionsManager.setConfig(config)
```

### Валидация перед установкой

Можно добавить дополнительную валидацию перед установкой расширения:

```typescript
// В конфигурации installChromeWebStore
installChromeWebStore({
  // ...другие опции
  beforeInstall: async (extensionId, manifest) => {
    // Проверка разрешений расширения
    const permissions = manifest.permissions || []
    const sensitivePermissions = ['tabs', 'cookies', 'webRequest']
    
    const hasSensitivePermissions = permissions.some(
      perm => sensitivePermissions.includes(perm)
    )
    
    if (hasSensitivePermissions) {
      // Показать диалог подтверждения пользователю
      const confirmed = await showConfirmationDialog(
        `Расширение ${manifest.name} запрашивает чувствительные разрешения. Установить?`
      )
      
      return { action: confirmed ? 'allow' : 'deny' }
    }
    
    return { action: 'allow' }
  }
})
```

### Разработка расширений для NEIRA Super App

При разработке расширений для NEIRA Super App следует учитывать следующие особенности:

1. **Поддерживаемые API**
   - Большинство Chrome Extension API поддерживаются через пакет `electron-chrome-extensions`
   - Некоторые API могут иметь ограниченную функциональность

2. **Манифест**
   - Поддерживается Manifest V3
   - Рекомендуется использовать минимально необходимые разрешения

3. **Тестирование**
   - Для тестирования можно использовать режим разработчика
   - Загрузка распакованных расширений доступна в режиме разработки

## Устранение неполадок

### Расширение не устанавливается

1. Проверьте, что ID расширения указан корректно
2. Убедитесь, что расширение доступно в Chrome Web Store
3. Проверьте, не находится ли расширение в черном списке
4. Проверьте логи приложения на наличие ошибок

### Расширение не работает

1. Убедитесь, что расширение включено
2. Проверьте совместимость расширения с Electron
3. Проверьте, что необходимые API поддерживаются
4. Попробуйте переустановить расширение

### Расширение не обновляется

1. Попробуйте обновить расширение вручную
2. Проверьте доступность обновлений в Chrome Web Store
3. Убедитесь, что автоматическое обновление включено
4. Проверьте логи приложения на наличие ошибок

## Лучшие практики

1. **Безопасность**
   - Используйте белый список для контроля устанавливаемых расширений
   - Проверяйте разрешения расширений перед установкой
   - Регулярно обновляйте расширения для получения исправлений безопасности

2. **Производительность**
   - Устанавливайте только необходимые расширения
   - Отключайте неиспользуемые расширения
   - Следите за потреблением памяти расширениями

3. **Совместимость**
   - Проверяйте совместимость расширений с Electron
   - Учитывайте ограничения API в Electron
   - Тестируйте расширения в разных версиях приложения

## Связанные документы

- [Архитектура интеграции с Chrome Web Store](/03-core-concepts/2-shell-core/08-chrome-web-store-integration)
- [Справочник по Chrome Extensions API](/04-reference/02-chrome-extensions)

---

**Верификация документа**

- **Дата создания:** 2025-06-30
- **Создал:** DocBuilder AI Assistant
- **Источник:** Анализ пакета `electron-chrome-web-store`
- **Проверка актуальности:** Документ отражает текущее состояние кода на 30.06.2025
