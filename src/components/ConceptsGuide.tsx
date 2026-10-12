import React from 'react';
import { CONCEPTS, MAX_INCORRECT_GUESSES } from '../constants';
import { GameState } from '../types';
import { Sparkles, Repeat, GitFork, Type, ListFilter, CheckCircle2 } from 'lucide-react';

interface ConceptsGuideProps {
  gameState: GameState;
}

export const ConceptsGuide: React.FC<ConceptsGuideProps> = ({ gameState }) => {
  const getConceptIcon = (id: string) => {
    switch (id) {
      case 'random':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'while-loop':
        return <Repeat className="w-4 h-4 text-cyan-400" />;
      case 'if-else':
        return <GitFork className="w-4 h-4 text-purple-400" />;
      case 'strings':
        return <Type className="w-4 h-4 text-emerald-400" />;
      case 'lists':
        return <ListFilter className="w-4 h-4 text-blue-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-zinc-400" />;
    }
  };

  // Compute live masked string
  const maskedString = gameState.word
    .split('')
    .map((c) => (gameState.guessedLetters.includes(c) ? c : '_'))
    .join(' ');

  return (
    <div className="flex flex-col gap-6">
      {/* Live State Inspector */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-mono mb-3">
          Live State Mapping (Connected to Current Game)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">random.choice() selected word:</span>
            <span className="text-zinc-200 font-bold">
              {gameState.status === 'playing' ? `${gameState.word.length} letters secret` : gameState.word}
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">while loop condition:</span>
            <span className="text-cyan-400 font-bold">
              {gameState.incorrectGuesses} &lt; {MAX_INCORRECT_GUESSES} ({MAX_INCORRECT_GUESSES - gameState.incorrectGuesses} left)
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">lists: guessed_letters:</span>
            <span className="text-blue-400 font-bold">
              [{gameState.guessedLetters.map((l) => `'${l}'`).join(', ') || 'empty'}]
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">strings: display mask:</span>
            <span className="text-emerald-400 font-bold tracking-widest">{maskedString}</span>
          </div>

          <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">if-else evaluation status:</span>
            <span
              className={`font-bold ${
                gameState.status === 'won'
                  ? 'text-emerald-400'
                  : gameState.status === 'lost'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {gameState.status.toUpperCase()}
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">rounds executed:</span>
            <span className="text-purple-400 font-bold">{gameState.rounds} iterations</span>
          </div>
        </div>
      </div>

      {/* 5 Key Concepts Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => (
          <div
            key={concept.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {getConceptIcon(concept.id)}
                <h4 className="text-sm font-semibold text-zinc-100 font-mono">{concept.title}</h4>
                <span className="text-xs text-zinc-500 font-mono">&mdash; {concept.subtitle}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                {concept.description}
              </p>
            </div>

            <div>
              <div className="bg-zinc-950 rounded p-2.5 font-mono text-xs text-zinc-300 border border-zinc-800/80 mb-2 overflow-x-auto">
                <pre>{concept.snippet}</pre>
              </div>
              <div className="text-[11px] text-zinc-500 leading-normal">
                <span className="text-zinc-400 font-medium">In Hangman: </span>
                {concept.roleInGame}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
