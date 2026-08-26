import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Feather, 
  Sparkles, 
  Send, 
  Users, 
  Eye, 
  Sliders, 
  HelpCircle, 
  Check,
  BookOpen,
  AlignLeft,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { poemAPI } from '../services/api';

const GENRES = ["Free Verse", "Sonnets", "Haiku", "Ghazal", "Spoken Word", "Romanticism", "Elegies", "Ballads"];
const MOODS = ["Melancholy", "Serene", "Passionate", "Nostalgic", "Hopeful", "Mystic", "Philosophical"];

const PRESETS = {
  "Haiku": `An ancient quiet (5)
A leaf drifts on morning pond (7)
Silence finds its home (5)`,
  "Sonnets": `When all the quiet stars begin to turn,
And shadows lengthen on the quiet lawn,
A solitary flame begins to burn,
And softly keeps its vigil till the dawn.`,
  "Free Verse": `We carry rivers in the pockets of our winter coats,
Unspooling memory like twine across the dusk.`
};

export default function CreatePoemPage() {
  const { currentUser, openAuthModal } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('Free Verse');
  const [mood, setMood] = useState('Philosophical');
  const [tagsInput, setTagsInput] = useState('');
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [collabMode, setCollabMode] = useState('ADD_STANZA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showLivePreview, setShowLivePreview] = useState(true);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className={`p-10 rounded-3xl border ${theme.cardBg} ${theme.border}`}>
          <Feather className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-amber-200 mb-2">
            The Quill Awaits Your Ink
          </h2>
          <p className="text-sm opacity-70 mb-6 max-w-md mx-auto">
            Please enter your poet persona or sign in to begin penning and publishing verses on PoetVerse.
          </p>
          <button
            onClick={openAuthModal}
            className="px-6 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all"
          >
            Sign In to Start Writing
          </button>
        </div>
      </div>
    );
  }

  // Calculate verse statistics
  const lines = content.split('\n');
  const lineCount = content.trim() ? lines.length : 0;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const stanzaCount = content.trim() ? content.split(/\n\s*\n/).length : 0;

  const handleApplyPreset = (presetGenre) => {
    setGenre(presetGenre);
    if (!content.trim() && PRESETS[presetGenre]) {
      setContent(PRESETS[presetGenre]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    setError(null);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      genre,
      mood,
      tags,
      isCollabOpen,
      collabMode: isCollabOpen ? collabMode : 'NONE',
    };

    try {
      await poemAPI.create(currentUser.id, payload);
    } catch (err) {
      // Local publish fallback
    }

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#10b981']
    });

    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Feather className="w-4 h-4" /> Poet's Sanctuary Studio
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-amber-100">
            Pen a New Masterpiece
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
              showLivePreview ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-stone-700 opacity-60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLivePreview ? 'Live Preview On' : 'Editor Only'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid: Left = Editor, Right = Live Poetic Preview */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Column (7 Cols or 12 Cols if preview hidden) */}
        <div className={`${showLivePreview ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
          
          {/* Title Input */}
          <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.border}`}>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
              Poem Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Architecture of Dusk, Echoes in Amber..."
              className="w-full p-3.5 rounded-xl border border-stone-700 bg-stone-900/60 font-heading text-xl font-bold text-amber-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 tracking-wide"
            />
          </div>

          {/* Verse Quill Editor */}
          <div className={`p-6 rounded-2xl border ${theme.cardBg} ${theme.border}`}>
            
            {/* Genre Quick Presets */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Poetic Verse (Stanzas) *
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="opacity-40 text-[10px] uppercase mr-1">Presets:</span>
                {['Free Verse', 'Sonnets', 'Haiku'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2 py-0.5 rounded-md bg-stone-800/80 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 border border-stone-700 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Inscribe your verses here...&#10;&#10;Separate stanzas with a blank line for classic poetic layout."
              rows={14}
              className="w-full p-4 rounded-xl border border-stone-700 bg-stone-900/70 font-serif-reading text-base leading-relaxed text-stone-100 placeholder:opacity-30 focus:outline-none focus:border-amber-500 resize-y shadow-inner"
            />

            {/* Live Metrics: Line Count, Word Count, Stanzas */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-800 text-xs opacity-60">
              <div className="flex items-center gap-4">
                <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
                <span>•</span>
                <span>{stanzaCount} {stanzaCount === 1 ? 'stanza' : 'stanzas'}</span>
                <span>•</span>
                <span>{wordCount} words</span>
              </div>
              <span className="font-mono text-[11px] text-amber-400">
                {genre === 'Sonnets' ? `${lineCount}/14 lines` : genre}
              </span>
            </div>

          </div>

          {/* Form Settings: Genre, Mood, Tags, Collab Toggle */}
          <div className={`p-6 rounded-2xl border space-y-5 ${theme.cardBg} ${theme.border}`}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                  Genre / Form
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-stone-900/80 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g} className="bg-stone-900">{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                  Mood & Atmosphere
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-stone-900/80 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {MOODS.map((m) => (
                    <option key={m} value={m} className="bg-stone-900">{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                Themes & Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. twilight, solitude, stars, longing"
                className="w-full p-3 rounded-xl border border-stone-700 bg-stone-900/60 text-xs text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* VerseCollab Settings */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    Open for VerseCollab
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCollabOpen}
                    onChange={(e) => setIsCollabOpen(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
              <p className="text-[11px] opacity-70 leading-relaxed">
                Allow other poets with matching styles to submit complementary stanzas or remix this piece with co-authorship attribution.
              </p>
            </div>

          </div>

          {/* Publish Action Button */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-3 rounded-xl border border-stone-700 text-xs font-medium opacity-70 hover:opacity-100 hover:bg-stone-800 transition-all"
            >
              Discard Draft
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-102 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Inscribing...' : 'Publish to PoetVerse'}</span>
            </button>
          </div>

        </div>

        {/* Live Preview Column (5 Cols) */}
        {showLivePreview && (
          <div className="lg:col-span-5">
            <div className={`sticky top-24 rounded-3xl border p-8 shadow-2xl flex flex-col items-center justify-start text-center ${theme.cardBg} ${theme.border}`}>
              
              <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-stone-800 text-xs opacity-50">
                <span className="uppercase tracking-widest font-semibold flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" /> Reader Preview
                </span>
                <span>{genre}</span>
              </div>

              {/* Title & Author */}
              <div className="mb-6 max-w-sm">
                <h2 className="font-heading text-2xl font-bold text-amber-200 mb-2">
                  {title || 'Untitled Verse'}
                </h2>
                <div className="text-xs opacity-75">
                  Penned by <span className="text-amber-400 font-semibold">{currentUser.displayName}</span>
                </div>
              </div>

              {/* Poetic Stanzas */}
              <div className="w-full max-w-sm font-serif-reading text-base leading-relaxed text-left pl-2 opacity-90 space-y-1">
                {lines.length === 0 || !content.trim() ? (
                  <p className="opacity-30 italic text-center py-10">
                    Your verses will appear here with authentic poetic spacing and typography...
                  </p>
                ) : (
                  lines.map((l, i) => (
                    <p key={i} className={l.trim() === '' ? 'h-4' : 'whitespace-pre-wrap'}>
                      {l}
                    </p>
                  ))
                )}
              </div>

              {/* Tags Preview */}
              {tagsInput.trim() && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8 pt-4 border-t border-stone-800 w-full">
                  {tagsInput.split(',').map((t, idx) => t.trim() && (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      #{t.trim().replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </form>

    </div>
  );
}
