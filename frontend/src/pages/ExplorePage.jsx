import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Feather, 
  BookOpen, 
  Users, 
  Flame, 
  ArrowRight,
  Wind,
  Sun,
  Moon,
  Search,
  Tag,
  Heart,
  Award,
  Filter,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { poemAPI, userAPI } from '../services/api';
import PoemCard from '../components/PoemCard';
import PoemReaderModal from '../components/PoemReaderModal';

const GENRE_CARDS = [
  {
    name: 'Sonnets',
    icon: Moon,
    desc: '14-line structured masterpieces of meter, volta, and romantic tension.',
    count: '34 Verses',
    color: 'from-amber-600/30 to-amber-900/40',
    borderColor: 'border-amber-500/40',
  },
  {
    name: 'Spoken Word',
    icon: Flame,
    desc: 'Rhythmic, percussive cadence forged for the stage, street, and microphone.',
    count: '42 Verses',
    color: 'from-orange-600/30 to-red-900/40',
    borderColor: 'border-orange-500/40',
  },
  {
    name: 'Haiku & Tanka',
    icon: Wind,
    desc: 'Ephemera captured in 5-7-5 syllabic pauses of nature, seasons, and silence.',
    count: '29 Verses',
    color: 'from-emerald-600/30 to-teal-900/40',
    borderColor: 'border-emerald-500/40',
  },
  {
    name: 'Ghazal',
    icon: Sparkles,
    desc: 'Couplets of mystical devotion, radif refrain, and profound longing.',
    count: '18 Verses',
    color: 'from-indigo-600/30 to-purple-900/40',
    borderColor: 'border-indigo-500/40',
  },
  {
    name: 'Free Verse',
    icon: Feather,
    desc: 'Liberated flow untethered by rhyme scheme, following raw internal rhythm.',
    count: '65 Verses',
    color: 'from-stone-700/40 to-stone-900/50',
    borderColor: 'border-stone-600/40',
  },
  {
    name: 'Romanticism',
    icon: Sun,
    desc: 'Sublime reverence for nature, human emotion, and solitary contemplation.',
    count: '24 Verses',
    color: 'from-amber-700/30 to-stone-900/40',
    borderColor: 'border-amber-600/40',
  }
];

const GENRES = ["All", "Sonnets", "Spoken Word", "Haiku", "Ghazal", "Free Verse", "Romanticism", "Elegies"];

const POPULAR_THEMES = ["Cosmos", "Philosophy", "Love", "Melancholy", "Nature", "Silence", "Urban", "Identity", "Hope", "Stars"];

const FALLBACK_POETS = [
  {
    id: 'u_elena',
    username: 'elena_solis',
    displayName: 'Elena Solis',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    bio: 'Weaver of midnight sonnets, classical romanticism, and whispers of the Andalusian wind.',
    interestGenres: ['Sonnets', 'Romanticism', 'Elegies'],
    badges: ['Master Sonneteer', 'Crown Poet 2026'],
    location: 'Granada, Spain'
  },
  {
    id: 'u_malik',
    username: 'malik_spoken',
    displayName: 'Malik Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Spoken word artist & rhythm architect. Translating urban pavement into fire and cadence.',
    interestGenres: ['Spoken Word', 'Slam Poetry', 'Free Verse'],
    badges: ['Slam Champion', 'Rhythm Architect'],
    location: 'Chicago, USA'
  },
  {
    id: 'u_kaito',
    username: 'kaito_tanka',
    displayName: 'Kaito Tanaka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Minimalist observations. Capturing the ephemeral pause between falling raindrops.',
    interestGenres: ['Haiku', 'Tanka', 'Nature'],
    badges: ['Zen Master', 'Haiku Purist'],
    location: 'Kyoto, Japan'
  },
  {
    id: 'u_zoya',
    username: 'zoya_mir',
    displayName: 'Zoya Mir',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    bio: 'Penning contemporary Ghazals and mystic verses on longing, moonlight, and timeless truth.',
    interestGenres: ['Ghazal', 'Sufi & Mystic', 'Romanticism'],
    badges: ['Ghazal Virtuoso', 'Verse Weaver'],
    location: 'Lahore, Pakistan'
  },
  {
    id: 'u_vatsal',
    username: 'vatsal_poet',
    displayName: 'Vatsal Awasthi',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    bio: 'Exploring the intersection of modern verse, cosmic philosophy, and spontaneous rhythm.',
    interestGenres: ['Free Verse', 'Sonnets', 'Spoken Word'],
    badges: ['Pioneer Poet', 'Co-Author Pioneer'],
    location: 'New Delhi, India'
  }
];

