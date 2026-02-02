
import React from 'react';
import { WordFormData } from '../types';
import { Layers, Hash, BookOpen, Quote } from 'lucide-react';

interface WordFormsViewProps {
  data: WordFormData;
}

const WordFormsView: React.FC<WordFormsViewProps> = ({ data }) => {
  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('noun')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (t.includes('verb')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (t.includes('adj')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (t.includes('adv')) return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="animate-fadeIn space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-5xl font-black text-amber-500 uppercase tracking-tighter drop-shadow-lg italic">Word Families</h2>
        <p className="text-amber-200/30 text-[10px] font-black uppercase tracking-[0.6em]">{data.unit_context}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.forms.map((item, idx) => (
          <div 
            key={idx}
            className="bg-[#F2E8CF] rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-2 border-transparent hover:border-amber-600/30 transition-all group overflow-hidden relative"
          >
            {/* Background Watermark */}
            <div className="absolute -top-6 -right-6 text-amber-900/5 rotate-12 pointer-events-none">
              <Layers size={140} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-700/10 flex items-center justify-center text-amber-800">
                  <Hash size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest">Root Word</p>
                  <h3 className="text-3xl font-black text-amber-900 tracking-tighter leading-none">{item.root_word}</h3>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-amber-900/10">
                <p className="text-[9px] font-black text-amber-800 uppercase tracking-[0.3em] mb-4">Derivatives & Forms</p>
                
                <div className="grid grid-cols-1 gap-4">
                  {item.derivatives.map((der, dIdx) => (
                    <div key={dIdx} className="bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-amber-900/5 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-lg font-black text-[#3E2723]">{der.form}</span>
                           <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${getTypeColor(der.type)}`}>
                             {der.type}
                           </span>
                        </div>
                        <p className="text-sm text-amber-900/70 font-medium italic">"{der.meaning}"</p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const u = new SpeechSynthesisUtterance(der.form);
                            u.lang = 'en-US';
                            window.speechSynthesis.speak(u);
                          }
                        }}
                        className="w-10 h-10 rounded-xl bg-amber-700/5 hover:bg-amber-700/10 text-amber-800 transition-colors flex items-center justify-center self-end md:self-auto"
                      >
                        <BookOpen size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#3E2723]/5 p-8 rounded-[3rem] border-2 border-dashed border-amber-900/10 text-center flex flex-col items-center">
         <Quote className="text-amber-700 opacity-20 mb-4" size={40} />
         <p className="text-amber-900/60 font-medium text-sm max-w-xl">
           Learning word families is one of the most effective ways to expand your vocabulary rapidly. One root can open the door to many related concepts!
         </p>
      </div>
    </div>
  );
};

export default WordFormsView;
