
import React, { useState, useEffect } from 'react';
import NumberInput from '../components/NumberInput';
import { IndianRupee, Percent } from 'lucide-react';

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(5000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [results, setResults] = useState({
    netAmount: 0,
    gstAmount: 0,
    totalAmount: 0,
    cgst: 0,
    sgst: 0
  });

  const GST_RATES = [3, 5, 12, 18, 28];

  useEffect(() => {
    let net = 0, gst = 0, total = 0;
    if (mode === 'add') {
      net = amount;
      gst = (amount * gstRate) / 100;
      total = net + gst;
    } else {
      total = amount;
      net = (amount * 100) / (100 + gstRate);
      gst = total - net;
    }

    setResults({
      netAmount: Math.round(net * 100) / 100,
      gstAmount: Math.round(gst * 100) / 100,
      totalAmount: Math.round(total * 100) / 100,
      cgst: Math.round((gst / 2) * 100) / 100,
      sgst: Math.round((gst / 2) * 100) / 100,
    });
  }, [amount, gstRate, mode]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <NumberInput 
            label="Base Amount"
            icon={<IndianRupee size={12}/>}
            value={amount}
            onChange={setAmount}
            prefix="₹"
            step={100}
            className="[&>div]:bg-slate-50 [&>div]:border-slate-100 [&>div]:p-3 [&>div]:rounded-[28px]"
          />
        </div>
        
        <div className="lg:col-span-7 space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Percent size={14} className="text-indigo-400"/> Select GST Rate
          </label>
          <div className="flex flex-wrap gap-3 items-center">
            {GST_RATES.map(rate => (
              <button 
                key={rate}
                onClick={() => setGstRate(rate)}
                className={`flex-1 min-w-[80px] px-4 py-4 rounded-2xl text-sm font-black transition-all border ${gstRate === rate ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-indigo-600 scale-105' : 'bg-white text-slate-500 hover:border-indigo-300 border-slate-100'}`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-[28px] max-w-2xl mx-auto border border-slate-200/50 shadow-inner">
        <button 
          onClick={() => setMode('add')}
          className={`flex-1 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all ${mode === 'add' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >Exclusive of GST</button>
        <button 
          onClick={() => setMode('remove')}
          className={`flex-1 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all ${mode === 'remove' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >Inclusive of GST</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-10 rounded-[48px] text-center border border-slate-100 shadow-sm group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Net Price</p>
          <p className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(results.netAmount)}</p>
        </div>
        <div className="bg-indigo-50/30 p-10 rounded-[48px] text-center border border-indigo-50 shadow-sm group hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all">
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">GST Amount</p>
          <p className="text-3xl font-black text-indigo-600 tracking-tight">{formatCurrency(results.gstAmount)}</p>
        </div>
        <div className="bg-indigo-600 p-10 rounded-[48px] text-center shadow-2xl shadow-indigo-200 transform scale-105 border-4 border-white">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-3">Grand Total</p>
          <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(results.totalAmount)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-8 bg-slate-50/50 rounded-[40px] border border-slate-100">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">CGST ({(gstRate/2).toFixed(1)}%)</p>
          <p className="text-xl font-bold text-slate-700">{formatCurrency(results.cgst)}</p>
        </div>
        <div className="w-px bg-slate-200 hidden md:block" />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">SGST ({(gstRate/2).toFixed(1)}%)</p>
          <p className="text-xl font-bold text-slate-700">{formatCurrency(results.sgst)}</p>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Precision Tax Calculation Engine • Local Only</p>
      </div>
    </div>
  );
};

export default GSTCalculator;