const FALLBACK_POEMS = [
  {
    id: 'p1',
    title: 'The Architecture of Dusk',
    genre: 'Sonnets',
    mood: 'Melancholy',
    tags: ['twilight', 'sonnet', 'longing', 'solitude', 'cosmos'],
    authorId: 'u_elena',
    authorUsername: 'elena_solis',
    authorDisplayName: 'Elena Solis',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    likesCount: 24,
    commentsCount: 6,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: [],
    content: `The shadows crawl across the whitewashed stone,\nAs twilight folds its amber wings to rest;\nThe clock unwinds its quiet, steady drone,\nWhile ancient longings stir within the chest.\n\nWe build our temples out of borrowed light,\nAnd name each silence after what we lost;\nYet stars ignite the borders of the night,\nUnmindful of the burning or the cost.`,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'p2',
    title: 'Neon Cadence on 47th Street',
    genre: 'Spoken Word',
    mood: 'Passionate',
    tags: ['spokenword', 'urban', 'rhythm', 'citylights', 'identity'],
    authorId: 'u_malik',
    authorUsername: 'malik_spoken',
    authorDisplayName: 'Malik Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    likesCount: 38,
    commentsCount: 9,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: [],
    content: `Listen to the asphalt humming under midnight tires,\nA city built on stubborn dreams and blue-note fires.\nEvery subway grate exhales the breath of yesterday's hustle,\nWhere tired shoulders carry worlds with quiet muscle.\n\nWe don't just speak—we strike the anvil of the mic,\nTurn the friction in our veins into a lightning strike.`,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'p3',
    title: 'Three Breaths of Autumn',
    genre: 'Haiku',
    mood: 'Serene',
    tags: ['autumn', 'nature', 'silence', 'zen'],
    authorId: 'u_kaito',
    authorUsername: 'kaito_tanka',
    authorDisplayName: 'Kaito Tanaka',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    likesCount: 31,
    commentsCount: 4,
    isCollabOpen: false,
    collabMode: 'NONE',
    coAuthors: [],
    content: `Pale morning mist drifts\nUpon the copper river—\nA maple leaf floats.\n\nCold wind through bamboo,\nThe bell tolls across the hill,\nSilence bows its head.`,
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'p4',
    title: 'The Ghazal of Wandering Moons',
    genre: 'Ghazal',
    mood: 'Mystic',
    tags: ['ghazal', 'moonlight', 'longing', 'philosophy'],
    authorId: 'u_zoya',
    authorUsername: 'zoya_mir',
    authorDisplayName: 'Zoya Mir',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    likesCount: 29,
    commentsCount: 7,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: [],
    content: `Across the barren desert night, a silver ember sings of you,\nIn every cup of midnight wine, the velvet shadows speak of you.\n\nI asked the stars where solace dwells among these revolving skies,\nThey only whispered through the dark and drew a constellation of you.`,
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'p5',
    title: 'Starlight Through the Lattice',
    genre: 'Free Verse',
    mood: 'Philosophical',
    tags: ['cosmos', 'philosophy', 'reflection', 'stars'],
    authorId: 'u_vatsal',
    authorUsername: 'vatsal_poet',
    authorDisplayName: 'Vatsal Awasthi',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    likesCount: 45,
    commentsCount: 12,
    isCollabOpen: true,
    collabMode: 'ADD_STANZA',
    coAuthors: ['elena_solis'],
    content: `We measure eternity by the flickering of distant suns,\nForgetting that the light we touch today began its voyage\nBefore our ancestors learned the geometry of sorrow.\n\nHere, between the intake and release of breath,\nThe universe rebuilds its quietest sanctuary.`,
    createdAt: new Date(Date.now() - 18000000).toISOString()
  }
];

