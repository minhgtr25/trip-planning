import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Calendar,
  Wallet,
  Package,
  LayoutDashboard,
  Plus,
  Settings,
  Clock,
  User,
  X,
  Trash2
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ItineraryTab } from './components/ItineraryTab';
import { BudgetTab } from './components/BudgetTab';
import { PackingTab } from './components/PackingTab';
import { ParticipantsTab } from './components/ParticipantsTab';

import { TripData, ItineraryItem, BudgetItem, PackingItem } from './types';
import { useTrips } from '../lib/useTrips';




const INITIAL_DATA: TripData = {
  name: "Cuối tuần tại Đà Lạt",
  startDate: "2026-03-15T09:00:00",
  location: "Đà Lạt, Việt Nam",
  imageUrl:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHJlc29ydCUyMHZpZXd8ZW58MHx8fHwxNzcwNjI3OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  participants: ["Tôi", "Bạn A", "Bạn B"],
  itinerary: [
    {
      id: 'day-1',
      date: '2026-03-15',
      items: [
        { id: '1', time: '09:00', activity: 'Đến sân bay Liên Khương', location: 'Đức Trọng', link: '', notes: 'Bắt taxi về trung tâm', done: true },
        { id: '2', time: '11:00', activity: 'Check-in khách sạn', location: 'Phường 1', link: '', notes: 'Gửi đồ tại quầy lễ tân', done: false },
        { id: '3', time: '12:30', activity: 'Ăn trưa Lẩu Gà Lá É', location: 'Đường Tao Đàn', link: '', notes: 'Quán 668', done: false },
      ]
    }
  ],
  budget: [
    { id: '1', category: 'Di chuyển', estimated: 500000, actual: 450000, payer: 'Tôi', notes: 'Vé máy bay' },
    { id: '2', category: 'Chỗ ở', estimated: 1200000, actual: 0, payer: 'Tôi', notes: 'Homestay' },
    { id: '3', category: 'Ăn uống', estimated: 200000, actual: 180000, payer: 'Bạn A', notes: 'Bữa trưa' },
  ],
  packing: [
    { id: '1', item: 'CCCD/Hộ chiếu', quantity: 1, category: 'Giấy tờ', packed: true, assignee: 'Tôi' },
    { id: '2', item: 'Sạc dự phòng', quantity: 1, category: 'Điện tử', packed: false, assignee: 'Tôi' },
    { id: '3', item: 'Áo khoác ấm', quantity: 2, category: 'Quần áo', packed: true, assignee: 'Bạn A' },
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'itinerary' | 'budget' | 'packing' | 'participants'>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');

  const { trips, active, selectTrip, updateTrip, createTrip } = useTrips(INITIAL_DATA);
  const activeTrip = trips.find(t => t.id === active)?.data || null;

  if (!activeTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải dữ liệu chuyến đi...</p>
      </div>
    );
  }


  const handleReset = () => {
    const fresh = {
      ...INITIAL_DATA,
      itinerary: [],
      budget: [],
      packing: [],
      participants: ["Tôi"],
      name: "Chuyến đi mới",
      location: "Địa điểm mới",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    if (active) updateTrip(fresh);
    else createTrip(fresh.name, fresh);
    setActiveTab('dashboard');
    setShowSettings(false);
    toast.success("Đã xóa toàn bộ dữ liệu chuyến đi");
  };

  const handleAddParticipant = () => {
    if (!activeTrip) return;
    if (newParticipantName.trim()) {
      if (activeTrip.participants.includes(newParticipantName.trim())) {
        toast.error("Người này đã có trong danh sách");
        return;
      }
      updateTrip({ participants: [...activeTrip.participants, newParticipantName.trim()] });
      setNewParticipantName('');
      setShowAddParticipant(false);
      toast.success(`Đã thêm ${newParticipantName.trim()}`);
    }
  };

  const handleAddItem = () => {
    if (!activeTrip) return;
    if (activeTab === 'itinerary') {
      const days = [...activeTrip.itinerary];
      if (days.length === 0) {
        days.push({
          id: Math.random().toString(36).slice(2, 11),
          date: activeTrip.startDate.slice(0,10),
          items: []
        });
      }
      const newItem: ItineraryItem = {
        id: Math.random().toString(36).slice(2, 11),
        time: '12:00',
        activity: '',
        location: '',
        link: '',
        notes: '',
        done: false
      };
      const lastIdx = days.length - 1;
      days[lastIdx].items.push(newItem);
      updateTrip({ itinerary: days });
      toast.info("Đã thêm lịch trình mới");
    } else if (activeTab === 'budget') {
      const newItem: BudgetItem = {
        id: Math.random().toString(36).slice(2, 11),
        category: 'Khác',
        estimated: 0,
        actual: 0,
        payer: activeTrip.participants[0] || 'Tôi',
        notes: ''
      };
      updateTrip({ budget: [...activeTrip.budget, newItem] });
      toast.info("Đã thêm khoản chi mới");
    } else if (activeTab === 'packing') {
      const newItem: PackingItem = {
        id: Math.random().toString(36).slice(2, 11),
        item: '',
        quantity: 1,
        category: 'Khác',
        packed: false,
        assignee: activeTrip.participants[0] || 'Tôi'
      };
      updateTrip({ packing: [...activeTrip.packing, newItem] });
      toast.info("Đã thêm món đồ mới");
    } else if (activeTab === 'participants') {
      setShowAddParticipant(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1C1E] font-sans flex flex-col pb-24">
      <Toaster position="top-center" richColors />
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm flex-col sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <Calendar className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-gray-900">TripFlow</h1>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <select
            value={active || ''}
            onChange={(e) => selectTrip(e.target.value)}
            className="border border-gray-300 rounded-xl p-1 text-sm"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>{t.name || 'Chuyến mới'}</option>
            ))}
          </select>
          <button
            onClick={() => createTrip('Chuyến mới', INITIAL_DATA)}
            className="text-indigo-600 hover:underline text-sm"
          >
            + Chuyến mới
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-full transition-all active:scale-90 ${showSettings ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Modal (Overlay) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl">Cài đặt</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <button 
              onClick={() => {
                if (confirm("Xóa toàn bộ dữ liệu chuyến đi? Thao tác này không thể hoàn tác.")) {
                  handleReset();
                }
              }}
              className="w-full bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center justify-between group hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                <span className="font-bold">Xóa toàn bộ dữ liệu</span>
              </div>
              <Plus className="w-4 h-4 rotate-45 opacity-50" />
            </button>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="font-black text-xl mb-4 text-center">Thêm người tham gia</h2>
            <input 
              autoFocus
              type="text"
              placeholder="Nhập tên..."
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl p-4 text-lg font-bold outline-none transition-all mb-4"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddParticipant(false)}
                className="flex-1 bg-gray-100 text-gray-600 font-bold p-4 rounded-2xl active:scale-95 transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={handleAddParticipant}
                className="flex-1 bg-indigo-600 text-white font-bold p-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-indigo-100"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-x-hidden">
        {activeTab === 'dashboard' && activeTrip && <Dashboard trip={activeTrip} onUpdate={updateTrip} />}
        {activeTab === 'itinerary' && (
          <ItineraryTab 
            days={activeTrip?.itinerary || []} 
            setDays={(days) => updateTrip({ itinerary: days })} 
          />
        )}
        {activeTab === 'budget' && (
          <BudgetTab 
            items={activeTrip?.budget || []} 
            participants={activeTrip?.participants || []}
            setItems={(items: import('./types').BudgetItem[]) => updateTrip({ budget: items })} 
          />
        )}
        {activeTab === 'packing' && (
          <PackingTab 
            items={activeTrip?.packing || []} 
            participants={activeTrip?.participants || []}
            setItems={(items: import('./types').PackingItem[]) => updateTrip({ packing: items })} 
          />
        )}
        {activeTab === 'participants' && (
          <ParticipantsTab 
            participants={activeTrip?.participants || []}
            setParticipants={(p) => updateTrip({ participants: p })}
            budget={activeTrip?.budget || []}
          />
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab !== 'dashboard' && (
        <button 
          onClick={handleAddItem}
          className="fixed bottom-28 right-6 w-15 h-15 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all z-40"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/50 p-2 z-50">
        <div className="flex justify-around items-center">
          <TabButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard className="w-6 h-6" />} 
            label="Tổng quan" 
          />
          <TabButton 
            active={activeTab === 'itinerary'} 
            onClick={() => setActiveTab('itinerary')} 
            icon={<Clock className="w-6 h-6" />} 
            label="Lịch trình" 
          />
          <TabButton 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')} 
            icon={<Wallet className="w-6 h-6" />} 
            label="Chi tiêu" 
          />
          <TabButton 
            active={activeTab === 'packing'} 
            onClick={() => setActiveTab('packing')} 
            icon={<Package className="w-6 h-6" />} 
            label="Đồ dùng" 
          />
          <TabButton 
            active={activeTab === 'participants'} 
            onClick={() => setActiveTab('participants')} 
            icon={<User className="w-6 h-6" />} 
            label="Bạn bè" 
          />
        </div>
      </nav>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: Readonly<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }>) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 flex-1 py-1 rounded-xl transition-all active:scale-95 ${
        active ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className={`${active ? 'scale-110' : ''} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}
