
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Ruler, Weight, Maximize2, Droplets, Thermometer, Clock, Database } from 'lucide-react';
import Dropdown, { DropdownOption } from '../components/Dropdown';
import NumberInput from '../components/NumberInput';

type UnitType = 'length' | 'weight' | 'area' | 'volume' | 'temperature' | 'time' | 'data';

const unitIcons: Record<UnitType, React.ReactNode> = {
  length: <Ruler size={16} />,
  weight: <Weight size={16} />,
  area: <Maximize2 size={16} />,
  volume: <Droplets size={16} />,
  temperature: <Thermometer size={16} />,
  time: <Clock size={16} />,
  data: <Database size={16} />
};

const units: Record<UnitType, Record<string, number>> = {
  length: {
    Meter: 1,
    Kilometer: 0.001,
    Centimeter: 100,
    Millimeter: 1000,
    Mile: 0.000621371,
    Yard: 1.09361,
    Foot: 3.28084,
    Inch: 39.3701,
    Pixel: 3779.527559
  },
  weight: {
    Kilogram: 1,
    Gram: 1000,
    Milligram: 1000000,
    MetricTon: 0.001,
    Pound: 2.20462,
    Ounce: 35.274
  },
  area: {
    SquareMeter: 1,
    SquareKilometer: 0.000001,
    SquareFoot: 10.7639,
    SquareMile: 3.861e-7,
    Acre: 0.000247105,
    Hectare: 0.0001
  },
  volume: {
    Liter: 1,
    Milliliter: 1000,
    Gallon: 0.264172,
    Quart: 1.05669,
    Pint: 2.11338,
    Cup: 4.22675
  },
  temperature: {
    Celsius: 1,
    Fahrenheit: 1,
    Kelvin: 1
  },
  time: {
    Second: 1,
    Minute: 1/60,
    Hour: 1/3600,
    Day: 1/86400,
    Week: 1/604800,
    Month: 1/2.628e+6,
    Year: 1/3.154e+7
  },
  data: {
    Byte: 1,
    Kilobyte: 1/1024,
    Megabyte: 1/1.049e+6,
    Gigabyte: 1/1.074e+9,
    Terabyte: 1/1.1e+12
  }
};

const MeasurementConverter: React.FC = () => {
  const [type, setType] = useState<UnitType>('length');
  const [val1, setVal1] = useState<number>(1);
  const [unit1, setUnit1] = useState<string>('');
  const [unit2, setUnit2] = useState<string>('');
  const [val2, setVal2] = useState<string>('');

  useEffect(() => {
    const keys = Object.keys(units[type]);
    setUnit1(keys[0]);
    setUnit2(keys[1] || keys[0]);
  }, [type]);

  useEffect(() => {
    if (unit1 && unit2) {
      const v = val1;
      if (isNaN(v)) {
        setVal2('');
        return;
      }

      if (type === 'temperature') {
        let celsius = v;
        if (unit1 === 'Fahrenheit') celsius = (v - 32) * 5/9;
        else if (unit1 === 'Kelvin') celsius = v - 273.15;

        let result = celsius;
        if (unit2 === 'Fahrenheit') result = (celsius * 9/5) + 32;
        else if (unit2 === 'Kelvin') result = celsius + 273.15;
        
        setVal2(result.toFixed(2));
        return;
      }

      const base = v / units[type][unit1];
      const res = base * units[type][unit2];
      setVal2(res.toString());
    }
  }, [val1, unit1, unit2, type]);

  const swap = () => {
    const tempUnit = unit1;
    const tempVal = parseFloat(val2) || 0;
    setUnit1(unit2);
    setUnit2(tempUnit);
    setVal1(tempVal);
  };

  const getUnitOptions = (): DropdownOption[] => {
    return Object.keys(units[type]).map(u => ({ value: u, label: u }));
  };

  return (
    <div className="space-y-10">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {(Object.keys(units) as UnitType[]).map(t => (
          <button 
            key={t}
            onClick={() => setType(t)}
            className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${type === t ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-indigo-600' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'}`}
          >
            {unitIcons[t]}
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-slate-50 p-6 md:p-10 rounded-[48px] border border-slate-100 shadow-inner">
        <div className="space-y-6">
          <Dropdown 
            label="Convert From" 
            value={unit1} 
            options={getUnitOptions()} 
            onChange={setUnit1} 
          />
          <NumberInput 
            value={val1}
            onChange={setVal1}
            step={1}
            icon={unitIcons[type]}
            className="w-full [&>div]:bg-white [&>div]:border-2 [&>div]:p-3 [&>div]:rounded-[24px]"
          />
        </div>

        <div className="flex lg:flex-col items-center justify-center gap-4 py-4 lg:py-0">
          <div className="h-px w-full bg-slate-200 hidden lg:block" />
          <button 
            onClick={swap}
            className="p-5 bg-white border shadow-2xl rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95 z-10 group"
          >
            <ArrowRightLeft className="lg:rotate-90 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="h-px w-full bg-slate-200 hidden lg:block" />
        </div>

        <div className="space-y-6">
          <Dropdown 
            label="Convert To" 
            value={unit2} 
            options={getUnitOptions()} 
            onChange={setUnit2} 
          />
          <div className="w-full p-6 bg-indigo-600 border-2 border-indigo-500 rounded-[24px] text-white shadow-xl shadow-indigo-200 flex flex-col gap-1">
             <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Resulting Value</span>
             <div className="flex items-center justify-between">
                <span className="text-3xl font-black truncate">
                  {val2 ? Number(val2).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0'}
                </span>
                <span className="text-indigo-300 font-bold text-sm ml-4 uppercase">{unit2}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Precision Unit Conversion Engine • No Data Saved</p>
      </div>
    </div>
  );
};

export default MeasurementConverter;
