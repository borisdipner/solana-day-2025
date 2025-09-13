import { useState, useEffect } from 'react';

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Проверяем URL параметр или localStorage только на клиенте
    if (typeof window !== 'undefined') {
      const urlDemo = window.location.search.includes('demo=true');
      const localDemo = localStorage.getItem('spotpass-demo-mode') === 'true';
      setIsDemoMode(urlDemo || localDemo);
    }
  }, []);

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotpass-demo-mode', enabled.toString());
    }
  };

  return { isDemoMode, setDemoMode };
}
