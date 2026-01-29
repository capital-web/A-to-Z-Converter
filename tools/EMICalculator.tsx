
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import NumberInput from '../components/NumberInput';
import { IndianRupee, Percent, Clock, Calendar, ChevronDown, ChevronUp, Info, List, TrendingUp, Download, Database, Check } from 'lucide-react';

interface AmortizationRow {
  period: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');
  const [showSchedule, setShowSchedule] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalPayment: 0
  });

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
        schedule.push({
          period: i,
          principal: Math.max(0, principal),
          interest: Math.max(0, interest),
          totalPayment: emi,
          balance: Math.max(0, remainingBalance)
        });
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
        schedule.push({
          period: i,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          totalPayment: emi,
          balance: Math.max(0, remainingBalance)
        });
      }
    }
    return schedule;
  }, [loanAmount, interestRate, tenure, tenureType, method]);

  useEffect(() => {
    const n = tenureType === 'years' ? tenure * 12 : tenure;
    if (n <= 0 || loanAmount <= 0) {
      setResults({ emi: 0, totalInterest: 0, totalPayment: 0 });
      return;
    }

    if (amortizationSchedule.length > 0) {
      const emi = amortizationSchedule[0].totalPayment;
      const totalPayment = amortizationSchedule.reduce((acc, row) => acc + row.totalPayment, 0);
      const totalInterest = totalPayment - loanAmount;

      setResults({
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment)
      });
      setIsSaved(false);
    }
  }, [amortizationSchedule, loanAmount, tenure, tenureType]);

  const handleSaveToDB = () => {
    const historyStr = localStorage.getItem('omni_history_db');
    const history = historyStr ? JSON.parse(historyStr) : [];
    
    const newRecord = {
      type: 'EMI',
      label: `Loan of ₹${loanAmount.toLocaleString('en-IN')}`,
      result: `EMI: ₹${results.emi.toLocaleString('en-IN')}`,
      timestamp: Date.now(),
      data: { loanAmount, interestRate, tenure, tenureType, method, results }
    };

    localStorage.setItem('omni_history_db', JSON.stringify([...history, newRecord]));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const yearlySchedule = useMemo(() => {
    const years: any[] = [];
    for (let i = 0; i < amortizationSchedule.length; i += 12) {
      const slice = amortizationSchedule.slice(i, i + 12);
      const yearPrincipal = slice.reduce((acc, row) => acc + row.principal, 0);
      const yearInterest = slice.reduce((acc, row) => acc + row.interest, 0);
      years.push({
        year: Math.floor(i / 12) + 1,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.round(slice[slice.length - 1].balance)
      });
    }
    return years;
  }, [amortizationSchedule]);

  const data = [
    { name: 'Principal', value: loanAmount, color: '#4f46e5' },
    { name: 'Interest', value: results.totalInterest, color: '#e2e8f0' }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 px-1 gap-2">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Loan Tenure</label>
              <div className="flex bg-slate-100 rounded-lg sm:rounded-xl p-1 w-full sm:w-auto">
                <button onClick={() => setTenureType('years')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs rounded-md transition-all ${tenureType === 'years' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500 font-medium'}`}>Years</button>
                <button onClick={() => setTenureType('months')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs rounded-md transition-all ${tenureType === 'months' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500 font-medium'}`}>Months</button>
              </div>
            </div>
            <NumberInput value={tenure} onChange={setTenure} min={1} max={tenureType === 'years' ? 40 : 480} suffix={tenureType} />
            <input type="range" min="1" max={tenureType === 'years' ? 30 : 360} step="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div className="pt-6 sm:pt-8 border-t space-y-4 sm:space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex flex-col"><span className="text-slate-500 font-semibold text-base sm:text-lg">Monthly EMI</span><span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">{method === 'flat' ? 'Fixed Interest' : 'Declining Balance'}</span></div>
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-indigo-600 tracking-tight">{formatCurrency(results.emi)}</span>
            </div>
            <div className="flex justify-center">
               <button onClick={handleSaveToDB} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                 {isSaved ? <Check size={14}/> : <Database size={14}/>} {isSaved ? 'Saved to DB' : 'Save to Database'}
               </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-[32px] sm:rounded-[48px] border border-slate-100 shadow-inner">
          <div className="w-full h-64 sm:h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"><TrendingUp className="mx-auto text-indigo-600 mb-1 size-5 sm:size-6" /><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Ratio</p></div>
          </div>
          <div className="flex gap-6 sm:gap-10 mt-6 sm:mt-8">
            <div className="flex items-center gap-2 sm:gap-3"><div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-600 shadow-lg shadow-indigo-100" /><div className="flex flex-col"><span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Principal</span><span className="text-base sm:text-lg font-black text-slate-700">{results.totalPayment > 0 ? Math.round((loanAmount/results.totalPayment)*100) : 0}%</span></div></div>
            <div className="flex items-center gap-2 sm:gap-3"><div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-200" /><div className="flex flex-col"><span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Interest</span><span className="text-base sm:text-lg font-black text-slate-700">{results.totalPayment > 0 ? Math.round((results.totalInterest/results.totalPayment)*100) : 0}%</span></div></div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-[28px] sm:rounded-[40px] overflow-hidden shadow-sm transition-all duration-500">
        <button onClick={() => setShowSchedule(!showSchedule)} className="w-full p-6 sm:p-8 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition-colors group">
          <div className="flex items-center gap-3 sm:gap-4"><div className="p-2.5 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform"><Calendar className="size-5 sm:size-6" /></div><div className="text-left"><h3 className="text-lg sm:text-xl font-black tracking-tight">Amortization Schedule</h3><p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Yearly Breakdown</p></div></div>
          {showSchedule ? <ChevronUp className="size-5 sm:size-6 text-slate-300" /> : <ChevronDown className="size-5 sm:size-6 text-slate-300" />}
        </button>
        {showSchedule && (
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="overflow-x-auto rounded-[20px] sm:rounded-[28px] border border-slate-100">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400"><tr><th className="px-4 sm:px-6 py-4">Year</th><th className="px-4 sm:px-6 py-4">Principal</th><th className="px-4 sm:px-6 py-4">Interest</th><th className="px-4 sm:px-6 py-4">Balance</th></tr></thead>
                <tbody className="divide-y divide-slate-50">{yearlySchedule.map((row) => (<tr key={row.year} className="hover:bg-indigo-50/30 transition-colors"><td className="px-4 sm:px-6 py-4 font-bold text-slate-700 whitespace-nowrap">Year {row.year}</td><td className="px-4 sm:px-6 py-4 font-medium text-slate-600 whitespace-nowrap">{formatCurrency(row.principal)}</td><td className="px-4 sm:px-6 py-4 font-medium text-slate-600 whitespace-nowrap">{formatCurrency(row.interest)}</td><td className="px-4 sm:px-6 py-4 font-black text-slate-800 whitespace-nowrap">{formatCurrency(row.balance)}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-amber-50 rounded-[24px] sm:rounded-[32px] border border-amber-100 flex items-start gap-3 sm:gap-4"><div className="p-2 bg-white text-amber-600 rounded-lg sm:rounded-xl shadow-sm"><Info className="size-4 sm:size-5" /></div><div><p className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Prepayment Tip</p><p className="text-[10px] sm:text-xs text-amber-700 font-medium leading-relaxed">Making a prepayment of just 1 extra EMI every year can significantly reduce your loan tenure by years!</p></div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EMICalculator;
