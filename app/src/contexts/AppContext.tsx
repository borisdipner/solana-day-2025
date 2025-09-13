import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppState {
  isDemoMode: boolean;
  isWalletConnected: boolean;
  createdAssets: string[];
  createdSlices: string[];
}

interface AppContextType {
  state: AppState;
  setDemoMode: (enabled: boolean) => void;
  setWalletConnected: (connected: boolean) => void;
  addAsset: (assetId: string) => void;
  addSlice: (sliceId: string) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isDemoMode: false,
    isWalletConnected: false,
    createdAssets: [],
    createdSlices: []
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Загружаем состояние из localStorage
    if (typeof window !== 'undefined') {
      const savedDemoMode = localStorage.getItem('spotpass-demo-mode') === 'true';
      const savedAssets = JSON.parse(localStorage.getItem('spotpass-assets') || '[]');
      const savedSlices = JSON.parse(localStorage.getItem('spotpass-slices') || '[]');
      
      setState(prev => ({
        ...prev,
        isDemoMode: savedDemoMode,
        createdAssets: savedAssets,
        createdSlices: savedSlices
      }));
    }
  }, []);

  const setDemoMode = (enabled: boolean) => {
    setState(prev => ({ ...prev, isDemoMode: enabled }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotpass-demo-mode', enabled.toString());
    }
  };

  const setWalletConnected = (connected: boolean) => {
    setState(prev => ({ ...prev, isWalletConnected: connected }));
  };

  const addAsset = (assetId: string) => {
    setState(prev => {
      const newAssets = [...prev.createdAssets, assetId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotpass-assets', JSON.stringify(newAssets));
      }
      return { ...prev, createdAssets: newAssets };
    });
  };

  const addSlice = (sliceId: string) => {
    setState(prev => {
      const newSlices = [...prev.createdSlices, sliceId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotpass-slices', JSON.stringify(newSlices));
      }
      return { ...prev, createdSlices: newSlices };
    });
  };

  const resetState = () => {
    setState({
      isDemoMode: false,
      isWalletConnected: false,
      createdAssets: [],
      createdSlices: []
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spotpass-demo-mode');
      localStorage.removeItem('spotpass-assets');
      localStorage.removeItem('spotpass-slices');
    }
  };

  if (!mounted) {
    return <div>Загрузка...</div>;
  }

  return (
    <AppContext.Provider value={{
      state,
      setDemoMode,
      setWalletConnected,
      addAsset,
      addSlice,
      resetState
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
