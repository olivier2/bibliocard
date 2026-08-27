export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

// Safari (iOS and macOS) has never implemented beforeinstallprompt or any
// equivalent - there's no event to listen for. This feature-detects support
// so callers can fall back to manual "Add to Home Screen" instructions.
export function supportsInstallPrompt(): boolean {
  return 'onbeforeinstallprompt' in window;
}

export function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || isIPadOS;
}

export function isSafari(): boolean {
  const ua = window.navigator.userAgent;
  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
}
