import React from 'react';
import { BudgetItem } from '../types';
import { toast } from 'sonner';
import { 
  Users, 
  Trash2, 
  CircleDollarSign,
  TrendingDown
} from 'lucide-react';

type Props = {
  participants: string[];
  setParticipants: (p: string[]) => void;
  budget: BudgetItem[];
};

export function ParticipantsTab({ participants, setParticipants, budget }: Props) {
  const removeParticipant = (name: string) => {
    if (participants.length <= 1) {
      toast.error("Phải có ít nhất một người tham gia");
      return;
    }
    setParticipants(participants.filter(p => p !== name));
    toast.info(`Đã xóa ${name}`);
  };

  const totalActual = budget.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0);
  const perPerson = participants.length > 0 ? totalActual / participants.length : 0;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Thẻ Chia Tiền */}
      <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center">
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-[0.2em] mb-3">Mỗi người cần chi trả</p>
          <p className="text-4xl font-black mb-2">{Math.round(perPerson).toLocaleString('vi-VN')}đ</p>
          <div className="flex items-center justify-center gap-2 bg-white/10 rounded-full px-4 py-1.5 w-fit mx-auto backdrop-blur-md">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Chia cho {participants.length} người</span>
          </div>
        </div>
      </div>

      {/* Danh sách người tham gia */}
      <div className="space-y-4">
        <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Danh sách bạn bè ({participants.length})</h3>
        <div className="grid gap-3">
          {participants.map((p, index) => (
            <div key={p + index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-lg shadow-inner">
                  {p.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-gray-900">{p}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Thành viên chuyến đi</p>
                </div>
              </div>
              <button 
                onClick={() => removeParticipant(p)}
                className="p-3 text-gray-300 hover:text-rose-500 bg-gray-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Thống kê chi tiết */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">Thống kê nhanh</h4>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <div className="p-3 bg-blue-50 w-fit rounded-xl">
              <CircleDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Tổng quỹ đã chi</p>
            <p className="font-black text-gray-900">{totalActual.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="p-3 bg-amber-50 w-fit rounded-xl">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Bình quân đầu người</p>
            <p className="font-black text-gray-900">{Math.round(perPerson).toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
