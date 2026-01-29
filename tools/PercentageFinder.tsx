
import React, { useState } from 'react';
import NumberInput from '../components/NumberInput';

const PercentageFinder: React.FC = () => {
  const [q1, setQ1] = useState({ p: 20, v: 1000, res: 200 });
  const [q2, setQ2] = useState({ v1: 50, v2: 200, res: 25 });
  const [q3, setQ3] = useState({ old: 100, current: 120, res: 20 });
  const [q4, setQ4] = useState({ p: 25, resVal: 50, original: 200 });
  const [q5, setQ5] = useState({ val: 1000, p: 10, resAdd: 1100, resSub: 900 });

  const handleQ1 = (p: number, v: number) => {
    setQ1({ p, v, res: (p / 100) * v });
  };

  const handleQ2 = (v1: number, v2: number) => {
    setQ2({ v1, v2, res: v2 !== 0 ? (v1 / v2) * 100 : 0 });
  };

  const handleQ3 = (oldV: number, currentV: number) => {
    setQ3({ old: oldV, current: currentV, res: oldV !== 0 ? ((currentV - oldV) / oldV) * 100 : 0 });
  };

  const handleQ4 = (p: number, resVal: number) => {
    setQ4({ p, resVal, original: p !== 0 ? (resVal / p) * 100 : 0 });
  };

  const handleQ5 = (val: number, p: number) => {
    const amount = (val * p) / 100;
    setQ5({ val, p, resAdd: val + amount, resSub: val - amount });
  };

  return (
    <div className="space-y-12">
      {/* Scenario 1 */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Calculate P% of V</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <NumberInput value={q1.p} onChange={(v) => handleQ1(v, q1.v)} suffix="%" />
            <NumberInput value={q1.v} onChange={(v) => handleQ1(q1.p, v)} prefix="of" />
          </div>
          <div className="text-indigo-600 font-black text-2xl px-4 min-w-[120px] text-center md:text-right">= {q1.res.toFixed(2)}</div>
        </div>
      </div>

      {/* Scenario 2 */}
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">V1 is what % of V2?</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <NumberInput value={q2.v1} onChange={(v) => handleQ2(v, q2.v2)} />
            <NumberInput value={q2.v2} onChange={(v) => handleQ2(q2.v1, v)} prefix="of" />
          </div>
          <div className="text-indigo-600 font-black text-2xl px-4 min-w-[120px] text-center md:text-right">= {q2.res.toFixed(2)}%</div>
        </div>
      </div>

      {/* Scenario 4 */}
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">V is P% of what?</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <NumberInput value={q4.resVal} onChange={(v) => handleQ4(q4.p, v)} />
            <NumberInput value={q4.p} onChange={(v) => handleQ4(v, q4.resVal)} prefix="is" suffix="%" />
          </div>
          <div className="text-indigo-600 font-black text-2xl px-4 min-w-[120px] text-center md:text-right">= {q4.original.toFixed(2)}</div>
        </div>
      </div>

      {/* Scenario 5 */}
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Add or Subtract P% to V</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <NumberInput value={q5.val} onChange={(v) => handleQ5(v, q5.p)} />
            <NumberInput value={q5.p} onChange={(v) => handleQ5(q5.val, v)} prefix="+/-" suffix="%" />
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <div className="text-green-600 font-black text-sm whitespace-nowrap">↑ {q5.resAdd.toFixed(2)}</div>
            <div className="text-red-500 font-black text-sm whitespace-nowrap">↓ {q5.resSub.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Scenario 3 */}
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Percentage Change</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <NumberInput value={q3.old} onChange={(v) => handleQ3(v, q3.current)} prefix="From" />
            <NumberInput value={q3.current} onChange={(v) => handleQ3(q3.old, v)} prefix="To" />
          </div>
          <div className={`font-black text-2xl px-4 min-w-[120px] text-center md:text-right ${q3.res >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {q3.res >= 0 ? '+' : ''}{q3.res.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageFinder;
