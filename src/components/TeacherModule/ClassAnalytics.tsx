import React from 'react';
import { StudentScoreRecord } from '../../types/curriculum';
import { Award, CheckCircle, AlertTriangle } from 'lucide-react';

interface ClassAnalyticsProps {
  records: StudentScoreRecord[];
}

export const ClassAnalytics: React.FC<ClassAnalyticsProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
        Chưa có dữ liệu bài thi nào để phân tích. Hãy cho học sinh làm bài kiểm tra trước!
      </div>
    );
  }

  const totalTests = records.length;
  const avgScore = (
    records.reduce((acc, curr) => acc + curr.score, 0) / totalTests
  ).toFixed(1);

  const perfectScoreCount = records.filter((r) => r.score === 10).length;
  const passRate = Math.round(
    (records.filter((r) => r.score >= 7).length / totalTests) * 100
  );

  // Analyze performance by Unit
  const unit1Records = records.filter((r) => r.unit.includes('Unit 1'));
  const unit2Records = records.filter((r) => r.unit.includes('Unit 2'));
  const unit3Records = records.filter((r) => r.unit.includes('Unit 3'));
  const reviewRecords = records.filter((r) => r.unit.includes('Tổng Hợp'));

  const getAvg = (list: StudentScoreRecord[]) => {
    if (list.length === 0) return 0;
    return (list.reduce((acc, c) => acc + c.score, 0) / list.length).toFixed(1);
  };

  // Find common mistakes across all test details
  const mistakeCounts: Record<string, { count: number; questionText: string; correctAns: string }> = {};
  records.forEach((r) => {
    r.details.forEach((d) => {
      if (!d.isCorrect) {
        if (!mistakeCounts[d.questionId]) {
          mistakeCounts[d.questionId] = {
            count: 0,
            questionText: d.questionText,
            correctAns: d.correctAnswer,
          };
        }
        mistakeCounts[d.questionId].count += 1;
      }
    });
  });

  const topMistakes = Object.values(mistakeCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Tổng Số Bài Đã Chấm</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2 tabular-nums">
            {totalTests}
          </div>
          <div className="text-xs text-slate-400 mt-1">Bài thi từ Lớp Lá & Lớp 1</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Điểm Trung Bình Lớp</span>
            <Award className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-orange-600 font-mono mt-2 tabular-nums">
            {avgScore} <span className="text-lg text-slate-400 font-sans font-normal">/ 10</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Đánh giá chung: Rất tốt</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Số Điểm 10 Tuyệt Đối</span>
            <span className="text-base">🌟</span>
          </div>
          <div className="text-3xl font-black text-amber-500 font-mono mt-2 tabular-nums">
            {perfectScoreCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Bé đạt điểm xuất sắc</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Tỉ Lệ Đạt Yêu Cầu (&ge; 7đ)</span>
            <span className="text-base">📈</span>
          </div>
          <div className="text-3xl font-black text-blue-600 font-mono mt-2 tabular-nums">
            {passRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Mục tiêu năm học: 95%</div>
        </div>
      </div>

      {/* Two-Column Analytics: Performance by Unit & Common Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance by Unit */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>Phân Bố Kết Quả Theo Từng Unit</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Unit 1: Art Class (Dụng Cụ Học Tập)</span>
                <span className="font-mono text-orange-600">{getAvg(unit1Records)} / 10đ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-2.5 rounded-full"
                  style={{ width: `${(Number(getAvg(unit1Records)) / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Unit 2: Let's Play (Đồ Chơi & Phương Tiện)</span>
                <span className="font-mono text-sky-600">{getAvg(unit2Records)} / 10đ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-sky-500 h-2.5 rounded-full"
                  style={{ width: `${(Number(getAvg(unit2Records)) / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Unit 3: Many Colors (Sắc Màu Rực Rỡ)</span>
                <span className="font-mono text-purple-600">{getAvg(unit3Records)} / 10đ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{ width: `${(Number(getAvg(unit3Records)) / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Kiểm Tra Tổng Hợp Unit 1-3</span>
                <span className="font-mono text-emerald-600">{getAvg(reviewRecords)} / 10đ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{ width: `${(Number(getAvg(reviewRecords)) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes / Pedagogical Guidance for Teachers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Các Câu Học Sinh Dễ Nhầm Lẫn Nhất</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Cần ôn lại trên lớp</span>
          </div>

          {topMistakes.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 font-medium">
              Tuyệt vời! Hiện tại học sinh đều làm đúng hầu hết các câu hỏi.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topMistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200/70 text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-slate-800">{m.questionText}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Đáp án chuẩn: <span className="font-bold text-emerald-700">{m.correctAns}</span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-bold font-mono text-[11px] shrink-0">
                    {m.count} bé sai
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-900">
            <span className="font-bold">Gợi ý cho giáo viên:</span> Dành 5 phút đầu giờ cho các bé chơi trò
            "Show me" (Giơ đồ vật: pencil, pen, crayon) và phân biệt màu sắc "purple" vs "blue" để củng cố phản xạ.
          </div>
        </div>
      </div>
    </div>
  );
};
