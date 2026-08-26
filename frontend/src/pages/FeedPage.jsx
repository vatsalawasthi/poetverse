import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Users, 
  Search, 
  Feather, 
  Compass, 
  Filter,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { poemAPI } from '../services/api';
import PoemCard from '../components/PoemCard';
import PoemReaderModal from '../components/PoemReaderModal';

const GENRE_FILTERS = ["All", "Sonnets", "Haiku", "Spoken Word", "Ghazal", "Free Verse", "Romanticism", "Elegies"];

// Initial sample poems if backend is not yet populated
const FALLBACK_POEMS = [
  {
    id: 'p1',
    title: 'The Architecture of Dusk',
    genre: 'Sonnets',
    mood: 'Melancholy',
    tags: ['twilight', 'sonnet', 'longing', 'solitude'],
    authorId: 'user_elena',
    authorUsername: 'elena_solis',
    authorDisplayName: 'Elena Solis',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    likesCount: 14,
    commentsCount: 3,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: [],
    content: `The shadows crawl across the whitewashed stone,
As twilight folds its amber wings to rest;
The clock unwinds its quiet, steady drone,
While ancient longings stir within the chest.

We build our temples out of borrowed light,
And name each silence after what we lost;
Yet stars ignite the borders of the night,
Unmindful of the burning or the cost.`,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'p2',
    title: 'Neon Cadence on 47th Street',
    genre: 'Spoken Word',
    mood: 'Passionate',
    tags: ['spokenword', 'chicago', 'rhythm', 'citylights'],
    authorId: 'user_malik',
    authorUsername: 'malik_spoken',
    authorDisplayName: 'Malik Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    likesCount: 22,
    commentsCount: 5,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: [],
    content: `Listen to the asphalt humming under midnight tires,
A city built on stubborn dreams and blue-note fires.
Every subway grate exhales the breath of yesterday's hustle,
Where tired shoulders carry worlds with quiet muscle.

We don't just speak—we strike the anvil of the mic,
Turn the friction in our veins into a lightning strike.
If you've ever felt the tremor when the bassline drops,
You know this heartbeat in our chest ain't never gonna stop.`,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'p3',
    title: 'Three Breaths of Autumn',
    genre: 'Haiku',
    mood: 'Serene',
    tags: ['autumn', 'zen', 'nature', 'leaves'],
    authorId: 'user_kaito',
    authorUsername: 'kaito_tanka',
    authorDisplayName: 'Kaito Tanaka',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    likesCount: 19,
    commentsCount: 2,
    isCollabOpen: false,
    collabMode: 'NONE',
    coAuthors: [],
    content: `Pale morning mist drifts
Upon the copper river—
A maple leaf floats.

Cold wind through bamboo,
The bell tolls across the hill,
Silence bows its head.

First frost on the pine,
Sunlight warms the wooden porch,
Winter draws its breath.`,
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'p4',
    title: 'A Mirror of Stars (آئینہِ شب)',
    genre: 'Ghazal',
    mood: 'Mystic',
    tags: ['ghazal', 'mystic', 'love', 'night'],
    authorId: 'user_zoya',
    authorUsername: 'zoya_mir',
    authorDisplayName: 'Zoya Mir',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    likesCount: 27,
    commentsCount: 4,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: [],
    content: `The cup is filled with liquid sky, tonight the heavens weep,
In quiet alcoves of the soul, the sacred vigil keep.

You search the shore for footprints that the gentle wave erased,
While oceans in your secret heart run turbulent and deep.

What candle ever feared the flame that gave it cause to shine?
The moth and fire understand what mortal lovers seek.`,
    createdAt: new Date(Date.now() - 28800000).toISOString()
  }
];

export default function FeedPage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  const [poems, setPoems] = useState(FALLBACK_POEMS);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'trending', 'following', 'collab'
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPoems = () => {
    setIsLoading(true);
    poemAPI.getFeed({
      filter: activeTab,
      genre: selectedGenre === 'All' ? null : selectedGenre,
      userId: currentUser?.id,
      search: searchQuery
    })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPoems(res.data);
        } else if (!searchQuery && selectedGenre === 'All' && activeTab === 'all') {
          setPoems(FALLBACK_POEMS);
        } else {
          setPoems(res.data || []);
        }
      })
      .catch(() => {
        // Filter local fallback
        let filtered = [...FALLBACK_POEMS];
        if (activeTab === 'trending') {
          filtered.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        } else if (activeTab === 'collab') {
          filtered = filtered.filter(p => p.isCollabOpen);
        }
        if (selectedGenre !== 'All') {
          filtered = filtered.filter(p => p.genre.toLowerCase() === selectedGenre.toLowerCase());
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.content.toLowerCase().includes(q) || 
            p.authorDisplayName.toLowerCase().includes(q)
          );
        }
        setPoems(filtered);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPoems();
  }, [activeTab, selectedGenre, searchQuery, currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Banner / Poetic Quote of the Day */}
      <div className={`relative rounded-3xl p-8 mb-8 border overflow-hidden shadow-2xl ${theme.cardBg} ${theme.border}`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Welcome to the Grand Circle
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-wide text-amber-100 mb-3">
              Where Words Weave Worlds.
            </h1>
            <p className="font-serif-reading text-sm sm:text-base opacity-80 leading-relaxed">
              Read curated verses, annotate margins with reflections, and unite with kindred poets across the globe to write collaborative stanzas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/collab"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/10 transition-all text-center"
            >
              <Users className="w-4 h-4" />
              <span>Join VerseCollab</span>
            </Link>
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all text-center hover:scale-102"
            >
              <Feather className="w-4 h-4" />
              <span>Pen a Verse</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Feed Controls & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        {/* Feed View Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900/60 border border-stone-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'opacity-70 hover:opacity-100 hover:text-amber-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest Verses</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'trending'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'opacity-70 hover:opacity-100 hover:text-amber-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Top Applause</span>
          </button>

          <button
            onClick={() => setActiveTab('collab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'collab'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'opacity-70 hover:opacity-100 hover:text-amber-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Open Collabs</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'following'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'opacity-70 hover:opacity-100 hover:text-amber-300'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Following Circle</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 opacity-40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verses, themes, or bards..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-700/80 bg-stone-900/60 text-xs text-stone-100 placeholder:opacity-40 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <span className="text-xs uppercase tracking-wider opacity-50 font-semibold flex items-center gap-1 shrink-0 pl-1">
          <Filter className="w-3 h-3 text-amber-400" /> Genre:
        </span>
        {GENRE_FILTERS.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all shrink-0 ${
              selectedGenre === g
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                : 'border-stone-800 bg-stone-900/40 opacity-70 hover:opacity-100 hover:border-stone-700'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Poems Grid */}
      {poems.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border p-8 ${theme.cardBg} ${theme.border}`}>
          <Feather className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-amber-200 mb-2">
            No verses found in this sanctuary
          </h3>
          <p className="text-xs opacity-60 max-w-md mx-auto mb-6">
            Try adjusting your search keywords, switching genre filters, or be the first bard to publish a verse here!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Pen First Verse
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {poems.map((poem) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              onSelectPoem={setSelectedPoem}
            />
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {selectedPoem && (
        <PoemReaderModal
          poem={selectedPoem}
          isOpen={Boolean(selectedPoem)}
          onClose={() => setSelectedPoem(null)}
          onPoemUpdated={(updated) => {
            setPoems(prev => prev.map(p => p.id === updated.id ? updated : p));
          }}
        />
      )}

    </div>
  );
}
