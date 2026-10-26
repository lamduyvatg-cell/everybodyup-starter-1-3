import React from 'react';

export type ActiveTab = 'learn' | 'practice' | 'exam' | 'pdf' | 'teacher';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeStudentName: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  activeStudentName,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-40 shadow-xs">
      {/* Zone 1: Brand wordmark (single text element) */}
      <a
        href="#learn"
        onClick={(e) => {
          e.preventDefault();
          onTabChange('learn');
        }}
        className="text-lg font-bold tracking-tight text-amber-950 font-['Outfit'] whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-sm shadow-xs font-black">
          ★
        </span>
        <span>KidsEnglish123</span>
      </a>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
        <button
          onClick={() => onTabChange('learn')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeTab === 'learn'
              ? 'text-orange-600 border-orange-500'
              : 'text-slate-600 hover:text-orange-600 border-transparent'
          }`}
        >
          Ôn Tập Unit
        </button>

        <button
          onClick={() => onTabChange('practice')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeTab === 'practice'
              ? 'text-orange-600 border-orange-500'
              : 'text-slate-600 hover:text-orange-600 border-transparent'
          }`}
        >
          Luyện Tập Vui
        </button>

        <button
          onClick={() => onTabChange('exam')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeTab === 'exam'
              ? 'text-orange-600 border-orange-500'
              : 'text-slate-600 hover:text-orange-600 border-transparent'
          }`}
        >
          Kiểm Tra Điểm 10
        </button>

        <button
          onClick={() => onTabChange('pdf')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeTab === 'pdf'
              ? 'text-orange-600 border-orange-500'
              : 'text-slate-600 hover:text-orange-600 border-transparent'
          }`}
        >
          Sách Gốc PDF
        </button>

        <button
          onClick={() => onTabChange('teacher')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
            activeTab === 'teacher'
              ? 'text-indigo-600 border-indigo-600 font-bold'
              : 'text-slate-600 hover:text-indigo-600 border-transparent'
          }`}
        >
          Sổ Điểm Giáo Viên
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onTabChange(activeTab === 'teacher' ? 'exam' : 'teacher')}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 active:scale-95"
        >
          {activeTab === 'teacher' ? 'Chế Độ Học Sinh' : `Bé: ${activeStudentName || 'Bé An'}`}
        </button>
      </div>
    </header>
  );
};
