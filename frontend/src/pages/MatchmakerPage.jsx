import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Feather, 
  Filter, 
  Search, 
  HeartHandshake, 
  Sliders, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { matchmakerAPI } from '../services/api';
import MatchCard from '../components/MatchCard';
import CreateCollabModal from '../components/CreateCollabModal';

const FALLBACK_MATCHES = [
  {
    userId: 'user_elena',
    username: 'elena_solis',
    displayName: 'Elena Solis',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    bio: 'Weaver of midnight sonnets, classical romanticism, and whispers of the Andalusian wind.',
    location: 'Granada, Spain',
    matchPercentage: 94,
    sharedGenres: ['Sonnets', 'Free Verse'],
    sharedThemes: ['Melancholy', 'Philosophy'],
    poemCount: 12,
    followerCount: 48,
    isFollowing: true,
  },
  {
    userId: 'user_zoya',
    username: 'zoya_mir',
    displayName: 'Zoya Mir',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    bio: 'Penning contemporary Ghazals and mystic verses on longing, moonlight, and timeless truth.',
    location: 'Lahore, Pakistan',
    matchPercentage: 88,
    sharedGenres: ['Ghazal', 'Romanticism'],
    sharedThemes: ['Love', 'Philosophy'],
    poemCount: 9,
    followerCount: 35,
    isFollowing: false,
  },
  {
    userId: 'user_malik',
    username: 'malik_spoken',
    displayName: 'Malik Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Spoken word artist & rhythm architect. Translating urban pavement into fire and cadence.',
    location: 'Chicago, USA',
    matchPercentage: 82,
    sharedGenres: ['Spoken Word', 'Free Verse'],
    sharedThemes: ['Resistance', 'Hope'],
    poemCount: 15,
    followerCount: 62,
    isFollowing: true,
  },
  {
    userId: 'user_kaito',
    username: 'kaito_tanka',
    displayName: 'Kaito Tanaka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Minimalist observations. Capturing the ephemeral pause between falling raindrops.',
    location: 'Kyoto, Japan',
    matchPercentage: 74,
    sharedGenres: ['Haiku', 'Free Verse'],
    sharedThemes: ['Nature', 'Silence'],
    poemCount: 20,
    followerCount: 54,
    isFollowing: false,
  }
];

export default function MatchmakerPage() {
  const { currentUser, openAuthModal } = useAuth();
  const { theme } = useTheme();

  const [matches, setMatches] = useState(FALLBACK_MATCHES);
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedMatch, setInvitedMatch] = useState(null);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      matchmakerAPI.getMatches(currentUser.id)
        .then(res => {
          if (res.data && res.data.length > 0) {
            setMatches(res.data);
          } else {
            setMatches(FALLBACK_MATCHES);
          }
        })
        .catch(() => {
          setMatches(FALLBACK_MATCHES);
        })
        .finally(() => setIsLoading(false));
    }
  }, [currentUser]);

  const handleInviteCollab = (match) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    setInvitedMatch(match);
    setIsCollabModalOpen(true);
  };

  const filteredMatches = matches.filter(m => {
    if (selectedGenreFilter !== 'All') {
      const hasGenre = m.sharedGenres?.some(g => g.toLowerCase().includes(selectedGenreFilter.toLowerCase()));
      if (!hasGenre) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.displayName.toLowerCase().includes(q) || m.username.toLowerCase().includes(q) || m.bio.toLowerCase().includes(q);
      if (!matchName) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Banner */}
      <div className={`relative rounded-3xl p-8 mb-8 border overflow-hidden shadow-2xl ${theme.cardBg} ${theme.border}`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Poetic Resonance Engine
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-wide text-amber-100 mb-3">
            Discover Your Poetic Kin.
          </h1>
          <p className="font-serif-reading text-sm sm:text-base opacity-80 leading-relaxed">
            Our synergy algorithm pairs you with writers who share your lyrical rhythms, favorite poetic genres, and emotional themes.
          </p>

          {/* Current User Interests Tag Bar */}
          {currentUser && (
            <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-60 font-semibold uppercase text-[10px] tracking-wider">
                Your Affinity Profile:
              </span>
              {currentUser.interestGenres?.map((g, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  {g}
                </span>
              ))}
              {currentUser.favoriteThemes?.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        {/* Genre Synergy Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs uppercase tracking-wider opacity-50 font-semibold shrink-0">
            Filter by Match:
          </span>
          {['All', 'Sonnets', 'Free Verse', 'Ghazal', 'Spoken Word', 'Haiku'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenreFilter(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all shrink-0 ${
                selectedGenreFilter === g
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                  : 'border-stone-800 bg-stone-900/40 opacity-70 hover:opacity-100 hover:border-stone-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 opacity-40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search poets by style or name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-700/80 bg-stone-900/60 text-xs text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border p-8 ${theme.cardBg} ${theme.border}`}>
          <HeartHandshake className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-amber-200 mb-2">
            No matching bards found
          </h3>
          <p className="text-xs opacity-60 max-w-md mx-auto">
            Try adjusting your search criteria or broadening your selected poetic genres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.userId}
              match={match}
              onInviteCollab={handleInviteCollab}
            />
          ))}
        </div>
      )}

      {/* Direct Collab Invite Modal */}
      {isCollabModalOpen && (
        <CreateCollabModal
          isOpen={isCollabModalOpen}
          onClose={() => { setIsCollabModalOpen(false); setInvitedMatch(null); }}
          onCollabCreated={() => {
            setIsCollabModalOpen(false);
            setInvitedMatch(null);
          }}
        />
      )}

    </div>
  );
}
