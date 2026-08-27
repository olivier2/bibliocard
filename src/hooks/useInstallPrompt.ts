import { useEffect, useState } from 'react';
import { isStandalone } from '../pwa';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_STORAGE_KEY = 'bibliocard.installPromptDismissed';

export function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_STORAGE_KEY) === '1');

  useEffect(() => {
    if (isStandalone()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    if (outcome === 'accepted') setDeferredEvent(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_STORAGE_KEY, '1');
    setDismissed(true);
  };

  return {
    isVisible: deferredEvent !== null && !dismissed,
    promptInstall,
    dismiss,
  };
}