export default function ExplorePage() {
  const { theme } = useTheme();
  const { currentUser, toggleFollow } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [poems, setPoems] = useState(FALLBACK_POEMS);
  const [poets, setPoets] = useState(FALLBACK_POETS);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'poems', 'poets', 'genres'

  useEffect(() => {
    // Fetch live poems
    poemAPI.getFeed()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPoems(res.data);
        }
      })
      .catch(() => {
        setPoems(FALLBACK_POEMS);
      });

    // Fetch live poets
    userAPI.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPoets(res.data);
        }
      })
      .catch(() => {
        setPoets(FALLBACK_POETS);
      });
  }, []);

  const handleGenreClick = (genreName) => {
    setSelectedGenre(genreName);
    setSelectedTheme('All');
    setSearchParams(genreName === 'All' ? {} : { genre: genreName });
  };

  const handleThemeClick = (themeName) => {
    setSelectedTheme(prev => prev === themeName ? 'All' : themeName);
  };

  // Filter poems
  const filteredPoems = poems.filter(poem => {
    const matchesGenre = selectedGenre === 'All' || 
      poem.genre?.toLowerCase().includes(selectedGenre.toLowerCase().replace('& tanka', '').trim());

    const matchesTheme = selectedTheme === 'All' ||
      poem.mood?.toLowerCase() === selectedTheme.toLowerCase() ||
      poem.tags?.some(t => t.toLowerCase() === selectedTheme.toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      poem.title?.toLowerCase().includes(query) ||
      poem.content?.toLowerCase().includes(query) ||
      poem.authorDisplayName?.toLowerCase().includes(query) ||
      poem.authorUsername?.toLowerCase().includes(query) ||
      poem.tags?.some(t => t.toLowerCase().includes(query));

    return matchesGenre && matchesTheme && matchesSearch;
  });

  // Filter poets
  const filteredPoets = poets.filter(poet => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return poet.displayName?.toLowerCase().includes(query) ||
      poet.username?.toLowerCase().includes(query) ||
      poet.bio?.toLowerCase().includes(query) ||
      poet.interestGenres?.some(g => g.toLowerCase().includes(query));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Banner with Search */}
      <div className={`relative rounded-3xl p-8 border overflow-hidden shadow-2xl ${theme.cardBg} ${theme.border}`}>
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Poetic Horizons & Discovery
          </div>
          
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-amber-100 mb-3 leading-tight">
            Explore Styles, Traditions & Bards.
          </h1>
          
          <p className="font-serif-reading text-sm sm:text-base opacity-80 leading-relaxed mb-6">
            Immerse yourself in structured sonnets, raw spoken word, meditative haiku, and mystical ghazals. Connect with fellow poets and discover contemporary masterpieces.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 opacity-40 text-stone-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search poems by title, verses, tags, or poet name..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-stone-700 bg-stone-900/90 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Genre Chips */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Browse by Genre:
            </span>
          </div>
          
          {/* Active Filter Indicators */}
          {(selectedGenre !== 'All' || selectedTheme !== 'All' || searchQuery) && (
            <button
              onClick={() => { setSelectedGenre('All'); setSelectedTheme('All'); setSearchQuery(''); setSearchParams({}); }}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Reset all filters <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => handleGenreClick(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedGenre === g
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'border border-stone-800 bg-stone-900/60 opacity-70 hover:opacity-100 hover:border-stone-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Popular Themes Bar */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold opacity-50 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> Themes:
          </span>
          {POPULAR_THEMES.map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleThemeClick(themeName)}
              className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all shrink-0 ${
                selectedTheme === themeName
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                  : 'border-stone-800 text-stone-400 bg-stone-900/40 hover:text-stone-200'
              }`}
            >
              #{themeName}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-amber-200 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Poetic Forms & Traditions
          </h2>
          <span className="text-xs opacity-60">Click any tradition to filter poems</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GENRE_CARDS.map((genre) => {
            const Icon = genre.icon;
            const isSelected = selectedGenre.toLowerCase().includes(genre.name.toLowerCase().slice(0, 4));

            return (
              <div
                key={genre.name}
                onClick={() => handleGenreClick(genre.name)}
                className={`group rounded-2xl border p-5 flex flex-col justify-between bg-gradient-to-br ${genre.color} ${genre.borderColor} shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-stone-900/70 border border-white/10 text-amber-300 shadow">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold opacity-75">
                      {genre.count}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-1.5">
                    {genre.name}
                  </h3>
                  <p className="font-serif-reading text-xs opacity-80 leading-relaxed mb-3">
                    {genre.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Browse {genre.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Community Poets Showcase */}
      <div className={`rounded-3xl border p-6 sm:p-8 ${theme.cardBg} ${theme.border}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-amber-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Community Bards in Residence
            </h2>
            <p className="text-xs opacity-60 mt-0.5">
              Active poets penning verses and leading collaborative stanzas.
            </p>
          </div>

          <Link to="/matchmaker" className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1">
            Poet Matchmaker <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredPoets.slice(0, 10).map((poet) => (
            <div
              key={poet.id || poet.username}
              className="p-4 rounded-2xl border border-stone-800 bg-stone-900/50 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all flex flex-col justify-between group"
            >
              <Link to={`/profile/${poet.username}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={poet.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={poet.displayName}
                    className="w-11 h-11 rounded-full object-cover border border-amber-400/40 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-stone-100 group-hover:text-amber-300 transition-colors truncate">
                      {poet.displayName}
                    </div>
                    <div className="text-[11px] opacity-50 truncate">@{poet.username}</div>
                  </div>
                </div>

                <p className="text-[11px] opacity-70 line-clamp-2 mb-3 leading-relaxed">
                  {poet.bio || 'Penning verses in the PoetVerse sanctuary.'}
                </p>

                {poet.badges && poet.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-0.5 font-medium">
                      <Award className="w-2.5 h-2.5" /> {poet.badges[0]}
                    </span>
                  </div>
                )}
              </Link>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <Link
                  to={`/profile/${poet.username}`}
                  className="text-[11px] text-amber-400 font-semibold hover:underline"
                >
                  View Verses
                </Link>
                {currentUser && currentUser.id !== poet.id && (
                  <button
                    onClick={() => toggleFollow(poet.id)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 font-bold border border-stone-700 transition-all cursor-pointer"
                  >
                    {currentUser.following?.includes(poet.id) ? 'Following' : '+ Follow'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovered Verses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-amber-200 flex items-center gap-2">
              <Feather className="w-5 h-5 text-amber-400" />
              {selectedGenre === 'All' ? 'Curated Verses' : `${selectedGenre} Verses`}
              <span className="text-sm font-normal opacity-60">({filteredPoems.length})</span>
            </h2>
            <p className="text-xs opacity-60 mt-0.5">
              Read, like, bookmark, or join collaborative stanzas from these masterworks.
            </p>
          </div>

          <Link
            to="/create"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Publish a Verse</span>
          </Link>
        </div>

        {filteredPoems.length === 0 ? (
          <div className={`text-center py-16 rounded-3xl border p-8 ${theme.cardBg} ${theme.border}`}>
            <BookOpen className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-amber-200 mb-2">
              No verses found matching your criteria
            </h3>
            <p className="text-xs opacity-60 max-w-md mx-auto mb-5">
              Try choosing a different genre filter, selecting another theme tag, or resetting your search query.
            </p>
            <button
              onClick={() => { setSelectedGenre('All'); setSelectedTheme('All'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoems.map((poem) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onSelectPoem={setSelectedPoem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {selectedPoem && (
        <PoemReaderModal
          poem={selectedPoem}
          isOpen={Boolean(selectedPoem)}
          onClose={() => setSelectedPoem(null)}
        />
      )}

    </div>
  );
}
