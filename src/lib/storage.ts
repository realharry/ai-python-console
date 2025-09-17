// Chrome extension storage utilities with fallback

export interface ConsoleState {
  code: string;
  output: string;
  history: string[];
  isActive: boolean;
}

const DEFAULT_STATE: ConsoleState = {
  code: '# Welcome to AI Python Console!\n# Write your Python code here and click Run to execute\n\nprint("Hello, World!")',
  output: '',
  history: [],
  isActive: false,
};

// Check if Chrome extension APIs are available
const isChromeExtension = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
};

export class Storage {
  static async getState(): Promise<ConsoleState> {
    try {
      if (isChromeExtension()) {
        const result = await chrome.storage.local.get(['consoleState']);
        return result.consoleState || DEFAULT_STATE;
      } else {
        // Fallback to localStorage for testing/development
        const stored = localStorage.getItem('consoleState');
        return stored ? JSON.parse(stored) : DEFAULT_STATE;
      }
    } catch (error) {
      console.error('Error getting state from storage:', error);
      return DEFAULT_STATE;
    }
  }

  static async setState(state: Partial<ConsoleState>): Promise<void> {
    try {
      const currentState = await this.getState();
      const newState = { ...currentState, ...state };
      
      if (isChromeExtension()) {
        await chrome.storage.local.set({ consoleState: newState });
      } else {
        // Fallback to localStorage for testing/development
        localStorage.setItem('consoleState', JSON.stringify(newState));
      }
    } catch (error) {
      console.error('Error setting state to storage:', error);
    }
  }

  static async clearState(): Promise<void> {
    try {
      if (isChromeExtension()) {
        await chrome.storage.local.remove(['consoleState']);
      } else {
        // Fallback to localStorage for testing/development
        localStorage.removeItem('consoleState');
      }
    } catch (error) {
      console.error('Error clearing state from storage:', error);
    }
  }
}