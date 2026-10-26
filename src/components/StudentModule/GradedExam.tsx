import React, { useState, useEffect } from 'react';
import { QuizQuestion, StudentScoreRecord, StudentProfile } from '../../types/curriculum';
import { QUESTION_BANK } from '../../data/curriculumData';
import { IllustrationIcon } from '../IllustrationIcon';
import { playSoundEffect, speakEnglish, speakVietnamese } from '../../utils/audio';
import { Volume2, Award, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GradedExamProps {
  students: StudentProfile[];
  currentStudentId: string;
  onStudentChange: (studentId: string) => void;
  onSaveScoreRecord: (record: StudentScoreRecord) => void;
  onViewTeacherGradebook: () => void;
}

export const GradedExam: React.FC<GradedExamProps> = ({
  students,
  currentStudentId,
  onStudentChange,
  onSaveScoreRecord,
  onViewTeacherGradebook,
}) => {
  const [testQuestions, setTestQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<StudentScoreRecord | null>(null);

  // Initialize random test questions from Units 1, 2, 3
  const prepareTest = () => {
    // Select 10 diverse questions
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
    setTestQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsTestStarted(true);
    setIsSubmitted(false);
    setFinalResult(null);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    playSoundEffect('pop');
  };

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTestStarted && !isSubmitted) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestStarted, isSubmitted, startTime]);

  const currentQ = testQuestions[currentIndex];
  const activeStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const handleSelectOption = (questionId: string, optionId: string) => {
    playSoundEffect('click');
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    playSoundEffect('click');
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playSoundEffect('click');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Automatic Grading Calculation
  const handleSubmitTest = () => {
    playSoundEffect('fanfare');
    setIsSubmitted(true);

    let correctCount = 0;
    const details = testQuestions.map((q) => {
      const chosenOptionId = userAnswers[q.id];
      const chosenOpt = q.options.find((o) => o.id === chosenOptionId);
      const correctOpt = q.options.find((o) => o.isCorrect);
      const isCorrect = chosenOpt?.isCorrect === true;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        isCorrect,
        questionText: q.questionText || q.promptVi,
        chosenAnswer: chosenOpt?.text || 'Chưa trả lời',
        correctAnswer: correctOpt?.text || '',
      };
    });

    const scoreCalculated = Math.round((correctCount / testQuestions.length) * 10);
    const timeSpent = Math.max(1, elapsedSeconds);

    let notes = 'Bé hoàn thành bài ôn tập rất tốt!';
    if (scoreCalculated === 10) notes = 'Tuyệt đối 10/10! Phát âm và phản xạ xuất sắc!';
    else if (scoreCalculated >= 8) notes = 'Đạt điểm Giỏi! Nắm chắc từ vựng và chữ cái.';
    else if (scoreCalculated >= 6) notes = 'Đạt điểm Khá. Cần luyện thêm phần nhận biết màu sắc.';
    else notes = 'Cần được giáo viên kèm thêm các từ vựng Unit 1 và Unit 2.';

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const record: StudentScoreRecord = {
      id: `rec_${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      className: activeStudent.className,
      unit: 'Bài Kiểm Tra Tổng Hợp Unit 1-3',
      score: scoreCalculated,
      totalQuestions: testQuestions.length,
      correctCount,
      timeSpentSeconds: timeSpent,
      timestamp: formattedDate,
      details,
      notes,
    };

    setFinalResult(record);
    onSaveScoreRecord(record);

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Student Profile Bar */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner">
            {activeStudent.avatar}
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase">Học sinh đang làm bài:</div>
            <div className="text-base font-extrabold text-slate-900 font-['Outfit']">
              {activeStudent.name}
            </div>
            <div className="text-xs text-slate-500 font-medium">Lớp: {activeStudent.className}</div>
          </div>
        </div>

        {/* Change Student Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Đổi học sinh:</span>
          <select
            value={currentStudentId}
            onChange={(e) => onStudentChange(e.target.value)}
            disabled={isTestStarted && !isSubmitted}
            className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-orange-400"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.className})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isTestStarted ? (
        /* Welcome / Start Exam Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              Bài Kiểm Tra Ôn Tập Unit 1 - 3 (Chấm Điểm Tự Động)
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Hệ thống tự động chấm điểm theo thang điểm 10, hiển thị câu đúng sai ngay tức thì và tự
              động lưu vào <b>Sổ Điểm Giáo Viên</b>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left text-xs font-semibold text-slate-700">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60">
              <span className="block text-orange-600 font-bold">10 Câu Hỏi</span>
              Từ vựng, Phonics, Mẫu câu
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60">
              <span className="block text-orange-600 font-bold">Phát Âm Loa</span>
              Bấm nghe từ vựng & câu hỏi
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60">
              <span className="block text-orange-600 font-bold">Tự Động Lưu</span>
              Ghi danh vào Bảng Điểm Lớp
            </div>
          </div>

          <button
            onClick={prepareTest}
            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Bắt Đầu Làm Bài Ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : !isSubmitted ? (
        /* Active Testing Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
          {/* Header Bar: Question index & Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-xl">
                Câu {currentIndex + 1} / {testQuestions.length}
              </span>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                {currentQ?.unit === 'all' ? 'Tổng Hợp' : currentQ?.unit?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 font-mono">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Thời gian: {formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Prompt in Vietnamese & Audio buttons */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase">Câu hỏi:</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
                {currentQ.promptVi}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentQ.audioPromptEn && (
                <button
                  onClick={() => speakEnglish(currentQ.audioPromptEn || '', 0.85)}
                  className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Tiếng Anh</span>
                </button>
              )}
              <button
                onClick={() => speakVietnamese(currentQ.promptVi)}
                className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                title="Đọc tiếng Việt"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question illustration if present */}
          {currentQ.imageKey && (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-36 h-36 rounded-3xl bg-amber-50/80 border-2 border-dashed border-amber-300 flex items-center justify-center p-3">
                <IllustrationIcon name={currentQ.imageKey} size={100} />
              </div>
              {currentQ.questionText && (
                <div className="mt-2 text-sm font-bold text-slate-800">
                  {currentQ.questionText}
                </div>
              )}
            </div>
          )}

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQ.options.map((opt) => {
              const isSelected = userAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`p-5 rounded-3xl flex flex-col items-center text-center transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'bg-amber-100/70 border-orange-500 text-orange-950 shadow-md ring-2 ring-orange-300'
                      : 'bg-white border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  {opt.imageKey && (
                    <div className="w-20 h-20 flex items-center justify-center mb-2">
                      <IllustrationIcon name={opt.imageKey} size={64} />
                    </div>
                  )}
                  <span className="text-lg font-black text-slate-900 capitalize font-['Outfit']">
                    {opt.text}
                  </span>
                  {opt.subText && (
                    <span className="text-xs font-semibold text-slate-500 mt-1">
                      {opt.subText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
              }`}
            >
              ← Câu Trước
            </button>

            <div className="flex items-center gap-1">
              {testQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    currentIndex === idx
                      ? 'bg-orange-500 text-white'
                      : userAnswers[q.id]
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentIndex < testQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Câu Sau</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <span>Nộp Bài & Chấm Điểm</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Test Result & Auto-Grade Summary */
        finalResult && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xl space-y-8">
            {/* Scoreboard Badge Card */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-amber-50 border border-amber-200">
                <div className="text-center px-6">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                    KẾT QUẢ CHẤM ĐIỂM TỰ ĐỘNG
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-orange-600 font-mono mt-1">
                    {finalResult.score} <span className="text-2xl text-slate-400">/ 10</span>
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    Đúng {finalResult.correctCount} / {finalResult.totalQuestions} câu · Thời gian:{' '}
                    {formatTime(finalResult.timeSpentSeconds)}
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {finalResult.score >= 9
                    ? '🌟 Xuất Sắc! Bé Giỏi Quá!'
                    : finalResult.score >= 7
                    ? '🎉 Làm Rất Tốt! Đạt Điểm Khá Giỏi'
                    : '💪 Bé Cố Lên Nhé! Ôn Lại Bài Một Chút Là Đạt 10/10'}
                </h2>
                <p className="text-slate-600 text-sm mt-1">{finalResult.notes}</p>
              </div>
            </div>

            {/* Answer Detailed Breakdown Table */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                Chi Tiết Từng Câu Hỏi & Đáp Án Của Bé:
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {finalResult.details.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3.5 flex items-center justify-between text-xs ${
                      d.isCorrect ? 'bg-emerald-50/40' : 'bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[11px] ${
                          d.isCorrect
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800">{d.questionText}</div>
                        <div className="text-slate-500 text-[11px]">
                          Bé chọn: <b className={d.isCorrect ? 'text-emerald-700' : 'text-rose-600'}>{d.chosenAnswer}</b>
                          {!d.isCorrect && (
                            <span> · Đáp án đúng: <b className="text-emerald-700">{d.correctAnswer}</b></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="font-bold shrink-0">
                      {d.isCorrect ? (
                        <span className="text-emerald-600">Đúng (+1đ)</span>
                      ) : (
                        <span className="text-rose-500">Sai (0đ)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={prepareTest}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Bài Khác</span>
              </button>

              <button
                onClick={onViewTeacherGradebook}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Xem Trong Sổ Điểm Giáo Viên</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
