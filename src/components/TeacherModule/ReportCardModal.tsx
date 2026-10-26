import React from 'react';
import { StudentScoreRecord } from '../../types/curriculum';
import { Printer, X, Award, CheckCircle } from 'lucide-react';

interface ReportCardModalProps {
  record: StudentScoreRecord | null;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar (hidden during print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-xs font-bold text-slate-700">
            Xem trước Phiếu Báo Điểm & Khen Thưởng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu (Print / Lưu PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate / Report Card Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-6 bg-radial from-amber-50 via-white to-orange-50/40">
          <div className="border-4 border-amber-400 p-6 sm:p-8 rounded-3xl bg-white shadow-sm relative text-center space-y-6">
            {/* Corner Decorative Stars */}
            <div className="absolute top-3 left-4 text-amber-400 text-2xl">★</div>
            <div className="absolute top-3 right-4 text-amber-400 text-2xl">★</div>
            <div className="absolute bottom-3 left-4 text-amber-400 text-2xl">★</div>
            <div className="absolute bottom-3 right-4 text-amber-400 text-2xl">★</div>

            {/* School / Class Brand */}
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-800">
                CHƯƠNG TRÌNH TIẾNG ANH MẦM NON & TIỂU HỌC
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
                PHIẾU KHEN THƯỞNG & BÁO ĐIỂM
              </h1>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">
                Giáo trình Ôn tập Unit 1, 2, 3 (Art Class, Let's Play, Many Colors)
              </div>
            </div>

            {/* Award Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
              <Award className="w-10 h-10" />
            </div>

            {/* Student Info */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500">Khen tặng em:</div>
              <div className="text-3xl font-black text-orange-600 font-['Outfit'] underline decoration-amber-300 underline-offset-4">
                {record.studentName}
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">
                Lớp: <span className="font-extrabold text-slate-900">{record.className}</span>
              </div>
            </div>

            {/* Score & Accomplishment Details */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Điểm số đạt được</div>
                <div className="text-3xl font-black text-amber-700 font-mono mt-0.5">
                  {record.score} <span className="text-base text-slate-400">/ 10</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Số câu làm đúng</div>
                <div className="text-3xl font-black text-emerald-600 font-mono mt-0.5">
                  {record.correctCount}/{record.totalQuestions}
                </div>
              </div>
            </div>

            {/* Teacher Feedback / Notes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nhận xét của Giáo viên:</span>
              </div>
              <p className="text-xs text-slate-700 italic">
                "{record.notes || 'Bé có phản xạ tiếng Anh rất nhanh nhạy và chăm chỉ học tập.'}"
              </p>
            </div>

            {/* Signatures Row */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-4">
              <div>
                <div className="font-bold">Ngày làm bài:</div>
                <div className="font-mono text-[11px]">{record.timestamp}</div>
              </div>

              <div className="text-center">
                <div className="font-bold text-slate-800">Giáo Viên Chủ Nhiệm</div>
                <div className="italic text-slate-400 mt-6">(Ký & ghi rõ họ tên)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
