import React from 'react';

export type ActiveTab = 'learn' | 'practice' | 'pdf';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
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

      {/* Zone 2: Clean single-line nav links */}
      <nav className="flex items-center gap-6 sm:gap-8 text-sm font-semibold text-slate-600">
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
          Trò Chơi Vui
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
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onTabChange(activeTab === 'practice' ? 'learn' : 'practice')}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
        >
          {activeTab === 'practice' ? 'Xem Bài Học' : 'Cùng Chơi Nào!'}
        </button>
      </div>
    </header>
  );
};
