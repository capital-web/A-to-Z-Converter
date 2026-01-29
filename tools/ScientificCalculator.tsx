
import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';

const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [lastAction, setLastAction] = useState<'number' | 'operator' | 'equal' | 'func'>('number');

  const handleInput = (val: string) => {
    if (lastAction === 'equal') {
      setDisplay(val);
      setExpression(val);
      setLastAction('number');
      return;
    }

    if (display === '0') {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(display + val);
      setExpression(expression + val);
    }
    setLastAction('number');
  };

  const handleFunction = (func: string) => {
    let newExpr = expression;
    if (lastAction === 'equal') {
        newExpr = display;
    }
    
    switch (func) {
      case 'sin': newExpr = `Math.sin(${newExpr})`; break;
      case 'cos': newExpr = `Math.cos(${newExpr})`; break;
      case 'tan': newExpr = `Math.tan(${newExpr})`; break;
      case 'log': newExpr = `Math.log10(${newExpr})`; break;
      case 'ln': newExpr = `Math.log(${newExpr})`; break;
      case 'sqrt': newExpr = `Math.sqrt(${newExpr})`; break;
      case 'pow2': newExpr = `Math.pow(${newExpr}, 2)`; break;
      case 'powY': newExpr = `${newExpr}**`; break;
      case 'pi': newExpr = (newExpr === '0' || newExpr === '') ? 'Math.PI' : newExpr + '*Math.PI'; break;
      case 'e': newExpr = (newExpr === '0' || newExpr === '') ? 'Math.E' : newExpr + '*Math.E'; break;
      default: break;
    }

    try {
      const result = eval(newExpr);
      setDisplay(String(result));
      setExpression(String(result));
      setLastAction('func');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const calculate = () => {
    try {
      const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
      setDisplay(String(result));
      setExpression(String(result));
      setLastAction('equal');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setLastAction('number');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression('');
    }
  };

  const buttons = [
    { label: 'sin', action: () => handleFunction('sin'), type: 'func' },
    { label: 'cos', action: () => handleFunction('cos'), type: 'func' },
    { label: 'tan', action: () => handleFunction('tan'), type: 'func' },
    { label: 'log', action: () => handleFunction('log'), type: 'func' },
    { label: 'ln', action: () => handleFunction('ln'), type: 'func' },
    { label: 'x²', action: () => handleFunction('pow2'), type: 'func' },
    { label: 'xʸ', action: () => handleFunction('powY'), type: 'func' },
    { label: '√', action: () => handleFunction('sqrt'), type: 'func' },
    { label: 'π', action: () => handleFunction('pi'), type: 'func' },
    { label: 'e', action: () => handleFunction('e'), type: 'func' },
    { label: '(', action: () => handleInput('('), type: 'bracket' },
    { label: ')', action: () => handleInput(')'), type: 'bracket' },
    { label: 'AC', action: clear, type: 'action' },
    { label: '7', action: () => handleInput('7'), type: 'number' },
    { label: '8', action: () => handleInput('8'), type: 'number' },
    { label: '9', action: () => handleInput('9'), type: 'number' },
    { label: '÷', action: () => handleInput('/'), type: 'operator' },
    { label: '4', action: () => handleInput('4'), type: 'number' },
    { label: '5', action: () => handleInput('5'), type: 'number' },
    { label: '6', action: () => handleInput('6'), type: 'number' },
    { label: '×', action: () => handleInput('*'), type: 'operator' },
    { label: '1', action: () => handleInput('1'), type: 'number' },
    { label: '2', action: () => handleInput('2'), type: 'number' },
    { label: '3', action: () => handleInput('3'), type: 'number' },
    { label: '-', action: () => handleInput('-'), type: 'operator' },
    { label: '0', action: () => handleInput('0'), type: 'number' },
    { label: '.', action: () => handleInput('.'), type: 'number' },
    { label: '=', action: calculate, type: 'equal' },
    { label: '+', action: () => handleInput('+'), type: 'operator' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl p-4 sm:p-6 md:p-8">
        <div className="text-right p-4 sm:p-6 md:p-8 min-h-[100px] sm:min-h-[140px] flex flex-col justify-end bg-slate-950/50 rounded-2xl sm:rounded-3xl mb-4 sm:mb-8">
          <div className="text-slate-500 text-[10px] sm:text-xs md:text-sm font-medium mb-1 sm:mb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {expression.replace(/\*/g, '×').replace(/\//g, '÷') || '\u00A0'}
          </div>
          <div className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight truncate">
            {display}
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`
                h-10 sm:h-14 md:h-16 rounded-xl md:rounded-2xl font-bold text-[10px] sm:text-sm md:text-lg transition-all active:scale-95
                ${btn.type === 'number' ? 'bg-slate-800 text-white hover:bg-slate-700' : ''}
                ${btn.type === 'operator' ? 'bg-slate-700 text-indigo-400 hover:bg-slate-600' : ''}
                ${btn.type === 'func' ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60' : ''}
                ${btn.type === 'action' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : ''}
                ${btn.type === 'equal' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                ${btn.type === 'bracket' ? 'bg-slate-700 text-slate-300' : ''}
              `}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-10 sm:h-14 md:h-16 rounded-xl md:rounded-2xl font-bold text-lg bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95"
          >
            <Delete size={16} className="sm:size-[20px]" />
          </button>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 flex justify-center items-center gap-6">
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <History size={12} className="sm:size-[14px]" /> Advanced Precision Engine
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
