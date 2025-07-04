# Решение частых ошибок

Этот гайд содержит решения для конкретных, часто встречающихся сообщений об ошибках.

## 1. Ошибка "Unknown channel in browser mode"

- **Симптомы:**

  ```
  Error: Unknown channel in browser mode
      at Object.getTariffPlans (lib/ipc-api.ts:189:23)
  ```

- **Причина:** Вызов IPC-канала происходит в dev-сборке (`STATIC_MODE=1` или Next.js browser mode), для которого отсутствуют mock-данные. В этом режиме `window.neiraAPI` замещается mock-объектом, и вызовы реальных IPC-каналов падают.
- **Решение:**
  1. **Добавьте mock-ответ:** Откройте `lib/ipc-api.ts` и добавьте mock-ответ для вашего канала в объект `mockResponses`.

      ```typescript
      // lib/ipc-api.ts
      'models:get-tariffs': {
        success: true,
        data: [
          { id: 'free', name: 'Free Plan', pricePerMonth: 0, features: [] },
          { id: 'pro',  name: 'Pro Plan',  pricePerMonth: 20, features: [] }
        ]
      }
      ```

  2. **Добавьте Fallback (если необходимо):** Убедитесь, что для неизвестных или устаревших каналов есть безопасный fallback, возвращающий пустой payload.

      ```typescript
      if (channel.startsWith('models:') || channel.includes('tariff')) {
        return { success: true, data: [] };
      }
      ```

  3. **Запустите тест:** Убедитесь, что все проверки проходят.

      ```bash
      node scripts/test-ipc-browser-mode.js
      ```

> **Правило:** Все новые IPC-каналы **обязаны** иметь mock-ответ для browser-режима.

## 2. Ошибка "No provider for model gpt-4o-mini"

- **Причина:** `APIManager` не смог найти активного AI-провайдера (например, OpenAI), который может обслуживать запрошенную модель (`gpt-4o-mini`).
- **Решение:**
  1. **Проверьте ключ API:** Убедитесь, что `OPENAI_API_KEY` (или ключ для другого соответствующего провайдера) корректно указан в `.env.local`.
  2. **Проверьте статус провайдера:** Посмотрите в логи запуска `shell`. Там будет указано, какие провайдеры были успешно сконфигурированы.

     ```
     ✅ [APIManager] OpenAI provider configured successfully.
     ❌ [APIManager] ANTHROPIC_API_KEY not found. Provider disabled.
     ```

  3. **Проверьте название модели:** Убедитесь, что вы не опечатались в названии модели.
