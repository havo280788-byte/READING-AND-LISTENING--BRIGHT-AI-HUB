
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

  // Seed default users if none exist OR if the list changed
  useEffect(() => {
    // Force update to ensure names are normalized
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Branding */}
        <div className="lg:w-2/5 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">ELITE ENG</h2>
            <p className="text-blue-100 font-medium">Tran Hung Dao High School Hub</p>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold leading-tight mb-6">Learn faster with smart AI tools.</h1>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i className="fa-solid fa-bolt text-sm"></i></div>
                <p className="text-sm font-medium">Instant Grammar Check</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i className="fa-solid fa-microphone text-sm"></i></div>
                <p className="text-sm font-medium">Speaking Pronunciation Lab</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><i className="fa-solid fa-users text-sm"></i></div>
                <p className="text-sm font-medium">Class 11A1 Managed Access</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form & Quick Access */}
        <div className="lg:w-3/5 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Quick Access List */}
          {isLogin && (
            <div className="md:w-1/2 p-8 bg-slate-50/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Class 11A1</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">53 Members Active</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                </div>
              </div>

              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="Find your name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:border-blue-400 transition-all shadow-sm font-medium"
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <button
                      key={u.username}
                      onClick={() => quickLogin(u)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-400 hover:shadow-md transition-all group text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{u.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tighter">ID: {u.username}</p>
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-200 group-hover:text-blue-500 text-xs"></i>
                    </button>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-xs text-slate-400 italic">No student found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual Auth Form */}
          <div className={`${isLogin ? 'md:w-1/2' : 'w-full'} p-8 md:p-10 flex flex-col justify-center`}>
            <div className="max-w-xs mx-auto w-full">
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {isLogin ? 'Manual Entry' : 'Join Elite Eng'}
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                {isLogin ? 'Sign in with your credentials.' : 'Create a personal account.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="NGUYEN VAN A" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-sm"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
                  <input 
                    type="text" 
                    required
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="student01" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium text-sm"
                  />
                  {isLogin && <p className="mt-2 text-[10px] text-slate-400 ml-1">Default password: <span className="font-bold text-blue-500">123</span></p>}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold animate-shake">
                    <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 active:scale-[0.98] transition-all mt-4"
                >
                  {isLogin ? 'Log In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {isLogin ? "Need a personal account? Sign Up" : "Back to Class Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Auth;
