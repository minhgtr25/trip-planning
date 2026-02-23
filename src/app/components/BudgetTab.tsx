import React from 'react';
import { BudgetItem } from '../types';
import { toast } from 'sonner';
import { 
  Trash2, 
  ChevronDown, 
  User,
  MessageSquareText,
  TrendingUp,
  CreditCard
} from 'lucide-react';

type Props = {
  items: BudgetItem[];
  setItems: (items: BudgetItem[]) => void;
};

const CATEGORIES = ['Ăn uống', 'Di chuyển', 'Chỗ ở', 'Vui chơi', 'Khác'] as const;

export function BudgetTab({ items, setItems, participants = [] }: { items: BudgetItem[], setItems: any, participants?: string[] }) {
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);

  const updateField = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const formatNum = (n: number) => n.toLocaleString('vi-VN');

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.error("Đã xóa khoản chi");
  };

  const totalEstimated = items.reduce((acc, curr) => acc + (Number(curr.estimated) || 0), 0);
  const totalActual = items.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0);
  const difference = totalEstimated - totalActual;
  const perPerson = (participants && participants.length > 0) ? totalActual / participants.length : 0;

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Tóm tắt nhanh phía trên */}
      <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">Tổng thực tế</p>
            <p className="text-3xl font-black">{totalActual.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">Mỗi người trả</p>
            <p className="text-xl font-black">{Math.round(perPerson).toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 transition-all active:scale-[0.98]">
            
            {/* Hàng 1: Danh mục & Xóa */}
            <div className="flex justify-between items-center">
              <div className="relative inline-flex">
                <select 
                  value={item.category}
                  onChange={(e) => updateField(item.id, 'category', e.target.value)}
                  className="appearance-none bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full pr-8 focus:ring-0 border-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400 pointer-events-none" />
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-300 hover:text-rose-500 transition-colors bg-gray-50 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Hàng 2: Số tiền thực tế (To & Rõ) */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Số tiền đã chi</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={focusedInput === `actual-${item.id}`
                    ? (item.actual ? item.actual.toString() : '')
                    : (item.actual ? formatNum(item.actual) : '')}
                  onFocus={e => {
                    setFocusedInput(`actual-${item.id}`);
                    e.currentTarget.select();
                  }}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D+/g, '');
                    v = v.replace(/^0+(?=\d)/, '');
                    updateField(item.id, 'actual', parseInt(v) || 0);
                  }}
                  className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black text-gray-900 p-0"
                  placeholder="0"
                />
                <span className="text-gray-400 font-bold">đ</span>
              </div>
            </div>

            {/* Hàng 3: Người chi & Dự kiến (Chữ đen đậm) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <User className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Người chi</span>
                </div>
                <div className="relative">
                  <select 
                    value={item.payer}
                    onChange={(e) => updateField(item.id, 'payer', e.target.value)}
                    className="w-full appearance-none bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 p-0 cursor-pointer pr-6"
                  >
                    {!participants.includes(item.payer) && <option value={item.payer}>{item.payer}</option>}
                    {participants.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1 border-l border-gray-100 pl-4">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Dự kiến</span>
                </div>
                <div className="flex items-center gap-1">
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={focusedInput === `estimated-${item.id}`
                      ? (item.estimated ? item.estimated.toString() : '')
                      : (item.estimated ? formatNum(item.estimated) : '')}
                    onFocus={e => {
                      setFocusedInput(`estimated-${item.id}`);
                      e.currentTarget.select();
                    }}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D+/g, '');
                      v = v.replace(/^0+(?=\d)/, '');
                      updateField(item.id, 'estimated', parseInt(v) || 0);
                    }}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 p-0"
                  />
                  <span className="text-[10px] font-bold text-gray-400">đ</span>
                </div>
              </div>
            </div>

            {/* Hàng 4: Ghi chú */}
            <div className="flex items-start gap-2 pt-3 border-t border-gray-50">
              <MessageSquareText className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
              <textarea 
                placeholder="Ghi chú thêm..."
                value={item.notes}
                onChange={(e) => updateField(item.id, 'notes', e.target.value)}
                rows={1}
                className="w-full bg-transparent border-none focus:ring-0 text-xs font-medium text-gray-600 p-0 placeholder:text-gray-300 resize-none min-h-[1.5rem]"
              />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-16 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-500 font-black">Chưa có khoản chi nào</p>
          <p className="text-gray-400 text-xs mt-1">Nhấn dấu + để thêm chi tiêu</p>
        </div>
      )}

      {/* Footer Tổng kết cố định nếu cần hoặc hiển thị cuối danh sách */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex justify-between items-center mt-2">
         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chênh lệch</span>
         <p className={`text-xl font-black ${difference >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
           {(difference >= 0 ? '+' : '') + difference.toLocaleString('vi-VN')}đ
         </p>
      </div>
    </div>
  );
}
