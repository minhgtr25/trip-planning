import React, { useState } from 'react';
import { PackingItem } from '../types';
import { toast } from 'sonner';
import { 
  Package, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Minus, 
  ChevronDown,
  User
} from 'lucide-react';

type Props = {
  items: PackingItem[];
  setItems: (items: PackingItem[]) => void;
};

const CATEGORIES = ['Tất cả', 'Giấy tờ', 'Điện tử', 'Quần áo', 'Vệ sinh', 'Sức khỏe', 'Khác'] as const;

export function PackingTab({ items, setItems, participants = [] }: { items: PackingItem[], setItems: any, participants?: string[] }) {
  const [filterCategory, setFilterCategory] = useState<typeof CATEGORIES[number]>('Tất cả');

  const updateField = (id: string, field: keyof PackingItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.error("Đã xóa đồ dùng");
  };
  
  const togglePacked = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
    if (item && !item.packed) {
      toast.success(`Đã chuẩn bị xong: ${item.item}`);
    }
  };
  const adjustQuantity = (id: string, delta: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item));
  };

  const filteredItems = items.filter(item => 
    filterCategory === 'Tất cả' || item.category === filterCategory
  );

  const packedCount = items.filter(i => i.packed).length;

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Tiến độ đóng gói */}
      <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-100 flex justify-between items-center">
        <div>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Tiến độ</p>
          <p className="text-3xl font-black">{packedCount} <span className="text-xl opacity-60">/ {items.length}</span></p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
          <Package className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Filter Categories - Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
              filterCategory === cat 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex items-start gap-4 transition-all ${item.packed ? 'opacity-60 bg-gray-50/50' : ''}`}
          >
            {/* Checkbox */}
            <button 
              onClick={() => togglePacked(item.id)}
              className="mt-1 flex-shrink-0"
            >
              {item.packed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
              ) : (
                <Circle className="w-6 h-6 text-gray-200" />
              )}
            </button>

            {/* Content Container */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {/* Item Name & Quantity */}
              <div className="flex justify-between items-start gap-2">
                <input 
                  type="text" 
                  value={item.item}
                  onChange={(e) => updateField(item.id, 'item', e.target.value)}
                  placeholder="Tên món đồ..."
                  className={`w-full bg-transparent border-none focus:ring-0 text-sm font-black p-0 ${item.packed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                />
                
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 flex-shrink-0">
                  <button onClick={() => adjustQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-400 active:scale-90"><Minus className="w-3 h-3" /></button>
                  <span className="text-xs font-black text-gray-700 min-w-[2ch] text-center">{item.quantity}</span>
                  <button onClick={() => adjustQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-400 active:scale-90"><Plus className="w-3 h-3" /></button>
                </div>
              </div>

              {/* Assignee & Category (Two columns for mobile) */}
              <div className="flex items-center gap-4">
                {/* Người mang (Bold black) */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <User className="w-3 h-3 text-gray-900" />
                  <div className="relative w-full">
                    <select 
                      value={item.assignee}
                      onChange={(e) => updateField(item.id, 'assignee', e.target.value)}
                      className="w-full appearance-none bg-transparent border-none focus:ring-0 text-[11px] font-black text-gray-900 p-0 cursor-pointer pr-4"
                    >
                      {item.assignee && !participants.includes(item.assignee) && <option value={item.assignee}>{item.assignee}</option>}
                      {participants.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Phân loại */}
                <div className="relative flex-1">
                  <select 
                    value={item.category}
                    onChange={(e) => updateField(item.id, 'category', e.target.value as any)}
                    className="w-full appearance-none bg-indigo-50/50 border-none rounded-lg px-2 py-1.5 text-[9px] font-black text-indigo-700 focus:ring-0 cursor-pointer uppercase pr-6"
                  >
                    {CATEGORIES.filter(c => c !== 'Tất cả').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button 
              onClick={() => removeItem(item.id)}
              className="mt-1 p-2 text-gray-300 hover:text-rose-500 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-16 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Không tìm thấy món đồ nào</p>
        </div>
      )}
    </div>
  );
}
