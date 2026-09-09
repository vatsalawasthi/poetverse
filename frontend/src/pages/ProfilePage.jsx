import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Sparkles, 
  Feather, 
  BookOpen, 
  Users, 
  Heart, 
  Bookmark, 
  Edit3, 
  Check, 
  Award,
  Calendar,
  Trash2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { poemAPI, userAPI } from '../services/api';
import PoemCard from '../components/PoemCard';
import PoemReaderModal from '../components/PoemReaderModal';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, toggleFollow, updateProfile, deleteAccount } = useAuth();
  const { theme } = useTheme();

  const [profileUser, setProfileUser] = useState(null);
  const [poems, setPoems] = useState([]);
  const [activeTab, setActiveTab] = useState('published'); // 'published', 'collaborations', 'bookmarked', 'about'
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Edit Form State
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editGenres, setEditGenres] = useState([]);

  const isOwnProfile = !username || (currentUser && currentUser.username === username);

  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(currentUser);
      setEditDisplayName(currentUser?.displayName || '');
      setEditBio(currentUser?.bio || '');
      setEditLocation(currentUser?.location || '');
      setEditGenres(currentUser?.interestGenres || []);
    } else {
      userAPI.getByUsername(username)
        .then(res => {
          setProfileUser(res.data);
        })
        .catch(() => {
          // fallback to matching mock persona
          const fallback = currentUser;
          setProfileUser(fallback);
        });
    }
  }, [username, isOwnProfile, currentUser]);

  useEffect(() => {
    if (profileUser) {
      poemAPI.getByAuthor(profileUser.id)
        .then(res => {
          if (res.data && res.data.length > 0) {
            setPoems(res.data);
          }
        })
        .catch(() => {
          // fallback mock poems for this user
        });
    }
  }, [profileUser]);

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs opacity-60">
        Loading poet portfolio...
      </div>
    );
  }

  const isFollowing = currentUser?.following?.includes?.(profileUser.id);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      displayName: editDisplayName,
      bio: editBio,
      location: editLocation,
      interestGenres: editGenres,
    });
    setIsEditing(false);
  };

  const handleConfirmDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    setDeleteError(null);
    const res = await deleteAccount();
    if (res.success) {
      setShowDeleteModal(false);
      navigate('/');
    } else {
      setDeleteError(res.error || 'Failed to delete account.');
      setIsDeleting(false);
    }
  };

  const publishedPoems = poems.filter(p => !p.coAuthors || p.coAuthors.length === 0);
  const collabPoems = poems.filter(p => p.coAuthors && p.coAuthors.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Profile Header Banner */}
      <div className={`relative rounded-3xl border p-8 mb-8 shadow-2xl overflow-hidden ${theme.cardBg} ${theme.border}`}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={profileUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250'}
                alt={profileUser.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/50 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-amber-500 text-stone-950 shadow">
                <Feather className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-amber-100">
                  {profileUser.displayName}
                </h1>
                {profileUser.badges?.includes('Crown Poet 2026') && (
                  <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold px-2 py-0.5 rounded-full shadow">
                    Crown Poet
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs opacity-60 mb-3">
                <span>@{profileUser.username}</span>
                {profileUser.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" /> {profileUser.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-500" /> Joined 2026
                </span>
              </div>

              <p className="font-serif-reading text-sm opacity-85 max-w-xl leading-relaxed">
                {profileUser.bio || "Penning verses in the quiet corners of the world."}
              </p>

              {/* Badges */}
              {profileUser.badges && profileUser.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {profileUser.badges.map((b, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-amber-300 border border-stone-700 font-medium flex items-center gap-1">
                      <Award className="w-2.5 h-2.5 text-amber-400" /> {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Button: Edit or Follow */}
          <div>
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-700 hover:bg-stone-800 text-xs font-semibold transition-all opacity-80 hover:opacity-100"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Close Editor' : 'Edit Portfolio'}</span>
              </button>
            ) : (
              <button
                onClick={() => toggleFollow(profileUser.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isFollowing
                    ? 'border border-stone-700 bg-stone-800 text-stone-300'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-amber-500/20 hover:scale-102'
                }`}
              >
                <span>{isFollowing ? 'Following' : 'Follow Bard'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-stone-800 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold opacity-60 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold opacity-60 mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold opacity-60 mb-1">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-900 text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 rounded-xl border border-stone-700 text-xs opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'published' ? 'bg-amber-500 text-stone-950 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Solo Verses ({publishedPoems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collaborations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'collaborations' ? 'bg-amber-500 text-stone-950 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Co-Authored Works ({collabPoems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'about' ? 'bg-amber-500 text-stone-950 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Affinity & Styles</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' ? (
        <div className={`p-8 rounded-3xl border space-y-6 ${theme.cardBg} ${theme.border}`}>
          <div>
            <h3 className="font-heading text-lg font-bold text-amber-200 mb-3">
              Poetic Genres & Forms
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.interestGenres?.map((g, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-amber-200 mb-3">
              Inspirations & Recurring Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.favoriteThemes?.map((t, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-stone-800 text-stone-300 border border-stone-700 text-xs">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {poems.length === 0 ? (
            <div className={`text-center py-20 rounded-2xl border p-8 ${theme.cardBg} ${theme.border}`}>
              <BookOpen className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-bold text-amber-200 mb-2">
                No verses published yet
              </h3>
              <p className="text-xs opacity-60">
                This poet’s ink is still resting. Check back soon for new stanzas!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeTab === 'published' ? publishedPoems : collabPoems).map((poem) => (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  onSelectPoem={setSelectedPoem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reader Modal */}
      {selectedPoem && (
        <PoemReaderModal
          poem={selectedPoem}
          isOpen={Boolean(selectedPoem)}
          onClose={() => setSelectedPoem(null)}
        />
      )}

      {/* Account Danger Zone for own profile */}
      {isOwnProfile && (
        <div className="mt-12 p-6 rounded-3xl border border-rose-500/30 bg-rose-950/15 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Account Danger Zone
              </h4>
              <p className="text-xs text-stone-400 mt-1 max-w-xl leading-relaxed">
                Permanently delete your poet account, published verses, co-authored contributions, bookmarks, and records. This action cannot be reversed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(null); }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account Permanently</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`relative w-full max-w-md rounded-2xl border border-rose-500/40 p-6 shadow-2xl ${theme.cardBg}`}>
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-rose-200">
                  Permanently Delete Account?
                </h3>
                <p className="text-xs text-rose-400/80">
                  This action is irreversible and immediate.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs text-stone-300 mb-5 leading-relaxed bg-stone-900/70 p-3.5 rounded-xl border border-stone-800">
              <p>
                You are about to permanently delete the account for <strong className="text-amber-300">@{currentUser?.username}</strong> (<span className="text-stone-400">{currentUser?.email}</span>).
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px]">
                <li>All your solo verses and drafts will be deleted.</li>
                <li>All your comments and collaboration stanzas will be removed.</li>
                <li>Your profile, following, and bookmarks will be completely wiped.</li>
              </ul>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                To confirm, type <span className="font-mono text-rose-300 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">DELETE</span> in the box below:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-3 py-2.5 rounded-xl border border-rose-500/40 bg-stone-900 text-xs font-mono text-rose-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-700 hover:bg-stone-800 text-xs font-semibold text-stone-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                onClick={handleConfirmDeleteAccount}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/30 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
