import React, { useState, useEffect, useRef } from 'react';
import { TripData } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, MapPin, CheckCircle2, DollarSign, Package } from 'lucide-react';

export function Dashboard({ trip, onUpdate }: { trip: TripData, onUpdate: (updates: Partial<TripData>) => void }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(trip.startDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [trip.startDate]);

  // flatten items across all days
  const allItineraryItems = trip.itinerary.flatMap(day => day.items.map(i => ({...i, dayDate: day.date})));
  const itineraryProgress = (allItineraryItems.filter(i => i.done).length / (allItineraryItems.length || 1)) * 100 || 0;
  const packingProgress = (trip.packing.filter(i => i.packed).length / trip.packing.length) * 100 || 0;
  const totalBudget = trip.budget.reduce((acc, curr) => acc + curr.estimated, 0);
  const actualBudget = trip.budget.reduce((acc, curr) => acc + curr.actual, 0);

  return (
    <div className="space-y-6 pb-4">
      {/* Hero Header */}
      <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden shadow-lg group">
        <ImageWithFallback 
          src={trip.imageUrl || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHJlc29ydCUyMHZpZXd8ZW58MHx8fHwxNzcwNjI3OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080"}
          alt={trip.location}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        {/* file input for local upload */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result) {
                  onUpdate({ imageUrl: reader.result as string });
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {/* change image controls */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => {
              const url = prompt('Nhập URL ảnh mới:');
              if (url) onUpdate({ imageUrl: url });
            }}
            className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            title="Thay ảnh bằng URL"
          >
            ✏️
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            title="Tải ảnh lên từ máy"
          >
            📁
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <input 
              value={trip.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
              className="bg-transparent border-none focus:ring-0 p-0 text-inherit font-inherit w-full cursor-pointer hover:bg-white/10 rounded transition-colors"
            />
          </div>
          <input 
            value={trip.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="text-3xl font-black text-white leading-tight bg-transparent border-none focus:ring-0 p-0 w-full cursor-pointer hover:bg-white/10 rounded transition-colors"
          />
        </div>
      </div>

      {/* Countdown Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <Calendar className="w-24 h-24 -mr-8 -mt-8" />
        </div>
        <div className="relative z-10">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Khởi hành sau</p>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="date"
              value={new Date(trip.startDate).toISOString().split('T')[0]}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              className="text-[11px] font-black text-gray-900 bg-transparent border-none focus:ring-0 p-0 cursor-pointer hover:bg-white/10 rounded transition-colors"
            />
          </div>
          {timeLeft ? (
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 leading-none">{timeLeft.days}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Ngày</span>
              </div>
              <span className="text-2xl font-light text-gray-200 self-start mt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-black text-gray-900 leading-none">{timeLeft.hours}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Giờ</span>
              </div>
            </div>
          ) : (
            <div className="text-indigo-600 font-black text-2xl uppercase italic tracking-tight">Đang diễn ra! ✈️</div>
          )}
        </div>
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center relative shadow-inner">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-36">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lịch trình</span>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{Math.round(itineraryProgress)}%</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-500 h-full transition-all duration-700 ease-out" 
                style={{ width: `${itineraryProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-36">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Đồ dùng</span>
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{Math.round(packingProgress)}%</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-blue-500 h-full transition-all duration-700 ease-out" 
                style={{ width: `${packingProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="p-4 bg-amber-50 rounded-2xl shadow-inner">
              <DollarSign className="w-7 h-7 text-amber-600" />
            </div>
            <div className="w-full">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Tổng chi tiêu</p>
              <div className="flex flex-col sm:flex-row items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-gray-900">{actualBudget.toLocaleString('vi-VN')}</span>
                <span className="text-xs sm:text-xs font-bold text-gray-400">/ {totalBudget.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
          <div className="text-right w-full sm:w-auto">
            <p className={`text-sm sm:text-base font-black ${actualBudget > totalBudget ? 'text-red-500' : 'text-emerald-500'}`}>
              {actualBudget > totalBudget ? `+${(actualBudget - totalBudget).toLocaleString('vi-VN')}đ` : `-${(totalBudget - actualBudget).toLocaleString('vi-VN')}đ`}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Dư/Thiếu</p>
          </div>
        </div>
      </div>

      {/* Quick Summary Section */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h3 className="font-black text-xl mb-1">Sắp tới</h3>
          {(() => {
            const now = new Date();
            const upcoming = allItineraryItems
              .map(i => ({...i, datetime: new Date(`${i.dayDate}T${i.time}`)}))
              .filter(i => i.datetime >= now && !i.done)
              .sort((a,b)=>a.datetime.getTime() - b.datetime.getTime())
              .slice(0,2);
            if (upcoming.length === 0) {
              return <p className="text-indigo-100 text-xs font-medium">Không có hoạt động sắp tới</p>;
            }
            return (
              <>
                <p className="text-indigo-100 text-xs font-medium mb-5">{`Bạn có ${upcoming.length} hoạt động tiếp theo`}</p>
                {upcoming.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg mb-3">
                    <div className="text-center border-r border-white/20 pr-4">
                      <p className="text-xs text-white font-black">{item.datetime.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-[10px] text-indigo-200 font-bold">
                        {item.datetime.getHours() < 12 ? 'Sáng' : 'Chiều'}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.activity}</p>
                      <p className="text-xs text-indigo-100 opacity-80 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
