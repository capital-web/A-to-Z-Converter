
import React, { useState, useEffect } from 'react';
import { Copy, Check, IndianRupee } from 'lucide-react';
import NumberInput from '../components/NumberInput';

const NumberToWords: React.FC = () => {
  const [input, setInput] = useState<number>(12500.50);
  const [words, setWords] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const convertPartToWords = (num: number): string => {
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return '';

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

    return res.trim();
  };

  const convertFullCurrency = (val: number): string => {
    if (isNaN(val) || val === 0) return 'Zero Rupees Only';

    const strVal = val.toString();
    const parts = strVal.split('.');
    const mainPart = parseInt(parts[0]) || 0;
    const decimalPart = parts[1] ? parseInt(parts[1].substring(0, 2).padEnd(2, '0')) : 0;

    let result = '';
    if (mainPart > 0) {
      result += convertPartToWords(mainPart) + ' Rupees';
    }

    if (decimalPart > 0) {
      if (result) result += ' and ';
      result += convertPartToWords(decimalPart) + ' Paisa';
    }

    return result ? result + ' Only' : 'Zero Rupees Only';
  };

  useEffect(() => {
    setWords(convertFullCurrency(input));
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(words);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <NumberInput 
          label="Enter Amount"
          icon={<IndianRupee size={12}/>}
          value={input}
          onChange={setInput}
          prefix="₹"
          step={10}
          className="max-w-md"
        />
      </div>

      <div className="relative group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Amount in Words (Indian Format)</label>
        <div className="min-h-32 w-full p-8 bg-indigo-50/50 rounded-3xl border-2 border-dashed border-indigo-200 flex items-center justify-center text-center transition-all group-hover:border-indigo-400">
          <p className="text-xl font-medium text-slate-700 leading-relaxed capitalize">
            {words || 'Enter a valid number above'}
          </p>
        </div>
        
        {words && (
          <button 
            onClick={handleCopy}
            className="absolute bottom-4 right-4 bg-white shadow-lg border p-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[100, 500.75, 1000, 10000.50].map(v => (
          <button 
            key={v}
            onClick={() => setInput(v)}
            className="py-2 px-4 rounded-xl border bg-white text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
          >
            ₹{v.toLocaleString('en-IN')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberToWords;
