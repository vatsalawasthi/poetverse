import React, { useState } from 'react';
import { X, Feather, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { collabAPI } from '../services/api';

export default function AddStanzaModal({ collab, isOpen, onClose, onStanzaAdded }) {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  const [stanzaText, setStanzaText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !collab) return null;

  const currentStanzaNumber = (collab.stanzas ? collab.stanzas.length : 0) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stanzaText.trim() || !currentUser) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await collabAPI.submitStanza(collab.id, currentUser.id, {
        text: stanzaText.trim()
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#fbbf24']
      });

      onStanzaAdded(res.data);
      onClose();
    } catch (err) {
      // Local fallback
      const newStanza = {
        id: 's_' + Date.now(),
        authorId: currentUser.id,
        authorUsername: currentUser.username,
        authorDisplayName: currentUser.displayName,
        authorAvatar: currentUser.avatar,
        text: stanzaText.trim(),
        orderIndex: currentStanzaNumber,
        status: 'APPROVED',
        submittedAt: new Date().toISOString(),
      };

      const updatedCollab = {
        ...collab,
        stanzas: [...(collab.stanzas || []), newStanza],
        status: (collab.stanzas?.length || 0) + 1 >= (collab.maxStanzas || 4) ? 'COMPLETED' : 'IN_PROGRESS'
      };

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });

      onStanzaAdded(updatedCollab);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-200">
                Contribute Stanza {currentStanzaNumber} of {collab.maxStanzas || 4}
              </h2>
              <div className="text-xs opacity-60">
                Co-writing: <span className="font-medium text-amber-300">{collab.title}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-stone-700 hover:bg-stone-800 transition-all opacity-80 hover:opacity-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Stanzas Reference */}
        <div className="px-6 py-4 max-h-52 overflow-y-auto bg-stone-950/40 border-b border-stone-800/80 space-y-3">
          <div className="text-[11px] uppercase tracking-wider font-semibold opacity-50 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Previous Stanzas
          </div>
          {collab.stanzas && collab.stanzas.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs">
              <div className="flex items-center justify-between mb-1 text-[10px] text-amber-400/80">
                <span className="font-semibold">{s.authorDisplayName || s.authorUsername}</span>
                <span className="opacity-50 font-mono">Stanza {idx + 1}</span>
              </div>
              <p className="font-serif-reading opacity-90 leading-relaxed whitespace-pre-wrap">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
              Your Continuing Verse / Stanza
            </label>
            <textarea
              value={stanzaText}
              onChange={(e) => setStanzaText(e.target.value)}
              placeholder="Weave your lines here... Match the rhythm, answer the previous imagery, or introduce a dramatic volta."
              rows={5}
              required
              className="w-full p-4 rounded-xl border border-stone-700 bg-stone-900/60 font-serif-reading text-sm sm:text-base leading-relaxed text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 resize-none shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs opacity-60">
              Writing as: <span className="font-semibold text-amber-400">{currentUser?.displayName}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-700 text-xs hover:bg-stone-800 transition-all opacity-80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !stanzaText.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Inscribing...' : 'Add Stanza to Thread'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
