import React, { useState, useMemo } from 'react';
import { RefreshCw, Search, ChevronDown, ChevronUp, BarChart3, Users, Trophy, Zap, Database, Save, Edit3, CheckCircle, X, AlertTriangle, Upload, Download } from 'lucide-react';
import { getFirebaseUrl, setFirebaseUrl, saveStudentProgress, loadAllStudentsProgress, isFirebaseConfigured } from '../services/firebaseService';

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

    // Firebase URL setup state
    const [firebaseUrlInput, setFirebaseUrlInput] = useState(getFirebaseUrl());
    const [fbSaved, setFbSaved] = useState(false);
    const [fbError, setFbError] = useState('');

    // Manual data entry state
    const [editingStudent, setEditingStudent] = useState<string | null>(null);
    const [editXP, setEditXP] = useState('');
    const [editModules, setEditModules] = useState('');
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [savedOk, setSavedOk] = useState<string | null>(null);

    // Local override data (data manually entered by teacher)
    const [localOverrides, setLocalOverrides] = useState<Record<string, { xp: number; completedModules: number }>>({});

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const exportCSV = () => {
        const BOM = '\uFEFF'; // UTF-8 BOM for Excel Vietnamese support
        const header = 'STT,Tên học sinh,Username,Số module,Tổng điểm XP,Trạng thái dữ liệu';
        const rows = studentData.map((s, i) =>
            `${i + 1},"${s.name}",${s.username},${s.completedModules},${s.xp},${s.dataSource}`
        );
        const csv = BOM + [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
        a.href = url;
        a.download = `BaoCaoHocSinh_${date}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveFirebaseUrl = () => {
        const url = firebaseUrlInput.trim();
        if (!url) { setFbError('Vui lòng nhập Firebase URL'); return; }
        if (!url.startsWith('https://')) { setFbError('URL phải bắt đầu bằng https://'); return; }
        setFirebaseUrl(url);
        setFbError('');
        setFbSaved(true);
        setTimeout(async () => {
            setFbSaved(false);
            await onRefresh();
        }, 1500);
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
            const override = localOverrides[s.username];
            const mergeData = (fb: any, local: any) => {
                if (!fb && !local) return {};
                if (!fb) return local;
                if (!local) return fb;
                return Object.keys({ ...fb, ...local }).reduce((acc, k) => {
                    acc[k] = Math.max(fb[k] || 0, local[k] || 0);
                    return acc;
                }, {} as Record<string, number>);
            };
            const baseXP = Math.max(fb.xp || 0, local.xp || 0);
            const baseMods = Math.max(fb.completedModules || 0, local.completedModules || 0);
            return {
                name: s.name,
                username: s.username,
                xp: override ? override.xp : baseXP,
                completedModules: override ? override.completedModules : baseMods,
                progress: mergeData(fb.progress || {}, local.progress || {}),
                moduleProgress: mergeData(fb.moduleProgress || {}, local.moduleProgress || {}),
                lastActive: fb.lastActive || local.updatedAt || null,
                dataSource: override ? 'manual' : (fb.xp || fb.completedModules ? 'firebase' : local.xp || local.completedModules ? 'local' : 'none'),
            };
        }).sort((a, b) => b.xp - a.xp);
    }, [firebaseStudents, localOverrides]);

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

    const startEdit = (student: typeof studentData[0]) => {
        setEditingStudent(student.username);
        setEditXP(String(student.xp));
        setEditModules(String(student.completedModules));
    };

    const cancelEdit = () => {
        setEditingStudent(null);
        setEditXP('');
        setEditModules('');
    };

    const saveEdit = async (student: typeof studentData[0]) => {
        const xp = parseInt(editXP) || 0;
        const mods = parseInt(editModules) || 0;
        setIsSaving(student.username);

        // Save override locally
        setLocalOverrides(prev => ({ ...prev, [student.username]: { xp, completedModules: mods } }));

        // Push to Firebase if configured
        if (isFirebaseConfigured()) {
            const dataToSave = {
                name: student.name,
                username: student.username,
                xp,
                completedModules: mods,
                moduleProgress: student.moduleProgress || {},
                progress: student.progress || {},
                selectedUnitId: 'u1',
                lastUpdated: new Date().toISOString(),
                restoredByTeacher: true,
            };
            await saveStudentProgress(student.username, dataToSave);
        }

        setIsSaving(null);
        setSavedOk(student.username);
        setEditingStudent(null);
        setTimeout(() => setSavedOk(null), 2500);

        // Refresh leaderboard
        await onRefresh();
    };

    const pushAllToFirebase = async () => {
        if (!isFirebaseConfigured()) {
            alert('Vui lòng nhập Firebase URL trước!');
            return;
        }
        setIsRefreshing(true);
        let count = 0;
        for (const s of studentData) {
            if (s.xp > 0 || s.completedModules > 0) {
                await saveStudentProgress(s.username, {
                    name: s.name,
                    username: s.username,
                    xp: s.xp,
                    completedModules: s.completedModules,
                    moduleProgress: s.moduleProgress || {},
                    progress: s.progress || {},
                    selectedUnitId: 'u1',
                    lastUpdated: new Date().toISOString(),
                    restoredByTeacher: true,
                });
                count++;
            }
        }
        await onRefresh();
        setIsRefreshing(false);
        alert(`✅ Đã đẩy dữ liệu ${count} học sinh lên Firebase!`);
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-24">

            {/* ─── Firebase URL Setup Panel ─── */}
            <section className="p-6 rounded-2xl" style={{ background: isFirebaseConfigured() ? 'rgba(34,197,94,0.07)' : 'rgba(245,158,11,0.08)', border: `1px solid ${isFirebaseConfigured() ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.25)'}` }}>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isFirebaseConfigured() ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)' }}>
                            <Database size={20} style={{ color: isFirebaseConfigured() ? '#4ADE80' : '#FBBF24' }} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest" style={{ color: isFirebaseConfigured() ? '#4ADE80' : '#FBBF24' }}>
                                {isFirebaseConfigured() ? '✓ Firebase đã kết nối' : '⚠ Chưa có Firebase URL'}
                            </p>
                            <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>
                                {isFirebaseConfigured() ? getFirebaseUrl() : 'Nhập URL để đồng bộ dữ liệu học sinh'}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 flex gap-3 w-full">
                        <input
                            type="text"
                            value={firebaseUrlInput}
                            onChange={e => setFirebaseUrlInput(e.target.value)}
                            placeholder="https://ten-project-default-rtdb.firebaseio.com"
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-mono outline-none"
                            style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', color: '#CBD5E1' }}
                        />
                        <button
                            onClick={handleSaveFirebaseUrl}
                            className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                            style={{ background: fbSaved ? '#22C55E' : '#F59E0B', color: 'white', minWidth: 100 }}
                        >
                            {fbSaved ? <><CheckCircle size={14} /> Đã lưu</> : <><Save size={14} /> Lưu URL</>}
                        </button>
                    </div>
                </div>
                {fbError && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><AlertTriangle size={12} />{fbError}</p>}
                {!isFirebaseConfigured() && (
                    <p className="mt-3 text-[11px] font-medium" style={{ color: '#64748B' }}>
                        💡 Nhập URL Firebase rồi nhấn <strong>Lưu URL</strong>. Sau đó nhấn <strong>Đẩy tất cả lên Firebase</strong> để khôi phục dữ liệu.
                    </p>
                )}
            </section>

            {/* Header Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', icon: <Users size={20} />, value: classStats.totalStudents, accent: '#6366F1', sub: 'Class 11A1' },
                    { label: 'Active Learners', icon: <Zap size={20} />, value: classStats.activeStudents, accent: '#22C55E', sub: `${classStats.totalStudents - classStats.activeStudents} not started` },
                    { label: 'Class Avg XP', icon: <BarChart3 size={20} />, value: classStats.avgXP, accent: '#22D3EE', sub: 'XP Points' },
                    { label: 'Top Student', icon: <Trophy size={20} />, value: classStats.topStudent?.name.split(' ').slice(-1)[0] || '–', accent: '#F59E0B', sub: `${classStats.topStudent?.xp || 0} XP` },
                ].map((stat, i) => (
                    <div key={i} className="p-8 flex flex-col gap-5 relative overflow-hidden" style={cardStyle}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${stat.accent}18`, color: stat.accent }}>{stat.icon}</div>
                        <div>
                            <p className="text-3xl font-black italic tracking-tighter truncate" style={{ color: '#F8FAFC', fontFamily: 'Poppins, sans-serif' }}>{stat.value}</p>
                            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#94A3B8' }}>{stat.label}</p>
                            <p className="text-xs mt-1 font-medium" style={{ color: '#64748B' }}>{stat.sub}</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: stat.accent, opacity: 0.08, filter: 'blur(15px)' }}></div>
                    </div>
                ))}
            </section>

            {/* Filters + Actions */}
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
                <button onClick={pushAllToFirebase}
                    className="type-caption px-5 py-3 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)', whiteSpace: 'nowrap' }}>
                    <Upload size={14} />
                    Đẩy tất cả lên Firebase
                </button>
                <button onClick={exportCSV}
                    className="type-caption px-5 py-3 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all"
                    style={{ background: 'rgba(251,191,36,0.12)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.2)', whiteSpace: 'nowrap' }}>
                    <Download size={14} />
                    Tải CSV
                </button>
            </section>

            {/* Student Table */}
            <section className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Table Header */}
                <div className="text-xs grid grid-cols-12 px-8 py-5 font-black uppercase tracking-[0.2em]" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#CBD5E1' }}>
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-3">Student Profile</div>
                    <div className="col-span-2 text-center">Modules</div>
                    <div className="col-span-2 text-center">XP Points</div>
                    <div className="col-span-2 text-center">Sync Status</div>
                    <div className="col-span-2 text-center">Actions</div>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="py-20 text-center">
                        <p style={{ color: '#64748B' }}>No students found for "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredStudents.map((student, idx) => {
                        const isExpanded = expandedStudent === student.username;
                        const isEditing = editingStudent === student.username;
                        const isSavingThis = isSaving === student.username;
                        const wasSaved = savedOk === student.username;
                        const rank = studentData.findIndex(s => s.username === student.username) + 1;
                        const rankColor = rank === 1 ? '#FBBF24' : rank === 2 ? '#94A3B8' : rank === 3 ? '#FB923C' : '#334155';
                        const rankBg = rank <= 3 ? `${rankColor}20` : 'rgba(255,255,255,0.03)';

                        return (
                            <div key={student.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <div
                                    className="grid grid-cols-12 px-6 py-4 items-center transition-colors"
                                    style={{ background: isExpanded ? '#243044' : wasSaved ? 'rgba(34,197,94,0.05)' : 'transparent' }}
                                    onMouseEnter={e => { if (!isExpanded && !isEditing) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                                    onMouseLeave={e => { if (!isExpanded && !isEditing) e.currentTarget.style.background = wasSaved ? 'rgba(34,197,94,0.05)' : 'transparent'; }}
                                >
                                    {/* Rank */}
                                    <div className="col-span-1 flex justify-center">
                                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
                                            style={{ background: rankBg, color: rankColor }}>{rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}</span>
                                    </div>

                                    {/* Name */}
                                    <div className="col-span-3 flex items-center gap-3 cursor-pointer" onClick={() => !isEditing && setExpandedStudent(isExpanded ? null : student.username)}>
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
                                            style={{ background: student.xp > 0 ? 'linear-gradient(135deg, #6366F1, #3B82F6)' : '#334155' }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black italic tracking-tight" style={{ color: '#E2E8F0', fontFamily: 'Poppins, sans-serif' }}>{student.name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>{student.username}</p>
                                        </div>
                                    </div>

                                    {/* Modules */}
                                    <div className="col-span-2 flex justify-center">
                                        {isEditing ? (
                                            <input
                                                type="number" min="0" max="30"
                                                value={editModules}
                                                onChange={e => setEditModules(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                                className="w-16 text-center px-2 py-1 rounded-lg text-sm font-black outline-none"
                                                style={{ background: '#0F172A', border: '1px solid #6366F1', color: '#A5B4FC' }}
                                            />
                                        ) : (
                                            <span className="text-2xl font-black italic" style={{ color: student.completedModules > 0 ? '#A5B4FC' : '#475569' }}>
                                                {student.completedModules}
                                            </span>
                                        )}
                                    </div>

                                    {/* XP */}
                                    <div className="col-span-2 flex justify-center">
                                        {isEditing ? (
                                            <input
                                                type="number" min="0"
                                                value={editXP}
                                                onChange={e => setEditXP(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                                className="w-20 text-center px-2 py-1 rounded-lg text-sm font-black outline-none"
                                                style={{ background: '#0F172A', border: '1px solid #F59E0B', color: '#FCD34D' }}
                                            />
                                        ) : (
                                            <span className="text-2xl font-black italic" style={{ color: student.xp > 0 ? '#F8FAFC' : '#475569' }}>
                                                {student.xp}
                                            </span>
                                        )}
                                    </div>

                                    {/* Sync Status */}
                                    <div className="col-span-2 flex justify-center">
                                        {wasSaved ? (
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-1"
                                                style={{ background: 'rgba(34,197,94,0.15)', color: '#4ADE80' }}>
                                                <CheckCircle size={10} /> saved
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
                                                style={student.dataSource === 'firebase' ? { background: 'rgba(34,197,94,0.15)', color: '#4ADE80' }
                                                    : student.dataSource === 'local' ? { background: 'rgba(59,130,246,0.15)', color: '#93C5FD' }
                                                        : student.dataSource === 'manual' ? { background: 'rgba(245,158,11,0.15)', color: '#FCD34D' }
                                                            : { background: 'rgba(255,255,255,0.06)', color: '#64748B' }}>
                                                {student.dataSource}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex justify-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={e => { e.stopPropagation(); saveEdit(student); }}
                                                    disabled={isSavingThis}
                                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all"
                                                    style={{ background: '#22C55E', color: 'white' }}>
                                                    {isSavingThis ? '...' : <><Save size={11} /> Lưu</>}
                                                </button>
                                                <button
                                                    onClick={e => { e.stopPropagation(); cancelEdit(); }}
                                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all"
                                                    style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
                                                    <X size={11} /> Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={e => { e.stopPropagation(); startEdit(student); }}
                                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all"
                                                    style={{ background: 'rgba(99,102,241,0.12)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                    <Edit3 size={11} /> Sửa
                                                </button>
                                                <button
                                                    onClick={e => { e.stopPropagation(); setExpandedStudent(isExpanded ? null : student.username); }}
                                                    className="px-2 py-1.5 rounded-lg text-[11px] transition-all"
                                                    style={{ background: 'rgba(255,255,255,0.04)', color: '#64748B' }}>
                                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isExpanded && !isEditing && (
                                    <div className="px-6 pb-6 animate-fadeIn">
                                        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <p className="type-caption font-black uppercase tracking-[0.3em] mb-5" style={{ color: '#6366F1' }}>Progress by Skill</p>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {['vocabulary', 'grammar', 'reading', 'listening', 'challenge'].map(skill => {
                                                    const val = student.progress?.[skill] || 0;
                                                    const colors: Record<string, string> = { vocabulary: '#6366F1', grammar: '#3B82F6', reading: '#22D3EE', listening: '#8B5CF6', challenge: '#F59E0B' };
                                                    return (
                                                        <div key={skill} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                            <p className="type-caption font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#94A3B8' }}>{skill}</p>
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
