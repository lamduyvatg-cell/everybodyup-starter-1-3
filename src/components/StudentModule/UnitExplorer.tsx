import React, { useState } from 'react';
import { UnitId, VocabItem, PhonicsItem } from '../../types/curriculum';
import { UNITS, VOCABULARY_LIST, PHONICS_LIST, CONVERSATIONS } from '../../data/curriculumData';
import { IllustrationIcon } from '../IllustrationIcon';
import { speakEnglish, speakVietnamese, playSoundEffect } from '../../utils/audio';
import { Volume2, Sparkles, BookOpen, MessageCircle } from 'lucide-react';

interface UnitExplorerProps {
  onStartPractice: (unitId: UnitId) => void;
  onOpenPdf: (pageNumber: number) => void;
}

export const UnitExplorer: React.FC<UnitExplorerProps> = ({ onStartPractice, onOpenPdf }) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitId>('unit1');
  const [activeCategory, setActiveCategory] = useState<'all' | 'vocab' | 'phonics' | 'story'>('all');
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  const currentUnitInfo = UNITS.find((u) => u.id === selectedUnit) || UNITS[0];

  const vocabFiltered = VOCABULARY_LIST.filter(
    (item) => item.unit === selectedUnit
  );

  const phonicsFiltered = PHONICS_LIST.filter(
    (item) => item.unit === selectedUnit
  );

  const storiesFiltered = CONVERSATIONS.filter(
    (item) => item.unit === selectedUnit
  );

  const handleSpeak = (text: string, isEnglish: boolean = true) => {
    playSoundEffect('pop');
    if (isEnglish) {
      speakEnglish(text, speechRate);
    } else {
      speakVietnamese(text);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Unit Selector Tabs */}
      <div className="bg-white rounded-3xl p-3 shadow-xs border border-amber-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {UNITS.map((unit) => {
            const isSelected = selectedUnit === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit.id);
                  playSoundEffect('click');
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-gradient-to-r ' + unit.colorTheme + ' text-white shadow-md scale-[1.01]'
                    : 'bg-amber-50/50 hover:bg-amber-100/60 text-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-amber-700 shadow-xs'
                  }`}
                >
                  {unit.id.replace('unit', '')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-amber-800/80'}`}>
                    {unit.badge}
                  </div>
                  <div className="font-bold text-base truncate font-['Outfit']">
                    {unit.titleEn}
                  </div>
                  <div className={`text-xs truncate ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                    {unit.titleVi}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit Banner & Controls */}
      <div className="bg-gradient-to-r from-amber-100/80 via-orange-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <span>Sách Tiếng Anh Lớp Lá & Lớp 1</span>
            <span aria-hidden="true">·</span>
            <span>{currentUnitInfo.pageRange}</span>
            <span aria-hidden="true">·</span>
            <span>Phát âm chuẩn bản xứ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            {currentUnitInfo.titleEn} - {currentUnitInfo.titleVi}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {currentUnitInfo.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenPdf(currentUnitInfo.pdfPage)}
            className="px-4 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>Mở Xem Trang Sách Gốc</span>
          </button>

          <button
            onClick={() => onStartPractice(selectedUnit)}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Luyện Tập Bài Tập Unit Này</span>
          </button>
        </div>
      </div>

      {/* Sub-Category Filter Controls (Segmented Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 bg-amber-100/60 rounded-2xl border border-amber-200/60">
          <button
            onClick={() => {
              setActiveCategory('all');
              playSoundEffect('click');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800/80 hover:text-amber-950'
            }`}
          >
            Tất Cả ({vocabFiltered.length + phonicsFiltered.length + storiesFiltered.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('vocab');
              playSoundEffect('click');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeCategory === 'vocab'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800/80 hover:text-amber-950'
            }`}
          >
            Từ Vựng Minh Họa ({vocabFiltered.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('phonics');
              playSoundEffect('click');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeCategory === 'phonics'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800/80 hover:text-amber-950'
            }`}
          >
            Chữ Cái & Phonics ({phonicsFiltered.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('story');
              playSoundEffect('click');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeCategory === 'story'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800/80 hover:text-amber-950'
            }`}
          >
            Hội Thoại & Bài Học ({storiesFiltered.length})
          </button>
        </div>

        {/* Speed Adjustment Control */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span>Tốc độ đọc giọng nói:</span>
          <button
            onClick={() => setSpeechRate(0.7)}
            className={`px-2 py-0.5 rounded cursor-pointer ${speechRate === 0.7 ? 'bg-amber-100 font-bold text-amber-900' : 'text-slate-500'}`}
          >
            Chậm (Bé 5t)
          </button>
          <span>|</span>
          <button
            onClick={() => setSpeechRate(0.85)}
            className={`px-2 py-0.5 rounded cursor-pointer ${speechRate === 0.85 ? 'bg-amber-100 font-bold text-amber-900' : 'text-slate-500'}`}
          >
            Vừa (Lớp 1)
          </button>
        </div>
      </div>

      {/* Grid of Vocabulary Flashcards */}
      {(activeCategory === 'all' || activeCategory === 'vocab') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Từ Vựng Sinh Động (Bấm loa để bé nghe phát âm chuẩn)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Chạm vào tranh để nghe từ và mẫu câu
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {vocabFiltered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSpeak(item.word)}
                className="group relative bg-white rounded-3xl p-5 border border-amber-200/70 hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col items-center text-center overflow-hidden"
              >
                {/* Illustration Frame */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center p-2 rounded-2xl bg-amber-50/60 group-hover:bg-orange-50/70 transition-colors">
                  <IllustrationIcon name={item.iconKey} size={84} />
                </div>

                <div className="mt-3 w-full">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-lg font-extrabold text-slate-900 capitalize font-['Outfit']">
                      {item.word}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(item.word);
                      }}
                      className="p-1 rounded-full text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-amber-800/90 mt-0.5">
                    {item.vietnamese}
                  </div>
                </div>

                {/* Example sentence */}
                <div className="mt-3 pt-3 border-t border-slate-100 w-full text-left bg-slate-50/70 -mx-5 -mb-5 p-3 rounded-b-3xl">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(item.sentenceExample);
                    }}
                    className="flex items-center justify-between text-xs font-bold text-orange-700 hover:text-orange-900 cursor-pointer"
                  >
                    <span>{item.sentenceExample}</span>
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.sentenceVietnamese}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid of Phonics Flashcards */}
      {(activeCategory === 'all' || activeCategory === 'phonics') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Chữ Cái & Âm Phonics (Nhận diện chữ cái & tập đọc)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Chữ hoa, chữ thường và từ ví dụ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {phonicsFiltered.map((p) => (
              <div
                key={p.letter}
                onClick={() => handleSpeak(`${p.letter}, ${p.word}`)}
                className="bg-white rounded-3xl p-5 border border-sky-200/80 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-sky-600 font-['Outfit']">
                    {p.letter}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {p.sound}
                  </span>
                </div>

                <div className="w-24 h-24 flex items-center justify-center p-2 rounded-2xl bg-sky-50/70 my-1">
                  <IllustrationIcon name={p.iconKey} size={70} />
                </div>

                <div className="mt-2">
                  <div className="text-base font-bold text-slate-900 capitalize">
                    {p.word}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {p.vietnamese}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(`${p.letter}. ${p.word}`);
                  }}
                  className="mt-3 px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-xl hover:bg-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe âm: {p.letter}</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stories & Conversations */}
      {(activeCategory === 'all' || activeCategory === 'story') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Hội Thoại & Giá Trị Đạo Đức (Values: Lễ phép & Thân thiện)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storiesFiltered.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-base text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <span>{story.title}</span>
                  </div>
                  <button
                    onClick={() => {
                      const allText = story.dialogue.map((d) => `${d.speaker} says: ${d.text}`).join('. ');
                      handleSpeak(allText);
                    }}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Đọc Toàn Bài</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {story.dialogue.map((line, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSpeak(line.text)}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                        <span>{line.speaker}: "{line.text}"</span>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        👉 {line.vietnamese}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-900 font-semibold flex items-center gap-2">
                  <span className="font-bold text-orange-600">🌟 Bài học đạo đức (Value):</span>
                  <span>{story.moralValue}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
