import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Users, 
  Sparkles, 
  Feather, 
  ExternalLink,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { poemAPI } from '../services/api';

export default function PoemCard({ poem, onSelectPoem }) {
  const { currentUser, toggleBookmark } = useAuth();
  const { theme } = useTheme();

  const isInitiallyLiked = poem.likedBy 
    ? (Array.isArray(poem.likedBy) ? poem.likedBy.includes(currentUser?.id) : poem.likedBy.has?.(currentUser?.id)) 
    : false;
  
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likesCount, setLikesCount] = useState(poem.likesCount || 0);

  const isBookmarked = currentUser?.bookmarkedPoemIds?.includes?.(poem.id) || false;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;

    try {
      await poemAPI.toggleLike(poem.id, currentUser.id);
    } catch (err) {
      // local fallback
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    if (nextLiked) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#fbbf24', '#d97706']
      });
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    toggleBookmark(poem.id);
  };

  // Preview first 2-3 stanzas or 6 lines max
  const lines = poem.content ? poem.content.split('\n') : [];
  const previewLines = lines.slice(0, 6);
  const hasMoreLines = lines.length > 6;

  return (
    <div
      onClick={() => onSelectPoem(poem)}
      className={`group relative rounded-2xl border p-6 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between ${theme.cardBg} ${theme.border} hover:border-amber-500/50`}
    >
      
      {/* Top Header: Author info & Genre Badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={poem.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={poem.authorDisplayName || poem.authorUsername}
              className="w-10 h-10 rounded-full object-cover border border-amber-400/40 shadow"
            />
            <div>
              <div className="text-sm font-semibold hover:underline flex items-center gap-1.5 text-stone-100 group-hover:text-amber-300 transition-colors">
                <span>{poem.authorDisplayName || poem.authorUsername}</span>
                {poem.coAuthors && poem.coAuthors.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    +{poem.coAuthors.length} Co-authors
                  </span>
                )}
              </div>
              <div className="text-xs opacity-50">
                @{poem.authorUsername}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {poem.genre || 'Poem'}
            </span>
            {poem.isCollabOpen && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <Users className="w-2.5 h-2.5" /> Collab
              </span>
            )}
          </div>
        </div>

        {/* Poem Title */}
        <h2 className="font-heading text-xl font-bold tracking-wide mb-3 text-amber-200 group-hover:text-amber-300 transition-colors">
          {poem.title}
        </h2>

        {/* Poetic Stanza Excerpt */}
        <div className="font-serif-reading text-sm sm:text-base leading-relaxed opacity-85 mb-4 pl-3 border-l-2 border-amber-500/30 group-hover:border-amber-400 transition-colors">
          {previewLines.map((line, idx) => (
            <p key={idx} className={line.trim() === '' ? 'h-3' : 'whitespace-pre-wrap'}>
              {line}
            </p>
          ))}
          {hasMoreLines && (
            <span className="text-xs text-amber-400/80 italic mt-2 block font-sans">
              ... Click to read full poem & marginalia
            </span>
          )}
        </div>

        {/* Tags */}
        {poem.tags && poem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {poem.tags.map((t, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800/60 text-stone-300 opacity-70">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-800/60 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-all ${
              isLiked ? 'text-amber-400 font-bold scale-105' : 'opacity-60 hover:opacity-100 hover:text-amber-400'
            }`}
            title="Applaud verse"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-amber-400' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <div className="flex items-center gap-1.5 opacity-60">
            <MessageSquare className="w-4 h-4" />
            <span>{poem.commentsCount || 0}</span>
          </div>

          {poem.mood && (
            <span className="hidden sm:inline text-[11px] opacity-40 italic">
              • {poem.mood}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-lg transition-all ${
              isBookmarked ? 'text-amber-400 bg-amber-500/10' : 'opacity-50 hover:opacity-100 hover:text-amber-400'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <span className="text-amber-400 opacity-80 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-medium">
            Read <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>

    </div>
  );
}
