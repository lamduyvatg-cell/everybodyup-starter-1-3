import React, { useState, useEffect } from 'react';
import { UnitId, QuizQuestion } from '../../types/curriculum';
import { QUESTION_BANK, UNITS } from '../../data/curriculumData';
import { IllustrationIcon } from '../IllustrationIcon';
import { playSoundEffect, speakEnglish, speakVietnamese } from '../../utils/audio';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizArenaProps {
  initialUnit?: UnitId | 'all';
}

export const QuizArena: React.FC<QuizArenaProps> = ({ initialUnit = 'unit1' }) => {
  const [selectedUnit, setSelectedUnit] = useState<UnitId | 'all'>(initialUnit);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [starCount, setStarCount] = useState<number>(0);

  // Filter questions based on selected unit
  const questions: QuizQuestion[] = QUESTION_BANK.filter((q) => {
    if (selectedUnit === 'all') return true;
    return q.unit === selectedUnit;
  });

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
  }, [selectedUnit]);

  // When question loads, auto-read English prompt if it's a listening question
  useEffect(() => {
    if (currentQ?.audioPromptEn) {
      const timer = setTimeout(() => {
        speakEnglish(currentQ.audioPromptEn || '', 0.85);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentQ]);

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      playSoundEffect('correct');
      setScore((prev) => prev + 1);
      setStarCount((prev) => prev + 1);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // fallback
      }
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleNextQuestion = () => {
    playSoundEffect('click');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Finished all
      playSoundEffect('fanfare');
      setIsAnswered(true);
    }
  };

  const handleRestart = () => {
    playSoundEffect('click');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCompleted = currentIndex >= questions.length - 1 && isAnswered;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Unit Filter Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 uppercase">Chọn phần ôn:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedUnit('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedUnit === 'all'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
              }`}
            >
              Tất Cả Unit 1-3
            </button>
            {UNITS.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedUnit === u.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {u.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Star Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/70 rounded-2xl border border-amber-300">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-bounce" />
          <span className="font-black text-amber-950 font-mono text-sm tabular-nums">
            {starCount} Ngôi Sao
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ && !isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
          {/* Header Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                Câu {currentIndex + 1} / {questions.length}
              </span>
              <span>·</span>
              <span className="capitalize">{currentQ.type.replace(/_/g, ' ')}</span>
            </div>

            <div className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Prompt in Vietnamese & Audio Read aloud */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                Hướng dẫn cho bé:
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-800 font-['Outfit']">
                {currentQ.promptVi}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentQ.audioPromptEn && (
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    speakEnglish(currentQ.audioPromptEn || '', 0.85);
                  }}
                  className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Tiếng Anh</span>
                </button>
              )}

              <button
                onClick={() => {
                  playSoundEffect('click');
                  speakVietnamese(currentQ.promptVi);
                }}
                className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
                title="Đọc to hướng dẫn tiếng Việt"
              >
                <Volume2 className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Central Question Target Graphic / Illustration (if question has image) */}
          {currentQ.imageKey && (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-amber-50/80 border-2 border-dashed border-amber-300 flex items-center justify-center p-4">
                <IllustrationIcon name={currentQ.imageKey} size={110} />
              </div>
              {currentQ.questionText && (
                <div className="mt-3 text-base font-extrabold text-slate-900 font-['Outfit']">
                  {currentQ.questionText}
                </div>
              )}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'bg-white border-2 border-amber-200/80 hover:border-orange-400 hover:shadow-md';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-300';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50 border-2 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`p-5 rounded-3xl flex flex-col items-center text-center transition-all cursor-pointer relative overflow-hidden group ${btnStyle}`}
                >
                  {opt.imageKey && (
                    <div className="w-24 h-24 flex items-center justify-center mb-3">
                      <IllustrationIcon name={opt.imageKey} size={70} />
                    </div>
                  )}

                  <span className="text-xl font-black text-slate-900 font-['Outfit'] capitalize">
                    {opt.text}
                  </span>

                  {opt.subText && (
                    <span className="text-xs font-semibold text-slate-500 mt-1">
                      {opt.subText}
                    </span>
                  )}

                  {/* Feedback Status Icon */}
                  {isAnswered && opt.isCorrect && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Chính xác! Bé giỏi quá!</span>
                    </div>
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-rose-500">
                      <XCircle className="w-4 h-4" />
                      <span>Chưa đúng rồi!</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Bar when answered */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-slate-600">
                💡 <span className="font-bold text-slate-800">Giải thích:</span> {currentQ.explanation}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-lg text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-4xl shadow-inner animate-pulse">
            👑
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 font-['Outfit']">
              Chúc Mừng Bé Đã Hoàn Thành Bài Luyện Tập!
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Bé đã trả lời đúng <span className="font-extrabold text-orange-600">{score}</span> /{' '}
              <span className="font-bold">{questions.length}</span> câu hỏi!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span className="font-black text-amber-950 text-xl font-mono">
              + {score} Điểm Thưởng
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại Lần Nữa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
