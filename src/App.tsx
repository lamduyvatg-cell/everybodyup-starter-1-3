/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { UnitExplorer } from './components/StudentModule/UnitExplorer';
import { QuizArena } from './components/StudentModule/QuizArena';
import { GradedExam } from './components/StudentModule/GradedExam';
import { PdfViewerModal } from './components/StudentModule/PdfViewerModal';
import { TeacherDashboard } from './components/TeacherModule/TeacherDashboard';
import {
  INITIAL_STUDENTS,
  INITIAL_SCORE_RECORDS,
} from './data/curriculumData';
import { StudentScoreRecord, StudentProfile, UnitId } from './types/curriculum';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [practiceUnit, setPracticeUnit] = useState<UnitId | 'all'>('unit1');
  const [pdfPageTarget, setPdfPageTarget] = useState<number>(1);

  // Load students from LocalStorage or initialize with mock data
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('kids_app_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Current selected student
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('kids_app_current_student');
      return saved || INITIAL_STUDENTS[0].id;
    } catch {
      return INITIAL_STUDENTS[0].id;
    }
  });

  // Load score records from LocalStorage or initialize with mock records
  const [scoreRecords, setScoreRecords] = useState<StudentScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kids_app_score_records');
      return saved ? JSON.parse(saved) : INITIAL_SCORE_RECORDS;
    } catch {
      return INITIAL_SCORE_RECORDS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kids_app_students', JSON.stringify(students));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('kids_app_current_student', currentStudentId);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [currentStudentId]);

  useEffect(() => {
    try {
      localStorage.setItem('kids_app_score_records', JSON.stringify(scoreRecords));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [scoreRecords]);

  const activeStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const handleStartPractice = (unitId: UnitId) => {
    setPracticeUnit(unitId);
    setActiveTab('practice');
  };

  const handleOpenPdf = (pageNumber: number) => {
    setPdfPageTarget(pageNumber);
    setActiveTab('pdf');
  };

  const handleSaveScoreRecord = (newRecord: StudentScoreRecord) => {
    setScoreRecords((prev) => [newRecord, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setScoreRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateNote = (id: string, newNote: string) => {
    setScoreRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, notes: newNote } : r))
    );
  };

  const handleAddStudent = (newStudent: StudentProfile) => {
    setStudents((prev) => [...prev, newStudent]);
    setCurrentStudentId(newStudent.id);
  };

  const handleDeleteStudent = (id: string) => {
    if (students.length <= 1) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (currentStudentId === id) {
      const remaining = students.filter((s) => s.id !== id);
      setCurrentStudentId(remaining[0].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 font-sans">
      {/* Top Bar adheres to Top Bar Contract */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeStudentName={activeStudent?.name || 'Bé An'}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'learn' && (
          <UnitExplorer
            onStartPractice={handleStartPractice}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {activeTab === 'practice' && (
          <QuizArena initialUnit={practiceUnit} />
        )}

        {activeTab === 'exam' && (
          <GradedExam
            students={students}
            currentStudentId={currentStudentId}
            onStudentChange={(id) => setCurrentStudentId(id)}
            onSaveScoreRecord={handleSaveScoreRecord}
            onViewTeacherGradebook={() => setActiveTab('teacher')}
          />
        )}

        {activeTab === 'pdf' && (
          <PdfViewerModal initialPage={pdfPageTarget} />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            records={scoreRecords}
            students={students}
            currentStudentId={currentStudentId}
            onSelectStudent={(id) => setCurrentStudentId(id)}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onDeleteRecord={handleDeleteRecord}
            onUpdateNote={handleUpdateNote}
            onGoToExam={() => setActiveTab('exam')}
          />
        )}
      </main>

      {/* Anti-Slop Compliant Footer */}
      <footer className="border-t border-amber-200/80 bg-white/80 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Bé Vui Học Tiếng Anh</span>
            <span aria-hidden="true">·</span>
            <span>Giáo trình Lớp Lá & Lớp 1 (Unit 1 - 3)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Chấm Điểm Tự Động</span>
            <span aria-hidden="true">·</span>
            <span>Âm Thanh Trực Quan</span>
            <span aria-hidden="true">·</span>
            <span>Báo Cáo Giáo Viên</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
