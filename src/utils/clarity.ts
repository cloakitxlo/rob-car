export const CLARITY_PROJECT_ID = 'y28ro2gre8';
const CLARITY_TAG_SRC = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    __robinClarityQueued?: boolean;
  }
}

function ensureClarityQueue() {
  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity as { q?: unknown[][] }).q = (window.clarity as { q?: unknown[][] }).q || [];
      (window.clarity as { q: unknown[][] }).q.push(args);
    };
}

export function initClarity() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  ensureClarityQueue();

  const alreadyInjected = Boolean(
    document.querySelector(`script[src*="clarity.ms/tag/${CLARITY_PROJECT_ID}"]`) ||
      document.querySelector(`script[src="${CLARITY_TAG_SRC}"]`)
  );
  if (alreadyInjected) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = CLARITY_TAG_SRC;
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    (document.head || document.documentElement).appendChild(script);
  }
}

export function identifyClarityUser(userId: string, friendlyName?: string) {
  if (typeof window === 'undefined') return;
  ensureClarityQueue();
  window.clarity?.('identify', userId, undefined, undefined, friendlyName || userId);
}

export function clarityEvent(name: string) {
  if (typeof window === 'undefined') return;
  ensureClarityQueue();
  window.clarity?.('event', name);
}
