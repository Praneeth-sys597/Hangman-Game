import React, { useState, useEffect, useRef } from 'react';
import { ConsoleLine, GameState, ThemeMode } from '../types';
import { ASCII_STAGES, MAX_INCORRECT_GUESSES, PREDEFINED_WORDS } from '../constants';
import { Terminal as TerminalIcon, Copy, RotateCcw, Trash2, Check, ArrowRight, CornerDownLeft } from 'lucide-react';

interface TerminalProps {
  gameState: GameState;
  lines: ConsoleLine[];
  onGuess: (letter: string) => void;
  onReset: () => void;
  onClear: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  gameState,
  lines,
  onGuess,
  onReset,
  onClear,
  theme,
  setTheme,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal when lines update
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Focus input on load or game state update
  useEffect(() => {
    inputRef.current?.focus();
  }, [gameState.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onGuess(trimmed);
    setInputValue('');
  };

  const handleCopy = () => {
    const textToCopy = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener to type directly into terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If focused inside another input or modifier keys held, let it behave normally
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.activeElement !== inputRef.current && /^[a-zA-Z]$/.test(e.key)) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme styling definitions
  const themeClasses = {
    classic: {
      bg: 'bg-zinc-950',
      text: 'text-zinc-100',
      prompt: 'text-cyan-400',
      border: 'border-zinc-800',
      headerBg: 'bg-zinc-900',
      headerText: 'text-zinc-400',
      cursor: 'bg-cyan-400',
      accent: 'text-cyan-300',
      inputFocus: 'text-zinc-100',
    },
    matrix: {
      bg: 'bg-black',
      text: 'text-emerald-400',
      prompt: 'text-emerald-500 font-bold',
      border: 'border-emerald-950',
      headerBg: 'bg-zinc-950',
      headerText: 'text-emerald-600',
      cursor: 'bg-emerald-400',
      accent: 'text-emerald-300',
      inputFocus: 'text-emerald-300',
    },
    amber: {
      bg: 'bg-stone-950',
      text: 'text-amber-300',
      prompt: 'text-amber-500 font-bold',
      border: 'border-amber-950/60',
      headerBg: 'bg-stone-900',
      headerText: 'text-amber-600',
      cursor: 'bg-amber-400',
      accent: 'text-amber-200',
      inputFocus: 'text-amber-200',
    },
  }[theme];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar / Quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">Theme:</span>
          <div className="flex items-center bg-zinc-900/80 p-0.5 rounded border border-zinc-800">
            <button
              type="button"
              onClick={() => setTheme('classic')}
              className={`px-2.5 py-1 text-xs rounded transition-colors font-mono ${
                theme === 'classic'
                  ? 'bg-zinc-700 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => setTheme('matrix')}
              className={`px-2.5 py-1 text-xs rounded transition-colors font-mono ${
                theme === 'matrix'
                  ? 'bg-emerald-950 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Matrix Green
            </button>
            <button
              type="button"
              onClick={() => setTheme('amber')}
              className={`px-2.5 py-1 text-xs rounded transition-colors font-mono ${
                theme === 'amber'
                  ? 'bg-amber-950 text-amber-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Amber CRT
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors"
            title="Start a new game session with a random word"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
            title="Clear previous output messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
            title="Copy console transcript to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Main Window */}
      <div
        className={`w-full rounded-lg border ${themeClasses.border} shadow-2xl overflow-hidden flex flex-col font-mono text-sm transition-colors`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Title Bar */}
        <div className={`px-4 py-2.5 ${themeClasses.headerBg} border-b ${themeClasses.border} flex items-center justify-between select-none`}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 ml-3">
              <TerminalIcon className="w-4 h-4 text-zinc-400" />
              <span className={`text-xs ${themeClasses.headerText} font-medium`}>
                python3 hangman.py &mdash; 5 Predefined Words &bull; 6 Guess Limit
              </span>
            </div>
          </div>
          <div className="text-xs text-zinc-500 hidden sm:block">
            {gameState.status === 'playing'
              ? `${MAX_INCORRECT_GUESSES - gameState.incorrectGuesses} guesses remaining`
              : gameState.status === 'won'
              ? 'WON'
              : 'GAME OVER'}
          </div>
        </div>

        {/* Terminal Body Screen */}
        <div
          className={`p-4 md:p-6 ${themeClasses.bg} min-h-[380px] max-h-[580px] overflow-y-auto leading-relaxed select-text space-y-1`}
        >
          {lines.map((line) => {
            if (line.type === 'ascii') {
              return (
                <pre
                  key={line.id}
                  className={`font-mono text-xs md:text-sm whitespace-pre leading-tight py-1 ${themeClasses.accent}`}
                >
                  {line.text}
                </pre>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="flex items-start gap-2 text-zinc-300">
                  <span className={themeClasses.prompt}>&gt;&gt;&gt;</span>
                  <span className="font-semibold">{line.text}</span>
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-400 font-semibold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'divider') {
              return (
                <div key={line.id} className="text-zinc-600 select-none py-0.5">
                  {line.text}
                </div>
              );
            }
            return (
              <div
                key={line.id}
                className={`${themeClasses.text} whitespace-pre-wrap break-words`}
              >
                {line.text}
              </div>
            );
          })}

          {/* Active interactive input prompt when playing */}
          {gameState.status === 'playing' ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className={themeClasses.prompt}>Enter a letter:</span>
              <input
                ref={inputRef}
                type="text"
                maxLength={1}
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (/^[A-Z]?$/.test(val)) {
                    setInputValue(val);
                  }
                }}
                className={`bg-transparent outline-none border-b border-zinc-700 focus:border-cyan-400 w-12 text-center uppercase font-bold text-base ${themeClasses.inputFocus}`}
                placeholder="_"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-300 border border-zinc-700"
              >
                <span>Submit</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="pt-3 flex items-center gap-3">
              <span className="text-zinc-400 text-xs">Game ended.</span>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono bg-cyan-700 hover:bg-cyan-600 text-white font-medium"
              >
                <span>Play Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Quick Letter Keypad (helpful for mobile and clicking) */}
        <div className={`p-3 ${themeClasses.headerBg} border-t ${themeClasses.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Alphabet Tracker ({gameState.guessedLetters.length} guessed)
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Click any letter or type on physical keyboard
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-13 gap-1.5">
            {alphabet.map((letter) => {
              const isGuessed = gameState.guessedLetters.includes(letter);
              const isInWord = isGuessed && gameState.word.includes(letter);
              const isWrong = isGuessed && !gameState.word.includes(letter);

              let buttonStyle = 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border-zinc-700';

              if (isInWord) {
                buttonStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-800 line-through opacity-80';
              } else if (isWrong) {
                buttonStyle = 'bg-rose-950/60 text-rose-400 border-rose-900 line-through opacity-50';
              }

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={isGuessed || gameState.status !== 'playing'}
                  onClick={() => onGuess(letter)}
                  className={`h-8 rounded text-xs font-mono font-semibold flex items-center justify-center border transition-all disabled:cursor-not-allowed ${buttonStyle}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
