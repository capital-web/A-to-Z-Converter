
import React, { useState, useEffect, useRef } from 'react';
import { Copy, Trash2, Check, PlusSquare, Repeat, Search, Filter, Undo, Redo, Sparkles, Eraser, CaseUpper, MousePointer2 } from 'lucide-react';

type ControlTab = 'case-converter' | 'find-replace' | 'prefix-suffix' | 'repeater' | 'cleanup';
type DuplicateMode = 'none' | 'global' | 'row-wise';

const TextConverter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [repeatCount, setRepeatCount] = useState<number>(2);
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ControlTab>('case-converter');
  const [dupMode, setDupMode] = useState<DuplicateMode>('none');

  // History State for Undo/Redo
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!isInternalUpdate.current) {
      setText(history[historyIndex]);
    }
    isInternalUpdate.current = false;
  }, [historyIndex, history]);

  const pushToHistory = (newText: string) => {
    if (newText === history[historyIndex]) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    pushToHistory(val);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isInternalUpdate.current = false;
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isInternalUpdate.current = false;
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyTransformation = (transformedText: string) => {
    setText(transformedText);
    pushToHistory(transformedText);
  };

  const handleCase = (type: string) => {
    let result = text;
    switch (type) {
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'capitalize':
        result = text.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
        break;
      case 'alternating':
        result = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'title':
        const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v\.?|via|vs\.?)$/i;
        result = text.toLowerCase().split(' ').map((word, index, array) => {
          if (index > 0 && index < array.length - 1 && word.match(smallWords)) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        break;
      case 'inverse':
        result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'slug':
        result = text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        break;
      case 'remove-spaces':
        result = text.replace(/\s+/g, ' ').trim();
        break;
      case 'remove-all-whitespace':
        result = text.replace(/\s+/g, '');
        break;
      case 'remove-line-breaks':
        result = text.replace(/[\r\n]+/gm, ' ').replace(/\s+/g, ' ').trim();
        break;
      case 'remove-empty-lines':
        result = text.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
        break;
      case 'remove-duplicate-lines':
        const lines = text.split(/\r?\n/);
        result = [...new Set(lines)].join('\n');
        break;
    }
    applyTransformation(result);
  };

  const handleReplace = () => {
    let result = text;
    if (findText) {
      try {
        const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedFind, 'g');
        result = text.replace(regex, replaceText);
      } catch (e) {
        result = text.split(findText).join(replaceText);
      }
    }
    
    if (dupMode === 'global') {
      const words = result.split(/\s+/).filter(w => w.length > 0);
      result = [...new Set(words)].join(' ');
    } else if (dupMode === 'row-wise') {
      result = result.split(/\r?\n/).map(line => {
        const words = line.split(/\s+/).filter(w => w.length > 0);
        return [...new Set(words)].join(' ');
      }).join('\n');
    }
    
    applyTransformation(result);
  };

  const applyPrefixSuffix = () => {
    if (!text) return;
    const lines = text.split('\n');
    const processed = lines.map(line => `${prefix}${line}${suffix}`).join('\n');
    applyTransformation(processed);
  };

  const handleRepeatLines = () => {
    if (!text || repeatCount < 1) return;
    const lines = text.split('\n');
    const processed = lines.map(line => {
      const repeated = [];
      for (let i = 0; i < repeatCount; i++) {
        repeated.push(line);
      }
      return repeated.join('\n');
    }).join('\n');
    applyTransformation(processed);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.trim() ? text.split('\n').length : 0
  };

  return (
    <div className="space-y-6">
      {/* Editor Area */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <textarea 
            value={text}
            onChange={handleManualChange}
            placeholder="Paste or type your text here..."
            className="w-full h-72 p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-sm transition-all resize-none shadow-inner"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title="Undo"
              className={`p-2 bg-white shadow border rounded-xl transition-all ${historyIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              title="Redo"
              className={`p-2 bg-white shadow border rounded-xl transition-all ${historyIndex === history.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              <Redo size={18} />
            </button>
            <div className="w-px h-8 bg-slate-100 mx-1" />
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-white shadow border rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button 
              onClick={() => { setText(''); pushToHistory(''); }}
              className="p-2 bg-white shadow border rounded-xl text-slate-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Characters</p>
            <p className="font-bold text-slate-700">{stats.chars}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Words</p>
            <p className="font-bold text-slate-700">{stats.words}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lines</p>
            <p className="font-bold text-slate-700">{stats.lines}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-slate-50 rounded-3xl border border-slate-100 p-1">
        <div className="flex bg-slate-200/50 p-1 rounded-2xl gap-1 flex-wrap overflow-hidden">
          <button 
            onClick={() => setActiveTab('case-converter')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all ${activeTab === 'case-converter' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CaseUpper size={14} /> Case Converter
          </button>
          <button 
            onClick={() => setActiveTab('find-replace')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all ${activeTab === 'find-replace' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Search size={14} /> Find & Replace
          </button>
          <button 
            onClick={() => setActiveTab('prefix-suffix')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all ${activeTab === 'prefix-suffix' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PlusSquare size={14} /> Prefix & Suffix
          </button>
          <button 
            onClick={() => setActiveTab('repeater')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all ${activeTab === 'repeater' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Repeat size={14} /> Line Repeater
          </button>
          <button 
            onClick={() => setActiveTab('cleanup')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all ${activeTab === 'cleanup' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Eraser size={14} /> Cleanup Spacing
          </button>
        </div>

        <div className="p-6 transition-all min-h-[160px]">
          {/* Case Converter Content */}
          {activeTab === 'case-converter' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <button onClick={() => handleCase('sentence')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">Sentence case</button>
              <button onClick={() => handleCase('lower')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">lower case</button>
              <button onClick={() => handleCase('upper')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">UPPER CASE</button>
              <button onClick={() => handleCase('capitalize')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">Capitalized Case</button>
              <button onClick={() => handleCase('alternating')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">aLtErNaTiNg cAsE</button>
              <button onClick={() => handleCase('title')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">Title Case</button>
              <button onClick={() => handleCase('inverse')} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">InVeRsE CaSe</button>
            </div>
          )}

          {/* Find & Replace Content */}
          {activeTab === 'find-replace' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Text to find..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                />
                <input 
                  type="text" 
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replacement text..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Unique Word Options</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="dup-mode" 
                      checked={dupMode === 'none'}
                      onChange={() => setDupMode('none')}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">None</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="dup-mode" 
                      checked={dupMode === 'global'}
                      onChange={() => setDupMode('global')}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">Global (All words)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="dup-mode" 
                      checked={dupMode === 'row-wise'}
                      onChange={() => setDupMode('row-wise')}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">Row Wise</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={handleReplace}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <Search size={16} /> Process Text
              </button>
            </div>
          )}

          {/* Prefix & Suffix Content */}
          {activeTab === 'prefix-suffix' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Prefix (e.g. # )"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                />
                <input 
                  type="text" 
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="Suffix (e.g. , )"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                />
              </div>
              <button 
                onClick={applyPrefixSuffix}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <PlusSquare size={16} /> Apply to All Lines
              </button>
            </div>
          )}

          {/* Line Repeater Content */}
          {activeTab === 'repeater' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(parseInt(e.target.value) || 1)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                  placeholder="Times to repeat..."
                />
                <button 
                  onClick={handleRepeatLines}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Repeat size={16} /> Repeat
                </button>
              </div>
            </div>
          )}

          {/* Cleanup Content */}
          {activeTab === 'cleanup' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <button 
                onClick={() => handleCase('remove-line-breaks')}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <Eraser size={18} />
                <span className="text-[11px] font-bold">Remove Line Breaks</span>
              </button>
              <button 
                onClick={() => handleCase('remove-spaces')}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <Filter size={18} />
                <span className="text-[11px] font-bold">Remove Extra Spaces</span>
              </button>
              <button 
                onClick={() => handleCase('remove-all-whitespace')}
                className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all text-indigo-700"
              >
                <MousePointer2 size={18} />
                <span className="text-[11px] font-bold text-center">Remove All Spaces & Tabs</span>
              </button>
              <button 
                onClick={() => handleCase('remove-empty-lines')}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <CaseUpper size={18} />
                <span className="text-[11px] font-bold">Remove Empty Lines</span>
              </button>
              <button 
                onClick={() => handleCase('remove-duplicate-lines')}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <Filter size={18} />
                <span className="text-[11px] font-bold">Remove Duplicate Lines</span>
              </button>
              <button 
                onClick={() => handleCase('slug')}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <Sparkles size={18} />
                <span className="text-[11px] font-bold">URL Slug Format</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextConverter;
