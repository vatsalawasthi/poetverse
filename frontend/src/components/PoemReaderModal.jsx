import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Users, 
  Sparkles, 
  Check, 
  Type, 
  AlignLeft,
  Feather
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { commentAPI, poemAPI } from '../services/api';

export default function PoemReaderModal({ poem, isOpen, onClose, onPoemUpdated }) {
  const { currentUser, toggleBookmark } = useAuth();
  const { theme } = useTheme();

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedLineForComment, setSelectedLineForComment] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [readerFont, setReaderFont] = useState('font-serif-reading'); // 'font-serif-reading', 'font-serif-display', 'font-sans-modern'
  const [fontSizeClass, setFontSizeClass] = useState('text-lg');
  const [showLineNumbers, setShowLineNumbers] = useState(false);

  useEffect(() => {
    if (poem && isOpen) {
      const liked = poem.likedBy ? (Array.isArray(poem.likedBy) ? poem.likedBy.includes(currentUser?.id) : poem.likedBy.has?.(currentUser?.id)) : false;
      setIsLiked(liked);
      setLikesCount(poem.likesCount || 0);

      // Load comments & annotations
      commentAPI.getByPoem(poem.id)
        .then(res => setComments(res.data || []))
        .catch(() => {
          // sample mock comments for fallback
          setComments([
            {
              id: 'c1',
              username: 'elena_solis',
              displayName: 'Elena Solis',
              userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
              content: 'The imagery here flows with profound quietude. Stunning work!',
              lineIndex: 2,
              createdAt: new Date().toISOString(),
            }
          ]);
        });
    }
  }, [poem, isOpen, currentUser]);

  if (!isOpen || !poem) return null;

  const isBookmarked = currentUser?.bookmarkedPoemIds?.includes?.(poem.id) || false;

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await poemAPI.toggleLike(poem.id, currentUser.id);
    } catch (e) {
      // local fallback
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    if (nextLiked) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#fef3c7']
      });
    }

    if (onPoemUpdated) {
      onPoemUpdated({ ...poem, likesCount: nextLiked ? likesCount + 1 : likesCount - 1 });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentUser) return;
    setIsSubmittingComment(true);

    const commentPayload = {
      poemId: poem.id,
      userId: currentUser.id,
      content: newCommentText.trim(),
      lineIndex: selectedLineForComment,
    };

    try {
      const res = await commentAPI.addComment(commentPayload);
      setComments(prev => [...prev, res.data]);
    } catch (err) {
      // fallback local add
      const localComment = {
        id: 'c_' + Date.now(),
        poemId: poem.id,
        userId: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        userAvatar: currentUser.avatar,
        content: newCommentText.trim(),
        lineIndex: selectedLineForComment,
        createdAt: new Date().toISOString(),
      };
      setComments(prev => [...prev, localComment]);
    }

    setNewCommentText('');
    setSelectedLineForComment(null);
    setIsSubmittingComment(false);
  };

  const lines = poem.content ? poem.content.split('\n') : [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `?poem=${poem.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${theme.cardBg} ${theme.border}`}>
        
        {/* Header Controls */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border} bg-inherit/50`}>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
              {poem.genre || 'Poetry'}
            </span>
            {poem.mood && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-stone-800/80 text-stone-300 border border-stone-700">
                Mood: {poem.mood}
              </span>
            )}
            {poem.isCollabOpen && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30 flex items-center gap-1">
                <Users className="w-3 h-3" /> Collab Open
              </span>
            )}
          </div>

          {/* Typography Toolbar & Close */}
          <div className="flex items-center gap-2">
            {/* Font Style */}
            <div className="hidden sm:flex items-center gap-1 border border-stone-700/60 rounded-lg p-1">
              <button
                onClick={() => setReaderFont('font-serif-reading')}
                className={`px-2 py-0.5 text-xs rounded transition-all ${readerFont === 'font-serif-reading' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
                title="Serif Lora"
              >
                Lora
              </button>
              <button
                onClick={() => setReaderFont('font-serif-display')}
                className={`px-2 py-0.5 text-xs rounded transition-all ${readerFont === 'font-serif-display' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
                title="Playfair Display"
              >
                Playfair
              </button>
              <button
                onClick={() => setReaderFont('font-sans-modern')}
                className={`px-2 py-0.5 text-xs rounded transition-all ${readerFont === 'font-sans-modern' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
                title="Modern Sans"
              >
                Sans
              </button>
            </div>

            {/* Font Size Toggle */}
            <div className="hidden sm:flex items-center gap-1 border border-stone-700/60 rounded-lg p-1">
              <button
                onClick={() => setFontSizeClass('text-base')}
                className={`px-2 py-0.5 text-xs rounded ${fontSizeClass === 'text-base' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeClass('text-lg')}
                className={`px-2 py-0.5 text-xs rounded ${fontSizeClass === 'text-lg' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeClass('text-xl')}
                className={`px-2 py-0.5 text-xs rounded ${fontSizeClass === 'text-xl' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
              >
                A+
              </button>
            </div>

            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`p-1.5 rounded-lg border text-xs transition-all ${showLineNumbers ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' : 'border-stone-700/60 opacity-60'}`}
              title="Toggle Line Numbers"
            >
              123
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-stone-700/60 hover:bg-stone-800/60 transition-all opacity-80 hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left = Poem Sanctuary, Right = Notes & Marginalia */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-stone-800/60">
          
          {/* Poem Body (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 overflow-y-auto flex flex-col items-center justify-start text-center">
            
            {/* Title & Author Header */}
            <div className="mb-8 max-w-lg">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-amber-200 mb-2">
                {poem.title}
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-sm opacity-80">
                <span>Penned by</span>
                <span className="font-semibold text-amber-400">{poem.authorDisplayName || poem.authorUsername}</span>
                {poem.coAuthors && poem.coAuthors.length > 0 && (
                  <span className="text-xs text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    with {poem.coAuthors.join(', ')}
                  </span>
                )}
              </div>

              {poem.tags && poem.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  {poem.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] opacity-60 hover:opacity-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stanzas Display with Line Highlighting & Annotation Triggers */}
            <div className={`w-full max-w-xl mx-auto space-y-1 ${readerFont} ${fontSizeClass} leading-relaxed text-left pl-4`}>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const hasAnnotation = comments.some(c => c.lineIndex === lineNumber);
                const isSelected = selectedLineForComment === lineNumber;
                const isEmpty = line.trim() === '';

                if (isEmpty) {
                  return <div key={index} className="h-6" />;
                }

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedLineForComment(isSelected ? null : lineNumber)}
                    className={`group relative flex items-start gap-4 py-1 px-3 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-amber-500/20 border-l-4 border-amber-400 text-amber-200' 
                        : hasAnnotation 
                        ? 'hover:bg-amber-500/10 border-l-2 border-amber-500/50'
                        : 'hover:bg-stone-800/30'
                    }`}
                  >
                    {/* Line number */}
                    {showLineNumbers && (
                      <span className="text-[11px] font-mono opacity-30 select-none w-5 text-right mt-1">
                        {lineNumber}
                      </span>
                    )}

                    <p className="flex-1 whitespace-pre-wrap">{line}</p>

                    {/* Annotation Badge or Add Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {hasAnnotation ? (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                          <MessageSquare className="w-2.5 h-2.5" /> Note
                        </span>
                      ) : (
                        <span className="text-[10px] opacity-50 hover:text-amber-400">
                          +Annotate
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: Applause, Bookmark, Share */}
            <div className="mt-12 pt-6 border-t border-stone-800/60 w-full max-w-lg flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  isLiked
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'border-stone-700/80 hover:border-amber-500/50 opacity-80 hover:opacity-100 hover:bg-stone-800/40'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-stone-950' : 'text-amber-400'}`} />
                <span>Applause ({likesCount})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(poem.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isBookmarked
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : 'border-stone-700/80 hover:bg-stone-800/40 opacity-75 hover:opacity-100'
                  }`}
                  title="Bookmark Verse"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-700/80 hover:bg-stone-800/40 transition-all opacity-80 hover:opacity-100 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Marginalia / Line Notes & Community Feedback (5 Cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col h-full bg-inherit/40">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/60">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading text-sm font-semibold tracking-wide">
                  Marginalia & Comments
                </h3>
              </div>
              <span className="text-xs opacity-50">
                {comments.length} {comments.length === 1 ? 'reflection' : 'reflections'}
              </span>
            </div>

            {/* Active Line Annotation Prompt */}
            {selectedLineForComment && (
              <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                <span>Annotating Line {selectedLineForComment}</span>
                <button
                  onClick={() => setSelectedLineForComment(null)}
                  className="text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
              {comments.length === 0 ? (
                <div className="text-center py-10 opacity-50 text-xs">
                  No marginal notes yet. Be the first poet to share your reflection or click a line to annotate!
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      c.lineIndex && c.lineIndex === selectedLineForComment
                        ? 'border-amber-400 bg-amber-500/15'
                        : 'border-stone-800/80 bg-stone-900/30 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                          alt={c.displayName}
                          className="w-5 h-5 rounded-full object-cover border border-amber-500/30"
                        />
                        <span className="font-semibold text-amber-300">{c.displayName || c.username}</span>
                      </div>
                      {c.lineIndex && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Line {c.lineIndex}
                        </span>
                      )}
                    </div>
                    <p className="opacity-90 leading-relaxed font-serif-reading">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handleAddComment} className="mt-auto pt-3 border-t border-stone-800/60 flex flex-col gap-2">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={selectedLineForComment ? `Add margin note on line ${selectedLineForComment}...` : "Leave a poetic reflection..."}
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-stone-700/80 bg-stone-900/50 text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-50">
                    {selectedLineForComment ? `Attached to line ${selectedLineForComment}` : 'General reflection'}
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-all disabled:opacity-40"
                  >
                    Post Note
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center p-3 text-xs opacity-60 border-t border-stone-800">
                Please sign in to leave margin reflections.
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
