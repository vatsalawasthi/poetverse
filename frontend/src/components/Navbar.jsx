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
  const { currentUser, personas, switchPersona, logout, openLoginModal, openRegisterModal } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const location = useLocation();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
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

        {/* Right Actions: Create, Theme, User Auth / Register */}
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
              onClick={() => { setIsThemeOpen(!isThemeOpen); setIsPersonaOpen(false); }}
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
                onClick={() => { setIsPersonaOpen(!isPersonaOpen); setIsThemeOpen(false); }}
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

              {isPersonaOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border p-2 z-50 ${theme.cardBg} ${theme.border} animate-in fade-in zoom-in-95`}>
                  
                  {/* Current User */}
                  <Link
                    to={`/profile/${currentUser.username}`}
                    onClick={() => setIsPersonaOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-800/40 transition-all mb-2 border-b border-stone-800/60 pb-3"
                  >
                    <img
                      src={currentUser.avatar}
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

                  {/* Switch Persona / Demo */}
                  <div className="text-[11px] font-semibold px-2 py-1 opacity-60 uppercase tracking-wider flex items-center justify-between">
                    <span>Try Demo Personas</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Quick Switch</span>
                  </div>

                  <div className="space-y-1 my-1">
                    {personas.map((p) => {
                      const isSelected = p.id === currentUser.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => { switchPersona(p); setIsPersonaOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all text-xs ${
                            isSelected ? 'bg-amber-500/20 text-amber-300 font-medium' : 'hover:bg-stone-800/40 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={p.avatar} alt={p.displayName} className="w-5 h-5 rounded-full object-cover" />
                          <div className="flex-1 truncate">
                            <span className="font-medium">{p.displayName}</span>
                            <span className="opacity-50 ml-1 text-[10px]">({p.interestGenres?.[0] || 'Poet'})</span>
                          </div>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-stone-800/60 mt-2 pt-2 flex items-center justify-between px-1">
                    <Link
                      to={`/profile/${currentUser.username}`}
                      onClick={() => setIsPersonaOpen(false)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <UserIcon className="w-3 h-3" /> View Portfolio
                    </Link>
                    <button
                      onClick={() => { logout(); setIsPersonaOpen(false); }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" /> Sign Out
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
