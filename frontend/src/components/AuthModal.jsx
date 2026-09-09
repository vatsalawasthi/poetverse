import React, { useState, useEffect } from 'react';
import { X, Feather, User, Mail, Lock, Check, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AVAILABLE_GENRES = ["Free Verse", "Sonnets", "Haiku & Tanka", "Ghazal", "Spoken Word", "Romanticism", "Elegies", "Ballads"];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalInitialMode, login, register } = useAuth();
  const { theme } = useTheme();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(['Free Verse', 'Sonnets']);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authModalInitialMode) {
      setMode(authModalInitialMode);
      setError(null);
    }
  }, [authModalInitialMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please check your username/password.');
      }
    } else {
      if (!email.trim() || !password.trim() || !username.trim()) {
        setError('Please fill in username, email, and password.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long for security.');
        setIsSubmitting(false);
        return;
      }

      const res = await register({
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        displayName: displayName.trim() || username.trim(),
        bio: bio.trim() || 'A poet in the PoetVerse sanctuary.',
        interestGenres: selectedGenres,
        favoriteThemes: ['Philosophy', 'Love', 'Reflective'],
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username.trim()}`
      });

      if (!res.success) {
        setError(res.error || 'Registration failed. Username or email may already exist.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${theme.cardBg} ${theme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-200">
                {mode === 'login' ? 'Sign In to PoetVerse' : 'Create Your Poet Account'}
              </h2>
              <div className="text-xs opacity-60">
                {mode === 'login' ? 'Access your personal verses and drafts' : 'Join the private sanctuary with your credentials'}
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
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${mode === 'login' ? 'border-b-2 border-amber-400 text-amber-300 bg-amber-500/10' : 'opacity-60 hover:opacity-100'}`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${mode === 'register' ? 'border-b-2 border-amber-400 text-amber-300 bg-amber-500/10' : 'opacity-60 hover:opacity-100'}`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  Full Name / Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Maya Angelou, John Keats, or Your Name"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                {mode === 'login' ? 'Username or Email *' : 'Choose Username *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 opacity-40" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter username or email' : 'e.g. poetry_soul'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  Personal Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 opacity-40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
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

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                    Poet Bio (Optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief line about your themes and writing style..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900/70 text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                    Your Preferred Poetic Genres
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
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign In Securely' : 'Create Private Account'}
              </button>
            </div>

            <div className="text-center pt-2">
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  New to PoetVerse? Create an account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
