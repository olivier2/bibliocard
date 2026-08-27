import { useEffect, useState } from 'react';
import { isStandalone } from '../pwa';

export function useIsStandalone(): boolean {
  const [standalone, setStandalone] = useState(() => isStandalone());

  useEffect(() => {
    const mql = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => setStandalone(isStandalone());
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return standalone;
}
