
import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [lastAction, setLastAction] = useState<'number' | 'operator' | 'equal'>('number');

  const handleNumber = (num: string) => {
    if (lastAction === 'equal') {
      setDisplay(num);
      setEquation(num);
      setLastAction('number');
      return;
    }
    
    if (display === '0' || lastAction === 'operator') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    setEquation(equation + num);
    setLastAction('number');
  };

  const handleOperator = (op: string) => {
    if (lastAction === 'operator') {
      setEquation(equation.slice(0, -1) + op);
      return;
    }
    
    try {
      if (equation !== '' && lastAction === 'number') {
        const result = eval(equation.replace('×', '*').replace('÷', '/'));
        setDisplay(String(result));
      }
    } catch (e) {
      setDisplay('Error');
    }

    setEquation(equation + op);
    setLastAction('operator');
  };

  const calculate = () => {
    if (lastAction === 'operator' || !equation) return;
    
    try {
      const result = eval(equation.replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation(String(result));
      setLastAction('equal');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setLastAction('number');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
    
    if (equation.length > 0) {
      setEquation(equation.slice(0, -1));
    }
  };

  const togglePlusMinus = () => {
    const val = parseFloat(display);
    const newVal = val * -1;
    setDisplay(String(newVal));
    setEquation(equation.replace(new RegExp(`${val}$`), String(newVal)));
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    const newVal = val / 100;
    setDisplay(String(newVal));
    setEquation(equation.replace(new RegExp(`${val}$`), String(newVal)));
  };

  const buttons = [
    { label: 'AC', action: clear, type: 'action' },
    { label: '+/-', action: togglePlusMinus, type: 'action' },
    { label: '%', action: handlePercent, type: 'action' },
    { label: '÷', action: () => handleOperator('/'), type: 'operator' },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: '×', action: () => handleOperator('*'), type: 'operator' },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '-', action: () => handleOperator('-'), type: 'operator' },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },
    { label: '0', action: () => handleNumber('0'), type: 'number', colSpan: 2 },
    { label: '.', action: () => handleNumber('.'), type: 'number' },
    { label: '=', action: calculate, type: 'operator' },
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl p-6">
        <div className="text-right p-6 min-h-[160px] flex flex-col justify-end">
          <div className="text-slate-500 text-sm font-medium mb-1 truncate">
            {equation.replace(/\*/g, '×').replace(/\//g, '÷') || '\u00A0'}
          </div>
          <div className="text-white text-5xl font-black tracking-tight truncate">
            {display}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`
                h-16 rounded-2xl font-bold text-xl transition-all active:scale-95
                ${btn.type === 'number' ? 'bg-slate-800 text-white hover:bg-slate-700' : ''}
                ${btn.type === 'operator' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                ${btn.type === 'action' ? 'bg-slate-700 text-indigo-300 hover:bg-slate-600' : ''}
                ${btn.colSpan === 2 ? 'col-span-2' : ''}
              `}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-16 rounded-2xl font-bold text-xl bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <RotateCcw size={14} /> Local Calculations
        </div>
      </div>
    </div>
  );
};

export default BasicCalculator;
