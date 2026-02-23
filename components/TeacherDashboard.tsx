import React, { useState, useMemo } from 'react';
import { UserAccount } from '../types';
import { COURSE_DATA, ALL_STUDENTS } from '../constants';
import { RefreshCw, Search, ChevronDown, ChevronUp, BarChart3, Users, Trophy, BookOpen, Zap } from 'lucide-react';

interface TeacherDashboardProps {
    firebaseStudents: Record<string, any>;
    onRefresh: () => void;
}

const STORAGE_KEY_PREFIX = 'ELITE_ENG_USER_DATA_V8';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ firebaseStudents, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<string>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const normalizeName = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();

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
    const ALL_STUDENT_LIST = CLASS_NAMES_RAW.map((n, i) => ({ username: `student${(i + 1).toString().padStart(2, '0')}`, name: normalizeName(n) }));

    const studentData = useMemo(() => {
        const savedDataMap: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_KEY_PREFIX + '_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key) || '{}');
                    const uname = data.username || key.replace(STORAGE_KEY_PREFIX + '_', '');
                    savedDataMap[uname] = data;
                } catch { }
            }
        }
        return ALL_STUDENT_LIST.map(s => {
            const fb = firebaseStudents[s.username] || {};
            const local = savedDataMap[s.username] || {};
            const mergeData = (fb: any, local: any) => {
                if (!fb && !local) return {};
                if (!fb) return local;
                if (!local) return fb;
                return Object.keys({ ...fb, ...local }).reduce((acc, k) => {
                    acc[k] = Math.max(fb[k] || 0, local[k] || 0);
                    return acc;
                }, {} as Record<string, number>);
            };
            return {
                name: s.name,
                username: s.username,
                xp: Math.max(fb.xp || 0, local.xp || 0),
                completedModules: Math.max(fb.completedModules || 0, local.completedModules || 0),
                progress: mergeData(fb.progress || {}, local.progress || {}),
                moduleProgress: mergeData(fb.moduleProgress || {}, local.moduleProgress || {}),
                lastActive: fb.lastActive || local.updatedAt || null,
                dataSource: fb.xp || fb.completedModules ? 'firebase' : local.xp || local.completedModules ? 'local' : 'none',
            };
        }).sort((a, b) => b.xp - a.xp);
    }, [firebaseStudents]);

    const filteredStudents = useMemo(() => searchQuery
        ? studentData.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.username.includes(searchQuery.toLowerCase()))
        : studentData, [studentData, searchQuery]);

    const classStats = useMemo(() => ({
        totalStudents: studentData.length,
        activeStudents: studentData.filter(s => s.xp > 0).length,
        avgXP: studentData.length > 0 ? Math.round(studentData.reduce((a, s) => a + s.xp, 0) / studentData.length) : 0,
        topStudent: studentData[0] || null,
    }), [studentData]);

    const UNIT_KEYS = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'];
    const cardStyle: React.CSSProperties = { background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)', borderRadius: '20px' };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', icon: <Users size={20} />, value: classStats.totalStudents, accent: '#6366F1', sub: 'Class 11A1' },
                    { label: 'Active Learners', icon: <Zap size={20} />, value: classStats.activeStudents, accent: '#22C55E', sub: `${classStats.totalStudents - classStats.activeStudents} not started` },
                    { label: 'Class Avg XP', icon: <BarChart3 size={20} />, value: classStats.avgXP, accent: '#22D3EE', sub: 'XP Points' },
                    { label: 'Top Student', icon: <Trophy size={20} />, value: classStats.topStudent?.name.split(' ').slice(-1)[0] || '–', accent: '#F59E0B', sub: `${classStats.topStudent?.xp || 0} XP` },
                ].map((stat, i) => (
                    <div key={i} className="p-6 flex flex-col gap-4 relative overflow-hidden" style={cardStyle}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.accent}18`, color: stat.accent }}>{stat.icon}</div>
                        <div>
                            <p className="type-h2 font-black truncate" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>{stat.value}</p>
                            <p className="type-caption font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{stat.label}</p>
                            <p className="type-caption mt-0.5" style={{ color: '#475569' }}>{stat.sub}</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full pointer-events-none" style={{ background: stat.accent, opacity: 0.06, filter: 'blur(10px)' }}></div>
                    </div>
                ))}
            </section>

            {/* Filters */}
            <section className="p-6 flex flex-col md:flex-row gap-4 items-center" style={cardStyle}>
                <div className="relative flex-1 w-full">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                    <input
                        type="text" placeholder="Search by name or username..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="type-button flex-1 w-full pl-9 pr-4 py-3 rounded-xl outline-none transition-all"
                        style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', color: '#CBD5E1' }}
                        onFocus={e => e.target.style.borderColor = '#6366F1'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                    />
                </div>
                <select value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)}
                    className="type-small px-4 py-3 rounded-xl font-bold outline-none cursor-pointer"
                    style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', color: '#CBD5E1', minWidth: '180px' }}>
                    <option value="all">All Units</option>
                    {UNIT_KEYS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                </select>
                <button onClick={handleRefresh}
                    className="type-caption px-5 py-3 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all"
                    style={{ background: isRefreshing ? '#6366F1' : 'rgba(99,102,241,0.12)', color: isRefreshing ? 'white' : '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                    {isRefreshing ? 'Syncing...' : 'Sync Firebase'}
                </button>
            </section>

            {/* Student Table */}
            <section className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Table Header */}
                <div className="type-caption grid grid-cols-12 px-6 py-4 font-black uppercase tracking-[0.2em]" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#475569' }}>
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-4">Student</div>
                    <div className="col-span-2 text-center">Modules</div>
                    <div className="col-span-2 text-center">XP</div>
                    <div className="col-span-2 text-center">Source</div>
                    <div className="col-span-1 text-center">Detail</div>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="py-20 text-center">
                        <p style={{ color: '#334155' }}>No students found for "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredStudents.map((student, idx) => {
                        const isExpanded = expandedStudent === student.username;
                        const rank = studentData.findIndex(s => s.username === student.username) + 1;
                        const rankColor = rank === 1 ? '#FBBF24' : rank === 2 ? '#94A3B8' : rank === 3 ? '#FB923C' : '#334155';
                        const rankBg = rank <= 3 ? `${rankColor}20` : 'rgba(255,255,255,0.03)';

                        return (
                            <div key={student.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <div
                                    onClick={() => setExpandedStudent(isExpanded ? null : student.username)}
                                    className="grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors"
                                    style={{ background: isExpanded ? '#243044' : 'transparent' }}
                                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div className="col-span-1 flex justify-center">
                                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
                                            style={{ background: rankBg, color: rankColor }}>{rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}</span>
                                    </div>
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0"
                                            style={{ background: student.xp > 0 ? 'linear-gradient(135deg, #6366F1, #3B82F6)' : '#334155' }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="type-small font-bold" style={{ color: '#CBD5E1' }}>{student.name}</p>
                                            <p className="type-caption" style={{ color: '#475569' }}>{student.username}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="text-sm font-black" style={{ color: student.completedModules > 0 ? '#A5B4FC' : '#334155' }}>
                                            {student.completedModules}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="text-sm font-black" style={{ color: student.xp > 0 ? '#F8FAFC' : '#334155' }}>
                                            {student.xp}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                                            style={student.dataSource === 'firebase' ? { background: 'rgba(34,197,94,0.12)', color: '#4ADE80' }
                                                : student.dataSource === 'local' ? { background: 'rgba(59,130,246,0.12)', color: '#93C5FD' }
                                                    : { background: 'rgba(255,255,255,0.04)', color: '#334155' }}>
                                            {student.dataSource}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        {isExpanded ? <ChevronUp size={14} style={{ color: '#6366F1' }} /> : <ChevronDown size={14} style={{ color: '#475569' }} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="px-6 pb-6 animate-fadeIn">
                                        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <p className="type-caption font-black uppercase tracking-[0.3em] mb-5" style={{ color: '#6366F1' }}>Progress by Skill</p>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {['vocabulary', 'grammar', 'reading', 'listening', 'challenge'].map(skill => {
                                                    const val = student.progress?.[skill] || 0;
                                                    const colors: Record<string, string> = { vocabulary: '#6366F1', grammar: '#3B82F6', reading: '#22D3EE', listening: '#8B5CF6', challenge: '#F59E0B' };
                                                    return (
                                                        <div key={skill} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                            <p className="type-caption font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#475569' }}>{skill}</p>
                                                            <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: '#0F172A' }}>
                                                                <div className="h-full rounded-full" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${colors[skill]}, ${colors[skill]}88)` }}></div>
                                                            </div>
                                                            <p className="text-lg font-black" style={{ color: colors[skill] }}>{val}%</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default TeacherDashboard;
