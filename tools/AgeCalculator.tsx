
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, PartyPopper, RefreshCw, Clock, Info, Stars, Hourglass, Database, Check } from 'lucide-react';
import { SupabaseDB } from '../services/supabaseService';

const getZodiacSign = (date: Date) => {
  const day = date.getDate(); const month = date.getMonth() + 1;
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

const AgeCalculator: React.FC<{ syncKey?: string }> = ({ syncKey }) => {
  const [birthDate, setBirthDate] = useState<string>(new Date(1995, 0, 1).toISOString().split('T')[0]);
  const [today, setToday] = useState<string>(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const dob = new Date(birthDate); const now = new Date(today);
    if (dob > now) { setAge({ years: 0, months: 0, days: 0 }); return; }
    let years = now.getFullYear() - dob.getFullYear(); let months = now.getMonth() - dob.getMonth(); let days = now.getDate() - dob.getDate();
    if (days < 0) { months -= 1; const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += lastMonth.getDate(); }
    if (months < 0) { years -= 1; months += 12; }
    setAge({ years, months, days });
  }, [birthDate, today]);

  const handleSaveToDB = async () => {
    const newRecord = {
      type: 'Age',
      label: `DOB: ${new Date(birthDate).toLocaleDateString()}`,
      result: `${age.years}Y, ${age.months}M`,
      timestamp: Date.now(),
      data: { birthDate, age }
    };
    const local = localStorage.getItem('omni_history_db');
    const history = local ? JSON.parse(local) : [];
    localStorage.setItem('omni_history_db', JSON.stringify([...history, newRecord]));
    if (syncKey) await SupabaseDB.pushHistory(syncKey, newRecord);
    setIsSaved(true); setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" />
        <input type="date" value={today} onChange={e => setToday(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" />
      </div>
      <div className="bg-indigo-600 rounded-[40px] p-10 text-white text-center shadow-2xl">
         <div className="flex justify-around items-center">
            <div><p className="text-6xl font-black">{age.years}</p><p className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Years</p></div>
            <div><p className="text-6xl font-black">{age.months}</p><p className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Months</p></div>
            <div><p className="text-6xl font-black">{age.days}</p><p className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Days</p></div>
         </div>
      </div>
      <div className="flex justify-center">
        <button onClick={handleSaveToDB} className={`px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white shadow-xl hover:bg-indigo-600 active:scale-95'}`}>
          {isSaved ? <><Check size={16} className="inline mr-2" /> Saved to Supabase</> : <><Database size={16} className="inline mr-2" /> Save to Database</>}
        </button>
      </div>
    </div>
  );
};

export default AgeCalculator;
