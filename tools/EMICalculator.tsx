
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import NumberInput from '../components/NumberInput';
import { IndianRupee, Percent, Clock, Calendar, ChevronDown, ChevronUp, Info, Database, Check, TrendingUp } from 'lucide-react';
import { SupabaseDB } from '../services/supabaseService';

interface EMICalculatorProps {
  syncKey?: string;
}

const EMICalculator: React.FC<EMICalculatorProps> = ({ syncKey }) => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');
  const [showSchedule, setShowSchedule] = useState(false);
  const [results, setResults] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculation Logic (Memoized)
  const amortizationSchedule = useMemo(() => {
    const p = loanAmount;
    const n = tenureType === 'years' ? tenure * 12 : tenure;
    if (n <= 0 || loanAmount <= 0) return [];

    const schedule = [];
    let remainingBalance = p;
    
    if (method === 'reducing') {
      const r = interestRate / 12 / 100;
      const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      
      for (let i = 1; i <= n; i++) {
        const interest = remainingBalance * r;
        const principal = emi - interest;
        remainingBalance -= principal;
        schedule.push({ period: i, principal, interest, totalPayment: emi, balance: Math.max(0, remainingBalance) });
      }
    } else {
      const t = tenureType === 'years' ? tenure : tenure / 12;
      const totalInterest = (p * interestRate * t) / 100;
      const totalPayment = p + totalInterest;
      const emi = totalPayment / n;
      const monthlyPrincipal = p / n;
      const monthlyInterest = totalInterest / n;

      for (let i = 1; i <= n; i++) {
        remainingBalance -= monthlyPrincipal;
        schedule.push({ period: i, principal: monthlyPrincipal, interest: monthlyInterest, totalPayment: emi, balance: Math.max(0, remainingBalance) });
      }
    }
    return schedule;
  }, [loanAmount, interestRate, tenure, tenureType, method]);

  useEffect(() => {
    if (amortizationSchedule.length > 0) {
      const emi = amortizationSchedule[0].totalPayment;
      const totalPayment = amortizationSchedule.reduce((acc, row) => acc + row.totalPayment, 0);
      setResults({
        emi: Math.round(emi),
        totalInterest: Math.round(totalPayment - loanAmount),
        totalPayment: Math.round(totalPayment)
      });
      setIsSaved(false);
    }
  }, [amortizationSchedule]);

  const handleSave = async () => {
    if (!syncKey) return;
    setIsSaving(true);
    const label = `Loan: ₹${loanAmount.toLocaleString('en-IN')} @ ${interestRate}%`;
    const resultText = `EMI: ₹${results.emi.toLocaleString('en-IN')}`;
    const data = { loanAmount, interestRate, tenure, tenureType, method, results };
    
    await SupabaseDB.pushHistory(syncKey, 'EMI', label, resultText, data);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl border border-slate-200/50">
            <button onClick={() => setMethod('reducing')} className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${method === 'reducing' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Reducing Balance</button>
            <button onClick={() => setMethod('flat')} className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${method === 'flat' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Flat Rate</button>
          </div>
          
          <div className="space-y-4">
            <NumberInput label="Loan Amount" icon={<IndianRupee size={12}/>} value={loanAmount} onChange={setLoanAmount} min={1000} step={10000} prefix="₹" />
            <input type="range" min="10000" max="20000000" step="50000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div className="space-y-4">
            <NumberInput label="Interest Rate (p.a)" icon={<Percent size={12}/>} value={interestRate} onChange={setInterestRate} min={0.1} max={30} step={0.1} suffix="%" />
            <input type="range" min="1" max="20" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2 px-1 gap-2">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Loan Tenure</label>
              <div className="flex bg-slate-100 rounded-lg sm:rounded-xl p-1">
                <button onClick={() => setTenureType('years')} className={`px-3 py-1 text-[10px] rounded-md transition-all ${tenureType === 'years' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}>Years</button>
                <button onClick={() => setTenureType('months')} className={`px-3 py-1 text-[10px] rounded-md transition-all ${tenureType === 'months' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}>Months</button>
              </div>
            </div>
            <NumberInput value={tenure} onChange={setTenure} min={1} max={tenureType === 'years' ? 40 : 480} suffix={tenureType} />
          </div>

          <div className="pt-6 sm:pt-8 border-t space-y-4">
            <div className="flex justify-between items-center">
              <div><span className="text-slate-500 font-semibold text-lg">Monthly EMI</span></div>
              <span className="text-3xl md:text-4xl font-black text-indigo-600 tracking-tight">{formatCurrency(results.emi)}</span>
            </div>
            
            {syncKey && (
              <button 
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-800 text-white hover:bg-indigo-600'}`}
              >
                {isSaving ? 'Saving...' : isSaved ? <><Check size={16}/> Saved to Database</> : <><Database size={16}/> Save Calculation</>}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[48px] border border-slate-100 shadow-inner">
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Principal', value: loanAmount, color: '#4f46e5' }, { name: 'Interest', value: results.totalInterest, color: '#e2e8f0' }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {[0, 1].map((i) => <Cell key={i} fill={i === 0 ? '#4f46e5' : '#e2e8f0'} />)}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"><TrendingUp className="mx-auto text-indigo-600 mb-1" size={20} /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ratio</p></div>
          </div>
          <div className="flex gap-10 mt-6">
            <div className="text-center"><p className="text-[10px] uppercase font-bold text-slate-400">Principal</p><p className="text-lg font-black text-slate-700">{results.totalPayment > 0 ? Math.round((loanAmount/results.totalPayment)*100) : 0}%</p></div>
            <div className="text-center"><p className="text-[10px] uppercase font-bold text-slate-400">Interest</p><p className="text-lg font-black text-slate-700">{results.totalPayment > 0 ? Math.round((results.totalInterest/results.totalPayment)*100) : 0}%</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
