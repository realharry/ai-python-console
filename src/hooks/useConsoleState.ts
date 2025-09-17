import { useState, useEffect, useCallback } from 'react';
import { Storage, ConsoleState } from '@/lib/storage';

// Check if Chrome extension APIs are available
const isChromeExtension = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
};

export function useConsoleState() {
  const [state, setState] = useState<ConsoleState>({
    code: '',
    output: '',
    history: [],
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await Storage.getState();
        setState(savedState);
        
        // Notify background script that console is active (only in Chrome extension context)
        if (savedState.isActive && isChromeExtension()) {
          chrome.runtime.sendMessage({
            type: 'CONSOLE_STATE_CHANGED',
            active: true
          });
        }
      } catch (error) {
        console.error('Error loading console state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Update state and persist to storage
  const updateState = useCallback(async (updates: Partial<ConsoleState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      // Persist to storage
      Storage.setState(newState);
      
      // Notify background script if active state changed (only in Chrome extension context)
      if (updates.isActive !== undefined && isChromeExtension()) {
        chrome.runtime.sendMessage({
          type: 'CONSOLE_STATE_CHANGED',
          active: updates.isActive
        });
      }
      
      return newState;
    });
  }, []);

  // Specific state update methods
  const setCode = useCallback((code: string) => {
    updateState({ code });
  }, [updateState]);

  const setOutput = useCallback((output: string) => {
    updateState({ output });
  }, [updateState]);

  const addToHistory = useCallback((command: string) => {
    setState(prev => {
      const newHistory = [...prev.history, command];
      const newState = { ...prev, history: newHistory };
      Storage.setState(newState);
      return newState;
    });
  }, []);

  const clearCode = useCallback(() => {
    updateState({ code: '' });
  }, [updateState]);

  const clearOutput = useCallback(() => {
    updateState({ output: '' });
  }, [updateState]);

  const setActive = useCallback((active: boolean) => {
    updateState({ isActive: active });
  }, [updateState]);

  return {
    state,
    isLoading,
    setCode,
    setOutput,
    addToHistory,
    clearCode,
    clearOutput,
    setActive,
    updateState,
  };
}