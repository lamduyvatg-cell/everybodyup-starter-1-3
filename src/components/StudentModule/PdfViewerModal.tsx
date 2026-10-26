import React, { useState } from 'react';
import { ExternalLink, BookOpen, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PdfViewerModalProps {
  initialPage?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pdfUrl = '/assets/aistudio/Unit_1_to_3_0bf5e7e8.pdf';

  const unitBookmarks = [
    { page: 1, label: 'Unit 1: Art Class (Trang 1)', desc: 'paper, glue, scissors, paint' },
    { page: 2, label: 'Unit 1: Lesson 2 (Trang 2)', desc: 'pencil, pen, crayon, marker' },
    { page: 3, label: 'Unit 1: Story (Trang 3)', desc: "What's Your Name?" },
    { page: 4, label: 'Unit 1: Phonics (Trang 4)', desc: 'Aa, Bb, Cc, Dd' },
    { page: 5, label: "Unit 2: Let's Play (Trang 5)", desc: 'balloon, ball, doll, yo-yo' },
    { page: 6, label: 'Unit 2: Toys 2 (Trang 6)', desc: 'train, boat, jet, car' },
    { page: 7, label: 'Unit 2: Story (Trang 7)', desc: 'Hello, Good-bye' },
    { page: 9, label: 'Unit 2: Phonics (Trang 9)', desc: 'Ee, Ff, Gg' },
    { page: 10, label: 'Unit 3: Colors 1 (Trang 10)', desc: 'red, blue, yellow, green' },
    { page: 11, label: 'Unit 3: Colors 2 (Trang 11)', desc: 'orange, purple, pink, brown' },
    { page: 12, label: 'Unit 3: Story (Trang 12)', desc: "I'm Fine" },
    { page: 13, label: 'Unit 3: Phonics (Trang 13)', desc: 'Hh, Ii, Jj' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <span>Giáo Trình Gốc Tiếng Anh Lớp Lá & Lớp 1</span>
            <span aria-hidden="true">·</span>
            <span>Unit 1 đến Unit 3</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            Tra Cứu Sách Gốc (PDF Textbook Viewer)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Giáo viên và phụ huynh có thể đối chiếu bài tập với từng trang giáo trình gốc.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mở Trong Tab Mới</span>
          </a>
          <a
            href={pdfUrl}
            download="Unit_1_to_3_Textbook.pdf"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải File PDF</span>
          </a>
        </div>
      </div>

      {/* Bookmarks Carousel / Quick Navigation Buttons */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs space-y-2">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span>Chuyển Nhanh Đến Trang Cần Xem:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {unitBookmarks.map((bm) => (
            <button
              key={bm.page}
              onClick={() => setCurrentPage(bm.page)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer text-left border ${
                currentPage === bm.page
                  ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                  : 'bg-amber-50/50 hover:bg-amber-100/70 text-slate-700 border-amber-200/60'
              }`}
            >
              <div className="font-extrabold">{bm.label}</div>
              <div className={`text-[10px] ${currentPage === bm.page ? 'text-white/80' : 'text-slate-500'}`}>
                {bm.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs font-semibold text-slate-600">
          <span>Đang xem trang: {currentPage} / 13</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold">Trang {currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(13, p + 1))}
              disabled={currentPage >= 13}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded iframe or object for the PDF file with fallback */}
        <div className="w-full h-[650px] sm:h-[800px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
          <iframe
            src={`${pdfUrl}#page=${currentPage}&toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title="Sách Giáo Khoa Unit 1-3"
          />
        </div>
      </div>
    </div>
  );
};
