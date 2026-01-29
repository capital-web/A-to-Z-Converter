
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, PartyPopper, RefreshCw, Clock, Info, Stars, Hourglass } from 'lucide-react';

const getZodiacSign = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", icon: "♒" };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: "Pisces", icon: "♓" };
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", icon: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", icon: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", icon: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", icon: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", icon: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", icon: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", icon: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", icon: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", icon: "♐" };
  return { sign: "Capricorn", icon: "♑" };
};

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>(new Date(1995, 0, 1).toISOString().split('T')[0]);
  const [today, setToday] = useState<string>(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const [nextBirthday, setNextBirthday] = useState({ months: 0, days: 0 });
  
  const lifeStats = useMemo(() => {
    const dob = new Date(birthDate);
    const now = new Date(today);
    if (dob > now) return null;

    const diffTime = now.getTime() - dob.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      months: (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth()),
      weeks: Math.floor(totalDays / 7),
      days: totalDays,
      hours: totalDays * 24,
      minutes: totalDays * 24 * 60,
      zodiac: getZodiacSign(dob)
    };
  }, [birthDate, today]);

  useEffect(() => {
    const dob = new Date(birthDate);
    const now = new Date(today);

    if (dob > now) {
      setAge({ years: 0, months: 0, days: 0 });
      return;
    }

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge({ years, months, days });

    // Next Birthday Calculation
    const nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday <= now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }

    const diff = nextBday.getTime() - now.getTime();
    const totalDaysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    const nextMonths = Math.floor(totalDaysRemaining / 30.44);
    const nextDays = Math.floor(totalDaysRemaining % 30.44);
    setNextBirthday({ months: nextMonths, days: nextDays });

  }, [birthDate, today]);

  const handleReset = () => {
    setBirthDate(new Date(1995, 0, 1).toISOString().split('T')[0]);
    setToday(new Date().toISOString().split('T')[0]);
  };

  const openPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      (e.currentTarget as any).showPicker();
    } catch (err) {}
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 ml-1">Select Date of Birth</label>
          <div className="relative group">
            <input 
              type="date" 
              value={birthDate}
              onClick={openPicker}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-[20px] sm:rounded-[28px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all cursor-pointer relative z-10 font-bold text-slate-700 text-sm sm:text-base"
            />
            <CalendarIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-indigo-600 z-0 size-4 sm:size-5" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 ml-1">Age on Date</label>
          <div className="relative group">
            <input 
              type="date" 
              value={today}
              onClick={openPicker}
              onChange={(e) => setToday(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-[20px] sm:rounded-[28px] focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all cursor-pointer relative z-10 font-bold text-slate-700 text-sm sm:text-base"
            />
            <CalendarIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-indigo-600 z-0 size-4 sm:size-5" />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="bg-indigo-600 rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 md:p-14 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="space-y-1 sm:space-y-2 py-4 md:py-0">
              <p className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter">{age.years}</p>
              <p className="text-[9px] sm:text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-indigo-200">Years Old</p>
            </div>
            <div className="space-y-1 sm:space-y-2 py-4 md:py-0">
              <p className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter">{age.months}</p>
              <p className="text-[9px] sm:text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-indigo-200">Months</p>
            </div>
            <div className="space-y-1 sm:space-y-2 py-4 md:py-0">
              <p className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter">{age.days}</p>
              <p className="text-[9px] sm:text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-indigo-200">Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 flex items-center gap-4 sm:gap-6 border border-slate-100 shadow-sm group hover:border-indigo-200 transition-colors">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <PartyPopper className="size-6 sm:size-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-base sm:text-lg">Next Birthday</h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              In <span className="text-indigo-600 font-black">{nextBirthday.months} months</span> and <span className="text-indigo-600 font-black">{nextBirthday.days} days</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 flex items-center gap-4 sm:gap-6 border border-slate-100 shadow-sm group hover:border-purple-200 transition-colors">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform text-2xl sm:text-3xl">
            {lifeStats?.zodiac.icon}
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-base sm:text-lg">Zodiac Sign</h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium capitalize">
              Your star sign is <span className="text-purple-600 font-black">{lifeStats?.zodiac.sign}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
           <Hourglass size={14} /> Total Life Breakdown
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
           {[
             { label: 'Months', val: lifeStats?.months.toLocaleString(), icon: <CalendarIcon size={14}/> },
             { label: 'Weeks', val: lifeStats?.weeks.toLocaleString(), icon: <Info size={14}/> },
             { label: 'Days', val: lifeStats?.days.toLocaleString(), icon: <Clock size={14}/> },
             { label: 'Hours', val: lifeStats?.hours.toLocaleString(), icon: <Hourglass size={14}/> },
             { label: 'Minutes', val: lifeStats?.minutes.toLocaleString(), icon: <Clock size={14}/> },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-50 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 text-center hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center justify-center gap-1">
                  {stat.icon} {stat.label}
                </p>
                <p className="text-lg sm:text-xl font-black text-slate-800">{stat.val}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleReset}
          className="bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 px-6 sm:px-10 py-4 sm:py-5 rounded-[20px] sm:rounded-[28px] flex items-center gap-2 sm:gap-3 font-black text-xs sm:text-sm uppercase tracking-widest transition-all active:scale-95 border border-transparent hover:border-red-100"
        >
          <RefreshCw size={16} />
          Reset Calculator
        </button>
      </div>
    </div>
  );
};

export default AgeCalculator;
