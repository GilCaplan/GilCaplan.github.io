// Minimal bring-your-own-key chat client.
// The key lives only in the caller's React state and is sent ONLY to the chosen
// provider's API directly from the browser. This site has no backend.

export type Provider = 'openai' | 'anthropic';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const PROVIDERS: Record<Provider, { label: string; defaultModel: string; models: string[] }> = {
  openai: {
    label: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
  },
  anthropic: {
    label: 'Anthropic',
    defaultModel: 'claude-haiku-4-5-20251001',
    models: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6', 'claude-opus-4-8'],
  },
};

export interface ChatOptions {
  provider: Provider;
  apiKey: string;
  model: string;
  system?: string;
  messages: ChatMessage[];
  temperature?: number;
}

export async function chat(opts: ChatOptions): Promise<string> {
  if (!opts.apiKey.trim()) throw new Error('Please enter your API key first.');
  return opts.provider === 'openai' ? chatOpenAI(opts) : chatAnthropic(opts);
}

async function chatOpenAI(opts: ChatOptions): Promise<string> {
  const messages: ChatMessage[] = opts.system
    ? [{ role: 'system', content: opts.system }, ...opts.messages]
    : opts.messages;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages,
      temperature: opts.temperature ?? 0.8,
    }),
  });

  if (!res.ok) throw new Error(await errorText(res, 'OpenAI'));
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? '';
}

async function chatAnthropic(opts: ChatOptions): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
      // Required for direct browser calls.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 1024,
      temperature: opts.temperature ?? 0.8,
      system: opts.system,
      messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) throw new Error(await errorText(res, 'Anthropic'));
  const data = await res.json();
  return (data?.content ?? [])
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('')
    .trim();
}

async function errorText(res: Response, name: string): Promise<string> {
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error?.message ?? JSON.stringify(body);
  } catch {
    detail = await res.text().catch(() => '');
  }
  if (res.status === 401) return `${name}: invalid API key.`;
  if (res.status === 429) return `${name}: rate limited or out of quota.`;
  return `${name} error (${res.status}): ${detail || res.statusText}`;
}
