
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import NumberInput from '../components/NumberInput';
import { IndianRupee, TrendingUp, PiggyBank, Calendar, Activity, Building2, Coins, Calculator, Percent, Wallet, ChevronDown, X } from 'lucide-react';

type CalculatorType = 'SIP' | 'Lumpsum' | 'EBITDA';

interface FinancialCalculatorProps {
  settings?: any;
}

const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ settings }) => {
  const [type, setType] = useState<CalculatorType>('SIP');
  
  // Initialize type based on settings order if available
  useEffect(() => {
    if (settings?.financialToolOrder && settings.financialToolOrder.length > 0) {
      setType(settings.financialToolOrder[0] as CalculatorType);
    }
  }, []); // Run once on mount

  // Investment State
  const [investment, setInvestment] = useState<number>(5000); // Monthly SIP or One-time
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [invResults, setInvResults] = useState({
    investedAmount: 0,
    estReturns: 0,
    totalValue: 0
  });

  // EBITDA State
  const [showMarginInput, setShowMarginInput] = useState(false);
  const [ebitdaData, setEbitdaData] = useState({
    revenue: 1200000, // Total Revenue/Sales
    netIncome: 500000,
    interest: 25000,
    taxes: 45000,
    depreciation: 30000,
    amortization: 10000
  });
  const [ebitdaValue, setEbitdaValue] = useState(0);
  const [ebitdaMargin, setEbitdaMargin] = useState(0);

  useEffect(() => {
    if (type === 'EBITDA') {
      const total = ebitdaData.netIncome + ebitdaData.interest + ebitdaData.taxes + ebitdaData.depreciation + ebitdaData.amortization;
      setEbitdaValue(total);
      
      // Calculate Margin: (EBITDA / Revenue) * 100
      if (ebitdaData.revenue > 0) {
        setEbitdaMargin((total / ebitdaData.revenue) * 100);
      } else {
        setEbitdaMargin(0);
      }
    } else {
      let invested = 0;
      let total = 0;

      if (type === 'SIP') {
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        invested = investment * months;
        
        // FV = P × ({[1 + i]^n - 1} / i) × (1 + i)
        if (rate === 0) {
          total = invested;
        } else {
          total = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        }
      } else {
        // Lumpsum
        invested = investment;
        total = investment * Math.pow(1 + rate / 100, years);
      }

      setInvResults({
        investedAmount: Math.round(invested),
        totalValue: Math.round(total),
        estReturns: Math.round(total - invested)
      });
    }
  }, [type, investment, rate, years, ebitdaData]);

  const invChartData = [
    { name: 'Invested', value: invResults.investedAmount, color: '#e2e8f0' },
    { name: 'Returns', value: invResults.estReturns, color: '#4f46e5' }
  ];

  const ebitdaChartData = [
    { name: 'Net Income', value: ebitdaData.netIncome, color: '#4f46e5' },
    { name: 'Interest', value: ebitdaData.interest, color: '#818cf8' },
    { name: 'Taxes', value: ebitdaData.taxes, color: '#a5b4fc' },
    { name: 'Depreciation', value: ebitdaData.depreciation, color: '#c7d2fe' },
    { name: 'Amortization', value: ebitdaData.amortization, color: '#e0e7ff' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleEbitdaChange = (key: string, value: number) => {
    setEbitdaData(prev => ({ ...prev, [key]: value }));
  };

  const tabs = settings?.financialToolOrder || ['SIP', 'Lumpsum', 'EBITDA'];

  return (
    <div className="space-y-10">
      {/* Type Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-[28px] max-w-2xl mx-auto border border-slate-200/50 shadow-inner overflow-x-auto">
        {tabs.map((tab: CalculatorType) => (
           <button 
             key={tab}
             onClick={() => { 
                setType(tab); 
                if(tab === 'SIP') setInvestment(5000);
                if(tab === 'Lumpsum') setInvestment(100000);
             }}
             className={`flex-1 py-4 px-6 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${type === tab ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
           >
             {tab}
           </button>
        ))}
      </div>

      {type === 'EBITDA' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            
            {/* Optional Margin Calculation */}
            <div className={`transition-all duration-300 ${showMarginInput ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-slate-100'} border rounded-[24px] overflow-hidden`}>
              {!showMarginInput ? (
                <button 
                  onClick={() => setShowMarginInput(true)}
                  className="w-full p-4 flex items-center justify-between text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group"
                >
                  <span className="flex items-center gap-2 group-hover:gap-3 transition-all">
                    <Percent size={16} /> Calculate EBITDA Margin
                  </span>
                  <ChevronDown size={18} />
                </button>
              ) : (
                <div className="p-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                          <Percent size={12}/> Margin Calculation
                      </span>
                      <button 
                          onClick={() => setShowMarginInput(false)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-white"
                          title="Remove Margin Calculation"
                      >
                          <X size={16} />
                      </button>
                  </div>
                  <NumberInput 
                    label="Total Revenue from Sales"
                    icon={<Wallet size={12}/>}
                    value={ebitdaData.revenue}
                    onChange={(v) => handleEbitdaChange('revenue', v)}
                    step={10000}
                    prefix="₹"
                    className="[&>div]:bg-white"
                  />
                </div>
              )}
            </div>

            <NumberInput 
              label="Net Income"
              icon={<Coins size={12}/>}
              value={ebitdaData.netIncome}
              onChange={(v) => handleEbitdaChange('netIncome', v)}
              step={1000}
              prefix="₹"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberInput 
                label="Interest Expense"
                icon={<Activity size={12}/>}
                value={ebitdaData.interest}
                onChange={(v) => handleEbitdaChange('interest', v)}
                step={500}
                prefix="₹"
              />
              <NumberInput 
                label="Taxes"
                icon={<Building2 size={12}/>}
                value={ebitdaData.taxes}
                onChange={(v) => handleEbitdaChange('taxes', v)}
                step={500}
                prefix="₹"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberInput 
                label="Depreciation"
                icon={<TrendingUp size={12}/>}
                value={ebitdaData.depreciation}
                onChange={(v) => handleEbitdaChange('depreciation', v)}
                step={500}
                prefix="₹"
              />
              <NumberInput 
                label="Amortization"
                icon={<TrendingUp size={12}/>}
                value={ebitdaData.amortization}
                onChange={(v) => handleEbitdaChange('amortization', v)}
                step={500}
                prefix="₹"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`grid gap-4 ${showMarginInput ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2 relative z-10">EBITDA Value</p>
                <p className="text-3xl font-black tracking-tight relative z-10 truncate">{formatCurrency(ebitdaValue)}</p>
              </div>

              {showMarginInput && (
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col justify-center animate-in zoom-in-95 duration-300">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                       <Percent size={14} />
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">EBITDA Margin</p>
                   </div>
                   <p className="text-3xl font-black text-slate-800">{ebitdaMargin.toFixed(1)}%</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-[40px] p-6 border border-slate-100 flex-1 min-h-[400px] flex flex-col">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">EBITDA Composition</p>
              
              <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ebitdaChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}
                      dataKey="value" stroke="none"
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 20;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                            {(percent * 100).toFixed(0)}%
                          </text>
                        );
                      }}
                    >
                      {ebitdaChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                 <div className="flex flex-wrap justify-center gap-3">
                    {ebitdaChartData.map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">{entry.name}</span>
                      </div>
                    ))}
                 </div>
                 
                 <div className="pt-4 border-t border-slate-200/50">
                    <p className="text-[10px] text-center text-slate-400 max-w-sm mx-auto leading-relaxed">
                       EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <NumberInput 
                label={type === 'SIP' ? "Monthly Investment" : "Total Investment"}
                icon={<IndianRupee size={12}/>}
                value={investment}
                onChange={setInvestment}
                min={500}
                step={type === 'SIP' ? 500 : 5000}
                prefix="₹"
              />
              <input 
                type="range" min={type === 'SIP' ? 500 : 5000} max={type === 'SIP' ? 100000 : 10000000} step={type === 'SIP' ? 500 : 5000}
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <NumberInput 
                label="Expected Return Rate (p.a)"
                icon={<TrendingUp size={12}/>}
                value={rate}
                onChange={setRate}
                min={1}
                max={50}
                step={0.1}
                suffix="%"
              />
              <input 
                type="range" min="1" max="30" step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <NumberInput 
                label="Time Period"
                icon={<Calendar size={12}/>}
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                suffix="Years"
              />
              <input 
                type="range" min="1" max="50" step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-[40px] p-8 border border-slate-100">
             <div className="w-full h-64 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={invChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}
                     dataKey="value" stroke="none"
                   >
                     {invChartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip formatter={(value: number) => formatCurrency(value)} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Value</p>
                  <p className="text-xl font-black text-slate-800">{formatCurrency(invResults.totalValue)}</p>
               </div>
             </div>

             <div className="w-full grid grid-cols-2 gap-4 mt-4">
               <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="w-3 h-3 rounded-full bg-slate-300" />
                   <span className="text-xs font-bold text-slate-400 uppercase">Invested</span>
                 </div>
                 <p className="text-lg font-black text-slate-700">{formatCurrency(invResults.investedAmount)}</p>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="w-3 h-3 rounded-full bg-indigo-600" />
                   <span className="text-xs font-bold text-indigo-400 uppercase">Est. Returns</span>
                 </div>
                 <p className="text-lg font-black text-indigo-600">{formatCurrency(invResults.estReturns)}</p>
               </div>
             </div>
          </div>
        </div>
      )}

      <div className="text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
            {type === 'EBITDA' ? <Activity size={14} /> : <PiggyBank size={14} />}
            {type === 'SIP' ? 'Disciplined Investing' : type === 'Lumpsum' ? 'Growth Potential' : 'Business Performance'}
         </div>
      </div>
    </div>
  );
};

export default FinancialCalculator;
