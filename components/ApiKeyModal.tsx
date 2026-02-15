
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Key, Zap, Shield, Crown, AlertCircle, Database } from 'lucide-react';
import { getFirebaseUrl, setFirebaseUrl as saveFirebaseUrl } from '../services/firebaseService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODELS = [
  {
    id: 'gemini-3-pro-preview',
    name: '3 Pro',
    desc: 'Chất lượng cao nhất',
    icon: <Crown size={24} />,
    tag: 'MẶC ĐỊNH',
    color: 'bg-rose-50 text-rose-600',
    border: 'border-rose-200',
    ring: 'ring-rose-500'
  },
  {
    id: 'gemini-3-flash-preview',
    name: '3 Flash',
    desc: 'Nhanh & Mạnh mẽ',
    icon: <Zap size={24} />,
    tag: '',
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-200',
    ring: 'ring-amber-500'
  },
  {
    id: 'gemini-2.5-flash',
    name: '2.5 Flash',
    desc: 'Ổn định & An toàn',
    icon: <Shield size={24} />,
    tag: '',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-200',
    ring: 'ring-blue-500'
  }
];

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-pro-preview');
  const [firebaseUrl, setFirebaseUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('user_gemini_key') || '';
      const savedModel = localStorage.getItem('user_gemini_model') || 'gemini-3-pro-preview';
      const savedFirebaseUrl = getFirebaseUrl();
      setApiKey(savedKey);
      setSelectedModel(savedModel);
      setFirebaseUrl(savedFirebaseUrl);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('user_gemini_key', apiKey.trim());
      localStorage.setItem('user_gemini_model', selectedModel);
      if (firebaseUrl.trim()) {
        saveFirebaseUrl(firebaseUrl.trim());
      }
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
        window.location.reload();
      }, 800);
    } else {
      alert("Vui lòng nhập API Key hợp lệ để tiếp tục.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] w-full max-w-[650px] shadow-2xl overflow-hidden relative font-sans">
        {/* Header */}
        <div className="p-6 md:p-8 pb-4 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Thiết lập Model & API Key</h2>
              <p className="text-slate-500 font-medium text-sm">Cấu hình AI cho ứng dụng của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 pt-4">
          {/* Section 1: Model Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">1. CHỌN MODEL AI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`relative p-5 rounded-3xl border-2 text-center transition-all duration-200 flex flex-col items-center gap-3 group ${isSelected
                      ? `border-blue-500 bg-white ring-4 ring-blue-500/10 shadow-xl scale-[1.02] z-10`
                      : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'
                      }`}
                  >
                    {model.tag && (
                      <span className="absolute -top-3 bg-[#2ECC71] text-white text-[9px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                        {model.tag}
                      </span>
                    )}

                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? model.color : 'bg-slate-200 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                      {model.icon}
                    </div>

                    <div>
                      <div className={`font-black text-sm ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                        {model.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 leading-tight">
                        {model.desc}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 text-blue-500">
                        <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <AlertCircle size={14} />
              Nếu model gặp lỗi, hệ thống tự động chuyển sang model dự phòng.
            </p>
          </div>

          {/* Section 2: API Key */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">2. API KEY</h3>
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Key size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Dán API Key của bạn vào đây..."
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-mono text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Lấy API Key tại Google AI Studio <span className="text-lg leading-none mb-0.5">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Firebase Database URL */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">3. FIREBASE DATABASE URL (Lưu kết quả chung)</h3>
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Database size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={firebaseUrl}
                  onChange={(e) => setFirebaseUrl(e.target.value)}
                  placeholder="https://your-project.firebaseio.com"
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-mono text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>
              <p className="mt-3 flex items-start gap-2 text-[10px] font-bold text-slate-400 bg-amber-50 p-3 rounded-xl border border-amber-100">
                <Database size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span>Dán URL Firebase để đồng bộ kết quả học sinh giữa các thiết bị. Tạo project miễn phí tại <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Firebase Console</a></span>
              </p>
              {firebaseUrl.trim() && (
                <button
                  onClick={() => {
                    const base = window.location.origin + window.location.pathname;
                    const shareUrl = `${base}?fb=${encodeURIComponent(firebaseUrl.trim())}`;
                    navigator.clipboard.writeText(shareUrl).then(() => {
                      alert('✅ Đã sao chép link chia sẻ! Gửi link này cho học sinh để tự động cấu hình Firebase.');
                    }).catch(() => {
                      prompt('Copy link bên dưới:', shareUrl);
                    });
                  }}
                  className="mt-3 w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-amber-200 transition-all"
                >
                  <Database size={14} />
                  📋 Copy Link Chia Sẻ (tự động cấu hình Firebase cho thiết bị khác)
                </button>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <button
            onClick={handleSave}
            className="w-full py-5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-2xl font-black text-base shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
          >
            {isSaved ? (
              <><CheckCircle2 /> Đã lưu thành công!</>
            ) : (
              <><Zap size={20} fill="currentColor" /> Lưu và Tiếp tục</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
