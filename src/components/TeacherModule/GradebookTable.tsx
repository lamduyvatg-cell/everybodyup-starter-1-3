import React, { useState } from 'react';
import { StudentScoreRecord } from '../../types/curriculum';
import { Search, Download, Trash2, Eye, Award } from 'lucide-react';

interface GradebookTableProps {
  records: StudentScoreRecord[];
  onDeleteRecord: (id: string) => void;
  onUpdateNote: (id: string, newNote: string) => void;
  onViewReportCard: (record: StudentScoreRecord) => void;
}

export const GradebookTable: React.FC<GradebookTableProps> = ({
  records,
  onDeleteRecord,
  onUpdateNote,
  onViewReportCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterUnit, setFilterUnit] = useState('all');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<StudentScoreRecord | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const filtered = records.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = filterClass === 'all' || r.className === filterClass;
    const matchUnit = filterUnit === 'all' || r.unit.includes(filterUnit);
    return matchSearch && matchClass && matchUnit;
  });

  const uniqueClasses = Array.from(new Set(records.map((r) => r.className)));

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Mã Bài Thi',
      'Họ và Tên Bé',
      'Lớp',
      'Chủ Đề Kiểm Tra',
      'Điểm Số (/10)',
      'Số Câu Đúng',
      'Tổng Số Câu',
      'Thời Gian (giây)',
      'Ngày Giờ Nộp Bài',
      'Nhận Xét Của Giáo Viên',
    ];

    const rows = filtered.map((r) => [
      r.id,
      `"${r.studentName}"`,
      `"${r.className}"`,
      `"${r.unit}"`,
      r.score,
      r.correctCount,
      r.totalQuestions,
      r.timeSpentSeconds,
      `"${r.timestamp}"`,
      `"${r.notes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_Diem_Tieng_Anh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startEditNote = (record: StudentScoreRecord) => {
    setEditingNoteId(record.id);
    setTempNote(record.notes || '');
  };

  const saveEditNote = (id: string) => {
    onUpdateNote(id, tempNote);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bé hoặc lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">Tất Cả Lớp</option>
            {uniqueClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Unit Filter */}
          <select
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">Tất Cả Bài Kiểm Tra</option>
            <option value="Unit 1">Unit 1: Art Class</option>
            <option value="Unit 2">Unit 2: Let’s Play</option>
            <option value="Unit 3">Unit 3: Many Colors</option>
            <option value="Tổng Hợp">Kiểm Tra Tổng Hợp</option>
          </select>
        </div>

        {/* Action Button: Export CSV */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Xuất File Excel (CSV)</span>
        </button>
      </div>

      {/* Main Gradebook Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Học Sinh</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Bài Kiểm Tra</th>
                <th className="py-3.5 px-4 text-center">Điểm Tự Động</th>
                <th className="py-3.5 px-4 text-center">Tỉ Lệ Đúng</th>
                <th className="py-3.5 px-4">Thời Gian Nộp</th>
                <th className="py-3.5 px-4">Lời Nhận Xét Của Giáo Viên</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy bài làm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                  let ratingLabel = 'Xuất Sắc';
                  if (record.score < 6) {
                    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
                    ratingLabel = 'Cần Cố Gắng';
                  } else if (record.score < 8) {
                    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
                    ratingLabel = 'Đạt Yêu Cầu';
                  } else if (record.score < 10) {
                    badgeColor = 'text-blue-700 bg-blue-50 border-blue-200';
                    ratingLabel = 'Giỏi';
                  }

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {record.studentName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {record.className}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {record.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-black font-mono text-sm px-2.5 py-0.5 rounded-lg border tabular-nums ${badgeColor}`}
                        >
                          {record.score} / 10
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {ratingLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                        {record.correctCount}/{record.totalQuestions}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {record.timestamp}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {editingNoteId === record.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-full"
                            />
                            <button
                              onClick={() => saveEditNote(record.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded font-bold cursor-pointer"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditNote(record)}
                            className="cursor-pointer hover:bg-slate-100 p-1 rounded text-slate-600 truncate"
                            title="Bấm để chỉnh sửa nhận xét"
                          >
                            {record.notes || <span className="italic text-slate-400">+ Thêm nhận xét...</span>}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRecordForDetail(record)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                            title="Xem chi tiết từng câu"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewReportCard(record)}
                            className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 cursor-pointer"
                            title="In Phiếu Báo Điểm & Khen Thưởng"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                            title="Xóa bài thi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question Details Modal */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Chi Tiết Bài Làm: {selectedRecordForDetail.studentName}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedRecordForDetail.className} · {selectedRecordForDetail.unit} · Điểm:{' '}
                  <span className="font-bold text-orange-600 font-mono">
                    {selectedRecordForDetail.score}/10
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {selectedRecordForDetail.details.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                    q.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">
                      Câu {idx + 1}: {q.questionText}
                    </div>
                    <div className="text-slate-600">
                      Học sinh chọn: <span className="font-bold">{q.chosenAnswer}</span>
                    </div>
                    {!q.isCorrect && (
                      <div className="text-emerald-700 font-semibold">
                        Đáp án đúng: {q.correctAnswer}
                      </div>
                    )}
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                      q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {q.isCorrect ? '✓ Đúng' : '✗ Sai'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
