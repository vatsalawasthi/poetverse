import React, { useState } from 'react';
import { X, Users, Sparkles, Plus, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { collabAPI } from '../services/api';

const GENRES = ["Free Verse", "Sonnets", "Haiku & Tanka", "Ghazal", "Spoken Word", "Romanticism", "Elegies", "Ballads"];
const MOODS = ["Melancholy", "Serene", "Passionate", "Nostalgic", "Hopeful", "Mystic", "Reflective"];

export default function CreateCollabModal({ isOpen, onClose, onCollabCreated }) {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [promptOrTheme, setPromptOrTheme] = useState('');
  const [genre, setGenre] = useState('Free Verse');
  const [mood, setMood] = useState('Reflective');
  const [maxStanzas, setMaxStanzas] = useState(4);
  const [initialStanza, setInitialStanza] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;
    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      promptOrTheme: promptOrTheme.trim(),
      genre,
      mood,
      maxStanzas: Number(maxStanzas),
      initialStanza: initialStanza.trim(),
    };

    try {
      const res = await collabAPI.create(currentUser.id, payload);
      onCollabCreated(res.data);
      onClose();
    } catch (err) {
      // Local fallback
      const localCollab = {
        id: 'collab_' + Date.now(),
        title: title.trim(),
        promptOrTheme: promptOrTheme.trim(),
        genre,
        mood,
        maxStanzas: Number(maxStanzas),
        leadAuthorId: currentUser.id,
        leadAuthorUsername: currentUser.username,
        leadAuthorDisplayName: currentUser.displayName,
        leadAuthorAvatar: currentUser.avatar,
        status: 'OPEN',
        stanzas: initialStanza.trim() ? [
          {
            id: 's_init',
            authorId: currentUser.id,
            authorUsername: currentUser.username,
            authorDisplayName: currentUser.displayName,
            authorAvatar: currentUser.avatar,
            text: initialStanza.trim(),
            orderIndex: 1,
            status: 'APPROVED',
            submittedAt: new Date().toISOString()
          }
        ] : [],
        createdAt: new Date().toISOString()
      };
      onCollabCreated(localCollab);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-200">
                Launch a VerseCollab Thread
              </h2>
              <div className="text-xs opacity-60">
                Invite fellow poets to write verses together round-robin
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
              Collaboration Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Whispers Across Midnight, The Four Seasons Symphony..."
              className="w-full p-3 rounded-xl border border-stone-700 bg-stone-900/60 text-sm text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 font-heading tracking-wide"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
              Collaboration Prompt / Guiding Theme
            </label>
            <textarea
              value={promptOrTheme}
              onChange={(e) => setPromptOrTheme(e.target.value)}
              placeholder="Explain the poetic concept or rhythm guide for your co-writers (e.g., 'Each stanza explores a different natural element')."
              rows={2}
              className="w-full p-3 rounded-xl border border-stone-700 bg-stone-900/60 text-xs text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900/80 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-stone-900">{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                Atmosphere / Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900/80 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m} className="bg-stone-900">{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                Total Stanzas (Length)
              </label>
              <select
                value={maxStanzas}
                onChange={(e) => setMaxStanzas(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900/80 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value={3} className="bg-stone-900">3 Stanzas (Triolet)</option>
                <option value={4} className="bg-stone-900">4 Stanzas (Classic)</option>
                <option value={6} className="bg-stone-900">6 Stanzas (Sestina)</option>
                <option value={8} className="bg-stone-900">8 Stanzas (Epic)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
              Opening Stanza (Optional - Start the piece)
            </label>
            <textarea
              value={initialStanza}
              onChange={(e) => setInitialStanza(e.target.value)}
              placeholder="Inscribe the opening stanza to set the tone, meter, and imagery..."
              rows={4}
              className="w-full p-3.5 rounded-xl border border-stone-700 bg-stone-900/60 font-serif-reading text-sm leading-relaxed text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs opacity-60">
              Co-authors will be attributed automatically.
            </span>

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
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Opening Studio...' : 'Open Collaboration'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
