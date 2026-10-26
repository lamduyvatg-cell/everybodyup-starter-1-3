import React, { useState, useEffect } from 'react';
import { UnitId, VocabItem, PhonicsItem } from '../../types/curriculum';
import { UNITS, VOCABULARY_LIST, PHONICS_LIST, CONVERSATIONS } from '../../data/curriculumData';
import { IllustrationIcon } from '../IllustrationIcon';
import {
  speakEnglish,
  speakVietnamese,
  playSoundEffect,
  playPhonicsSequence,
  stopPhonicsSequence,
} from '../../utils/audio';
import {
  Volume2,
  Sparkles,
  BookOpen,
  MessageCircle,
  Play,
  Pause,
  Check,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UnitExplorerProps {
  onStartPractice: (unitId: UnitId) => void;
  onOpenPdf: (pageNumber: number) => void;
}

export const UnitExplorer: React.FC<UnitExplorerProps> = ({ onStartPractice, onOpenPdf }) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitId>('unit1');
  const [activeCategory, setActiveCategory] = useState<'all' | 'vocab' | 'phonics' | 'story'>('all');
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [activePhonicsLetter, setActivePhonicsLetter] = useState<string | null>(null);
  const [activePhonicsStep, setActivePhonicsStep] = useState<0 | 1 | 2 | 3>(0);

  // Visual Progress Tracking State
  const [completedUnits, setCompletedUnits] = useState<Record<UnitId, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kids_completed_units');
      return saved ? JSON.parse(saved) : { unit1: false, unit2: false, unit3: false };
    } catch {
      return { unit1: false, unit2: false, unit3: false };
    }
  });

  const [exploredItems, setExploredItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kids_explored_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync progress to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kids_completed_units', JSON.stringify(completedUnits));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [completedUnits]);

  useEffect(() => {
    try {
      localStorage.setItem('kids_explored_items', JSON.stringify(exploredItems));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [exploredItems]);

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

  // Helper to calculate progress for any unit
  const getUnitProgress = (unitId: UnitId) => {
    const unitVocab = VOCABULARY_LIST.filter((v) => v.unit === unitId);
    const unitPhonics = PHONICS_LIST.filter((p) => p.unit === unitId);
    const totalCount = unitVocab.length + unitPhonics.length;
    const exploredInUnit = [...unitVocab.map((v) => v.id), ...unitPhonics.map((p) => p.letter)].filter(
      (id) => exploredItems.includes(id)
    ).length;

    const isMarkedCompleted = !!completedUnits[unitId];
    const isCompleted = isMarkedCompleted || (totalCount > 0 && exploredInUnit >= totalCount);

    return {
      totalCount,
      exploredInUnit,
      isCompleted,
      percent: Math.min(100, Math.round((exploredInUnit / totalCount) * 100)),
    };
  };

  const markItemAsExplored = (itemId: string, unitId: UnitId) => {
    if (!exploredItems.includes(itemId)) {
      const nextExplored = [...exploredItems, itemId];
      setExploredItems(nextExplored);

      // Check if this makes the unit 100% complete
      const unitVocab = VOCABULARY_LIST.filter((v) => v.unit === unitId);
      const unitPhonics = PHONICS_LIST.filter((p) => p.unit === unitId);
      const allUnitIds = [...unitVocab.map((v) => v.id), ...unitPhonics.map((p) => p.letter)];
      const isAllDone = allUnitIds.every((id) => nextExplored.includes(id));

      if (isAllDone && !completedUnits[unitId]) {
        setCompletedUnits((prev) => ({ ...prev, [unitId]: true }));
        playSoundEffect('fanfare');
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {
          // fallback
        }
      }
    }
  };

  const toggleUnitCompletion = (unitId: UnitId) => {
    const willBeCompleted = !completedUnits[unitId];
    setCompletedUnits((prev) => ({
      ...prev,
      [unitId]: willBeCompleted,
    }));

    if (willBeCompleted) {
      playSoundEffect('fanfare');
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch {
        // fallback
      }
    } else {
      playSoundEffect('pop');
    }
  };

  const handleSpeak = (vocabItem: VocabItem, isEnglish: boolean = true) => {
    playSoundEffect('pop');
    markItemAsExplored(vocabItem.id, vocabItem.unit);
    if (isEnglish) {
      speakEnglish(vocabItem.word, speechRate);
    } else {
      speakVietnamese(vocabItem.vietnamese);
    }
  };

  const handlePlayPhonics = async (p: PhonicsItem) => {
    if (activePhonicsLetter === p.letter && activePhonicsStep > 0) {
      // Toggle stop
      stopPhonicsSequence();
      setActivePhonicsLetter(null);
      setActivePhonicsStep(0);
      return;
    }

    playSoundEffect('pop');
    markItemAsExplored(p.letter, p.unit);
    setActivePhonicsLetter(p.letter);
    await playPhonicsSequence(p, (step) => {
      setActivePhonicsStep(step);
      if (step === 0) {
        setActivePhonicsLetter(null);
      }
    });
  };

  const currentUnitProgress = getUnitProgress(selectedUnit);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Unit Selector Tabs with Small Badge Icons showing completion */}
      <div className="bg-white rounded-3xl p-3 shadow-xs border border-amber-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {UNITS.map((unit) => {
            const isSelected = selectedUnit === unit.id;
            const progress = getUnitProgress(unit.id);

            return (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit.id);
                  playSoundEffect('click');
                }}
                className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer text-left overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r ' + unit.colorTheme + ' text-white shadow-md scale-[1.01]'
                    : 'bg-amber-50/50 hover:bg-amber-100/60 text-slate-700'
                }`}
              >
                {/* Unit Icon Number */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-amber-700 shadow-xs'
                  }`}
                >
                  {unit.id.replace('unit', '')}
                </div>

                {/* Text & Small Badge Indicator */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isSelected ? 'text-white/80' : 'text-amber-800/80'
                      }`}
                    >
                      {unit.badge}
                    </span>

                    {/* Small Badge Icon showing if student has completed unit */}
                    {progress.isCompleted ? (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-lg border shadow-2xs shrink-0 ${
                          isSelected
                            ? 'bg-white text-emerald-800 border-white/60'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title="Học sinh đã hoàn thành Unit này"
                      >
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>Đã Hoàn Thành</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100/80 text-amber-900 border border-amber-200'
                        }`}
                        title="Tiến độ khám phá"
                      >
                        <span>
                          {progress.exploredInUnit}/{progress.totalCount} mục
                        </span>
                      </span>
                    )}
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

      {/* Unit Banner & Controls with Progress Bar and Completion Toggle */}
      <div className="bg-gradient-to-r from-amber-100/80 via-orange-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <span>Sách Tiếng Anh Lớp Lá & Lớp 1</span>
            <span aria-hidden="true">·</span>
            <span>{currentUnitInfo.pageRange}</span>
            <span aria-hidden="true">·</span>
            <span>Phát âm chuẩn bản xứ</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              {currentUnitInfo.titleEn} - {currentUnitInfo.titleVi}
            </h1>

            {/* Banner Unit Completion Badge */}
            {currentUnitProgress.isCompleted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bé Đã Hoàn Thành Unit Này!</span>
              </span>
            )}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            {currentUnitInfo.description}
          </p>

          {/* Visual Progress Bar */}
          <div className="pt-3 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                {currentUnitProgress.isCompleted ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Đã hoàn thành 100% bài học
                  </span>
                ) : (
                  <span className="text-amber-900">Tiến độ khám phá bài học:</span>
                )}
              </span>
              <span className="font-mono text-xs text-slate-600 tabular-nums font-semibold">
                {currentUnitProgress.exploredInUnit} / {currentUnitProgress.totalCount} mục ({currentUnitProgress.percent}%)
              </span>
            </div>

            <div className="w-full bg-amber-200/60 rounded-full h-2.5 overflow-hidden border border-amber-300/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  currentUnitProgress.isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-400 to-orange-500'
                }`}
                style={{
                  width: `${currentUnitProgress.isCompleted ? 100 : Math.max(8, currentUnitProgress.percent)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Manual Completion Checkmark Button */}
          <button
            onClick={() => toggleUnitCompletion(selectedUnit)}
            className={`px-4 py-2.5 font-bold text-xs rounded-2xl border transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
              currentUnitProgress.isCompleted
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-100/60'
            }`}
            title="Bấm để đánh dấu hoàn thành bài học"
          >
            <Check
              className={`w-4 h-4 ${
                currentUnitProgress.isCompleted ? 'text-emerald-600 stroke-[3]' : 'text-slate-400'
              }`}
            />
            <span>
              {currentUnitProgress.isCompleted ? 'Đã Hoàn Thành Unit ✓' : 'Đánh Dấu Đã Học Xong'}
            </span>
          </button>

          <button
            onClick={() => onOpenPdf(currentUnitInfo.pdfPage)}
            className="px-4 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>Xem Trang Sách Gốc</span>
          </button>

          <button
            onClick={() => onStartPractice(selectedUnit)}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Luyện Tập Bài Này</span>
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
            className={`px-2 py-0.5 rounded cursor-pointer ${
              speechRate === 0.7 ? 'bg-amber-100 font-bold text-amber-900' : 'text-slate-500'
            }`}
          >
            Chậm (Bé 5t)
          </button>
          <span>|</span>
          <button
            onClick={() => setSpeechRate(0.85)}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              speechRate === 0.85 ? 'bg-amber-100 font-bold text-amber-900' : 'text-slate-500'
            }`}
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
              <span>Từ Vựng Sinh Động (Chạm vào thẻ để nghe phát âm & tích lũy tiến độ)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Chạm vào tranh để nghe từ và mẫu câu
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {vocabFiltered.map((item) => {
              const isExplored = exploredItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSpeak(item)}
                  className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col items-center text-center overflow-hidden ${
                    isExplored
                      ? 'border-emerald-300 ring-1 ring-emerald-200/60 shadow-xs'
                      : 'border-amber-200/70 hover:border-orange-400 hover:shadow-lg'
                  }`}
                >
                  {/* Small Badge Icon for explored item */}
                  {isExplored && (
                    <span
                      className="absolute top-3 right-3 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md"
                      title="Bé đã học từ này"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                      <span>Đã học</span>
                    </span>
                  )}

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
                          handleSpeak(item);
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
                        playSoundEffect('pop');
                        markItemAsExplored(item.id, item.unit);
                        speakEnglish(item.sentenceExample, speechRate);
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
              );
            })}
          </div>
        </section>
      )}

      {/* Grid of Phonics Flashcards */}
      {(activeCategory === 'all' || activeCategory === 'phonics') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Chữ Cái & Âm Phonics (Nhận diện chữ cái & tập đọc 3 bước)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              A /eɪ/ (1s) → a /æ/ (1s) → apple
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {phonicsFiltered.map((p) => {
              const isPlayingThis = activePhonicsLetter === p.letter;
              const currentStep = isPlayingThis ? activePhonicsStep : 0;
              const isExplored = exploredItems.includes(p.letter);

              return (
                <div
                  key={p.letter}
                  className={`bg-white rounded-3xl p-5 border transition-all flex flex-col items-center text-center relative ${
                    isPlayingThis
                      ? 'border-sky-400 ring-2 ring-sky-200 shadow-md'
                      : isExplored
                      ? 'border-emerald-300 ring-1 ring-emerald-200/60 shadow-xs'
                      : 'border-sky-200/80 hover:border-sky-300 hover:shadow-md'
                  }`}
                >
                  {/* Explored Badge Icon */}
                  {isExplored && (
                    <span
                      className="absolute top-3 right-3 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md"
                      title="Bé đã luyện âm này"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                      <span>Đã học</span>
                    </span>
                  )}

                  {/* Top Bar with Big Letter & Sound Indicator */}
                  <div className="w-full flex items-center justify-between mb-2 pr-14">
                    <span className="text-3xl font-black text-sky-600 font-['Outfit']">
                      {p.letter}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
                      Tên: <b className="text-sky-700">{p.letterNameIpa}</b> · Âm:{' '}
                      <b className="text-orange-600">{p.sound}</b>
                    </span>
                  </div>

                  {/* Central Illustration */}
                  <div className="w-28 h-28 flex items-center justify-center p-2 rounded-2xl bg-sky-50/70 my-2">
                    <IllustrationIcon name={p.iconKey} size={76} />
                  </div>

                  <div className="mt-1">
                    <div className="text-lg font-black text-slate-900 capitalize font-['Outfit']">
                      {p.word}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">{p.vietnamese}</div>
                  </div>

                  {/* 3-Step Sequence Visual Flow with real-time Step Highlight */}
                  <div className="w-full mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Tiến trình phát âm 3 bước:</span>
                      {isPlayingThis && (
                        <span className="text-sky-600 font-mono animate-pulse font-extrabold">
                          Bước {currentStep}/3{' '}
                          {currentStep === 1
                            ? '(Tên chữ)'
                            : currentStep === 2
                            ? '(Âm chữ)'
                            : '(Từ)'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 items-center">
                      {/* Step 1: Letter Name */}
                      <button
                        onClick={() => {
                          playSoundEffect('pop');
                          markItemAsExplored(p.letter, p.unit);
                          speakEnglish(p.letterPronounceText, 0.7);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center border cursor-pointer ${
                          currentStep === 1
                            ? 'bg-sky-500 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
                        }`}
                        title="Nghe tên chữ cái"
                      >
                        <span className="text-sm font-['Outfit']">{p.upperLetter}</span>
                        <span className="text-[10px] font-normal opacity-90">{p.letterNameIpa}</span>
                      </button>

                      {/* Step 2: Letter Sound */}
                      <button
                        onClick={() => {
                          playSoundEffect('pop');
                          markItemAsExplored(p.letter, p.unit);
                          speakEnglish(p.soundPronounceText, 0.65);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center border cursor-pointer ${
                          currentStep === 2
                            ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                        }`}
                        title="Nghe âm phonics"
                      >
                        <span className="text-sm font-['Outfit']">{p.lowerLetter}</span>
                        <span className="text-[10px] font-normal opacity-90">{p.sound}</span>
                      </button>

                      {/* Step 3: Example Word */}
                      <button
                        onClick={() => {
                          playSoundEffect('pop');
                          markItemAsExplored(p.letter, p.unit);
                          speakEnglish(p.wordPronounceText || p.word, 0.72);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center border cursor-pointer ${
                          currentStep === 3
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300 scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                        title="Nghe từ ví dụ"
                      >
                        <span className="text-xs truncate font-['Outfit'] capitalize">{p.word}</span>
                        <span className="text-[10px] font-normal opacity-90">Từ ví dụ</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center font-medium">
                      {p.upperLetter} ({p.letterNameIpa}) → nghỉ 1s → {p.lowerLetter} ({p.sound}) → nghỉ 1s →{' '}
                      {p.word}
                    </div>
                  </div>

                  {/* Primary 3-Step Playback Action Button */}
                  <button
                    onClick={() => handlePlayPhonics(p)}
                    className={`mt-4 w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isPlayingThis
                        ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-300'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-4 h-4 animate-pulse" />
                        <span>Đang đọc 3 bước... (Bấm để dừng)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>
                          Nghe chuẩn 3 bước: {p.upperLetter} → {p.lowerLetter} → {p.word}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
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
                      const allText = story.dialogue
                        .map((d) => `${d.speaker} says: ${d.text}`)
                        .join('. ');
                      playSoundEffect('pop');
                      speakEnglish(allText, speechRate);
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
                      onClick={() => {
                        playSoundEffect('pop');
                        speakEnglish(line.text, speechRate);
                      }}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                        <span>
                          {line.speaker}: "{line.text}"
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">👉 {line.vietnamese}</div>
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
