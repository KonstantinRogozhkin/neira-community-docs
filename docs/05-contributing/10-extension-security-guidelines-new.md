# 🔒 Безопасность Chrome Расширений

> **Статус:** Production Ready · **Версия:** 2.0 · **Дата:** 2025-07-01

## 🎯 Модель угроз

| Угроза               | Вектор           | Защита                  | Приоритет |
| -------------------- | ---------------- | ----------------------- | --------- |
| Вредоносный код      | Установка        | Whitelist + подпись     | CRITICAL  |
| Утечка данных        | API доступ       | Минимальные permissions | HIGH      |
| Code injection       | Уязвимости       | Sandbox + CSP           | HIGH      |
| Privilege escalation | Native Messaging | Валидация сообщений     | MEDIUM    |

## 🛡️ Система защиты

### Автоматическая проверка

```typescript
const securityConfig = {
  allowlist: ['extension-id-1', 'extension-id-2'],
  denylist: ['malicious-extension-id'],
  sensitivePermissions: ['tabs', 'cookies', 'webRequest'],

  beforeInstall: async (id, manifest) => {
    const hasRiskPerms = manifest.permissions?.some((p) => sensitivePermissions.includes(p))
    return hasRiskPerms ? { action: 'prompt' } : { action: 'allow' }
  },
}
```

### Content Security Policy

```typescript
// ✅ БЕЗОПАСНАЯ CSP (без 'unsafe-eval')
extensionsManager.setExtensionCSP('extension-id', {
  'script-src': ["'self'"],
  'object-src': ["'none'"],
  'unsafe-eval': false, // НИКОГДА не включать!
})
```

**Решенная проблема (SECURITY:FRAMER_MOTION_CSP_FIX):**

- ❌ Было: framer-motion требовал 'unsafe-eval'
- ✅ Стало: CSS анимации через Tailwind, CSP без 'unsafe-eval'
- 📈 Результат: Значительно повышена безопасность

## 🔍 Ручная проверка

### Чек-лист перед установкой

- [ ] **Репутация** в Chrome Web Store (рейтинг >4.0)
- [ ] **Permissions** обоснованы функциональностью
- [ ] **Код проверен** (для open-source)
- [ ] **Тестирование** в изолированной среде

### Принцип минимальных привилегий

```json
{
  "permissionOverrides": {
    "extension-id": {
      "allow": ["storage", "activeTab"],
      "deny": ["tabs", "webRequest"]
    }
  }
}
```

## 🔐 Native Messaging Security

### Безопасная обработка сообщений

```typescript
function handleNativeMessage(message: any): void {
  // 1. Валидация структуры
  if (!message?.command) throw new Error('Invalid format')

  // 2. Whitelist команд
  const allowed = ['read-password', 'save-password']
  if (!allowed.includes(message.command)) {
    throw new Error(`Command not allowed: ${message.command}`)
  }

  // 3. Безопасное выполнение
  executeCommand(message.command, message.params)
}
```

### Ограничение доступа

```json
{
  "com.example.password_manager": {
    "path": "/path/to/native_host",
    "allowed_origins": ["chrome-extension://specific-id-only"]
  }
}
```

## 📊 Мониторинг и аудит

### Автоматический мониторинг

```typescript
extensionsManager.on('api-access', (event) => {
  if (event.api === 'cookies.getAll') {
    logger.warn('Sensitive API access:', event.extensionId)
  }
})
```

### Регулярный аудит

- **Еженедельно:** Проверка новых расширений
- **Ежемесячно:** Аудит permissions активных расширений
- **Ежеквартально:** Полный security review

## 🚨 Incident Response

### При обнаружении угрозы

1. **Немедленно** отключить расширение
2. **Изолировать** затронутые данные
3. **Уведомить** пользователей
4. **Обновить** blacklist/allowlist
5. **Провести** полный аудит

### Критерии блокировки

- Доступ к sensitive API без обоснования
- Попытки обхода sandbox
- Подозрительная сетевая активность
- Изменения в permissions без уведомления

## 📚 Связанные документы

- [Security Principles](/03-core-concepts/1-architecture-patterns/08-security-principles)
- [Chrome Extensions Reference](/04-reference/02-chrome-extensions)
- [Risk Management Patterns](/03-core-concepts/1-architecture-patterns/15-risk-management-patterns)

---

**Ответственный:** Security Team  
**Reviewer:** Architecture Team
