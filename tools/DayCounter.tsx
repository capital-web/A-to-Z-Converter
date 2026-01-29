
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const DayCounter: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    days: 0,
    weeks: 0,
    remainingDaysInWeeks: 0,
    preciseMonths: 0,
    remainingDaysInMonths: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(totalDays / 7);
    const remainingDaysInWeeks = totalDays % 7;

    // Precise Month + Day calculation
    const d1 = start < end ? start : end;
    const d2 = start < end ? end : start;

    let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    let extraDays = d2.getDate() - d1.getDate();

    if (extraDays < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      extraDays += prevMonth.getDate();
    }
    
    setStats({
      days: totalDays,
      weeks,
      remainingDaysInWeeks,
      preciseMonths: months,
      remainingDaysInMonths: extraDays,
      hours: totalDays * 24,
      minutes: totalDays * 24 * 60
    });
  }, [startDate, endDate]);

  const openPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      (e.currentTarget as any).showPicker();
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> Start Date
          </label>
          <div className="relative">
            <input 
              type="date" 
              value={startDate}
              onClick={openPicker}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium cursor-pointer relative z-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> End Date
          </label>
          <div className="relative">
            <input 
              type="date" 
              value={endDate}
              onClick={openPicker}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium cursor-pointer relative z-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-3xl text-center shadow-xl shadow-indigo-100 text-white transform hover:scale-105 transition-all">
          <p className="text-5xl font-black">{stats.days}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-indigo-200">Total Days</p>
        </div>
        <div className="bg-white border-2 border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:border-indigo-100 transition-all">
          <p className="text-4xl font-black text-slate-800">{stats.weeks}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Weeks + {stats.remainingDaysInWeeks} Days
          </p>
        </div>
        <div className="bg-white border-2 border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:border-indigo-100 transition-all">
          <p className="text-4xl font-black text-slate-800">{stats.preciseMonths}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Months + {stats.remainingDaysInMonths} Days
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl grid grid-cols-2 gap-4 border border-dashed border-slate-200">
        <div className="text-center flex flex-col items-center gap-1">
          <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm mb-1">
            <Clock size={16} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Hours</p>
          <p className="font-black text-slate-700">{stats.hours.toLocaleString()}</p>
        </div>
        <div className="text-center flex flex-col items-center gap-1">
          <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm mb-1">
            <Clock size={16} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Minutes</p>
          <p className="font-black text-slate-700">{stats.minutes.toLocaleString()}</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-400 font-medium italic">
          Difference between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default DayCounter;
