
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MoveRight, MoveLeft, History, Plus, Minus, RotateCcw } from 'lucide-react';
import NumberInput from '../components/NumberInput';

type OffsetUnit = 'days' | 'weeks' | 'months' | 'years';
type Operation = 'add' | 'subtract';

const DateOffsetCalculator: React.FC = () => {
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [offsetValue, setOffsetValue] = useState<number>(3);
  const [unit, setUnit] = useState<OffsetUnit>('days');
  const [operation, setOperation] = useState<Operation>('add');
  const [resultDate, setResultDate] = useState<Date | null>(null);

  useEffect(() => {
    const date = new Date(baseDate);
    if (isNaN(date.getTime())) return;

    if (operation === 'add') {
      if (unit === 'days') date.setDate(date.getDate() + offsetValue);
      else if (unit === 'weeks') date.setDate(date.getDate() + offsetValue * 7);
      else if (unit === 'months') date.setMonth(date.getMonth() + offsetValue);
      else if (unit === 'years') date.setFullYear(date.getFullYear() + offsetValue);
    } else {
      if (unit === 'days') date.setDate(date.getDate() - offsetValue);
      else if (unit === 'weeks') date.setDate(date.getDate() - offsetValue * 7);
      else if (unit === 'months') date.setMonth(date.getMonth() - offsetValue);
      else if (unit === 'years') date.setFullYear(date.getFullYear() - offsetValue);
    }
    setResultDate(date);
  }, [baseDate, offsetValue, unit, operation]);

  const handleReset = () => {
    setBaseDate(new Date().toISOString().split('T')[0]);
    setOffsetValue(3);
    setUnit('days');
    setOperation('add');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      (e.currentTarget as any).showPicker();
    } catch (err) {}
  };

  const quickOffsets = [
    { label: '+7 Days', value: 7, u: 'days', op: 'add' },
    { label: '+30 Days', value: 30, u: 'days', op: 'add' },
    { label: '-1 Month', value: 1, u: 'months', op: 'subtract' },
    { label: '+1 Year', value: 1, u: 'years', op: 'add' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon size={14} /> Start Date
          </label>
          <div className="relative">
            <input 
              type="date" 
              value={baseDate}
              onClick={openPicker}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium cursor-pointer relative z-10"
            />
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          <button 
            onClick={() => setOperation('subtract')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${operation === 'subtract' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Minus size={14} /> Past
          </button>
          <button 
            onClick={() => setOperation('add')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${operation === 'add' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Plus size={14} /> Future
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <NumberInput 
              label={`Number of ${unit}`}
              value={offsetValue}
              onChange={setOffsetValue}
              min={1}
              max={10000}
            />
            
            <div className="flex flex-wrap gap-2">
              {(['days', 'weeks', 'months', 'years'] as OffsetUnit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${unit === u ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quick Presets</p>
             <div className="flex flex-wrap gap-2">
                {quickOffsets.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setOffsetValue(q.value);
                      setUnit(q.u as OffsetUnit);
                      setOperation(q.op as Operation);
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    {q.label}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="relative group">
          <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-100 min-h-[220px] flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="absolute top-0 left-0 p-8 opacity-10 pointer-events-none">
              {operation === 'add' ? <MoveRight size={120} /> : <MoveLeft size={120} />}
            </div>
            
            {resultDate && (
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.3em]">Target Date</p>
                <div>
                   <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                     {formatDate(resultDate)}
                   </h3>
                   <div className="mt-4 flex items-center justify-center gap-2">
                     <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/10">
                       {operation === 'add' ? 'Upcoming' : 'Past Date'}
                     </span>
                     <span className="text-white/60 text-xs font-medium">
                       {offsetValue} {unit} {operation === 'add' ? 'after' : 'before'}
                     </span>
                   </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleReset}
            className="absolute -bottom-4 right-8 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all hover:rotate-180 duration-500 group"
            title="Reset to Today"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="mt-12 text-center bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
        <div className="flex items-center justify-center gap-2 mb-1">
          <History size={14} className="text-slate-400"/>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Temporal Calculation Engine</p>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Accurately handles leap years and variable month lengths for reliable date planning.
        </p>
      </div>
    </div>
  );
};

export default DateOffsetCalculator;
