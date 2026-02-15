
import React, { useState, useMemo } from 'react';
import { Users, Search, TrendingUp, Award, BookOpen, ChevronDown, ChevronUp, BarChart3, Flame, GraduationCap, RefreshCw } from 'lucide-react';

interface TeacherDashboardProps {
    firebaseStudents: Record<string, any>;
    onRefresh: () => void;
}

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

const normalizeName = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toUpperCase();
};

const ALL_STUDENTS = CLASS_NAMES_RAW.map((rawName, index) => ({
    username: `student${(index + 1).toString().padStart(2, '0')}`,
    name: normalizeName(rawName),
    rawName
}));

const UNIT_NAMES: Record<string, string> = {
    u1: 'Unit 1: Generation Gap',
    u2: 'Unit 2: Vietnam & ASEAN',
    u3: 'Unit 3: Global Warming',
    u4: 'Unit 4: World Heritage',
    u5: 'Unit 5: Cities & Education',
    u6: 'Unit 6: Social Issues',
    u7: 'Unit 7: Healthy Lifestyle',
    u8: 'Unit 8: Health & Life',
};

const SKILL_KEYS = ['vocabulary_memory', 'vocabulary_escape', 'grammar_quiz', 'reading', 'listening', 'practice_test'];
const SKILL_LABELS: Record<string, string> = {
    vocabulary_memory: 'Vocab Memory',
    vocabulary_escape: 'Vocab Game',
    grammar_quiz: 'Grammar',
    reading: 'Reading',
    listening: 'Listening',
    practice_test: 'Challenge',
};

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ firebaseStudents, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const STORAGE_KEY_PREFIX = 'ELITE_ENG_USER_DATA_V8';

    const studentData = useMemo(() => {
        // Read all localStorage data
        const localDataMap: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_KEY_PREFIX + '_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key) || '{}');
                    const uname = data.username || key.replace(STORAGE_KEY_PREFIX + '_', '');
                    localDataMap[uname] = data;
                } catch (e) { /* skip */ }
            }
        }

        return ALL_STUDENTS.map(s => {
            const fb = firebaseStudents[s.username];
            const local = localDataMap[s.username];

            // Merge: take the higher XP and completedModules from either source
            const fbXp = fb?.xp || 0;
            const localXp = local?.xp || 0;
            const fbModules = fb?.completedModules || 0;
            const localModules = local?.completedModules || 0;

            // Merge moduleProgress: take higher score per key
            const mergedModuleProgress: Record<string, any> = {};
            const fbProgress = fb?.moduleProgress || {};
            const localProgress = local?.moduleProgress || {};
            const allKeys = new Set([...Object.keys(fbProgress), ...Object.keys(localProgress)]);
            for (const key of allKeys) {
                const fbVal = fbProgress[key];
                const localVal = localProgress[key];
                if (!fbVal) { mergedModuleProgress[key] = localVal; }
                else if (!localVal) { mergedModuleProgress[key] = fbVal; }
                else { mergedModuleProgress[key] = (fbVal.score || 0) >= (localVal.score || 0) ? fbVal : localVal; }
            }

            const hasData = !!fb || !!local;
            const xp = Math.max(fbXp, localXp);
            const completedModules = Math.max(fbModules, localModules);

            return {
                ...s,
                xp,
                completedModules,
                moduleProgress: mergedModuleProgress,
                lastUpdated: fb?.lastUpdated || null,
                hasData,
                dataSource: fb && local ? 'both' : fb ? 'firebase' : local ? 'local' : 'none'
            };
        }).sort((a, b) => b.xp - a.xp);
    }, [firebaseStudents]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return studentData;
        const q = searchQuery.toLowerCase();
        return studentData.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.rawName.toLowerCase().includes(q) ||
            s.username.toLowerCase().includes(q)
        );
    }, [studentData, searchQuery]);

    const classStats = useMemo(() => {
        const active = studentData.filter(s => s.xp > 0);
        const totalXp = studentData.reduce((sum, s) => sum + s.xp, 0);
        const avgXp = active.length > 0 ? Math.round(totalXp / active.length) : 0;
        const totalModules = studentData.reduce((sum, s) => sum + s.completedModules, 0);
        return {
            totalStudents: studentData.length,
            activeStudents: active.length,
            avgXp,
            totalModules,
        };
    }, [studentData]);

    const getSkillScore = (moduleProgress: Record<string, any>, unitId: string, skillKey: string) => {
        const key = `${unitId}_${skillKey}`;
        return moduleProgress[key]?.score || 0;
    };

    const getUnitAvgScore = (moduleProgress: Record<string, any>, unitId: string) => {
        const scores = SKILL_KEYS.map(sk => getSkillScore(moduleProgress, unitId, sk));
        const nonZero = scores.filter(s => s > 0);
        return nonZero.length > 0 ? Math.round(nonZero.reduce((a, b) => a + b, 0) / nonZero.length) : 0;
    };

    const getScoreColor = (score: number) => {
        if (score === 0) return 'text-slate-300';
        if (score < 40) return 'text-red-500';
        if (score < 70) return 'text-amber-500';
        return 'text-emerald-600';
    };

    const getScoreBg = (score: number) => {
        if (score === 0) return 'bg-slate-50';
        if (score < 40) return 'bg-red-50';
        if (score < 70) return 'bg-amber-50';
        return 'bg-emerald-50';
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">
            {/* Header Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Users size={16} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng HS</span>
                    </div>
                    <p className="text-3xl font-black text-[#2D3748]">{classStats.totalStudents}</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500"><TrendingUp size={16} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoạt động</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{classStats.activeStudents}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{Math.round(classStats.activeStudents / classStats.totalStudents * 100)}% đã bắt đầu</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><Flame size={16} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TB XP</span>
                    </div>
                    <p className="text-3xl font-black text-amber-600">{classStats.avgXp}</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Award size={16} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng Modules</span>
                    </div>
                    <p className="text-3xl font-black text-purple-600">{classStats.totalModules}</p>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-white rounded-3xl p-6 border border-green-100 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 flex items-center justify-center text-[#27AE60]">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#2D3748] tracking-tight">Chi tiết kết quả học sinh</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Student Results</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm học sinh..."
                                className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-[#27AE60] transition-all font-medium w-full md:w-52"
                            />
                        </div>
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-[#27AE60] cursor-pointer"
                        >
                            <option value="all">Tất cả Units</option>
                            {Object.entries(UNIT_NAMES).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleRefresh}
                            className={`px-4 py-2.5 rounded-xl bg-[#27AE60] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#2ECC71] transition-all shadow-sm ${isRefreshing ? 'opacity-70' : ''}`}
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            Làm mới
                        </button>
                    </div>
                </div>
            </section>

            {/* Student Table */}
            <section className="bg-white rounded-3xl border border-green-100 shadow-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[auto_1fr_80px_80px_1fr] gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest items-center">
                    <span className="w-8 text-center">#</span>
                    <span>Họ tên</span>
                    <span className="text-center">XP</span>
                    <span className="text-center">Modules</span>
                    <span className="text-center">Trạng thái</span>
                </div>

                {/* Student Rows */}
                <div className="divide-y divide-slate-50">
                    {filteredStudents.map((student, index) => {
                        const isExpanded = expandedStudent === student.username;
                        const unitIds = selectedUnit === 'all' ? Object.keys(UNIT_NAMES) : [selectedUnit];
                        const rank = index + 1;

                        return (
                            <div key={student.username}>
                                {/* Main Row */}
                                <div
                                    onClick={() => setExpandedStudent(isExpanded ? null : student.username)}
                                    className={`grid grid-cols-[auto_1fr_80px_80px_1fr] gap-2 px-6 py-4 items-center cursor-pointer transition-all hover:bg-green-50/50 ${isExpanded ? 'bg-green-50/80' : ''}`}
                                >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {rank}
                                    </span>
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-[#27AE60] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#2D3748] truncate">{student.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">@{student.username}</p>
                                        </div>
                                    </div>
                                    <span className={`text-center text-sm font-black ${student.xp > 0 ? 'text-[#27AE60]' : 'text-slate-300'}`}>{student.xp}</span>
                                    <span className={`text-center text-sm font-black ${student.completedModules > 0 ? 'text-blue-600' : 'text-slate-300'}`}>{student.completedModules}</span>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${student.dataSource === 'both' ? 'bg-emerald-50 text-emerald-600' :
                                                student.dataSource === 'firebase' ? 'bg-blue-50 text-blue-600' :
                                                    student.dataSource === 'local' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-slate-50 text-slate-400'
                                            }`}>
                                            {student.dataSource === 'both' ? '🔄 Synced' :
                                                student.dataSource === 'firebase' ? '☁️ Firebase' :
                                                    student.dataSource === 'local' ? '💾 Local only' :
                                                        'Chưa bắt đầu'}
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 animate-fadeIn">
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            {student.lastUpdated && (
                                                <p className="text-[10px] text-slate-400 font-bold mb-4">
                                                    Cập nhật lần cuối: {new Date(student.lastUpdated).toLocaleString('vi-VN')}
                                                </p>
                                            )}
                                            {unitIds.map(unitId => (
                                                <div key={unitId} className="mb-4 last:mb-0">
                                                    <h4 className="text-xs font-black text-[#27AE60] uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <BarChart3 size={12} />
                                                        {UNIT_NAMES[unitId] || unitId}
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                                        {SKILL_KEYS.map(sk => {
                                                            const score = getSkillScore(student.moduleProgress, unitId, sk);
                                                            return (
                                                                <div key={sk} className={`${getScoreBg(score)} rounded-xl p-3 text-center border border-transparent`}>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{SKILL_LABELS[sk]}</p>
                                                                    <p className={`text-xl font-black ${getScoreColor(score)}`}>
                                                                        {score > 0 ? `${score}%` : '—'}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    {selectedUnit === 'all' && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full transition-all duration-500"
                                                                    style={{ width: `${getUnitAvgScore(student.moduleProgress, unitId)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-500 w-10 text-right">{getUnitAvgScore(student.moduleProgress, unitId)}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredStudents.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-slate-400 font-medium">Không tìm thấy học sinh phù hợp</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default TeacherDashboard;
