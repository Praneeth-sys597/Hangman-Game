import React, { useState, useEffect, useCallback } from 'react';
import { ConsoleLine, GameState, ThemeMode } from './types';
import { PREDEFINED_WORDS, MAX_INCORRECT_GUESSES, ASCII_STAGES } from './constants';
import { Terminal } from './components/Terminal';
import { CodeViewer } from './components/CodeViewer';
import { ConceptsGuide } from './components/ConceptsGuide';
import { Terminal as TerminalIcon, Code, BookOpen, HelpCircle, Shuffle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'code' | 'concepts'>('terminal');
  const [theme, setTheme] = useState<ThemeMode>('classic');

  // Game state
  const [gameState, setGameState] = useState<GameState>(() => {
    const randomWord = PREDEFINED_WORDS[Math.floor(Math.random() * PREDEFINED_WORDS.length)];
    return {
      word: randomWord,
      guessedLetters: [],
      incorrectGuesses: 0,
      maxGuesses: MAX_INCORRECT_GUESSES,
      status: 'playing',
      rounds: 0,
    };
  });

  const [lines, setLines] = useState<ConsoleLine[]>([]);

  // Format masked word with spaces between characters
  const getMaskedWord = useCallback((word: string, guessed: string[]) => {
    return word
      .split('')
      .map((c) => (guessed.includes(c) ? c : '_'))
      .join(' ');
  }, []);

  // Initialize welcome logs
  const initGameLogs = useCallback((word: string) => {
    const initialLines: ConsoleLine[] = [
      {
        id: `sys-${Date.now()}-1`,
        type: 'system',
        text: '==================================================',
      },
      {
        id: `sys-${Date.now()}-2`,
        type: 'system',
        text: '             TEXT-BASED HANGMAN GAME              ',
      },
      {
        id: `sys-${Date.now()}-3`,
        type: 'system',
        text: '==================================================',
      },
      {
        id: `sys-${Date.now()}-4`,
        type: 'system',
        text: 'Welcome! Guess the hidden word one letter at a time.',
      },
      {
        id: `sys-${Date.now()}-5`,
        type: 'system',
        text: `Word chosen randomly from 5 predefined words. Limit: ${MAX_INCORRECT_GUESSES} incorrect guesses.`,
      },
      {
        id: `sys-${Date.now()}-6`,
        type: 'ascii',
        text: ASCII_STAGES[0],
      },
      {
        id: `sys-${Date.now()}-7`,
        type: 'output',
        text: `Word: ${word.split('').map(() => '_').join(' ')}`,
      },
      {
        id: `sys-${Date.now()}-8`,
        type: 'output',
        text: `Incorrect guesses left: ${MAX_INCORRECT_GUESSES}`,
      },
      {
        id: `sys-${Date.now()}-9`,
        type: 'output',
        text: 'Guessed letters: None',
      },
      {
        id: `sys-${Date.now()}-10`,
        type: 'divider',
        text: '--------------------------------------------------',
      },
    ];
    setLines(initialLines);
  }, []);

  // Start initial game once on mount
  useEffect(() => {
    initGameLogs(gameState.word);
  }, []);

  // Reset / New game handler
  const handleReset = () => {
    const randomWord = PREDEFINED_WORDS[Math.floor(Math.random() * PREDEFINED_WORDS.length)];
    const newState: GameState = {
      word: randomWord,
      guessedLetters: [],
      incorrectGuesses: 0,
      maxGuesses: MAX_INCORRECT_GUESSES,
      status: 'playing',
      rounds: 0,
    };
    setGameState(newState);
    initGameLogs(randomWord);
  };

  // Clear output lines
  const handleClear = () => {
    setLines([
      {
        id: `clr-${Date.now()}`,
        type: 'system',
        text: `[Terminal cleared] Game in progress. Word: ${getMaskedWord(
          gameState.word,
          gameState.guessedLetters
        )} | Incorrect left: ${MAX_INCORRECT_GUESSES - gameState.incorrectGuesses}`,
      },
    ]);
  };

  // Main input processor (letters or commands)
  const handleGuess = (input: string) => {
    const clean = input.trim().toUpperCase();
    if (!clean) return;

    // Handle special terminal commands
    if (clean === 'HELP') {
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', text: 'help' },
        {
          id: `out-${Date.now()}-1`,
          type: 'system',
          text: 'COMMANDS:\n- Type any single letter (A-Z) to guess.\n- "WORDS" to list all 5 predefined words.\n- "RESTART" to begin a new game.\n- "CLEAR" to clear the screen.',
        },
      ]);
      return;
    }

    if (clean === 'RESTART' || clean === 'PLAY' || clean === 'NEW') {
      handleReset();
      return;
    }

    if (clean === 'CLEAR' || clean === 'CLS') {
      handleClear();
      return;
    }

    if (clean === 'WORDS') {
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', text: 'words' },
        {
          id: `out-${Date.now()}`,
          type: 'system',
          text: `The 5 Predefined Words are: ${PREDEFINED_WORDS.join(', ')}`,
        },
      ]);
      return;
    }

    if (clean === 'HINT') {
      const remainingUnrevealed = gameState.word
        .split('')
        .filter((c) => !gameState.guessedLetters.includes(c));
      const hintChar = remainingUnrevealed[0] || '?';
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', text: 'hint' },
        {
          id: `out-${Date.now()}`,
          type: 'system',
          text: `HINT: The word has ${gameState.word.length} letters. One of the hidden letters is '${hintChar}'.`,
        },
      ]);
      return;
    }

    // If game has already ended
    if (gameState.status !== 'playing') {
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', text: clean },
        {
          id: `out-${Date.now()}`,
          type: 'error',
          text: 'Game has already finished! Click "New Game" or type "RESTART" to play again.',
        },
      ]);
      return;
    }

    // Input validation: Must be single alphabet letter
    if (clean.length !== 1 || !/^[A-Z]$/.test(clean)) {
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', text: clean },
        {
          id: `out-${Date.now()}`,
          type: 'error',
          text: 'Invalid input! Please enter a single alphabetical letter (A-Z).',
        },
      ]);
      return;
    }

    const letter = clean;

    // Check if letter was already guessed
    if (gameState.guessedLetters.includes(letter)) {
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', text: letter },
        {
          id: `out-${Date.now()}`,
          type: 'error',
          text: `You already guessed '${letter}'! Try a different letter.`,
        },
      ]);
      return;
    }

    // Process valid new letter
    const nextGuessed = [...gameState.guessedLetters, letter];
    const isCorrect = gameState.word.includes(letter);
    const nextIncorrect = isCorrect ? gameState.incorrectGuesses : gameState.incorrectGuesses + 1;
    const nextRounds = gameState.rounds + 1;

    // Check if won
    const isWon = gameState.word.split('').every((char) => nextGuessed.includes(char));
    // Check if lost
    const isLost = !isWon && nextIncorrect >= MAX_INCORRECT_GUESSES;

    const nextStatus = isWon ? 'won' : isLost ? 'lost' : 'playing';

    setGameState({
      ...gameState,
      guessedLetters: nextGuessed,
      incorrectGuesses: nextIncorrect,
      status: nextStatus,
      rounds: nextRounds,
    });

    const masked = getMaskedWord(gameState.word, nextGuessed);
    const newLines: ConsoleLine[] = [
      { id: `in-${Date.now()}`, type: 'input', text: letter },
    ];

    if (isCorrect) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'success',
        text: `Good guess! '${letter}' is in the word.`,
      });
    } else {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'error',
        text: `Sorry, '${letter}' is not in the word.`,
      });
    }

    // Append ASCII art for current stage
    newLines.push({
      id: `art-${Date.now()}`,
      type: 'ascii',
      text: ASCII_STAGES[nextIncorrect],
    });

    // Append current word state and stats
    newLines.push({
      id: `word-${Date.now()}`,
      type: 'output',
      text: `Word: ${masked}`,
    });

    newLines.push({
      id: `stats-${Date.now()}`,
      type: 'output',
      text: `Incorrect guesses left: ${MAX_INCORRECT_GUESSES - nextIncorrect} / ${MAX_INCORRECT_GUESSES}`,
    });

    newLines.push({
      id: `list-${Date.now()}`,
      type: 'output',
      text: `Guessed letters: ${nextGuessed.join(', ')}`,
    });

    // Check game termination messages
    if (isWon) {
      newLines.push({
        id: `win-${Date.now()}-1`,
        type: 'divider',
        text: '==================================================',
      });
      newLines.push({
        id: `win-${Date.now()}-2`,
        type: 'success',
        text: `CONGRATULATIONS! You guessed the word: ${gameState.word}`,
      });
      newLines.push({
        id: `win-${Date.now()}-3`,
        type: 'system',
        text: `Finished in ${nextRounds} guesses with ${MAX_INCORRECT_GUESSES - nextIncorrect} mistakes spared.`,
      });
      newLines.push({
        id: `win-${Date.now()}-4`,
        type: 'system',
        text: 'Type "RESTART" or click "New Game" to play another round.',
      });
    } else if (isLost) {
      newLines.push({
        id: `loss-${Date.now()}-1`,
        type: 'divider',
        text: '==================================================',
      });
      newLines.push({
        id: `loss-${Date.now()}-2`,
        type: 'error',
        text: `GAME OVER! You ran out of guesses (limit of ${MAX_INCORRECT_GUESSES} reached).`,
      });
      newLines.push({
        id: `loss-${Date.now()}-3`,
        type: 'system',
        text: `The secret word was: ${gameState.word}`,
      });
      newLines.push({
        id: `loss-${Date.now()}-4`,
        type: 'system',
        text: 'Type "RESTART" or click "New Game" to try again.',
      });
    }

    newLines.push({
      id: `div-${Date.now()}`,
      type: 'divider',
      text: '--------------------------------------------------',
    });

    setLines((prev) => [...prev, ...newLines]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-mono font-bold text-base shadow-inner">
              &gt;_
            </div>
            <div>
              <h1 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Hangman Game</span>
                <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900">
                  TASK 1
                </span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Text-based Console</span>
                <span aria-hidden="true">&bull;</span>
                <span>5 Predefined Words</span>
                <span aria-hidden="true">&bull;</span>
                <span>Max 6 Mistakes</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'terminal'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Console Game</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'code'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Python Script</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('concepts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'concepts'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5 Core Concepts</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Quick Scope Verification Banner */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-zinc-300">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              Scope Checklist:
            </span>
            <span className="text-zinc-400">
              <strong className="text-zinc-200">5 Words:</strong> PYTHON, HANGMAN, VARIABLE, COMPUTER, ALGORITHM
            </span>
            <span className="text-zinc-400">
              <strong className="text-zinc-200">Mistakes Limit:</strong> 6
            </span>
            <span className="text-zinc-400">
              <strong className="text-zinc-200">Output:</strong> Pure text console (no audio/graphics)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleGuess('HINT')}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer"
            >
              Ask for Hint
            </button>
            <span className="text-zinc-600">&bull;</span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              Reroll Word
            </button>
          </div>
        </div>

        {/* Tab Viewport */}
        {activeTab === 'terminal' && (
          <Terminal
            gameState={gameState}
            lines={lines}
            onGuess={handleGuess}
            onReset={handleReset}
            onClear={handleClear}
            theme={theme}
            setTheme={setTheme}
          />
        )}

        {activeTab === 'code' && <CodeViewer />}

        {activeTab === 'concepts' && <ConceptsGuide gameState={gameState} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 px-4 text-center text-xs text-zinc-500 font-mono">
        Text-Based Hangman Game &bull; Built with random, while loop, if-else, strings & lists
      </footer>
    </div>
  );
}
