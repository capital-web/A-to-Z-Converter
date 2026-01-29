
import React, { useState, useMemo } from 'react';
import { RotateCcw, Banknote } from 'lucide-react';
import NumberInput from '../components/NumberInput';

const convertToWords = (num: number): string => {
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const getBelowHundred = (n: number): string => {
    if (n < 10) return single[n];
    if (n < 20) return double[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
  };

  const getBelowThousand = (n: number): string => {
    if (n < 100) return getBelowHundred(n);
    return single[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + getBelowHundred(n % 100) : '');
  };

  let res = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  if (crore > 0) res += getBelowThousand(crore) + ' Crore ';
  if (lakh > 0) res += getBelowHundred(lakh) + ' Lakh ';
  if (thousand > 0) res += getBelowHundred(thousand) + ' Thousand ';
  if (hundred > 0) res += getBelowThousand(hundred);

  return res.trim() + ' Only';
};

const CurrencyCounter: React.FC = () => {
  const denominations = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
  const [counts, setCounts] = useState<Record<number, number>>(
    denominations.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {})
  );

  const totals = useMemo(() => {
    const breakdown = denominations.map(d => ({
      denom: d,
      count: counts[d],
      total: d * counts[d]
    }));
    const grandTotal = breakdown.reduce((acc, curr) => acc + curr.total, 0);
    const totalCount = breakdown.reduce((acc, curr) => acc + curr.count, 0);
    return { breakdown, grandTotal, totalCount, inWords: convertToWords(grandTotal) };
  }, [counts]);

  const reset = () => setCounts(denominations.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {}));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 p-6 rounded-3xl border">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-4xl font-black text-indigo-600">{formatCurrency(totals.grandTotal)}</p>
          </div>
          <button onClick={reset} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <RotateCcw size={20} />
          </button>
        </div>
        {totals.grandTotal > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">In Words</p>
            <p className="text-sm font-medium text-slate-600 capitalize leading-relaxed">{totals.inWords}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {totals.breakdown.map((item) => (
          <div key={item.denom} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl hover:border-indigo-200 transition-colors">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm ${
              item.denom >= 500 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-700'
            }`}>
              ₹{item.denom}
            </div>
            <div className="flex-1">
              <NumberInput 
                value={counts[item.denom]}
                onChange={(val) => setCounts(prev => ({ ...prev, [item.denom]: val }))}
                min={0}
                placeholder="Count"
              />
            </div>
            <div className="w-24 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
              <p className="font-bold text-slate-700 truncate">{formatCurrency(item.total)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Total Notes/Coins Collected</span>
        <span className="text-indigo-600 font-black text-xl">{totals.totalCount.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CurrencyCounter;
