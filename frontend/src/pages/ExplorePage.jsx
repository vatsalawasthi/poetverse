import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Feather, 
  BookOpen, 
  Users, 
  Flame, 
  ArrowRight,
  Music,
  Wind,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const GENRE_CARDS = [
  {
    name: 'Sonnets',
    icon: Moon,
    desc: '14-line structured masterpieces of meter, volta, and romantic tension.',
    count: '34 Verses',
    popularPrompt: 'The Architecture of Dusk',
    color: 'from-amber-600/30 to-amber-900/40',
    borderColor: 'border-amber-500/40',
  },
  {
    name: 'Spoken Word',
    icon: Flame,
    desc: 'Rhythmic, percussive cadence forged for the stage, street, and microphone.',
    count: '42 Verses',
    popularPrompt: 'Neon Cadence on 47th Street',
    color: 'from-orange-600/30 to-red-900/40',
    borderColor: 'border-orange-500/40',
  },
  {
    name: 'Haiku & Tanka',
    icon: Wind,
    desc: 'Ephemera captured in 5-7-5 syllabic pauses of nature, seasons, and silence.',
    count: '29 Verses',
    popularPrompt: 'Three Breaths of Autumn',
    color: 'from-emerald-600/30 to-teal-900/40',
    borderColor: 'border-emerald-500/40',
  },
  {
    name: 'Ghazal',
    icon: Sparkles,
    desc: 'Couplets of mystical devotion, radif refrain, and profound longing.',
    count: '18 Verses',
    popularPrompt: 'A Mirror of Stars',
    color: 'from-indigo-600/30 to-purple-900/40',
    borderColor: 'border-indigo-500/40',
  },
  {
    name: 'Free Verse',
    icon: Feather,
    desc: 'Liberated flow untethered by rhyme scheme, following raw internal rhythm.',
    count: '65 Verses',
    popularPrompt: 'Rivers in Winter Pockets',
    color: 'from-stone-700/40 to-stone-900/50',
    borderColor: 'border-stone-600/40',
  },
  {
    name: 'Romanticism',
    icon: Sun,
    desc: 'Sublime reverence for nature, human emotion, and solitary contemplation.',
    count: '24 Verses',
    popularPrompt: 'Whispers on the Andalusian Wind',
    color: 'from-amber-700/30 to-stone-900/40',
    borderColor: 'border-amber-600/40',
  }
];

export default function ExplorePage() {
  const { theme } = useTheme();
  const { personas } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Banner */}
      <div className={`relative rounded-3xl p-8 mb-8 border overflow-hidden shadow-2xl ${theme.cardBg} ${theme.border}`}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Poetic Horizons
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-wide text-amber-100 mb-3">
            Explore Styles & Traditions.
          </h1>
          <p className="font-serif-reading text-sm sm:text-base opacity-80 leading-relaxed">
            Browse poetry across diverse classical and contemporary traditions. Discover form guides, find signature works, and immerse in lyrical variety.
          </p>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {GENRE_CARDS.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.name}
              to={`/?genre=${genre.name}`}
              className={`group rounded-2xl border p-6 flex flex-col justify-between bg-gradient-to-br ${genre.color} ${genre.borderColor} shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-stone-900/60 border border-white/10 text-amber-300 shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold opacity-70">
                    {genre.count}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                  {genre.name}
                </h3>
                <p className="font-serif-reading text-xs opacity-80 leading-relaxed mb-4">
                  {genre.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Explore {genre.name}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Spotlight Poets Circle */}
      <div className={`rounded-3xl border p-8 ${theme.cardBg} ${theme.border}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-amber-200">
              Spotlight Bards in Residence
            </h2>
            <p className="text-xs opacity-60">
              Featured contributors active in collaborative stanza exchanges this week.
            </p>
          </div>
          <Link to="/matchmaker" className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1">
            Find Matches <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p) => (
            <Link
              key={p.id}
              to={`/profile/${p.username}`}
              className="p-4 rounded-2xl border border-stone-800 bg-stone-900/40 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all flex items-center gap-3.5 group"
            >
              <img
                src={p.avatar}
                alt={p.displayName}
                className="w-12 h-12 rounded-full object-cover border border-amber-400/40 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-stone-100 group-hover:text-amber-300 transition-colors truncate">
                  {p.displayName}
                </div>
                <div className="text-[11px] opacity-50 truncate">@{p.username}</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">
                  {p.interestGenres?.[0] || 'Poet'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
