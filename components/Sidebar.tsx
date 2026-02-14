
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

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  selectedUnitId,
  onUnitChange,
  user,
  onLogout,
  onReset
}) => {
  const menuItems: { id: ViewType; icon: string; label: string }[] = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'vocabulary', icon: 'fa-book', label: 'Vocabulary' },
    { id: 'grammar', icon: 'fa-pen-clip', label: 'Grammar' },
    { id: 'listening', icon: 'fa-headphones', label: 'Listening' },
    { id: 'reading', icon: 'fa-book-open', label: 'Reading' },
    { id: 'practice_test', icon: 'fa-shield-halved', label: 'Challenge' },
  ];

  return (
    <nav className="w-full md:w-64 bg-white border-r border-[#2ECC71]/20 p-4 flex flex-row md:flex-col justify-between md:justify-start overflow-x-auto md:overflow-x-hidden sticky top-0 z-50 shadow-2xl backdrop-blur-xl">
      <div className="hidden md:block mb-6 px-4">
        <h2 className="text-xl font-black text-[#2D3748] tracking-tighter leading-tight uppercase">TRAN HUNG DAO<br />HIGH SCHOOL</h2>
        <div className="h-1 w-12 bg-[#27AE60] my-2 rounded-full"></div>
        <p className="text-[10px] text-[#2ECC71] font-bold uppercase tracking-widest">G11 Learning Hub</p>
      </div>

      {/* Unit Selector */}
      <div className="px-4 mb-6 hidden md:block">
        <label className="block text-[10px] font-black text-[#27AE60] uppercase tracking-widest mb-2 ml-1">Current Module</label>
        <select
          value={selectedUnitId}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-full bg-green-50 border border-[#27AE60]/30 rounded-2xl px-3 py-2.5 text-xs font-bold text-[#2D3748] outline-none focus:border-[#27AE60] transition-all cursor-pointer shadow-sm"
        >
          {COURSE_DATA.map(unit => (
            <option key={unit.id} value={unit.id}>{unit.id.toUpperCase()}: {unit.title.split(':')[1]?.trim() || unit.title}</option>
          ))}
        </select>
      </div>

      <ul className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveView(item.id)}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all w-full text-left whitespace-nowrap
                ${activeView === item.id
                  ? 'bg-[#27AE60] text-white shadow-xl shadow-[#27AE60]/30 scale-[1.02] border border-[#2ECC71]'
                  : 'text-[#5D6D61] hover:bg-green-50 hover:text-[#27AE60]'}`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto hidden md:flex flex-col pt-8 border-t border-[#2ECC71]/10">
        <div className="bg-green-50 p-4 rounded-3xl mb-4 border border-[#2ECC71]/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#27AE60] text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white ring-2 ring-[#27AE60]/10">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-[#2D3748] truncate">{user.name}</p>
              <p className="text-[10px] text-[#2ECC71] font-bold truncate tracking-tight">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={onLogout} className="py-2.5 bg-white border border-[#27AE60]/20 rounded-2xl text-[10px] font-black text-[#5D6D61] hover:bg-green-50 transition-all flex items-center justify-center gap-1"><i className="fa-solid fa-right-from-bracket"></i> EXIT</button>
            <button onClick={onReset} className="py-2.5 bg-white border border-[#27AE60]/20 rounded-2xl text-[10px] font-black text-[#27AE60] hover:bg-green-50 transition-all flex items-center justify-center gap-1"><i className="fa-solid fa-arrows-rotate"></i> RESET</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
