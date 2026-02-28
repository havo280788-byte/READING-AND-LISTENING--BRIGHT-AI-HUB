import React, { useState, useEffect } from 'react';
import { Card } from './Components';
import { UserStats } from '../types';

// The list of students to fetch data for
const STUDENTS = [
    "Hoa Quang An", "Pham Quynh Anh", "Ha Thi Minh Anh", "Cao Nguyen Quynh Anh", "Tran Nguyet Anh",
    "Hoa Gia Binh", "Hoang Van Cong Chinh", "Nguyen Manh Cuong", "Tran Thi Dung", "Nguyen Thanh Dat",
    "Nguyen Phuc Dien", "Nguyen Trung Duc", "Nguyen Le Gia Han", "Nguyen Phuong Hien", "Nguyen Hoang Gia Huynh",
    "Duong Gia Hung", "Dinh Van Hung", "Le Dinh Khoi", "Nguyen Thi Ngoc Lan", "Huynh Dang Khanh Linh",
    "Pham Vu Thuy Linh", "Nguyen Bui Yen Linh", "Dang Hoang Long", "Nguyen Khanh Ly", "Tran Hoang Minh",
    "Tran Nu Nguyet Nga", "Tran Nhu Ngoc", "Le Thi Nhu Ngoc", "Tran Nu Bao Ngoc", "Tran Hoang Nguyen",
    "Nguyen Thao Nguyen", "Phan Duy Nguyen", "Nguyen Thi Thanh Nhan", "Bui Thien Nhan", "Nguyen Ngoc Uyen Nhi",
    "Vu Nguyen Tue Nhi", "Nguyen Hoang Tam Nhu", "Le Kim Phat", "Nguyen Ba Phi", "Dinh Xuan Hoang Phuc",
    "Ta Pham Minh Phuc", "Tran Huu Quang", "Nguyen Tien Sang", "Tran Minh Thong", "Vu Le Phuong Thuy",
    "Vo Bao Thuy", "Nguyen Anh Thu", "Le Trinh Anh Thu", "Pham Anh Thu", "Nguyen Thuy Tien",
    "Nguyen Phuong Uyen", "Vu Thi Ha Vy"
];

import { getAllStudentStats } from '../services/firebaseService';

interface StudentAggregatedInfo {
    name: string;
    speakingAvg: number | null;
    writingAvg: number | null;
    lessonsCompleted: number;
    lastPractice: string | null;
}

export const TeacherDashboard: React.FC = () => {
    const [aggregatedData, setAggregatedData] = useState<StudentAggregatedInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all cloud data
                const cloudRecords = await getAllStudentStats();
                const cloudMap = new Map(cloudRecords.map(r => [r.name, r.stats]));

                // Merge with predefined STUDENT list to ensure all names are present
                const data = STUDENTS.map(name => {
                    const stats = cloudMap.get(name);

                    if (stats) {
                        const speakingAvg = stats.speakingScore.length > 0
                            ? stats.speakingScore.reduce((a, b) => a + b, 0) / stats.speakingScore.length
                            : null;
                        const writingAvg = stats.writingScore.length > 0
                            ? stats.writingScore.reduce((a, b) => a + b, 0) / stats.writingScore.length
                            : null;

                        return {
                            name,
                            speakingAvg,
                            writingAvg,
                            lessonsCompleted: stats.lessonsCompleted,
                            lastPractice: stats.lastPractice
                        };
                    }

                    // Fallback for students with no cloud data
                    return {
                        name,
                        speakingAvg: null,
                        writingAvg: null,
                        lessonsCompleted: 0,
                        lastPractice: null
                    };
                }).sort((a, b) => b.lessonsCompleted - a.lessonsCompleted);

                setAggregatedData(data);
            } catch (error) {
                console.error("Failed to fetch teacher data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const activeStudents = aggregatedData.filter(s => s.lessonsCompleted > 0);
    const inactiveStudents = aggregatedData.filter(s => s.lessonsCompleted === 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-4">
                    <i className="fas fa-spinner fa-spin text-3xl"></i>
                </div>
                <p className="text-slate-400 font-bold text-lg tracking-wide uppercase">Syncing class data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Class Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white !border-0 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-blue-100 font-medium text-lg">Total Students</span>
                        <span className="text-5xl font-extrabold mt-2">{STUDENTS.length}</span>
                        <span className="text-blue-100 text-sm mt-1">Registered in system</span>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white !border-0 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-green-100 font-medium text-lg">Active Students</span>
                        <span className="text-5xl font-extrabold mt-2">{activeStudents.length}</span>
                        <span className="text-green-100 text-sm mt-1">Practiced at least once</span>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white !border-0 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl">
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-purple-100 font-medium text-lg">Total Lessons</span>
                        <span className="text-5xl font-extrabold mt-2">
                            {aggregatedData.reduce((acc, curr) => acc + curr.lessonsCompleted, 0)}
                        </span>
                        <span className="text-purple-100 text-sm mt-1">Completed across class</span>
                    </div>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card title="Student Performance Overview" className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar -mx-8 -mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Lessons</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Avg Speaking</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Avg Writing</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeStudents.map((student, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-blue-400 font-bold border border-white/10">
                                            {student.lessonsCompleted}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`font-bold text-lg ${student.speakingAvg && student.speakingAvg >= 7 ? 'text-green-400' : 'text-slate-300'}`}>
                                            {student.speakingAvg ? student.speakingAvg.toFixed(1) : '-'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`font-bold text-lg ${student.writingAvg && student.writingAvg >= 7 ? 'text-green-400' : 'text-slate-300'}`}>
                                            {student.writingAvg ? student.writingAvg.toFixed(1) : '-'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-400 text-sm font-medium">
                                        {student.lastPractice ? new Date(student.lastPractice).toLocaleDateString() : 'Never'}
                                    </td>
                                </tr>
                            ))}
                            {inactiveStudents.length > 0 && (
                                <tr className="bg-white/5">
                                    <td colSpan={5} className="px-8 py-4 text-sm font-bold text-slate-500 uppercase tracking-widest text-center">
                                        Students with no data yet ({inactiveStudents.length})
                                    </td>
                                </tr>
                            )}
                            {inactiveStudents.map((student, idx) => (
                                <tr key={`inactive-${idx}`} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs border border-white/10">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-white/90">{student.name}</span>
                                        </div>
                                    </td>
                                    <td colSpan={4} className="px-8 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                                        <i className="fas fa-clock-rotate-left mr-2 opacity-50"></i>
                                        Pending First Session
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
