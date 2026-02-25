import React from 'react';
import { ArrowDown, HelpCircle, Info, Layout, Palette, Zap } from 'lucide-react';

const TenseDecisionFlow = () => {
    return (
        <div className="flex flex-col items-center gap-4 py-8 px-4 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto min-w-full md:min-w-0">
            {/* Header */}
            <div className="bg-indigo-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest flex items-center gap-2 mb-4 shadow-lg shadow-indigo-500/20">
                <Zap size={16} /> Start: Action
            </div>

            <ArrowDown className="text-slate-600" />

            {/* Level 1: Is it happening NOW? */}
            <div className="flex flex-col items-center gap-4">
                <div className="card-dark border-2 border-indigo-500/30 p-4 w-64 text-center ring-4 ring-indigo-500/5">
                    <HelpCircle size={20} className="mx-auto mb-2 text-indigo-400" />
                    <p className="font-bold text-white uppercase text-xs tracking-wider">Is it happening NOW?</p>
                </div>

                <div className="flex gap-20 md:gap-40 h-10 items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="h-full w-px bg-slate-700"></div>
                        <span className="text-[10px] font-black text-green-400 bg-slate-900 px-2 py-1 rounded border border-green-500/20 mt-2">YES</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-full w-px bg-slate-700"></div>
                        <span className="text-[10px] font-black text-red-400 bg-slate-900 px-2 py-1 rounded border border-red-500/20 mt-2">NO</span>
                    </div>
                </div>

                <div className="flex gap-10 md:gap-20">
                    {/* Result: Continuous */}
                    <div className="flex flex-col items-center">
                        <div className="card-dark border-2 border-green-500/40 p-5 w-48 text-center bg-green-500/5 group hover:bg-green-500/10 transition-colors">
                            <h4 className="text-green-400 font-black text-xs uppercase mb-2 tracking-tighter">Present Continuous</h4>
                            <div className="bg-slate-950 p-2 rounded text-[10px] font-mono whitespace-nowrap text-slate-300">S + am/is/are + V-ing</div>
                        </div>
                    </div>

                    {/* Decision 2: Habit or Fact? */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="card-dark border-2 border-slate-700 p-4 w-48 text-center">
                            <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Habit or Fact?</p>
                        </div>
                        <div className="flex gap-16 h-8 items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="h-full w-px bg-slate-800"></div>
                                <span className="text-[8px] font-black text-green-400 mt-1">YES</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="h-full w-px bg-slate-800"></div>
                                <span className="text-[8px] font-black text-red-400 mt-1">NO</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="card-dark border-2 border-blue-500/40 p-5 w-40 text-center bg-blue-500/5">
                                <h4 className="text-blue-400 font-black text-[10px] uppercase mb-1">Present Simple</h4>
                                <div className="bg-slate-950 p-2 rounded text-[9px] font-mono text-slate-300">S + V(s/es)</div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="card-dark border-2 border-slate-800 p-3 w-32 text-center">
                                    <p className="text-slate-500 uppercase text-[8px] font-bold">State?</p>
                                </div>
                                <ArrowDown size={12} className="text-slate-800" />
                                <div className="card-dark border-2 border-yellow-500/40 p-4 w-40 text-center bg-yellow-500/5">
                                    <h4 className="text-yellow-400 font-black text-[10px] uppercase mb-1">Stative Verb</h4>
                                    <p className="text-slate-500 text-[8px] italic">(no -ing)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FunctionMap = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {/* Present Simple */}
            <div className="card-dark border-t-4 border-t-blue-500 p-6 flex flex-col gap-4 relative group">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase rounded shadow-lg shadow-blue-500/20">Present Simple</div>
                <ul className="space-y-4 mt-4">
                    {['Habit', 'Routine', 'General Fact', 'Permanent Situation'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300 group-hover:translate-x-1 transition-transform">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-4 ring-blue-500/10"></div>
                            <span className="text-sm font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Present Continuous */}
            <div className="card-dark border-t-4 border-t-green-500 p-6 flex flex-col gap-4 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded shadow-lg shadow-green-500/20">Continuous</div>
                <ul className="space-y-4 mt-4">
                    {['Happening NOW', 'Temporary', 'Changing Situation'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/10"></div>
                            <span className="text-sm font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Stative Verbs */}
            <div className="card-dark border-t-4 border-t-yellow-500 p-6 flex flex-col gap-4 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-yellow-500 text-white text-[10px] font-black uppercase rounded shadow-lg shadow-yellow-500/20">Stative Verbs</div>
                <ul className="space-y-4 mt-4">
                    {['Thoughts', 'Feelings', 'Possession', 'Senses'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 ring-4 ring-yellow-500/10"></div>
                            <span className="text-sm font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const StructureMap = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 card-dark p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Present Simple</h4>
                        <div className="text-2xl font-mono text-white tracking-tighter">S + V<span className="text-blue-500">(s/es)</span></div>
                    </div>
                </div>
                <div className="flex-1 card-dark p-6 border-l-4 border-l-green-500 flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Present Continuous</h4>
                        <div className="text-2xl font-mono text-white tracking-tighter">S + <span className="text-green-500">am/is/are</span> + V-ing</div>
                    </div>
                </div>
            </div>
            <div className="card-dark p-6 border-l-4 border-l-yellow-500 flex items-center gap-8">
                <div>
                    <h4 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-2">Stative Verbs</h4>
                    <div className="text-xl font-mono text-white">S + Base Verb</div>
                    <p className="text-[10px] text-slate-500 uppercase font-black mt-2 bg-slate-950 px-2 py-1 rounded inline-block">No Continuous Form</p>
                </div>
            </div>
        </div>
    );
};

const GrammarDiagrams: React.FC<{ unitId: string }> = ({ unitId }) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const tabs = [
        { label: 'Decision Flow', icon: <Zap size={14} />, component: <TenseDecisionFlow /> },
        { label: 'Functions', icon: <Layout size={14} />, component: <FunctionMap /> },
        { label: 'Structures', icon: <Info size={14} />, component: <StructureMap /> },
        {
            label: 'Color Logic', icon: <Palette size={14} />, component: (
                <div className="p-8 rounded-3xl bg-slate-950/50 space-y-8 animate-fadeIn">
                    <h3 className="text-center font-black uppercase text-xl tracking-tighter gradient-text">Unit 1 Visual Logic</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-green-500 shadow-xl shadow-green-500/20 flex items-center justify-center text-white font-black text-2xl">A</div>
                            <div>
                                <p className="font-black text-green-400 text-xs uppercase mb-1">Green → Action Now</p>
                                <p className="text-[10px] text-slate-500 leading-tight">Present Continuous focuses on movement and progression.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500 shadow-xl shadow-blue-500/20 flex items-center justify-center text-white font-black text-2xl">H</div>
                            <div>
                                <p className="font-black text-blue-400 text-xs uppercase mb-1">Blue → Habit / Fact</p>
                                <p className="text-[10px] text-slate-500 leading-tight">Present Simple represents stability and regularity.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-yellow-500 shadow-xl shadow-yellow-500/20 flex items-center justify-center text-white font-black text-2xl">S</div>
                            <div>
                                <p className="font-black text-yellow-400 text-xs uppercase mb-1">Yellow → State</p>
                                <p className="text-[10px] text-slate-500 leading-tight">Stative verbs describe unchanging mental or physical states.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === i
                                ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 scale-105'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="relative min-h-[400px]">
                {tabs[activeTab].component}
            </div>
        </div>
    );
};

export default GrammarDiagrams;
