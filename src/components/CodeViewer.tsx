import React, { useState } from 'react';
import { PYTHON_REFERENCE_CODE, PREDEFINED_WORDS } from '../constants';
import { Copy, Check, Code, FileText } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_REFERENCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm text-zinc-200 font-medium">hangman.py</span>
          <span className="text-zinc-500 text-xs hidden sm:inline">&bull; Complete Standalone Implementation</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Script' : 'Copy Python Script'}</span>
          </button>
        </div>
      </div>

      {/* Code block with syntax styling */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
        <div className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-zinc-300 leading-relaxed">
          <pre className="whitespace-pre">
            {PYTHON_REFERENCE_CODE.split('\n').map((line, idx) => {
              // Highlight comments
              if (line.trim().startsWith('#')) {
                return (
                  <div key={idx} className="text-emerald-500 font-medium">
                    <span className="inline-block w-8 text-zinc-600 select-none text-right pr-3">{idx + 1}</span>
                    {line}
                  </div>
                );
              }
              // Highlight keywords (while, if, else, import, break, continue)
              const hasKeyword = /\b(import|while|if|else|elif|break|continue|in|not|and|or|for)\b/.test(line);
              return (
                <div key={idx} className="hover:bg-zinc-900/40">
                  <span className="inline-block w-8 text-zinc-600 select-none text-right pr-3">{idx + 1}</span>
                  <span className={hasKeyword ? 'text-zinc-100' : 'text-zinc-300'}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Predefined Words Reference */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg">
        <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-mono mb-2 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          5 Predefined Words in the Scope
        </h4>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_WORDS.map((word, i) => (
            <span
              key={word}
              className="px-2.5 py-1 text-xs font-mono bg-zinc-800 text-cyan-300 rounded border border-zinc-700"
            >
              #{i + 1} {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
