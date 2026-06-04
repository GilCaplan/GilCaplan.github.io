// Tiny shared setting for the cursor spotlight: persisted in localStorage,
// default ON. Components subscribe via the 'spotlight' window event.
const KEY = 'gc_spotlight';

export function spotlightOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSpotlight(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('spotlight', { detail: on }));
}
