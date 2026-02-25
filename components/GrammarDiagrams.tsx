import React from 'react';
import { ArrowDown, HelpCircle, Info, Layout, Palette, Zap, Phone, BookOpen, Clock } from 'lucide-react';

/* --- UNIT 1 COMPONENTS --- */
const U1DecisionFlow = () => (
    <div className="flex flex-col items-center gap-4 py-8 px-4 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto min-w-full md:min-w-0">
        <div className="bg-indigo-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest flex items-center gap-2 mb-4 shadow-lg shadow-indigo-500/20">
            <Zap size={16} /> Start: Action
        </div>
        <ArrowDown className="text-slate-600" />
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
                <div className="flex flex-col items-center">
                    <div className="card-dark border-2 border-green-500/40 p-5 w-48 text-center bg-green-500/5 transition-colors">
                        <h4 className="text-green-400 font-black text-xs uppercase mb-2 tracking-tighter">Present Continuous</h4>
                        <div className="bg-slate-950 p-2 rounded text-[10px] font-mono whitespace-nowrap text-slate-300">S + am/is/are + V-ing</div>
                    </div>
                </div>
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

const U1FunctionMap = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
        <div className="card-dark border-t-4 border-t-blue-500 p-6 flex flex-col gap-4 relative group">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase rounded shadow-lg shadow-blue-500/20">Present Simple</div>
            <ul className="space-y-4 mt-4">
                {['Habit', 'Routine', 'General Fact', 'Permanent Situation'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 transition-transform">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-4 ring-blue-500/10"></div>
                        <span className="text-sm font-medium">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
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

const U1StructureMap = () => (
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

/* --- UNIT 2 COMPONENTS --- */
const U2DecisionFlow = () => (
    <div className="flex flex-col items-center gap-4 py-8 px-4 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto min-w-full md:min-w-0">
        <div className="bg-purple-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest flex items-center gap-2 mb-4 shadow-lg shadow-purple-500/20">
            <Clock size={16} /> Past Action
        </div>
        <ArrowDown className="text-slate-600" />
        <div className="flex flex-col items-center gap-4">
            <div className="card-dark border-2 border-purple-500/30 p-4 w-72 text-center">
                <HelpCircle size={20} className="mx-auto mb-2 text-purple-400" />
                <p className="font-bold text-white uppercase text-xs tracking-wider">Happening at a specific moment in the past?</p>
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
                <div className="flex flex-col items-center">
                    <div className="card-dark border-2 border-green-500/40 p-5 w-48 text-center bg-green-500/5">
                        <h4 className="text-green-400 font-black text-xs uppercase mb-2">Past Continuous</h4>
                        <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-300">S + was/were + V-ing</div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="card-dark border-2 border-slate-700 p-4 w-48 text-center">
                        <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Completed action?</p>
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
                            <h4 className="text-blue-400 font-black text-[10px] uppercase mb-1">Past Simple</h4>
                            <div className="bg-slate-950 p-2 rounded text-[9px] font-mono text-slate-300">S + V2 / V-ed</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="card-dark border-2 border-slate-800 p-3 w-40 text-center">
                                <p className="text-slate-500 uppercase text-[8px] font-bold">Background situation?</p>
                            </div>
                            <ArrowDown size={12} className="text-slate-800" />
                            <div className="card-dark border-2 border-green-500/40 p-4 w-40 text-center bg-green-500/5">
                                <h4 className="text-green-400 font-black text-[10px] uppercase mb-1">Past Continuous</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const U2FunctionMap = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div className="card-dark border-t-4 border-t-green-500 p-8 flex flex-col gap-6 relative">
            <div className="absolute -top-3 left-8 px-4 py-2 bg-green-500 text-white text-xs font-black uppercase rounded shadow-lg shadow-green-500/20">Past Continuous</div>
            <ul className="space-y-4 mt-4">
                {['Action in progress in the past', 'Background description', 'Interrupted action'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-200">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/40"></div>
                        <span className="text-base font-medium">{item}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/50 border border-green-500/10 italic text-sm text-slate-400">
                "She was studying at 8 p.m."
            </div>
        </div>
        <div className="card-dark border-t-4 border-t-blue-500 p-8 flex flex-col gap-6 relative">
            <div className="absolute -top-3 left-8 px-4 py-2 bg-blue-500 text-white text-xs font-black uppercase rounded shadow-lg shadow-blue-500/20">Past Simple</div>
            <ul className="space-y-4 mt-4">
                {['Completed action in the past', 'Finished event', 'Sequence of events'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-200">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40"></div>
                        <span className="text-base font-medium">{item}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/50 border border-blue-500/10 italic text-sm text-slate-400">
                "She studied last night."
            </div>
        </div>
    </div>
);

const U2InterruptedLogic = () => (
    <div className="p-8 rounded-3xl bg-slate-950/50 flex flex-col items-center justify-center gap-10 animate-fadeIn">
        <h3 className="font-black uppercase text-xl tracking-tighter text-white">Interrupted Action Logic</h3>

        <div className="relative w-full max-w-2xl h-40 flex items-center justify-center">
            {/* Timeline Line */}
            <div className="absolute h-1 w-full bg-slate-800 rounded-full"></div>

            {/* Background Action (Continuous) */}
            <div className="absolute h-12 w-2/3 bg-green-500/20 border-b-4 border-b-green-500 rounded-lg flex items-center justify-center px-6 animate-pulse">
                <span className="text-green-400 font-bold italic tracking-wide">She was studying...</span>
            </div>

            {/* Interrupter (Simple) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="h-20 w-px bg-red-500 shadow-lg shadow-red-500/50 flex items-center justify-center">
                    <Phone size={24} className="text-red-500 bg-slate-950 rounded-full p-1" />
                </div>
                <div className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Interruption!</div>
                <span className="mt-2 text-white font-mono font-bold text-sm">rang.</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="card-dark p-4 border-l-4 border-l-green-500">
                <p className="text-xs font-black text-green-400 uppercase mb-1">Background Action</p>
                <p className="text-sm text-slate-300 font-bold">Past Continuous</p>
            </div>
            <div className="card-dark p-4 border-l-4 border-l-red-500">
                <p className="text-xs font-black text-red-400 uppercase mb-1">Interrupting Action</p>
                <p className="text-sm text-slate-300 font-bold">Past Simple</p>
            </div>
        </div>
    </div>
);

const U2SummaryCard = () => (
    <div className="card-dark p-8 border-2 border-indigo-500/20 bg-indigo-500/5 space-y-6">
        <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-400" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Unit 2 Mini Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-5 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-blue-400">Past Simple</span>
                <span className="text-2xl font-black text-white">Finished</span>
            </div>
            <div className="bg-slate-950/60 p-5 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-green-400">Past Continuous</span>
                <span className="text-2xl font-black text-white">Ongoing</span>
            </div>
            <div className="bg-slate-950/60 p-5 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-purple-400">Interrupted</span>
                <span className="text-2xl font-black text-white">Both</span>
            </div>
        </div>
    </div>
);

/* --- UNIT 3 COMPONENTS --- */
const U3DecisionFlow = () => (
    <div className="flex flex-col items-center gap-4 py-8 px-4 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto min-w-full md:min-w-0">
        <div className="bg-purple-600 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest flex items-center gap-2 mb-4 shadow-lg shadow-purple-600/20">
            <Zap size={16} /> Present Perfect?
        </div>
        <ArrowDown className="text-slate-600" />
        <div className="flex flex-col items-center gap-4">
            <div className="card-dark border-2 border-purple-500/30 p-4 w-64 text-center ring-4 ring-purple-500/5">
                <HelpCircle size={20} className="mx-auto mb-2 text-purple-400" />
                <p className="font-bold text-white uppercase text-xs tracking-wider">Is the time finished?</p>
            </div>
            <div className="flex gap-20 md:gap-40 h-10 items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="h-full w-px bg-slate-700"></div>
                    <span className="text-[10px] font-black text-red-400 bg-slate-900 px-2 py-1 rounded border border-red-500/20 mt-2">YES</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-full w-px bg-slate-700"></div>
                    <span className="text-[10px] font-black text-green-400 bg-slate-900 px-2 py-1 rounded border border-green-500/20 mt-2">NO</span>
                </div>
            </div>
            <div className="flex gap-10 md:gap-20">
                <div className="flex flex-col items-center">
                    <div className="card-dark border-2 border-blue-500/40 p-5 w-40 text-center bg-blue-500/5">
                        <h4 className="text-blue-400 font-black text-[10px] uppercase mb-1">Past Simple</h4>
                        <p className="text-[8px] text-slate-500">(finished action)</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="card-dark border-2 border-slate-700 p-4 w-48 text-center">
                        <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Connected to present?</p>
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
                        <div className="card-dark border-2 border-purple-500/40 p-5 w-44 text-center bg-purple-500/5 ring-2 ring-purple-500/20">
                            <h4 className="text-purple-400 font-black text-[10px] uppercase mb-1">Present Perfect</h4>
                        </div>
                        <div className="card-dark border-2 border-blue-500/30 p-5 w-40 text-center bg-slate-900">
                            <h4 className="text-blue-400 font-black text-[10px] uppercase mb-1">Past Simple</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const U3FunctionMap = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        <div className="card-dark border-t-4 border-t-purple-500 p-8 flex flex-col gap-5 relative group transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -top-3 left-8 px-4 py-2 bg-purple-500 text-white text-xs font-black uppercase rounded shadow-lg shadow-purple-500/20">Functions</div>
            <ul className="space-y-4 mt-4">
                {[
                    { text: 'Experience (Life experience)', desc: 'Things you have done in your life.' },
                    { text: 'Unfinished time period', desc: 'Actions within "this week", "this month".' },
                    { text: 'Result in the present', desc: 'Past action with visible impact now.' },
                    { text: 'Continuing until now', desc: 'Started in past, still true.' }
                ].map((item, i) => (
                    <li key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-black text-slate-200 uppercase tracking-tight">{item.text}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 ml-4.5">{item.desc}</p>
                    </li>
                ))}
            </ul>
        </div>
        <div className="flex flex-col gap-4">
            <div className="card-dark p-6 bg-purple-500/5 border-2 border-purple-500/10">
                <h4 className="text-xs font-black text-purple-400 uppercase mb-3">Unit 3 Example</h4>
                <p className="text-lg font-bold text-slate-100">"She <span className="text-purple-400 font-black">has studied</span> English for five years."</p>
                <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-slate-950 rounded text-[9px] text-slate-500">Action continues</span>
                    <span className="px-2 py-1 bg-slate-950 rounded text-[9px] text-slate-500">Present Result</span>
                </div>
            </div>
            <div className="card-dark p-6 border-l-4 border-l-purple-500">
                <h4 className="text-[10px] font-black text-purple-400 uppercase mb-1">Structure</h4>
                <div className="text-3xl font-mono text-white tracking-widest leading-none">S + <span className="text-purple-400 font-black">have/has</span> + V3</div>
            </div>
        </div>
    </div>
);

const U3TimeMarkers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div className="card-dark p-8 space-y-8 bg-slate-900/40 relative">
            <div className="absolute top-0 right-0 p-4"><Clock size={40} className="text-slate-800" /></div>
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b border-white/5 pb-2">FOR → Duration</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-bold text-center w-full">for 2 hours</span>
                        <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-bold text-center w-full">for five years</span>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b border-white/5 pb-2">SINCE → Starting Point</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold text-center w-full">since 2020</span>
                        <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold text-center w-full">since Monday</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="card-dark p-8 space-y-8 bg-slate-900/40">
            <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-950/60 border-l-4 border-l-indigo-500">
                    <h4 className="text-xs font-black text-indigo-400 uppercase mb-2">ALREADY → Positive</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                        <li>• already done</li>
                        <li>• already finished</li>
                    </ul>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/60 border-l-4 border-l-pink-500">
                    <h4 className="text-xs font-black text-pink-400 uppercase mb-2">YET → Neg & Question</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                        <li>• not yet</li>
                        <li>• Have you finished yet?</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const U3Comparison = () => (
    <div className="card-dark overflow-hidden animate-fadeIn">
        <div className="bg-indigo-600 p-4 text-center">
            <h3 className="text-white font-black uppercase tracking-tighter">Core Difference</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="p-8 space-y-6">
                <h4 className="text-blue-400 font-black uppercase text-xl tracking-tighter">Past Simple</h4>
                <ul className="space-y-4">
                    {['Finished time', 'Specific time mentioned', 'yesterday / last year / in 2022'].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                            <span className="text-sm text-slate-300 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-8 space-y-6 bg-purple-500/5">
                <h4 className="text-purple-400 font-black uppercase text-xl tracking-tighter">Present Perfect</h4>
                <ul className="space-y-4">
                    {['No specific time', 'Experience', 'Result NOW', 'Unfinished time'].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                            <span className="text-sm text-slate-300 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const U3SummaryCard = () => (
    <div className="card-dark p-8 bg-gradient-to-br from-indigo-900/40 to-slate-950 border border-indigo-500/20">
        <h3 className="text-center font-black uppercase text-xl text-white mb-8 tracking-tighter">Unit 3 Mini Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
                { label: 'Connection', val: 'To NOW', col: 'text-purple-400' },
                { label: 'Finished Time', val: 'Past Simple', col: 'text-blue-400' },
                { label: 'Since', val: 'Start Point', col: 'text-green-400' },
                { label: 'For', val: 'Duration', col: 'text-yellow-400' },
                { label: 'Already', val: 'Positive (+)', col: 'text-indigo-400' },
                { label: 'Yet', val: 'Neg/Que (?)', col: 'text-pink-400' }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <span className="text-[9px] font-black uppercase text-slate-500 mb-1">{item.label}</span>
                    <span className={`text-sm font-black uppercase tracking-tight ${item.col}`}>{item.val}</span>
                </div>
            ))}
        </div>
    </div>
);



/* --- UNIT 4 COMPONENTS --- */
const U4PairedConjunctions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        <div className="card-dark p-6 border-l-4 border-l-indigo-500 bg-indigo-500/5">
            <h4 className="text-xs font-black text-indigo-400 uppercase mb-4">Structure Map</h4>
            <div className="space-y-3 font-mono text-lg text-white">
                <div className="p-3 bg-slate-950 rounded border border-white/5">BOTH <span className="text-indigo-500">A</span> AND <span className="text-indigo-500">B</span></div>
                <div className="p-3 bg-slate-950 rounded border border-white/5">EITHER <span className="text-indigo-500">A</span> OR <span className="text-indigo-500">B</span></div>
                <div className="p-3 bg-slate-950 rounded border border-white/5">NEITHER <span className="text-indigo-500">A</span> NOR <span className="text-indigo-500">B</span></div>
                <div className="p-3 bg-slate-950 rounded border border-white/5">NOT ONLY <span className="text-indigo-500">A</span> BUT ALSO <span className="text-indigo-500">B</span></div>
            </div>
        </div>
        <div className="card-dark p-6 border-t-4 border-t-green-500 relative overflow-hidden">
            <div className="absolute -top-1 -right-1 p-2 bg-green-500/10 rounded-bl-3xl"><Zap className="text-green-500" size={40} /></div>
            <h4 className="text-xs font-black text-green-400 uppercase mb-4">Focus: BOTH ... AND</h4>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Meaning: Add two positive ideas</p>
            <div className="text-xl font-bold text-white mb-6">"She is <span className="text-green-400">both</span> smart <span className="text-green-400">and</span> hardworking."</div>
            <div className="p-4 rounded-xl bg-slate-950 border border-green-500/20">
                <p className="text-[10px] font-black text-green-500 uppercase mb-1">Grammar Tip</p>
                <p className="text-sm text-slate-300">Verb is always <span className="underline decoration-green-500 decoration-2">plural</span>.</p>
                <p className="text-xs text-slate-400 mt-2 italic">Both Tom and Anna <span className="text-green-400 font-bold">are</span> here.</p>
            </div>
        </div>
    </div>
);

const U4ChoiceNegation = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        {/* Either or */}
        <div className="card-dark p-6 border-l-4 border-l-blue-500">
            <h4 className="text-blue-400 font-black text-xs uppercase mb-2">EITHER ... OR</h4>
            <p className="text-[10px] text-slate-500 mb-4 tracking-tighter">Choice (one of two)</p>
            <div className="p-4 bg-slate-950 rounded-xl border border-blue-500/10 mb-6 font-bold text-slate-200">
                "You can <span className="text-blue-400 underline">either</span> stay <span className="text-blue-400 underline">or</span> leave."
            </div>
            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Info size={12} /> Verb agrees with the <span className="text-blue-400">nearest subject</span></p>
                <div className="space-y-2">
                    <p className="text-xs text-slate-400">Either Tom or <span className="text-blue-400 font-bold">Anna IS</span> coming.</p>
                    <p className="text-xs text-slate-400">Either the students or the <span className="text-blue-400 font-bold">teacher IS</span> responsible.</p>
                </div>
            </div>
        </div>

        {/* Neither nor */}
        <div className="card-dark p-6 border-l-4 border-l-red-500">
            <h4 className="text-red-400 font-black text-xs uppercase mb-2">NEITHER ... NOR</h4>
            <p className="text-[10px] text-slate-500 mb-4 tracking-tighter">Negative choice (none of two)</p>
            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/10 mb-6 font-bold text-slate-200">
                "Neither Tom <span className="text-red-400">nor</span> Anna is here."
            </div>
            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Info size={12} /> Verb agrees with the <span className="text-red-400">nearest subject</span></p>
                <div className="space-y-2">
                    <p className="text-xs text-slate-400">Neither the teacher nor the <span className="text-red-400 font-bold">students ARE</span> ready.</p>
                </div>
            </div>
        </div>
    </div>
);

const U4CompoundNouns = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-[2] card-dark p-8 border-2 border-green-500/20 relative">
                <h4 className="text-xs font-black text-green-400 uppercase mb-6 tracking-widest">Types of Compound Nouns</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { type: 'Noun + Noun', ex: ['bus stop', 'school bag'] },
                        { type: 'Adj + Noun', ex: ['blackboard', 'greenhouse'] },
                        { type: 'Verb + Noun', ex: ['washing machine', 'swimming pool'] }
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col items-center text-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase mb-3">{item.type}</span>
                            <div className="space-y-1">
                                {item.ex.map((e, j) => <p key={j} className="text-sm font-bold text-white">{e}</p>)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 card-dark p-8 flex items-center justify-center bg-green-500/5">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={32} className="text-green-500" />
                    </div>
                    <p className="font-black text-white text-sm uppercase">What is it?</p>
                    <p className="text-xs text-slate-400 mt-2">A noun made of <span className="text-green-400">two or more</span> words.</p>
                </div>
            </div>
        </div>
    </div>
);

const U4StressPattern = () => (
    <div className="card-dark p-10 bg-gradient-to-br from-purple-900/40 to-slate-950 border border-purple-500/20 text-center animate-fadeIn">
        <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-10">Stress Pattern (Score Booster)</h4>
        <div className="flex flex-wrap justify-center gap-8">
            {[
                { word: 'BLACKboard', color: 'text-white' },
                { word: 'GREENhouse', color: 'text-white' },
                { word: 'BUS stop', color: 'text-white' }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="text-3xl font-black tracking-tighter text-white mb-2">
                        <span className="text-purple-400">{item.word.split(/(?=[a-z])/)[0]}</span>
                        <span className="text-slate-600">{item.word.split(/(?=[a-z])/)[1]}</span>
                    </div>
                    <div className="w-10 h-1 bg-purple-500 rounded-full"></div>
                </div>
            ))}
        </div>
        <p className="text-sm font-bold text-slate-400 mt-12 uppercase tracking-widest">
            Stress usually falls on the <span className="text-purple-400 border-b-2 border-purple-500/30 pb-1">FIRST WORD</span>
        </p>
    </div>
);



/* --- UNIT 5 COMPONENTS --- */
const U5DecisionFlow = () => (
    <div className="flex flex-col items-center gap-4 py-8 px-4 bg-slate-900/40 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto min-w-full md:min-w-0">
        <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest flex items-center gap-2 mb-4 shadow-lg shadow-blue-600/20">
            <Zap size={16} /> Future Decision?
        </div>
        <ArrowDown className="text-slate-600" />
        <div className="flex flex-col items-center gap-4">
            <div className="card-dark border-2 border-blue-500/30 p-4 w-64 text-center ring-4 ring-blue-500/5">
                <HelpCircle size={20} className="mx-auto mb-2 text-blue-400" />
                <p className="font-bold text-white uppercase text-xs tracking-wider">Is the decision made NOW?</p>
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
                <div className="flex flex-col items-center">
                    <div className="card-dark border-2 border-blue-500/40 p-5 w-40 text-center bg-blue-500/5">
                        <h4 className="text-blue-400 font-black text-xl uppercase mb-1">WILL</h4>
                        <p className="text-[8px] text-slate-500">(instant decision)</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="card-dark border-2 border-slate-700 p-4 w-48 text-center">
                        <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Planned before?</p>
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
                        <div className="card-dark border-2 border-indigo-500/40 p-5 w-44 text-center bg-indigo-500/5">
                            <h4 className="text-indigo-400 font-black text-xs uppercase mb-1 tracking-tighter line-clamp-1">BE GOING TO</h4>
                        </div>
                        <div className="card-dark border-2 border-slate-800 p-5 w-40 text-center bg-slate-900">
                            <h4 className="text-slate-400 font-black text-[10px] uppercase mb-1">Prediction?</h4>
                            <ArrowDown size={10} className="mx-auto text-slate-600 mb-1" />
                            <span className="text-blue-400 font-black text-xs">WILL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const U5FormUsage = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div className="card-dark p-8 border-t-4 border-t-blue-500 bg-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4"><Zap className="text-blue-500/20" size={60} /></div>
            <h4 className="text-xl font-black text-blue-400 uppercase mb-6 tracking-tighter">WILL</h4>
            <ul className="space-y-3 mb-8">
                {['Instant decision', 'Promise', 'Offer', 'Prediction (opinion)'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-200 font-bold">{item}</span>
                    </li>
                ))}
            </ul>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase">Example & Form</p>
                <p className="text-sm font-bold text-white tracking-tight italic">"I will help you."</p>
                <div className="h-px bg-white/5 my-2"></div>
                <p className="font-mono text-blue-400 font-black">S + will + V</p>
            </div>
        </div>

        <div className="card-dark p-8 border-t-4 border-t-indigo-500 bg-indigo-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4"><Clock className="text-indigo-500/20" size={60} /></div>
            <h4 className="text-xl font-black text-indigo-400 uppercase mb-6 tracking-tighter">BE GOING TO</h4>
            <ul className="space-y-3 mb-8">
                {['Planned action', 'Prior intention', 'Prediction (evidence)'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        <span className="text-sm text-slate-200 font-bold">{item}</span>
                    </li>
                ))}
            </ul>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase">Example & Form</p>
                <p className="text-sm font-bold text-white tracking-tight italic">"Look at the clouds! It is going to rain."</p>
                <div className="h-px bg-white/5 my-2"></div>
                <p className="font-mono text-indigo-400 font-black">S + am/is/are + going to + V</p>
            </div>
        </div>
    </div>
);

const U5TimelinePossibility = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="card-dark p-8 bg-slate-950/50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-8 text-center tracking-widest">Timeline Comparison</h4>
            <div className="relative h-20 flex items-center px-10">
                <div className="absolute h-1 w-full left-0 bg-slate-800"></div>
                <div className="flex-1 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-600 mb-2"></div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase">Past</span>
                </div>
                <div className="flex-1 flex flex-col items-center relative">
                    <div className="w-4 h-4 rounded-full bg-white ring-4 ring-white/10 mb-2 z-10"></div>
                    <span className="text-[10px] font-black text-white uppercase">NOW</span>
                    {/* Will arrow from now */}
                    <div className="absolute top-2 left-1/2 w-24 h-8 border-t-2 border-r-2 border-blue-500/50 rounded-tr-xl -z-0"></div>
                    <span className="absolute -top-6 left-12 text-[9px] font-black text-blue-400">WILL (instant)</span>
                </div>
                <div className="flex-1 flex flex-col items-center relative">
                    <div className="w-2 h-2 rounded-full bg-slate-600 mb-2"></div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase">Future</span>
                    {/* be going to arrow from before */}
                    <div className="absolute top-1 -left-20 w-32 h-6 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-xl -z-0"></div>
                    <span className="absolute -bottom-6 -left-12 text-[9px] font-black text-indigo-400">GOING TO (planned)</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-dark p-8 bg-purple-500/5 border-l-4 border-l-purple-500">
                <h4 className="text-sm font-black text-purple-400 uppercase mb-6">MAY / MIGHT</h4>
                <div className="space-y-4">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter underline underline-offset-4 decoration-purple-500/30">Possibility & Uncertainty</p>
                    <p className="text-base text-white font-bold">"She <span className="text-purple-400">may</span> come."</p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-purple-300 text-sm">
                        S + may/might + V
                        <p className="text-[10px] text-red-500/70 mt-1 uppercase mt-2 font-sans font-black">No "TO" after might!</p>
                    </div>
                </div>
            </div>
            <div className="card-dark p-8 bg-slate-950/80">
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest text-center">Likelihood Scale</h4>
                <div className="space-y-4">
                    {[
                        { label: 'Certain', val: 'WILL', pct: '100%', col: 'bg-blue-500' },
                        { label: 'Likely', val: 'Probably', pct: '75%', col: 'bg-indigo-500 opacity-80' },
                        { label: 'Possible', val: 'May / Might', pct: '50%', col: 'bg-purple-500 opacity-60' },
                        { label: 'Impossible', val: 'Won\'t', pct: '0%', col: 'bg-red-500' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="w-16 text-[9px] font-black text-slate-500 uppercase">{item.label}</span>
                            <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                <div className={`h-full ${item.col}`} style={{ width: item.pct }}></div>
                            </div>
                            <span className={`w-20 text-[10px] font-bold ${item.col.split(' ')[0].replace('bg-', 'text-')} text-right`}>{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);



/* --- UNIT 6 COMPONENTS --- */
const U6GerundLogic = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div className="card-dark p-8 border-l-4 border-l-purple-500 bg-purple-500/5">
            <h4 className="text-xs font-black text-purple-400 uppercase mb-4 tracking-widest">What is a Gerund?</h4>
            <div className="flex flex-col items-center gap-2 mb-6">
                <div className="px-6 py-3 bg-slate-950 rounded-xl border border-purple-500/20 text-xl font-mono text-white">
                    VERB + <span className="text-purple-400">-ING</span>
                </div>
                <ArrowDown size={14} className="text-slate-600" />
                <div className="px-6 py-2 bg-purple-500 text-white rounded-full text-xs font-black uppercase">Acts like a NOUN</div>
            </div>
            <div className="space-y-2">
                <p className="text-xs text-slate-400 italic">"Swimming is fun."</p>
                <p className="text-xs text-slate-400 italic">"I enjoy reading."</p>
            </div>
        </div>

        <div className="card-dark p-8 border-t-4 border-t-green-500">
            <h4 className="text-xs font-black text-green-400 uppercase mb-6 tracking-widest">Usage Map</h4>
            <div className="space-y-4">
                {[
                    { title: '1. As a Subject', ex: 'Swimming is healthy.' },
                    { title: '2. After Certain Verbs', ex: 'enjoy / avoid / finish' },
                    { title: '3. After Prepositions', ex: 'interested in learning' }
                ].map((item, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-green-500 uppercase block mb-1">{item.title}</span>
                        <p className="text-sm font-bold text-slate-200">{item.ex}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="md:col-span-2 card-dark p-8 bg-gradient-to-r from-slate-950 to-purple-900/20 border border-purple-500/20">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                <div className="text-center">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase mb-4">Verb Pattern</h4>
                    <div className="p-4 bg-slate-950 rounded-2xl border-2 border-purple-500/40">
                        <span className="text-2xl font-black text-white">VERB + V-ing</span>
                    </div>
                    <p className="text-[10px] text-red-500 font-black mt-2 tracking-widest uppercase">⚠ No "to"</p>
                </div>
                <div className="hidden md:block w-px h-20 bg-white/10"></div>
                <div className="flex gap-4">
                    <div className="card-dark p-4 bg-green-500/10 border-green-500/20 flex flex-col items-center">
                        <span className="text-xs font-bold text-white mb-1">I enjoy reading.</span>
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white">✔</div>
                    </div>
                    <div className="card-dark p-4 bg-red-500/10 border-red-500/20 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 mb-1 line-through">I enjoy to read.</span>
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">✘</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const U6TagQuestions = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-dark p-8 border-l-4 border-l-blue-500 bg-blue-500/5">
                <h4 className="text-xs font-black text-blue-400 uppercase mb-6 tracking-widest">Logic: Opposites Attract</h4>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 p-3 bg-green-500/20 rounded-lg text-center border border-green-500/30">
                            <span className="text-[10px] font-black text-green-400 uppercase">Positive (+)</span>
                        </div>
                        <ArrowDown size={14} className="rotate-[270deg] text-slate-600" />
                        <div className="flex-1 p-3 bg-red-500/20 rounded-lg text-center border border-red-500/30">
                            <span className="text-[10px] font-black text-red-400 uppercase">Negative (-)</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center italic">"She is tired, <span className="text-blue-400 underline decoration-2">isn't she?</span>"</p>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 p-3 bg-red-500/20 rounded-lg text-center border border-red-500/30">
                            <span className="text-[10px] font-black text-red-400 uppercase">Negative (-)</span>
                        </div>
                        <ArrowDown size={14} className="rotate-[270deg] text-slate-600" />
                        <div className="flex-1 p-3 bg-green-500/20 rounded-lg text-center border border-green-500/30">
                            <span className="text-[10px] font-black text-green-400 uppercase">Positive (+)</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center italic">"She isn't here, <span className="text-blue-400 underline decoration-2">is she?</span>"</p>
                </div>
            </div>

            <div className="card-dark p-8 border-t-4 border-t-indigo-500">
                <h4 className="text-xs font-black text-indigo-400 uppercase mb-6 tracking-widest">Auxiliary Matching</h4>
                <div className="space-y-3">
                    {[
                        { s: 'She IS here', t: "ISN'T she?" },
                        { s: 'They CAN swim', t: "CAN'T they?" },
                        { s: 'You WENT home', t: "DIDN'T you?" }
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-white/5">
                            <span className="text-xs text-slate-400 font-mono">{item.s}</span>
                            <ArrowDown size={12} className="rotate-[270deg] text-slate-700" />
                            <span className="text-xs text-indigo-400 font-black">{item.t}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-2 flex items-center gap-2"><Zap size={10} /> Special Cases</h5>
                    <p className="text-xs text-slate-200">Let's go, <span className="text-indigo-400 font-bold underline">shall we?</span></p>
                    <p className="text-xs text-slate-200">I am late, <span className="text-indigo-400 font-bold underline">aren't I?</span></p>
                </div>
            </div>
        </div>

        <div className="card-dark p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-white/5 text-center">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-12">Intonation (Score Booster)</h4>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                <div className="flex-1 card-dark p-6 bg-slate-950/50 border-blue-500/20">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <Phone size={24} className="rotate-[135deg]" />
                        </div>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1 uppercase">Rising Tone</h5>
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-4">Real Question</p>
                    <p className="text-xs text-slate-400">Speaker is unsure and wants to find out the truth.</p>
                </div>
                <div className="flex flex-col justify-center text-slate-700 px-4">
                    <div className="hidden md:block w-px h-full bg-white/5 mx-auto"></div>
                    <span className="font-black text-xs uppercase my-4">OR</span>
                </div>
                <div className="flex-1 card-dark p-6 bg-slate-950/50 border-purple-500/20">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                            <Phone size={24} className="rotate-[225deg]" />
                        </div>
                    </div>
                    <h5 className="text-sm font-black text-white mb-1 uppercase">Falling Tone</h5>
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-4">Confirmation</p>
                    <p className="text-xs text-slate-400">Speaker expects agreement or is just continuous chat.</p>
                </div>
            </div>
        </div>
    </div>
);

/* --- MAIN COMPONENT --- */

const GrammarDiagrams: React.FC<{ unitId: string }> = ({ unitId }) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const getTabs = () => {
        switch (unitId) {
            case 'u1':
                return [
                    { label: 'Decision Flow', icon: <Zap size={14} />, component: <U1DecisionFlow /> },
                    { label: 'Functions', icon: <Layout size={14} />, component: <U1FunctionMap /> },
                    { label: 'Structures', icon: <Info size={14} />, component: <U1StructureMap /> },
                    {
                        label: 'Color Logic', icon: <Palette size={14} />, component: (
                            <div className="p-8 rounded-3xl bg-slate-950/50 space-y-8 animate-fadeIn">
                                <h3 className="text-center font-black uppercase text-xl tracking-tighter gradient-text">Unit 1 Visual Logic</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-white font-black text-2xl">A</div>
                                        <div><p className="font-black text-green-400 text-xs uppercase mb-1">Green → Action Now</p></div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-black text-2xl">H</div>
                                        <div><p className="font-black text-blue-400 text-xs uppercase mb-1">Blue → Habit / Fact</p></div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center text-white font-black text-2xl">S</div>
                                        <div><p className="font-black text-yellow-400 text-xs uppercase mb-1">Yellow → State</p></div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                ];
            case 'u2':
                return [
                    { label: 'Decision Flow', icon: <Clock size={14} />, component: <U2DecisionFlow /> },
                    { label: 'Function Map', icon: <Layout size={14} />, component: <U2FunctionMap /> },
                    {
                        label: 'Structures', icon: <Info size={14} />, component: (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 card-dark p-8 border-l-4 border-l-blue-500">
                                        <h4 className="text-blue-400 font-black text-xs uppercase mb-2">Past Simple</h4>
                                        <p className="text-3xl font-mono text-white">S + V2 / V-ed</p>
                                    </div>
                                    <div className="flex-1 card-dark p-8 border-l-4 border-l-green-500">
                                        <h4 className="text-green-400 font-black text-xs uppercase mb-2">Past Continuous</h4>
                                        <p className="text-3xl font-mono text-white">S + was/were + V-ing</p>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { label: 'Logic Chart', icon: <Zap size={14} />, component: <U2InterruptedLogic /> },
                    { label: 'Summary', icon: <BookOpen size={14} />, component: <U2SummaryCard /> },
                ];
            case 'u3':
                return [
                    { label: 'Decision Flow', icon: <Zap size={14} />, component: <U3DecisionFlow /> },
                    { label: 'Function Map', icon: <Layout size={14} />, component: <U3FunctionMap /> },
                    { label: 'Time Markers', icon: <Clock size={14} />, component: <U3TimeMarkers /> },
                    { label: 'Differences', icon: <Layout size={14} />, component: <U3Comparison /> },
                    { label: 'Summary', icon: <BookOpen size={14} />, component: <U3SummaryCard /> }
                ];
            case 'u4':
                return [
                    { label: 'Paired Rules', icon: <Layout size={14} />, component: <U4PairedConjunctions /> },
                    { label: 'Choice Logic', icon: <Zap size={14} />, component: <U4ChoiceNegation /> },
                    { label: 'Compounds', icon: <Info size={14} />, component: <U4CompoundNouns /> },
                    { label: 'Stress Tips', icon: <Palette size={14} />, component: <U4StressPattern /> },
                ];
            case 'u5':
                return [
                    { label: 'Decision Flow', icon: <Zap size={14} />, component: <U5DecisionFlow /> },
                    { label: 'Will vs Going To', icon: <Layout size={14} />, component: <U5FormUsage /> },
                    { label: 'Timeline & Prob', icon: <Clock size={14} />, component: <U5TimelinePossibility /> },
                ];
            case 'u6':
                return [
                    { label: 'Gerund Logic', icon: <Layout size={14} />, component: <U6GerundLogic /> },
                    { label: 'Question Tags', icon: <Zap size={14} />, component: <U6TagQuestions /> },
                ];
            default:
                return [
                    {
                        label: 'Comming Soon', icon: <Info size={14} />, component: (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-950/30 rounded-3xl border border-dashed border-slate-800">
                                <BookOpen size={48} className="text-slate-700 mb-4" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest">Diagrams for Unit {unitId.slice(1)} arriving soon!</p>
                            </div>
                        )
                    }
                ];
        }
    };

    const tabs = getTabs();

    // Reset tab when unit changes
    React.useEffect(() => {
        setActiveTab(0);
    }, [unitId]);

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

            <div className="relative min-h-[420px]">
                {tabs[activeTab]?.component}
            </div>
        </div>
    );
};

export default GrammarDiagrams;
