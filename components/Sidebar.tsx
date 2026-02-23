
import React from 'react';
import { ViewType, UserAccount } from '../types';
import { COURSE_DATA } from '../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedUnitId: string;
  onUnitChange: (unitId: string) => void;
  user: UserAccount;
  onLogout: () => void;
  onReset: () => void;
}

const TEACHER_USERNAME = 'student53';

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  selectedUnitId,
  onUnitChange,
  user,
  onLogout,
  onReset
}) => {
  const isTeacher = user.username === TEACHER_USERNAME;

  const menuItems: { id: ViewType; icon: string; label: string }[] = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'vocabulary', icon: 'fa-book', label: 'Vocabulary' },
    { id: 'grammar', icon: 'fa-pen-clip', label: 'Grammar' },
    { id: 'listening', icon: 'fa-headphones', label: 'Listening' },
    { id: 'reading', icon: 'fa-book-open', label: 'Reading' },
    { id: 'practice_test', icon: 'fa-shield-halved', label: 'Challenge' },
    ...(isTeacher ? [{ id: 'teacher_dashboard' as ViewType, icon: 'fa-chalkboard-user', label: 'Teacher Hub' }] : []),
  ];

  return (
    <nav className="w-full md:w-64 md:min-h-screen p-4 flex flex-row md:flex-col justify-between md:justify-start overflow-x-auto md:overflow-x-hidden sticky top-0 z-50"
      style={{ background: '#111827', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Logo */}
      <div className="hidden md:block mb-8 px-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)' }}>
            <i className="fa-solid fa-bolt text-white text-xs"></i>
          </div>
          <h2 className="text-sm font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', color: '#F8FAFC' }}>
            ELITE ENG
          </h2>
        </div>
        <div className="h-px w-full my-3" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6366F1' }}>G11 AI Learning Hub</p>
      </div>

      {/* Unit Selector */}
      <div className="px-4 mb-6 hidden md:block">
        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: '#94A3B8' }}>
          Current Module
        </label>
        <select
          value={selectedUnitId}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-xs font-bold outline-none transition-all cursor-pointer"
          style={{
            background: '#1E293B',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#CBD5E1',
          }}
          onFocus={(e) => e.target.style.borderColor = '#6366F1'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          {COURSE_DATA.map(unit => (
            <option key={unit.id} value={unit.id} style={{ background: '#1E293B' }}>
              {unit.id.toUpperCase()}: {unit.title.split(':')[1]?.trim() || unit.title}
            </option>
          ))}
        </select>
      </div>

      {/* Nav Items */}
      <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left whitespace-nowrap`}
                style={isActive ? {
                  background: '#312E81',
                  color: '#A5B4FC',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.2)',
                } : {
                  color: '#94A3B8',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#1E293B';
                    e.currentTarget.style.color = '#CBD5E1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                <i className={`fa-solid ${item.icon} w-5 text-sm`}></i>
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* User Footer */}
      <div className="mt-auto hidden md:flex flex-col pt-6">
        <div className="h-px w-full mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
        <div className="p-4 rounded-2xl" style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)' }}>
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate" style={{ color: '#F8FAFC' }}>{user.name}</p>
              <p className="text-[10px] font-medium truncate" style={{ color: '#6366F1' }}>@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onLogout}
              className="py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
              style={{ background: '#334155', color: '#CBD5E1' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#3F4C63'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#334155'}
            >
              <i className="fa-solid fa-right-from-bracket"></i> EXIT
            </button>
            <button
              onClick={onReset}
              className="py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
              style={{ background: '#334155', color: '#CBD5E1' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#3F4C63'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#334155'}
            >
              <i className="fa-solid fa-arrows-rotate"></i> RESET
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
