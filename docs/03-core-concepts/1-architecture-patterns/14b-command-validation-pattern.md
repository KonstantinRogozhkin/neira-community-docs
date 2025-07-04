# 🛡️ Command Validation Pattern

> **Применение:** Безопасная валидация команд в TaskExecutionService  
> **Статус:** Критический  
> **Приоритет:** 95

## 🚨 Проблема

**Критическая уязвимость:** Использование blacklist вместо whitelist в TaskExecutionService.

**Детали проблемы:**

- Возможность обхода защиты через новые команды
- Отсутствие валидации параметров команд
- Риск injection атак

## ✅ Решение: Whitelist архитектура

### Основная реализация

```typescript
// ✅ БЕЗОПАСНАЯ АРХИТЕКТУРА
const ALLOWED_COMMANDS = {
  desktop_click: DesktopClickValidator,
  browser_navigate: BrowserNavigateValidator,
  file_read: FileReadValidator,
} as const

interface CommandValidator<T> {
  validate(command: string, params: T[]): Promise<ValidationResult>
}

class WhitelistCommandValidator {
  async validate(command: string, params: any[]): Promise<ValidationResult> {
    // 1. Проверка разрешенной команды
    const validator = ALLOWED_COMMANDS[command]
    if (!validator) {
      return {
        valid: false,
        error: `Command '${command}' is not allowed`,
      }
    }

    // 2. Валидация параметров
    return validator.validate(command, params)
  }
}
```

### Валидаторы параметров

```typescript
// Пример валидатора для файловых операций
class FileReadValidator implements CommandValidator<string> {
  async validate(command: string, params: string[]): Promise<ValidationResult> {
    const [filePath] = params

    // Проверка пути
    if (!filePath || typeof filePath !== 'string') {
      return { valid: false, error: 'Invalid file path' }
    }

    // Проверка на path traversal
    if (filePath.includes('..') || filePath.includes('~')) {
      return { valid: false, error: 'Path traversal detected' }
    }

    // Проверка разрешенных расширений
    const allowedExtensions = ['.txt', '.md', '.json']
    const ext = path.extname(filePath)
    if (!allowedExtensions.includes(ext)) {
      return { valid: false, error: `File extension ${ext} not allowed` }
    }

    return { valid: true }
  }
}
```

## 📊 Метрики безопасности

```typescript
const SECURITY_METRICS = {
  'security.command_validation_time': histogram(),
  'security.blocked_commands_count': counter(),
  'security.injection_attempts': counter(),
  'security.validation_failures': counter(),
}

// Использование метрик
class SecurityMonitor {
  recordBlockedCommand(command: string) {
    SECURITY_METRICS['security.blocked_commands_count'].inc({
      command,
      reason: 'not_whitelisted',
    })
  }

  recordValidationTime(duration: number) {
    SECURITY_METRICS['security.command_validation_time'].observe(duration)
  }
}
```

## 🔄 Поэтапное внедрение

### Фаза 1: Параллельная система (неделя 1)

```typescript
const validateCommand = (command: string, params: any[]) => {
  if (FEATURE_FLAGS.USE_WHITELIST_VALIDATION) {
    return whitelistValidator.validate(command, params)
  }
  return legacyBlacklistValidator.validate(command, params)
}
```

### Фаза 2: Тестирование (неделя 2)

- Comprehensive testing всех команд
- A/B тестирование в dev окружении
- Мониторинг производительности

### Фаза 3: Полный переход (неделя 3)

- Включение whitelist по умолчанию
- Удаление legacy кода
- Обновление документации

## 🎯 Критерии готовности

**Обязательные требования:**

- [ ] Блокировка неразрешенных команд: **100%**
- [ ] Защита от injection атак: **100%**
- [ ] Покрытие тестами: **100%**
- [ ] Время валидации: **sub-1ms**

## 🧪 Тестирование

```typescript
describe('WhitelistCommandValidator', () => {
  it('should block non-whitelisted commands', async () => {
    const result = await validator.validate('malicious_command', [])
    expect(result.valid).toBe(false)
    expect(result.error).toContain('not allowed')
  })

  it('should validate parameters for allowed commands', async () => {
    const result = await validator.validate('file_read', ['../etc/passwd'])
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Path traversal')
  })
})
```

## 📈 Ожидаемые результаты

- **Безопасность:** Устранение критической уязвимости
- **Производительность:** Валидация менее 1ms
- **Надежность:** 100% покрытие тестами
- **Мониторинг:** Полная наблюдаемость security events

---

**Дедлайн:** 31.07.2025  
**Время выполнения:** 16-20 часов  
**Ответственный:** Команда разработки
