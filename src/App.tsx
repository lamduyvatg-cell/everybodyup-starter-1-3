/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { UnitExplorer } from './components/StudentModule/UnitExplorer';
import { QuizArena } from './components/StudentModule/QuizArena';
import { PdfViewerModal } from './components/StudentModule/PdfViewerModal';
import { UnitId } from './types/curriculum';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [practiceUnit, setPracticeUnit] = useState<UnitId | 'all'>('unit1');
  const [pdfPageTarget, setPdfPageTarget] = useState<number>(1);

  const handleStartPractice = (unitId: UnitId) => {
    setPracticeUnit(unitId);
    setActiveTab('practice');
  };

  const handleOpenPdf = (pageNumber: number) => {
    setPdfPageTarget(pageNumber);
    setActiveTab('pdf');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 font-sans">
      {/* Top Bar adheres to Top Bar Contract */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
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

        {activeTab === 'pdf' && (
          <PdfViewerModal initialPage={pdfPageTarget} />
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
            <span>Hình Ảnh Minh Họa Sinh Động</span>
            <span aria-hidden="true">·</span>
            <span>Phát Âm Tiếng Anh Chuẩn</span>
            <span aria-hidden="true">·</span>
            <span>Trò Chơi Tương Tác Vui Nhộn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
