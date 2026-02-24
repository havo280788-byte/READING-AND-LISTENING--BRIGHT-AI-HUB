import React, { useState } from 'react';
import { BookOpen, BarChart2, Headphones, FileText, Target, Trophy, GraduationCap, LogOut, RefreshCw, ChevronDown } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  selectedUnitId: string;
  onUnitChange: (unitId: string) => void;
  user: { name: string; username: string; xp?: number } | null;
  onLogout: () => void;
  onReset?: () => void;
}

const UNITS = [
  { id: 'u1', label: 'Unit 1' }, { id: 'u2', label: 'Unit 2' },
  { id: 'u3', label: 'Unit 3' }, { id: 'u4', label: 'Unit 4' },
  { id: 'u5', label: 'Unit 5' }, { id: 'u6', label: 'Unit 6' },
];

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
  { id: 'vocabulary', label: 'Vocabulary', icon: <BookOpen size={18} /> },
  { id: 'grammar', label: 'Grammar', icon: <FileText size={18} /> },
  { id: 'listening', label: 'Listening', icon: <Headphones size={18} /> },
  { id: 'reading', label: 'Reading', icon: <Target size={18} /> },
  { id: 'challenge', label: 'Challenge', icon: <Trophy size={18} /> },
];

const TEACHER_MENU_ITEM = { id: 'teacher_dashboard', label: 'Teacher View', icon: <GraduationCap size={18} /> };

const Sidebar: React.FC<SidebarProps> = ({
  activeView, setActiveView, selectedUnitId, onUnitChange, user, onLogout, onReset
}) => {
  const [unitOpen, setUnitOpen] = useState(false);
  const initials = user?.name?.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || 'ST';

  return (
    <nav className="w-full md:w-64 flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-x-hidden sticky top-0 z-50"
      style={{ background: '#111827', borderRight: '1px solid rgba(255,255,255,0.05)', minHeight: '100vh' }}>

      {/* Logo */}
      <div className="hidden md:flex items-center gap-3 px-5 py-6 shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <p className="type-caption font-black uppercase tracking-[0.3em]" style={{ color: '#6366F1' }}>Elite English</p>
          <p className="type-caption" style={{ color: '#334155', fontSize: '11px' }}>Grade 11 · AI Hub</p>
        </div>
      </div>

      {/* Unit Selector */}
      <div className="hidden md:block px-4 mb-3">
        <button onClick={() => setUnitOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all type-small"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
          <span className="font-semibold" style={{ color: '#CBD5E1' }}>
            {UNITS.find(u => u.id === selectedUnitId)?.label ?? 'Select Unit'}
          </span>
          <ChevronDown size={14} className={`transition-transform ${unitOpen ? 'rotate-180' : ''}`} />
        </button>
        {unitOpen && (
          <div className="mt-1 rounded-xl overflow-hidden animate-fadeIn" style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)' }}>
            {UNITS.map(u => (
              <button key={u.id} onClick={() => { onUnitChange(u.id); setUnitOpen(false); }}
                className="w-full text-left px-4 py-2.5 transition-all type-small"
                style={selectedUnitId === u.id
                  ? { background: 'rgba(99,102,241,0.15)', color: '#A5B4FC', fontWeight: 600 }
                  : { color: '#64748B' }}
                onMouseEnter={e => { if (selectedUnitId !== u.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (selectedUnitId !== u.id) e.currentTarget.style.background = 'transparent'; }}>
                {u.label}
              </button>
            ))}
          </div>
        )}
        <p className="type-caption mt-2 pl-1" style={{ color: '#334155', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Navigation
        </p>
      </div>

      {/* Nav Items */}
      <ul className="flex flex-row md:flex-col gap-1 px-2 md:px-3 py-2 md:py-0 overflow-x-auto md:overflow-x-visible">
        {[...menuItems, ...(user?.username === 'student53' ? [TEACHER_MENU_ITEM] : [])].map((item) => {
          const isActive = activeView === item.id;
          const isTeacher = item.id === 'teacher_dashboard';
          return (
            <li key={item.id} className="shrink-0">
              <button
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all w-full text-left whitespace-nowrap ${isActive ? 'type-nav-active' : 'type-nav'}`}
                style={isActive ? {
                  background: isTeacher ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                  color: isTeacher ? '#FCD34D' : '#A5B4FC',
                  boxShadow: isTeacher ? '0 0 12px rgba(245,158,11,0.15)' : '0 0 12px rgba(99,102,241,0.15)',
                  border: isTeacher ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(99,102,241,0.2)',
                } : {
                  color: isTeacher ? '#B45309' : '#64748B',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = isTeacher ? '#FCD34D' : '#94A3B8'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isTeacher ? '#B45309' : '#64748B'; } }}>
                <span style={{ color: isActive ? (isTeacher ? '#F59E0B' : '#6366F1') : (isTeacher ? '#B45309' : '#475569') }}>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* User Footer */}
      <div className="hidden md:block mt-auto px-3 pb-5 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {user && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366F1,#3B82F6)' }}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="type-small font-semibold truncate" style={{ color: '#CBD5E1' }}>{user.name}</p>
              <p className="type-caption truncate" style={{ color: '#475569', fontSize: '11px' }}>{user.xp ?? 0} XP</p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {onReset && (
            <button onClick={onReset} title="Reset Progress"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all type-caption"
              style={{ background: 'rgba(255,255,255,0.03)', color: '#475569', border: '1px solid rgba(255,255,255,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F59E0B'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
              <RefreshCw size={13} /> <span className="hidden lg:inline">Reset</span>
            </button>
          )}
          <button onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all type-caption"
            style={{ background: 'rgba(239,68,68,0.07)', color: '#64748B', border: '1px solid rgba(239,68,68,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#FCA5A5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#64748B'; }}>
            <LogOut size={13} /> <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
