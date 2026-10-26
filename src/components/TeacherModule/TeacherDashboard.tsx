import React, { useState } from 'react';
import { StudentScoreRecord, StudentProfile } from '../../types/curriculum';
import { GradebookTable } from './GradebookTable';
import { ClassAnalytics } from './ClassAnalytics';
import { StudentManagement } from './StudentManagement';
import { ReportCardModal } from './ReportCardModal';
import { BarChart3, Users, ClipboardCheck, Sparkles } from 'lucide-react';
import { playSoundEffect } from '../../utils/audio';

interface TeacherDashboardProps {
  records: StudentScoreRecord[];
  students: StudentProfile[];
  currentStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddStudent: (newStudent: StudentProfile) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateNote: (id: string, newNote: string) => void;
  onGoToExam: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  records,
  students,
  currentStudentId,
  onSelectStudent,
  onAddStudent,
  onDeleteStudent,
  onDeleteRecord,
  onUpdateNote,
  onGoToExam,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'gradebook' | 'analytics' | 'roster'>('gradebook');
  const [selectedReportCardRecord, setSelectedReportCardRecord] = useState<StudentScoreRecord | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
            <span>Hệ Thống Quản Lý Giáo Viên</span>
            <span aria-hidden="true">·</span>
            <span>Chấm Điểm Tự Động 100%</span>
            <span aria-hidden="true">·</span>
            <span>Xuất Báo Cáo Excel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
            Sổ Điểm & Quản Lý Kết Quả Học Tập (Lớp Lá & Lớp 1)
          </h1>
          <p className="text-indigo-200/90 text-sm max-w-2xl leading-relaxed">
            Theo dõi tự động tiến độ học tập, tỉ lệ làm đúng theo từng Unit 1-3, phát hiện các từ học
            sinh hay nhầm lẫn và in phiếu khen thưởng cho phụ huynh.
          </p>
        </div>

        <button
          onClick={onGoToExam}
          className="px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Cho Học Sinh Làm Bài Ngay</span>
        </button>
      </div>

      {/* Sub Navigation Segmented Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs w-fit">
        <button
          onClick={() => {
            setActiveSubTab('gradebook');
            playSoundEffect('click');
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'gradebook'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Bảng Điểm Bài Thi ({records.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('analytics');
            playSoundEffect('click');
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Phân Tích Kỹ Năng & Lỗi Sai</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('roster');
            playSoundEffect('click');
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'roster'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh Sách Học Sinh ({students.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'gradebook' && (
        <GradebookTable
          records={records}
          onDeleteRecord={onDeleteRecord}
          onUpdateNote={onUpdateNote}
          onViewReportCard={(rec) => setSelectedReportCardRecord(rec)}
        />
      )}

      {activeSubTab === 'analytics' && <ClassAnalytics records={records} />}

      {activeSubTab === 'roster' && (
        <StudentManagement
          students={students}
          onAddStudent={onAddStudent}
          onDeleteStudent={onDeleteStudent}
          currentStudentId={currentStudentId}
          onSelectStudent={onSelectStudent}
        />
      )}

      {/* Report Card Certificate Modal */}
      <ReportCardModal
        record={selectedReportCardRecord}
        onClose={() => setSelectedReportCardRecord(null)}
      />
    </div>
  );
};
