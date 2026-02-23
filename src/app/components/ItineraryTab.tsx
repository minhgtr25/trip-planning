import React, { useState } from 'react';
import { ItineraryItem, ItineraryDay } from '../types';
import { toast } from 'sonner';
import { Reorder, useDragControls } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  CheckSquare, 
  Square, 
  GripVertical, 
  Trash2,
  PlusCircle,
} from 'lucide-react';

type Props = {
  days: ItineraryDay[];
  setDays: (days: ItineraryDay[]) => void;
};

const SUGGESTIONS = ['Ăn sáng', 'Ăn trưa', 'Ăn tối', 'Check-in', 'Tham quan', 'Di chuyển'];

export function ItineraryTab({ days, setDays }: Readonly<Props>) {
  const [activeSuggestion, setActiveSuggestion] = useState<{id: string, text: string} | null>(null);

  const updateField = (dayId: string, id: string, field: keyof ItineraryItem, value: any) => {
    setDays(days.map(d => {
      if (d.id !== dayId) return d;
      return {
        ...d,
        items: d.items.map(item => item.id === id ? { ...item, [field]: value } : item)
      };
    }));
  };

  const removeItem = (dayId: string, id: string) => {
    setDays(days.map(d => {
      if (d.id !== dayId) return d;
      return { ...d, items: d.items.filter(item => item.id !== id) };
    }));
    toast.error("Đã xóa hoạt động");
  };
  
  const toggleDone = (dayId: string, id: string) => {
    let toggled: ItineraryItem | undefined;
    setDays(days.map(d => {
      if (d.id !== dayId) return d;
      return {
        ...d,
        items: d.items.map(item => {
          if (item.id === id) {
            toggled = item;
            return { ...item, done: !item.done };
          }
          return item;
        })
      };
    }));
    if (toggled && !toggled.done) {
      toast.success(`Hoàn thành: ${toggled.activity}`);
    }
  };

  const addDay = () => {
    // automatically create a new day using today's date (or last day + 1 if desired)
    const today = new Date().toISOString().slice(0,10);
    const newDay = { id: Math.random().toString(36).slice(2,11), date: today, items: [] };
    setDays([...days, newDay]);
    toast.success(`Đã thêm ngày ${today}`);
  };

  const removeDay = (dayId: string) => {
    setDays(days.filter(d => d.id !== dayId));
    toast.error('Đã xóa ngày');
  };

  const addItem = (dayId: string) => {
    setDays(days.map(d => {
      if (d.id !== dayId) return d;
      const newItem: ItineraryItem = {
        id: Math.random().toString(36).slice(2, 11),
        time: '12:00',
        activity: '',
        location: '',
        link: '',
        notes: '',
        done: false
      };
      return { ...d, items: [...d.items, newItem] };
    }));
    toast.info('Đã thêm hoạt động');
  };

  const reorderItems = (dayId: string, items: ItineraryItem[]) => {
    setDays(days.map(d => d.id === dayId ? { ...d, items } : d));
  };

  return (
    <div className="flex flex-col space-y-6">
      {days.map(day => (
        <div key={day.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-bold">Ngày {days.findIndex(d => d.id === day.id) + 1}</span>
              <input
                type="date"
                value={day.date}
                onChange={e => setDays(days.map(d => d.id === day.id ? { ...d, date: e.target.value } : d))}
                className="text-sm font-bold bg-transparent border-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => addItem(day.id)} className="text-indigo-600 hover:text-indigo-800">
                <PlusCircle className="w-5 h-5" />
              </button>
              <button onClick={() => removeDay(day.id)} className="text-rose-500 hover:text-rose-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {/* Header row */}
            <div className="grid grid-cols-[30px_60px_1fr_45px_35px] gap-1 px-2 py-2 bg-gray-50/50 border-b border-gray-50 items-center">
              <div />
              <div className="text-[8px] font-bold text-gray-400 uppercase">Giờ</div>
              <div className="text-[8px] font-bold text-gray-400 uppercase">Hoạt động & Địa điểm</div>
              <div className="text-[8px] font-bold text-gray-400 uppercase text-center">Xong</div>
              <div />
            </div>

            <Reorder.Group axis="y" values={day.items} onReorder={items => reorderItems(day.id, items)} className="flex flex-col divide-y divide-gray-50">
              {day.items.map((item) => (
                <ItineraryRow 
                  key={item.id} 
                  item={item} 
                  dayId={day.id}
                  updateField={updateField} 
                  toggleDone={toggleDone} 
                  removeItem={removeItem}
                  activeSuggestion={activeSuggestion}
                  setActiveSuggestion={setActiveSuggestion}
                />
              ))}
            </Reorder.Group>

            {day.items.length === 0 && (
              <div className="p-4 text-center text-gray-400 text-sm font-medium">Chưa có hoạt động trong ngày</div>
            )}
          </div>
        </div>
      ))}

      {days.length === 0 && (
        <div className="p-12 text-center text-gray-400 text-sm font-medium">Chưa có lịch trình</div>
      )}

      <div className="flex justify-center">
        <button onClick={addDay} className="flex items-center gap-1 text-indigo-600 font-bold">
          <PlusCircle className="w-5 h-5" /> Thêm ngày
        </button>
      </div>
    </div>
  );
}

function ItineraryRow({ item, dayId, updateField, toggleDone, removeItem, activeSuggestion, setActiveSuggestion }: any) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={item}
      dragListener={false}
      dragControls={controls}
      className={`grid grid-cols-[30px_60px_1fr_45px_35px] gap-1 px-2 py-3 items-center bg-white ${item.done ? 'opacity-60' : ''}`}
    >
      <div onPointerDown={(e) => controls.start(e)} className="flex justify-center text-gray-300 cursor-grab p-1">
        <GripVertical className="w-4 h-4" />
      </div>

      <input 
        type="time" 
        value={item.time}
        onChange={(e) => updateField(dayId, item.id, 'time', e.target.value)}
        className="w-full bg-transparent border-none focus:ring-0 text-[11px] font-bold text-gray-800 p-0"
      />

      <div className="relative min-w-0 pr-1">
        <input 
          type="text" 
          placeholder="Hoạt động..."
          value={item.activity}
          onChange={(e) => {
            updateField(dayId, item.id, 'activity', e.target.value);
            setActiveSuggestion({ id: item.id, text: e.target.value });
          }}
          className={`w-full bg-transparent border-none focus:ring-0 text-xs font-black p-0 truncate ${item.done ? 'line-through' : 'text-gray-900'}`}
        />
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-2.5 h-2.5 text-gray-300 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Ở đâu?"
            value={item.location}
            onChange={(e) => updateField(dayId, item.id, 'location', e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-[10px] text-gray-500 p-0 italic truncate"
          />
        </div>
        
        {activeSuggestion?.id === item.id && activeSuggestion.text.length > 0 && (
          <div className="absolute left-0 top-full z-30 bg-white border border-gray-100 rounded-lg shadow-lg py-1 min-w-[120px]">
            {SUGGESTIONS.filter(s => s.toLowerCase().includes(activeSuggestion.text.toLowerCase())).map(s => (
              <button key={s} onMouseDown={() => { updateField(dayId, item.id, 'activity', s); setActiveSuggestion(null); }} className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-indigo-50 border-b border-gray-50 last:border-0">{s}</button>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => toggleDone(dayId, item.id)} className="flex justify-center p-2">
        {item.done ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-gray-200" />}
      </button>

      <button onClick={() => removeItem(dayId, item.id)} className="flex justify-center p-2 text-gray-200 hover:text-rose-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </Reorder.Item>
  );
}
