
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  searchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onChange, icon, className = "", searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(opt => 
      (opt.label || opt.value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className={`space-y-2 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-700 flex items-center justify-between hover:border-indigo-300 transition-all focus:ring-4 focus:ring-indigo-50/50"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon}
          <span className="capitalize truncate">{(selectedOption?.label || selectedOption?.value).replace(/-/g, ' ')}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          {searchable && (
            <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto py-2 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 flex items-center justify-between ${value === opt.value ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600'}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {opt.icon}
                    <span className="capitalize truncate">{(opt.label || opt.value).replace(/-/g, ' ')}</span>
                  </div>
                  {value === opt.value && <Check size={16} className="flex-shrink-0" />}
                </button>
              ))
            ) : (
               <div className="p-4 text-center text-xs text-slate-400 font-medium">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
