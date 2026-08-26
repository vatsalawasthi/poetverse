import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, UserPlus, UserCheck, Users, Feather, BookOpen, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MatchCard({ match, onInviteCollab }) {
  const { currentUser, toggleFollow } = useAuth();
  const { theme } = useTheme();

  const isFollowing = currentUser?.following?.includes?.(match.userId) || match.isFollowing;
  const [followingState, setFollowingState] = useState(isFollowing);

  const handleFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(match.userId);
    setFollowingState(!followingState);
  };

  return (
    <div className={`group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] ${theme.cardBg} ${theme.border} hover:border-amber-500/50`}>
      
      {/* Top Banner: Match Score Badge */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <Link to={`/profile/${match.username}`} className="flex items-center gap-3">
            <img
              src={match.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={match.displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/40 shadow-md group-hover:border-amber-400 transition-colors"
            />
            <div>
              <h3 className="font-heading text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                {match.displayName}
              </h3>
              <div className="text-xs opacity-60">@{match.username}</div>
              {match.location && (
                <div className="flex items-center gap-1 text-[11px] opacity-40 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{match.location}</span>
                </div>
              )}
            </div>
          </Link>

          {/* Resonance / Synergy Badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{match.matchPercentage}% Resonance</span>
            </div>
            <span className="text-[10px] opacity-50 mt-1 uppercase tracking-wider font-semibold">
              Poetic Synergy
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs font-serif-reading opacity-80 leading-relaxed mb-4 line-clamp-2">
          {match.bio || "Crafting verses and wandering between stanzas."}
        </p>

        {/* Shared Genres */}
        {match.sharedGenres && match.sharedGenres.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider opacity-50 font-semibold mb-1.5 flex items-center gap-1">
              <Feather className="w-2.5 h-2.5 text-amber-400" /> Shared Genres
            </div>
            <div className="flex flex-wrap gap-1.5">
              {match.sharedGenres.map((g, i) => (
                <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Shared Themes */}
        {match.sharedThemes && match.sharedThemes.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wider opacity-50 font-semibold mb-1.5">
              Common Inspirations
            </div>
            <div className="flex flex-wrap gap-1.5">
              {match.sharedThemes.map((t, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metrics & Actions */}
      <div className="pt-4 border-t border-stone-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs opacity-60">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {match.poemCount || 0} verses
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {match.followerCount || 0} bards
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFollow}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              followingState
                ? 'border-stone-700 bg-stone-800 text-stone-300'
                : 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            {followingState ? (
              <>
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" />
                <span>Follow</span>
              </>
            )}
          </button>

          <button
            onClick={() => onInviteCollab(match)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-102"
          >
            <Users className="w-3 h-3" />
            <span>Collab</span>
          </button>
        </div>
      </div>

    </div>
  );
}
