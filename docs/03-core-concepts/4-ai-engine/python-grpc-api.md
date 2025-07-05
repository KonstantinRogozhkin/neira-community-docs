# 🐍 Python gRPC API & Integration

**Версия:** 1.2  
**Статус:** ✅ **Действующий стандарт**

## 🔄 Поток вызова Python-функции

1. **Менеджер в `shell`** (например, `APIManager`) решает, что задачу нужно делегировать Python.
2. Он вызывает метод `PythonAPIManager`:

   ```typescript
   // APIManager.ts
   const response = await this.pythonAPIManager.processPrompt(\{ prompt: 'Анализируй этот текст...' });
   ```

3. **`PythonAPIManager`**:
   - Проверяет, что gRPC-клиент готов.
   - Вызывает соответствующий метод gRPC-клиента: `this.grpcClient.processPrompt(...)`.
4. **Python-агент (gRPC Server)**:
   - Получает запрос.
   - Выполняет необходимую логику (например, обрабатывает текст с помощью библиотеки `nltk`).
   - Отправляет ответ.
5. **`PythonAPIManager`** получает ответ и возвращает его в `APIManager`.

## 🛠️ Кроссплатформенная интеграция и отказоустойчивость

### Кроссплатформенные пути к сокету (PYTHON:SOCKET_PATH_CROSS_PLATFORM)

**Решенная проблема:** Несоответствие путей к сокету между Python-агентом (`tempfile.gettempdir()`) и PythonAPIManager (`/tmp/` жестко задано) вызывало ошибки подключения.

**Решение:** Унификация через `os.tmpdir()` в TypeScript и переменную окружения `NEIRA_SOCKET_PATH` для кроссплатформенности.

```typescript
// Node.js (PythonAPIManager.ts)
private getSocketPath(): string {
  if (platform() === 'win32') {
    return '127.0.0.1:50051' // TCP для Windows
  } else {
    // Используем тот же путь к временной директории, что и Python-агент
    const tempDir = os.tmpdir()
    return `unix://${path.join(tempDir, 'neira_agent.sock')}` // Unix socket для macOS/Linux
  }
}
```

```python
# Python (agent.py)
def get_socket_path():
    """Определяет путь к Unix-сокету в зависимости от ОС"""
    # Используем переменную окружения, если она установлена
    env_socket_path = os.environ.get('NEIRA_SOCKET_PATH')
    if env_socket_path:
        return f"unix://{env_socket_path}" if platform.system() != "Windows" else env_socket_path

    # Или стандартный путь к временной директории
    temp_dir = tempfile.gettempdir()
    socket_name = 'neira_agent.sock'
    return f"unix://{os.path.join(temp_dir, socket_name)}" if platform.system() != "Windows" else "127.0.0.1:50051"
```

Пути к временным файлам на разных ОС:

- macOS: `/var/folders/XX/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/T/`
- Linux: `/tmp/`
- Windows: `C:\Users\USERNAME\AppData\Local\Temp\`

Для обеспечения согласованности путей между Node.js и Python, `PythonAPIManager` передает путь к сокету через переменную окружения `NEIRA_SOCKET_PATH` при запуске Python-агента:

```typescript
// Извлекаем путь к сокету без 'unix://' префикса для передачи в переменной окружения
const socketFilePath = this.socketPath.replace('unix://', '')

