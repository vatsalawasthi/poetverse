import React from 'react';
import { Users, Plus, CheckCircle2, Clock, Feather, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CollabCard({ collab, onAddStanza, onOpenDetails }) {
  const { theme } = useTheme();

  const currentStanzaCount = collab.stanzas ? collab.stanzas.length : 0;
  const maxStanzas = collab.maxStanzas || 4;
  const progressPercent = Math.min(100, Math.round((currentStanzaCount / maxStanzas) * 100));
  const isCompleted = collab.status === 'COMPLETED' || currentStanzaCount >= maxStanzas;

  // Extract distinct contributor avatars
  const contributors = collab.stanzas 
    ? Array.from(new Map(collab.stanzas.map(s => [s.authorId, s])).values())
    : [];

  return (
    <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl ${theme.cardBg} ${theme.border} hover:border-amber-500/50`}>
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {collab.genre || 'Poetry'}
            </span>
            {collab.mood && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                {collab.mood}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 animate-pulse">
                <Clock className="w-3.5 h-3.5" /> Open for Verses
              </span>
            )}
          </div>
        </div>

        {/* Title & Theme Prompt */}
        <h3 className="font-heading text-xl font-bold tracking-wide text-amber-200 mb-2">
          {collab.title}
        </h3>

        {collab.promptOrTheme && (
          <p className="text-xs italic opacity-75 mb-4 bg-stone-900/40 p-2.5 rounded-xl border border-stone-800">
            <span className="font-semibold text-amber-400 not-italic">Prompt: </span>
            "{collab.promptOrTheme}"
          </p>
        )}

        {/* Latest Stanzas Preview */}
        <div className="space-y-3 my-4">
          {collab.stanzas && collab.stanzas.slice(0, 2).map((s, idx) => (
            <div key={idx} className="text-xs bg-stone-900/50 p-3 rounded-xl border border-stone-800/80">
              <div className="flex items-center justify-between mb-1.5 text-[10px] text-amber-400/80">
                <span className="font-semibold">{s.authorDisplayName || s.authorUsername}</span>
                <span className="font-mono opacity-50">Stanza {s.orderIndex || idx + 1}</span>
              </div>
              <p className="font-serif-reading opacity-85 leading-relaxed line-clamp-3">
                {s.text}
              </p>
            </div>
          ))}
          {collab.stanzas && collab.stanzas.length > 2 && (
            <div className="text-center text-[11px] opacity-60">
              +{collab.stanzas.length - 2} more stanzas in thread
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Footer */}
      <div className="mt-4 pt-4 border-t border-stone-800/60">
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="opacity-60 flex items-center gap-1">
              <Feather className="w-3 h-3 text-amber-400" /> Stanza Progress
            </span>
            <span className="font-mono font-semibold text-amber-400">
              {currentStanzaCount} / {maxStanzas}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Contributors & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {contributors.map((c, i) => (
              <img
                key={i}
                src={c.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                alt={c.authorDisplayName}
                title={c.authorDisplayName}
                className="w-7 h-7 rounded-full object-cover border-2 border-stone-900 shadow"
              />
            ))}
            <span className="text-[10px] pl-3 opacity-50">
              {contributors.length} {contributors.length === 1 ? 'co-poet' : 'co-poets'}
            </span>
          </div>

          {!isCompleted ? (
            <button
              onClick={() => onAddStanza(collab)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-102"
            >
              <Plus className="w-3.5 h-3.5" /> Add Verse
            </button>
          ) : (
            <button
              onClick={() => onOpenDetails(collab)}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-500/10 transition-all"
            >
              View Masterpiece
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
