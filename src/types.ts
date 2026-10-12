export type ThemeMode = 'classic' | 'matrix' | 'amber';

export interface ConsoleLine {
  id: string;
  type: 'system' | 'input' | 'output' | 'error' | 'success' | 'ascii' | 'divider';
  text: string;
  timestamp?: string;
}

export interface GameState {
  word: string;
  guessedLetters: string[];
  incorrectGuesses: number;
  maxGuesses: number;
  status: 'playing' | 'won' | 'lost';
  rounds: number;
}
