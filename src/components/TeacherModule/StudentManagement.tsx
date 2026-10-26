import React, { useState } from 'react';
import { StudentProfile } from '../../types/curriculum';
import { Plus, UserPlus, Trash2 } from 'lucide-react';

interface StudentManagementProps {
  students: StudentProfile[];
  onAddStudent: (newStudent: StudentProfile) => void;
  onDeleteStudent: (id: string) => void;
  currentStudentId: string;
  onSelectStudent: (id: string) => void;
}

const AVATAR_OPTIONS = ['🦁', '🐰', '🐼', '🐱', '🐨', '🐯', '🦊', '🐸', '🦄', '🐶'];

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onDeleteStudent,
  currentStudentId,
  onSelectStudent,
}) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('Lớp Lá 1');
  const [avatar, setAvatar] = useState('🦁');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: StudentProfile = {
      id: `std_${Date.now()}`,
      name: name.trim(),
      className,
      avatar,
      createdDate: new Date().toISOString().slice(0, 10),
    };

    onAddStudent(newStudent);
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Add Trigger */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
            Quản Lý Danh Sách Học Sinh ({students.length} em)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thêm tên các bé Lớp Lá và Lớp 1 để tự động gán điểm khi các bé hoàn thành bài ôn tập.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isAdding ? 'Đóng Biểu Mẫu' : '+ Thêm Học Sinh Mới'}
        </button>
      </div>

      {/* Add Student Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4"
        >
          <div className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-orange-600" />
            <span>Nhập Thông Tin Học Sinh Mới:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và Tên Bé:
              </label>
              <input
                type="text"
                required
                placeholder="VD: Bé Nguyễn Gia Hưng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lớp Học:
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-orange-400"
              >
                <option value="Lớp Lá 1">Lớp Lá 1 (Mầm non 5 tuổi)</option>
                <option value="Lớp Lá 2">Lớp Lá 2 (Mầm non 5 tuổi)</option>
                <option value="Lớp Lá 3">Lớp Lá 3 (Mầm non 5 tuổi)</option>
                <option value="Lớp 1A">Lớp 1A (Tiểu học)</option>
                <option value="Lớp 1B">Lớp 1B (Tiểu học)</option>
                <option value="Lớp 1C">Lớp 1C (Tiểu học)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hình Đại Diện Con Vật:
              </label>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg cursor-pointer transition-transform ${
                      avatar === av ? 'bg-orange-200 ring-2 ring-orange-500 scale-110' : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Lưu Vào Danh Sách</span>
            </button>
          </div>
        </form>
      )}

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((st) => {
          const isActive = currentStudentId === st.id;
          return (
            <div
              key={st.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-amber-50/70 border-orange-400 shadow-sm ring-1 ring-orange-300'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {st.avatar}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 font-['Outfit']">
                    {st.name}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">{st.className}</div>
                  {isActive && (
                    <span className="inline-block text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md mt-1">
                      Đang chọn làm bài
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!isActive && (
                  <button
                    onClick={() => onSelectStudent(st.id)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Chọn Bé
                  </button>
                )}
                {students.length > 1 && (
                  <button
                    onClick={() => onDeleteStudent(st.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Xóa học sinh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
