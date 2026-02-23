
import React, { useState, useEffect, useMemo } from 'react';
import { UserAccount } from '../types';

interface AuthProps {
  onLogin: (user: UserAccount) => void;
}

const normalizeName = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toUpperCase();
};

const CLASS_NAMES_RAW = [
  "Hòa Quang An", "Phạm Quỳnh Anh", "Hà Thị Minh Anh", "Cao Nguyễn Quỳnh Anh", "Trần Nguyệt Ánh",
  "Hòa Gia Bình", "Hoàng Văn Công Chính", "Nguyễn Mạnh Cường", "Trần Thị Dung", "Nguyễn Thành Đạt",
  "Nguyễn Phúc Điền", "Nguyễn Trung Đức", "Nguyễn Lê Gia Hân", "Nguyễn Phương Hiền", "Nguyễn Hoàng Gia Huynh",
  "Dương Gia Hưng", "Đinh Văn Hưng", "Lê Đình Khôi", "Nguyễn Thị Ngọc Lan", "Huỳnh Đặng Khánh Linh",
  "Phạm Vũ Thùy Linh", "Nguyễn Bùi Yến Linh", "Đặng Hoàng Long", "Nguyễn Khánh Ly", "Trần Hoàng Minh",
  "Trần Nữ Nguyệt Nga", "Trần Như Ngọc", "Lê Thị Như Ngọc", "Trần Nữ Bảo Ngọc", "Trần Hoàng Nguyên",
  "Nguyễn Thảo Nguyên", "Phan Duy Nguyễn", "Nguyễn Thị Thanh Nhàn", "Bùi Thiện Nhân", "Nguyễn Ngọc Uyển Nhi",
  "Vũ Nguyễn Tuệ Nhi", "Nguyễn Hoàng Tâm Như", "Lê Kim Phát", "Nguyễn Bá Phi", "Đinh Xuân Hoàng Phúc",
  "Tạ Phạm Minh Phúc", "Trần Hữu Quang", "Nguyễn Tiến Sang", "Trần Minh Thông", "Vũ Lê Phương Thùy",
  "Võ Bảo Thùy", "Nguyễn Anh Thư", "Lê Trịnh Anh Thư", "Phạm Anh Thư", "Nguyễn Thùy Tiên",
  "Nguyễn Phương Uyên", "Vũ Thị Hà Vy", "Nguyen Thi Thu Ha"
];

const CLASS_NAMES = CLASS_NAMES_RAW.map(normalizeName);

const DEFAULT_USERS: UserAccount[] = CLASS_NAMES.map((name, index) => ({
  username: `student${(index + 1).toString().padStart(2, '0')}`,
  password: '123',
  name: name
}));

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('elite_eng_users', JSON.stringify(DEFAULT_USERS));
  }, []);

  const filteredUsers = useMemo(() => {
    return DEFAULT_USERS.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  };

  const performLogin = (u: string, p: string) => {
    setError('');
    const users: UserAccount[] = JSON.parse(localStorage.getItem('elite_eng_users') || '[]');

    if (isLogin) {
      const user = users.find(user => user.username === u && user.password === p);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } else {
      if (users.find(user => user.username === u)) {
        setError('Username already exists');
        return;
      }
      if (!u || !p || !name) {
        setError('Please fill in all fields');
        return;
      }
      const normalizedName = normalizeName(name);
      const newUser: UserAccount = { username: u, password: p, name: normalizedName };
      users.push(newUser);
      localStorage.setItem('elite_eng_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  const quickLogin = (user: UserAccount) => {
    setUsername(user.username);
    setPassword(user.password);
    onLogin(user);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#F8FAFC',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0F172A' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: '#6366F1', filter: 'blur(100px)' }}></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: '#22D3EE', filter: 'blur(100px)' }}></div>
      </div>

      <div className="w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col lg:flex-row relative z-10"
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>

        {/* Left Side — Branding */}
        <div className="lg:w-2/5 p-12 flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #312E81 0%, #1E40AF 50%, #0E7490 100%)' }}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <i className="fa-solid fa-bolt text-white text-sm"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>ELITE ENG</h2>
                <p className="text-xs text-blue-200 font-medium">Tran Hung Dao High School</p>
              </div>
            </div>
            <div className="h-px my-6" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Learn faster with<br /><span style={{ color: '#67E8F9' }}>AI-powered</span> tools.
            </h1>
            <div className="space-y-3">
              {[
                { icon: 'fa-bolt', text: 'Instant Grammar Check' },
                { icon: 'fa-microphone', text: 'Speaking Pronunciation Lab' },
                { icon: 'fa-users', text: 'Class 11A1 Managed Access' },
              ].map((f, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <i className={`fa-solid ${f.icon} text-white text-xs`}></i>
                  </div>
                  <p className="text-sm font-medium text-blue-100">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full opacity-10" style={{ background: 'white', filter: 'blur(40px)' }}></div>
        </div>

        {/* Right Side */}
        <div className="lg:w-3/5 flex flex-col md:flex-row" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Quick Access List */}
          {isLogin && (
            <div className="md:w-1/2 p-8" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Class 11A1</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>53 Members Active</p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', color: '#A5B4FC' }}>
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                </div>
              </div>

              <div className="relative mb-4">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#64748B' }}></i>
                <input
                  type="text"
                  placeholder="Find your name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                  onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <button
                      key={u.username}
                      onClick={() => quickLogin(u)}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 group"
                      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#6366F1';
                        e.currentTarget.style.background = '#243044';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.background = '#1E293B';
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 transition-all duration-200"
                          style={{ background: '#334155' }}
                          ref={(el) => {
                            if (el) {
                              el.closest('button')?.addEventListener('mouseenter', () => {
                                el.style.background = 'linear-gradient(135deg, #6366F1, #3B82F6)';
                              });
                              el.closest('button')?.addEventListener('mouseleave', () => {
                                el.style.background = '#334155';
                              });
                            }
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#CBD5E1' }}>{u.name}</p>
                          <p className="text-[10px] uppercase tracking-tighter" style={{ color: '#64748B' }}>ID: {u.username}</p>
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-right text-xs" style={{ color: '#334155' }}></i>
                    </button>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-xs italic" style={{ color: '#475569' }}>No student found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual Auth Form */}
          <div className={`${isLogin ? 'md:w-1/2' : 'w-full'} p-8 md:p-10 flex flex-col justify-center`}>
            <div className="max-w-xs mx-auto w-full">
              <h2 className="text-2xl font-black mb-1" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>
                {isLogin ? 'Manual Entry' : 'Join Elite Eng'}
              </h2>
              <p className="text-sm mb-8" style={{ color: '#64748B' }}>
                {isLogin ? 'Sign in with your credentials.' : 'Create a personal account.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: '#64748B' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="NGUYEN VAN A"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: '#64748B' }}>Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="student01"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: '#64748B' }}>Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  {isLogin && <p className="mt-2 text-[10px] ml-1" style={{ color: '#475569' }}>Default password: <span style={{ color: '#6366F1', fontWeight: 'bold' }}>123</span></p>}
                </div>

                {error && (
                  <div className="p-3 rounded-xl text-[11px] font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 mt-4"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #3B82F6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; }}
                >
                  {isLogin ? 'Log In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-bold transition-colors duration-200"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#A5B4FC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  {isLogin ? "Need a personal account? Sign Up" : "Back to Class Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
