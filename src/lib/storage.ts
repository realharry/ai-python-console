// Chrome extension storage utilities

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

export class Storage {
  static async getState(): Promise<ConsoleState> {
    try {
      const result = await chrome.storage.local.get(['consoleState']);
      return result.consoleState || DEFAULT_STATE;
    } catch (error) {
      console.error('Error getting state from storage:', error);
      return DEFAULT_STATE;
    }
  }

  static async setState(state: Partial<ConsoleState>): Promise<void> {
    try {
      const currentState = await this.getState();
      const newState = { ...currentState, ...state };
      await chrome.storage.local.set({ consoleState: newState });
    } catch (error) {
      console.error('Error setting state to storage:', error);
    }
  }

  static async clearState(): Promise<void> {
    try {
      await chrome.storage.local.remove(['consoleState']);
    } catch (error) {
      console.error('Error clearing state from storage:', error);
    }
  }
}