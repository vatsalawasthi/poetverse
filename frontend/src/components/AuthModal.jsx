import React, { useState } from 'react';
import { X, Feather, Sparkles, User, Mail, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AVAILABLE_GENRES = ["Free Verse", "Sonnets", "Haiku & Tanka", "Ghazal", "Spoken Word", "Romanticism", "Elegies", "Ballads"];
const AVAILABLE_THEMES = ["Melancholy", "Love", "Philosophy", "Nature", "Cosmos", "Resistance", "Silence", "Moonlight"];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, personas, switchPersona } = useAuth();
  const { theme } = useTheme();

  const [mode, setMode] = useState('login'); // 'login', 'register', 'personas'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(['Free Verse', 'Sonnets']);
  const [selectedThemes, setSelectedThemes] = useState(['Philosophy', 'Melancholy']);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleTheme = (thm) => {
    setSelectedThemes(prev => 
      prev.includes(thm) ? prev.filter(t => t !== thm) : [...prev, thm]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in. Check your credentials.');
      }
    } else {
      const res = await register({
        username,
        email,
        password,
        displayName: displayName || username,
        bio,
        interestGenres: selectedGenres,
        favoriteThemes: selectedThemes,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
      });
      if (!res.success) {
        setError(res.error || 'Registration failed.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-200">
                {mode === 'login' ? 'Welcome Back, Bard' : mode === 'register' ? 'Join the Poet Sanctuary' : 'Select a Demo Persona'}
              </h2>
              <div className="text-xs opacity-60">
                PoetVerse — Social & Collaborative Sanctuary
              </div>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg border border-stone-700 hover:bg-stone-800 transition-all opacity-80 hover:opacity-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-stone-800/80">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-all ${mode === 'login' ? 'border-b-2 border-amber-400 text-amber-300 bg-amber-500/10' : 'opacity-60 hover:opacity-100'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-all ${mode === 'register' ? 'border-b-2 border-amber-400 text-amber-300 bg-amber-500/10' : 'opacity-60 hover:opacity-100'}`}
          >
            Create Profile
          </button>
          <button
            onClick={() => { setMode('personas'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-all ${mode === 'personas' ? 'border-b-2 border-amber-400 text-amber-300 bg-amber-500/10' : 'opacity-60 hover:opacity-100'}`}
          >
            Demo Poets
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {mode === 'personas' ? (
            <div className="space-y-3">
              <div className="text-xs opacity-70 mb-2">
                Click any established poet persona to instantly enter their perspective, test matchmaking, or co-author stanzas:
              </div>
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { switchPersona(p); closeAuthModal(); }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-stone-800 bg-stone-900/50 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all text-left group"
                >
                  <img
                    src={p.avatar}
                    alt={p.displayName}
                    className="w-11 h-11 rounded-full object-cover border border-amber-400/40 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                      {p.displayName}
                    </div>
                    <div className="text-xs opacity-50">@{p.username} • {p.location}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.interestGenres?.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 opacity-40" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. vatsal_poet or elena_solis"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Vatsal Awasthi"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 opacity-40" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="bard@verse.io"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Poet Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Brief note about your style, inspirations, or poetic journey..."
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Poetic Interests Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                      Your Poetic Genres (Used for Matchmaking)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_GENRES.map((g) => {
                        const selected = selectedGenres.includes(g);
                        return (
                          <button
                            type="button"
                            key={g}
                            onClick={() => toggleGenre(g)}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                              selected ? 'bg-amber-500 text-stone-950 font-bold border-amber-400' : 'border-stone-700 bg-stone-900/50 opacity-70 hover:opacity-100'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 inline mr-1" />}
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                      Favorite Themes & Inspirations
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_THEMES.map((t) => {
                        const selected = selectedThemes.includes(t);
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => toggleTheme(t)}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                              selected ? 'bg-amber-600/30 text-amber-300 font-bold border-amber-500' : 'border-stone-700 bg-stone-900/50 opacity-70 hover:opacity-100'
                            }`}
                          >
                            #{t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 opacity-40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Entering Sanctuary...' : mode === 'login' ? 'Sign In to PoetVerse' : 'Inscribe Profile'}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('personas')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Or click here to pick a ready demo persona
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