this.pythonProcess = spawn(this.agentPath, [], {
  env: {
    ...process.env,
    NEIRA_AGENT_MODE: 'production',
    NEIRA_LOG_LEVEL: 'info',
    NEIRA_SOCKET_PATH: socketFilePath, // Передаем путь к сокету
  },
})
```

**Результат:** Устранены ошибки подключения, обеспечена совместимость Windows через TCP.

### Решение race condition и повышение стабильности (PYTHON:GRPC_RACE_CONDITION_FIX)

**Решенная проблема:** Race condition при инициализации - Node.js клиент подключался до готовности gRPC сервера, вызывая сбои инициализации и переключение в mock-режим даже при исправном агенте.

**Решение:** Многоуровневая стратегия: сигнал готовности `AGENT_READY` + health check с экспоненциальной задержкой.

Для предотвращения проблемы race condition реализован надежный механизм ожидания:

1. **Проверка наличия и доступности сокета** перед первой попыткой подключения:

   ```typescript
   private async waitForSocketReady(socketPath: string, timeoutMs = 15000): Promise<boolean> {
     const plainPath = socketPath.replace('unix://', '')
     const startTime = Date.now()

     while (Date.now() - startTime < timeoutMs) {
       try {
         // Проверяем наличие файла сокета
         if (fs.existsSync(plainPath)) {
           this.logger.info(`✓ gRPC сокет найден: ${plainPath}`)
           return true
         }

         this.logger.debug(`Ожидание готовности gRPC сокета по пути: ${plainPath}`)
         await new Promise(resolve => setTimeout(resolve, 500))
       } catch (error) {
         this.logger.error(`❌ Ошибка при ожидании готовности gRPC сокета: ${error.message}`)
       }
     }

     this.logger.error(`⏱️ Превышено время ожидания появления сокета (${timeoutMs}ms)`)
     return false
   }
   ```

2. **Ожидание сигнала готовности:** `PythonAPIManager` активно слушает `stdout` запускаемого Python-процесса. Он ожидает строку-маркер (`AGENT_READY`), которая явно сигнализирует о том, что gRPC-сервер запущен и готов принимать соединения.

3. **Экспоненциальная задержка** для health-check'ов для преодоления временных проблем с соединением:

   ```typescript
   private async performHealthCheck(retries = 3): Promise<boolean> {
     for (let attempt = 1; attempt <= retries; attempt++) {
       try {
         const response = await (this.grpcClient as any).HealthCheck({ service: 'python-agent' })
         if (response?.healthy) {
           this.logger.info(`✅ Python Agent health check пройден: ${response.message} (v${response.version})`)
           return true
         }

         this.logger.warn(`⚠️ Получен отрицательный health check ответ: ${response?.message || 'Нет сообщения'}`)
       } catch (error) {
         const delay = Math.pow(2, attempt - 1) * 500 // 500ms, 1000ms, 2000ms, 4000ms...
         this.logger.warn(`⚠️  HealthCheck неудачен (попытка ${attempt}/${retries}). Повтор через ${delay} мс...`)
         await new Promise(resolve => setTimeout(resolve, delay))
       }
     }

     this.logger.error(`❌ Не удалось подтвердить готовность Python Agent после ${retries} попыток — переходим в мок-режим`)
     return false
   }
   ```

4. **Улучшенное логирование** в Python-агенте для точной диагностики проблем:

   ```python
   def HealthCheck(self, request, context):
       """Проверка здоровья сервиса"""
       logger.info(f"🔍 Health check запрос для сервиса: {request.service}")

       # Выводим детали запроса для отладки
       logger.debug(f"🔍 Детали запроса: {request}")
       logger.debug(f"🔍 Метаданные запроса: {context.invocation_metadata()}")

       response = agent_pb2.HealthCheckResponse(
           healthy=True,
           message="Python Agent работает корректно",
           version=self.version
       )

       logger.info(f"✅ Отправляем ответ health check: {response}")
       return response
   ```

### Решение проблемы регистра имен методов в gRPC

gRPC требует точного соответствия имен методов, включая регистр. При этом в разных языках используются разные соглашения:

- TypeScript/JavaScript обычно использует camelCase (healthCheck)
- Python при генерации из .proto файлов использует PascalCase (HealthCheck)

Для решения этой проблемы реализован универсальный хелпер:

```typescript
private callGrpcMethod(methodName: string, request: any): Promise<any> {
  if (!this.grpcClient) {
    throw new Error('gRPC клиент не инициализирован')
  }

  // Проверяем наличие метода с точным регистром
  if (typeof (this.grpcClient as any)[methodName] === 'function') {
    return (this.grpcClient as any)[methodName](/)7231
  }

  // Проверяем наличие метода с заглавной буквы (PascalCase)
  const pascalCaseMethod = methodName.charAt(0).toUpperCase() + methodName.slice(1)
  if (typeof (this.grpcClient as any)[pascalCaseMethod] === 'function') {
    this.logger.debug(`Вызываем метод ${pascalCaseMethod} (преобразован из ${methodName})`)
    return (this.grpcClient as any)[pascalCaseMethod](/)7604
  }

  // Если метод не найден, логируем доступные методы
``` 