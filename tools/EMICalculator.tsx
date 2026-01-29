
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import NumberInput from '../components/NumberInput';
import { IndianRupee, Percent, Clock, Calendar, ChevronDown, ChevronUp, Info, List, TrendingUp, Download, Database, Check } from 'lucide-react';
import { SupabaseDB } from '../services/supabaseService';

interface AmortizationRow {
  period: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

const EMICalculator: React.FC<{ syncKey?: string }> = ({ syncKey }) => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');
  const [showSchedule, setShowSchedule] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [results, setResults] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  const amortizationSchedule = useMemo(() => {
    const p = loanAmount;
    const n = tenureType === 'years' ? tenure * 12 : tenure;
    if (n <= 0 || loanAmount <= 0) return [];
    const schedule: AmortizationRow[] = [];
    let remainingBalance = p;
    if (method === 'reducing') {
      const r = interestRate / 12 / 100;
      const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      for (let i = 1; i <= n; i++) {
        const interest = remainingBalance * r;
        const principal = emi - interest;
        remainingBalance -= principal;
        schedule.push({ period: i, principal: Math.max(0, principal), interest: Math.max(0, interest), totalPayment: emi, balance: Math.max(0, remainingBalance) });
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
      setResults({ emi: Math.round(emi), totalInterest: Math.round(totalPayment - loanAmount), totalPayment: Math.round(totalPayment) });
      setIsSaved(false);
    }
  }, [amortizationSchedule, loanAmount]);

  const handleSaveToDB = async () => {
    const newRecord = {
      type: 'EMI',
      label: `Loan: ₹${loanAmount.toLocaleString('en-IN')}`,
      result: `₹${results.emi.toLocaleString('en-IN')}/mo`,
      timestamp: Date.now(),
      data: { loanAmount, interestRate, tenure, results }
    };

    // Save Local
    const local = localStorage.getItem('omni_history_db');
    const history = local ? JSON.parse(local) : [];
    localStorage.setItem('omni_history_db', JSON.stringify([...history, newRecord]));

    // Save Supabase
    if (syncKey) {
      await SupabaseDB.pushHistory(syncKey, newRecord);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
            <button onClick={() => setMethod('reducing')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${method === 'reducing' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}>Reducing</button>
            <button onClick={() => setMethod('flat')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${method === 'flat' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}>Flat</button>
          </div>
          <NumberInput label="Loan Amount" icon={<IndianRupee size={12}/>} value={loanAmount} onChange={setLoanAmount} step={10000} prefix="₹" />
          <NumberInput label="Interest Rate" icon={<Percent size={12}/>} value={interestRate} onChange={setInterestRate} step={0.1} suffix="%" />
          <div className="pt-6 border-t flex justify-between items-center">
            <div><span className="text-slate-500 font-semibold text-lg">Monthly EMI</span></div>
            <span className="text-4xl font-black text-indigo-600 tracking-tight">{formatCurrency(results.emi)}</span>
          </div>
          <button onClick={handleSaveToDB} className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-600 active:scale-95'}`}>
            {isSaved ? <><Check size={16} className="inline mr-2" /> Saved to Supabase</> : <><Database size={16} className="inline mr-2" /> Save to Database</>}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[48px] border border-slate-100 shadow-inner">
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={[{ name: 'Principal', value: loanAmount, color: '#4f46e5' }, { name: 'Interest', value: results.totalInterest, color: '#e2e8f0' }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">{[{ color: '#4f46e5' }, { color: '#e2e8f0' }].map((entry, index) => (<Cell key={index} fill={entry.color} />))}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-10 mt-6"><div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Principal</span><span className="text-lg font-black text-slate-700">{formatCurrency(loanAmount)}</span></div><div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Interest</span><span className="text-lg font-black text-slate-700">{formatCurrency(results.totalInterest)}</span></div></div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
