
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  icon,
  prefix,
  suffix,
  className = "",
  placeholder
}) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

  const handleDecrement = () => {
    const newVal = Math.max(min, numericValue - step);
    onChange(Number(newVal.toFixed(2)));
  };

  const handleIncrement = () => {
    const newVal = Math.min(max, numericValue + step);
    onChange(Number(newVal.toFixed(2)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
    onChange(val);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-sm group hover:border-indigo-300 transition-all focus-within:ring-4 focus-within:ring-indigo-50">
        <button
          type="button"
          onClick={handleDecrement}
          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all active:scale-90"
        >
          <Minus size={16} />
        </button>
        
        <div className="flex-1 flex items-center px-2">
          {prefix && <span className="text-slate-400 font-bold text-base mr-1">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className="w-full bg-transparent border-none p-2 text-center text-base font-bold text-slate-700 outline-none placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="text-slate-400 font-bold text-base ml-1">{suffix}</span>}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all active:scale-90"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
