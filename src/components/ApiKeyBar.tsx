import { PROVIDERS, type Provider } from '../lib/chat';

export interface KeyState {
  provider: Provider;
  model: string;
  apiKey: string;
  remember: boolean;
}

export default function ApiKeyBar({
  state,
  onChange,
}: {
  state: KeyState;
  onChange: (next: KeyState) => void;
}) {
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-start gap-2 text-xs text-muted">
        <span className="mt-0.5 text-accent">🔒</span>
        <p>
          Your API key is used <strong className="text-ink2">only in your browser</strong> to call
          the provider directly. It's never sent to, logged by, or stored on any server — this site
          has no backend. "Remember" keeps it in your browser's local storage only.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={state.provider}
          onChange={(e) => {
            const provider = e.target.value as Provider;
            onChange({ ...state, provider, model: PROVIDERS[provider].defaultModel });
          }}
          className="rounded-lg border border-line bg-app px-3 py-2 text-sm text-ink2 outline-none focus:border-accent"
        >
          {Object.entries(PROVIDERS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          value={state.model}
          onChange={(e) => onChange({ ...state, model: e.target.value })}
          className="rounded-lg border border-line bg-app px-3 py-2 text-sm text-ink2 outline-none focus:border-accent"
        >
          {PROVIDERS[state.provider].models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="password"
          value={state.apiKey}
          onChange={(e) => onChange({ ...state, apiKey: e.target.value })}
          placeholder={`${PROVIDERS[state.provider].label} API key`}
          className="min-w-[200px] flex-1 rounded-lg border border-line bg-app px-3 py-2 text-sm text-ink2 outline-none focus:border-accent"
        />
        <label className="flex items-center gap-1.5 text-xs text-muted">
          <input
            type="checkbox"
            checked={state.remember}
            onChange={(e) => onChange({ ...state, remember: e.target.checked })}
            className="accent-accent"
          />
          Remember
        </label>
      </div>
    </div>
  );
}
