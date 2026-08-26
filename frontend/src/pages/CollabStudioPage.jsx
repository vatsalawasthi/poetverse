import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Feather, 
  BookOpen, 
  Flame 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { collabAPI } from '../services/api';
import CollabCard from '../components/CollabCard';
import AddStanzaModal from '../components/AddStanzaModal';
import CreateCollabModal from '../components/CreateCollabModal';
import PoemReaderModal from '../components/PoemReaderModal';

const FALLBACK_COLLABS = [
  {
    id: 'collab_1',
    title: 'Echoes Across the Horizon',
    promptOrTheme: 'A round-robin poem where each poet contributes a stanza from their continent’s perspective at the exact same moment of dawn.',
    genre: 'Free Verse',
    mood: 'Hopeful',
    maxStanzas: 4,
    leadAuthorId: 'user_elena',
    leadAuthorUsername: 'elena_solis',
    leadAuthorDisplayName: 'Elena Solis',
    leadAuthorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    status: 'IN_PROGRESS',
    stanzas: [
      {
        id: 's1',
        authorId: 'user_elena',
        authorUsername: 'elena_solis',
        authorDisplayName: 'Elena Solis',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        text: `The first ray strikes the Sierra snow,
Melting the crystal frost of slumber,
Waking the larks to sing the dawn.`,
        orderIndex: 1,
        status: 'APPROVED',
      },
      {
        id: 's2',
        authorId: 'user_vatsal',
        authorUsername: 'vatsal_poet',
        authorDisplayName: 'Vatsal Awasthi',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
        text: `Across the eastern oceans, bells awake the river ghats,
Incense spiraling through the morning fog,
Joining the distant hum of waking streets.`,
        orderIndex: 2,
        status: 'APPROVED',
      }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'collab_2',
    title: 'The Clockmaker’s Daughter',
    promptOrTheme: 'A narrative sonnet cycle about a daughter who repairs the lost seconds of human lives.',
    genre: 'Sonnets',
    mood: 'Mystic',
    maxStanzas: 3,
    leadAuthorId: 'user_zoya',
    leadAuthorUsername: 'zoya_mir',
    leadAuthorDisplayName: 'Zoya Mir',
    leadAuthorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    status: 'OPEN',
    stanzas: [
      {
        id: 's_z1',
        authorId: 'user_zoya',
        authorUsername: 'zoya_mir',
        authorDisplayName: 'Zoya Mir',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
        text: `With tweezers fine and magnifying glass,
She catches hours that slipped beneath the floor;
The ticking brass remembers what must pass,
Yet leaves a second waiting at the door.`,
        orderIndex: 1,
        status: 'APPROVED',
      }
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString()
  }
];

export default function CollabStudioPage() {
  const { currentUser, openAuthModal } = useAuth();
  const { theme } = useTheme();

  const [collabs, setCollabs] = useState(FALLBACK_COLLABS);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'OPEN', 'COMPLETED'
  const [selectedCollabForStanza, setSelectedCollabForStanza] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPoemForReading, setSelectedPoemForReading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCollabs = () => {
    setIsLoading(true);
    collabAPI.getAll(filterStatus === 'ALL' ? null : filterStatus)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCollabs(res.data);
        } else {
          setCollabs(FALLBACK_COLLABS);
        }
      })
      .catch(() => {
        let filtered = [...FALLBACK_COLLABS];
        if (filterStatus === 'OPEN') {
          filtered = filtered.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS');
        } else if (filterStatus === 'COMPLETED') {
          filtered = filtered.filter(c => c.status === 'COMPLETED');
        }
        setCollabs(filtered);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCollabs();
  }, [filterStatus]);

  const handleOpenAddStanza = (collab) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    setSelectedCollabForStanza(collab);
  };

  const handleOpenDetails = (collab) => {
    // Construct full poem object for completed reading
    const fullContent = collab.stanzas ? collab.stanzas.map(s => s.text).join('\n\n') : '';
    const coAuthors = collab.stanzas ? Array.from(new Set(collab.stanzas.map(s => s.authorDisplayName || s.authorUsername))) : [];
    
    setSelectedPoemForReading({
      id: collab.id,
      title: collab.title,
      content: fullContent,
      genre: collab.genre,
      mood: collab.mood,
      authorDisplayName: collab.leadAuthorDisplayName || collab.leadAuthorUsername,
      authorUsername: collab.leadAuthorUsername,
      authorAvatar: collab.leadAuthorAvatar,
      coAuthors,
      isCollabOpen: false,
      likesCount: 18,
      commentsCount: 3,
      tags: ['VerseCollab', collab.genre?.toLowerCase()]
    });
  };

  const handleStanzaAdded = (updatedCollab) => {
    setCollabs(prev => prev.map(c => c.id === updatedCollab.id ? updatedCollab : c));
  };

  const handleCollabCreated = (newCollab) => {
    setCollabs(prev => [newCollab, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Header Banner */}
      <div className={`relative rounded-3xl p-8 mb-8 border overflow-hidden shadow-2xl ${theme.cardBg} ${theme.border}`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              VerseCollab Studio
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-wide text-amber-100 mb-3">
              Co-Authoring the Unwritten.
            </h1>
            <p className="font-serif-reading text-sm sm:text-base opacity-80 leading-relaxed">
              Step into collaborative round-robin threads. Add the next stanza to an open prompt, exchange rhythmic ideas, and craft joint poetic anthologies.
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) openAuthModal();
              else setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs shadow-xl shadow-emerald-500/20 transition-all hover:scale-102 self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Collaboration Prompt</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-2xl bg-stone-900/60 border border-stone-800/80 w-fit">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStatus === 'ALL' ? 'bg-amber-500 text-stone-950 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          All Threads ({collabs.length})
        </button>

        <button
          onClick={() => setFilterStatus('OPEN')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStatus === 'OPEN' ? 'bg-amber-500 text-stone-950 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Open for Verses</span>
        </button>

        <button
          onClick={() => setFilterStatus('COMPLETED')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterStatus === 'COMPLETED' ? 'bg-amber-500 text-stone-950 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed Masterpieces</span>
        </button>
      </div>

      {/* Collaborations Grid */}
      {collabs.length === 0 ? (
        <div className={`text-center py-20 rounded-2xl border p-8 ${theme.cardBg} ${theme.border}`}>
          <Users className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-amber-200 mb-2">
            No active collaborative threads
          </h3>
          <p className="text-xs opacity-60 max-w-md mx-auto mb-6">
            Be the first poet to launch an open stanza exchange or round-robin challenge!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Start Collaboration
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {collabs.map((collab) => (
            <CollabCard
              key={collab.id}
              collab={collab}
              onAddStanza={handleOpenAddStanza}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      )}

      {/* Add Stanza Modal */}
      {selectedCollabForStanza && (
        <AddStanzaModal
          collab={selectedCollabForStanza}
          isOpen={Boolean(selectedCollabForStanza)}
          onClose={() => setSelectedCollabForStanza(null)}
          onStanzaAdded={handleStanzaAdded}
        />
      )}

      {/* Create New Collaboration Modal */}
      <CreateCollabModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCollabCreated={handleCollabCreated}
      />

      {/* Poem Reader for Completed Collaborations */}
      {selectedPoemForReading && (
        <PoemReaderModal
          poem={selectedPoemForReading}
          isOpen={Boolean(selectedPoemForReading)}
          onClose={() => setSelectedPoemForReading(null)}
        />
      )}

    </div>
  );
}
