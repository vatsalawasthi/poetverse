import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Feather, 
  Sparkles, 
  Users, 
  BookOpen, 
  Compass, 
  PenTool, 
  Palette, 
  User as UserIcon, 
  ChevronDown, 
  LogOut,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { currentUser, logout, openLoginModal, openRegisterModal } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Feed', icon: BookOpen },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/collab', label: 'VerseCollab', icon: Users, badge: 'Live' },
    { to: '/matchmaker', label: 'Poet Matchmaker', icon: Sparkles, badge: 'AI' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${theme.cardBg}/90 ${theme.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#161413] rounded-[10px] flex items-center justify-center">
              <Feather className="w-5 h-5 text-amber-400 -rotate-12 transition-transform group-hover:rotate-0" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              PoetVerse
            </span>
            <span className="text-[10px] tracking-widest uppercase font-medium opacity-60">
              Sanctuary of Verses
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'text-amber-400 bg-amber-500/10 font-semibold shadow-inner'
                    : 'opacity-70 hover:opacity-100 hover:bg-stone-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : ''}`} />
                {link.label}
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Create, Theme, User Auth / Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Pen Verse Button */}
          <Link
            to="/create"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-102 active:scale-98"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Pen Verse</span>
          </Link>

          {/* Theme Palette Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsThemeOpen(!isThemeOpen); setIsProfileOpen(false); }}
              title="Reading Atmosphere"
              className={`p-2 rounded-lg border transition-all ${theme.border} hover:bg-stone-800/40 opacity-80 hover:opacity-100`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
            </button>

            {isThemeOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border p-2 z-50 ${theme.cardBg} ${theme.border} animate-in fade-in zoom-in-95`}>
                <div className="text-xs font-semibold px-2 py-1 opacity-60 uppercase tracking-wider">
                  Reading Atmosphere
                </div>
                <div className="space-y-1 mt-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setIsThemeOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-all ${
                        theme.id === t.id ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:bg-stone-800/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border border-stone-600 ${t.bg}`}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Buttons or Active Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsThemeOpen(false); }}
                className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border transition-all ${theme.border} hover:bg-stone-800/40`}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full object-cover border border-amber-500/40 shadow"
                />
                <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                  {currentUser.displayName}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border p-2 z-50 ${theme.cardBg} ${theme.border} animate-in fade-in zoom-in-95`}>
                  
                  {/* Current User Info */}
                  <Link
                    to={`/profile/${currentUser.username}`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-800/40 transition-all border-b border-stone-800/60 pb-3"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={currentUser.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate text-amber-300">
                        {currentUser.displayName}
                      </div>
                      <div className="text-xs opacity-60 truncate">
                        @{currentUser.username}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-2 space-y-1">
                    <Link
                      to={`/profile/${currentUser.username}`}
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-stone-200 hover:text-amber-300 hover:bg-stone-800/40 rounded-lg transition-all"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>View My Portfolio</span>
                    </Link>

                    <button
                      onClick={() => { logout(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openLoginModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold opacity-80 hover:opacity-100 hover:text-amber-300 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={openRegisterModal}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Sanctuary</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t py-2 px-2 border-stone-800/50 bg-inherit">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs ${
                active ? 'text-amber-400 font-bold' : 'opacity-60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
