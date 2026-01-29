
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Trash2, Check, Languages, Delete, CornerDownLeft, Type, Undo, Redo } from 'lucide-react';

interface ScriptData {
  name: string;
  native: string;
  vowels: string[];
  consonants: string[];
  signs: string[];
  digits: string[];
}

const INDIC_SCRIPTS: Record<string, ScriptData> = {
  hindi: {
    name: 'Hindi/Marathi (Devanagari)',
    native: 'हिन्दी',
    vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
    consonants: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ'],
    signs: ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '़', '्'],
    digits: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']
  },
  bengali: {
    name: 'Bengali/Assamese',
    native: 'বাংলা',
    vowels: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'],
    consonants: ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ড়', 'ঢ়', 'য়'],
    signs: ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', '্', 'ং', 'ঃ', 'ঁ'],
    digits: ['০', '১', '२', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  },
  punjabi: {
    name: 'Punjabi (Gurmukhi)',
    native: 'ਪੰਜਾਬੀ',
    vowels: ['ਅ', 'ਆ', 'ਇ', 'ਈ', 'ਉ', 'ਊ', 'ਏ', 'ਐ', 'ਓ', 'ਔ'],
    consonants: ['ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਙ', 'ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਞ', 'ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਣ', 'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ', 'ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ', 'ਯ', 'ਰ', 'ਲ', 'ਵ', 'ੜ', 'ਸ਼', 'ਖ਼', 'ਗ਼', 'ਜ਼', 'ਫ਼', 'ਲ਼'],
    signs: ['ਾ', 'ਿ', 'ੀ', 'ੁ', 'ੂ', 'ੇ', 'ੈ', 'ੋ', 'ੌ', '੍', 'ਂ', 'ੱ', 'ੰ'],
    digits: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯']
  },
  gujarati: {
    name: 'Gujarati',
    native: 'ગુજરાતી',
    vowels: ['અ', 'આ', 'ઇ', 'ઈ', 'ઉ', 'ઊ', 'ઋ', 'એ', 'ઐ', 'ઓ', 'ઔ'],
    consonants: ['ક', 'ખ', 'ગ', 'ઘ', 'ઙ', 'ચ', 'છ', 'જ', 'ઝ', 'ઞ', 'ટ', 'ઠ', 'ડ', 'ઢ', 'ણ', 'ત', 'થ', 'દ', 'ધ', 'ન', 'પ', 'ફ', 'બ', 'ભ', 'મ', 'ય', 'ર', 'લ', 'વ', 'શ', 'ષ', 'સ', 'હ', 'ળ', 'ક્ષ', 'જ્ઞ'],
    signs: ['ા', 'િ', 'ી', 'ુ', 'ૂ', 'ૃ', 'ે', 'ૈ', 'ો', 'ૌ', '્', 'ં', 'ઃ'],
    digits: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯']
  },
  tamil: {
    name: 'Tamil',
    native: 'தமிழ்',
    vowels: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'],
    consonants: ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ'],
    signs: ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்'],
    digits: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯']
  },
  telugu: {
    name: 'Telugu',
    native: 'తెలుగు',
    vowels: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ౠ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ', 'అం', 'అః'],
    consonants: ['క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ', 'ఛ', 'జ', 'ఝ', 'ఞ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ', 'ళ', 'క్ష'],
    signs: ['ా', 'ి', 'ీ', 'ు', 'ూ', 'ృ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ', '్', 'ం', 'ః'],
    digits: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯']
  },
  kannada: {
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    vowels: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅః'],
    consonants: ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ', 'ಕ್ಷ'],
    signs: ['ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', '್', 'ಂ', 'ಃ'],
    digits: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯']
  },
  malayalam: {
    name: 'Malayalam',
    native: 'മലയാളം',
    vowels: ['അ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ഋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ഔ'],
    consonants: ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ದ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ರ', 'ല', 'വ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ള', 'ഴ', 'റ'],
    signs: ['ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೃ', 'െ', 'ೇ', 'ൈ', 'ൊ', 'ೋ', 'ൗ', '്', 'ം', 'ഃ'],
    digits: ['൦', '൧', '൨', '൩', '൪', '൫', '൬', '൭', '൮', '൯']
  }
};

const IndicKeyboard: React.FC = () => {
  const [activeLang, setActiveLang] = useState<string>('hindi');
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const script = INDIC_SCRIPTS[activeLang];

  const handleCharClick = (char: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + char + text.substring(end);
    
    setText(newText);
    pushToHistory(newText);

    // Focus back and move cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const handleBackspace = () => {
    const textarea = textareaRef.current;
    if (!textarea || text.length === 0) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let newText = "";
    let newCursor = 0;

    if (start !== end) {
      newText = text.substring(0, start) + text.substring(end);
      newCursor = start;
    } else if (start > 0) {
      newText = text.substring(0, start - 1) + text.substring(end);
      newCursor = start - 1;
    } else {
      return;
    }

    setText(newText);
    pushToHistory(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setText('');
    pushToHistory('');
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    pushToHistory(val);
  };

  return (
    <div className="space-y-8">
      {/* Header & Language Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Indic Input Tools</p>
           <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
             <Languages size={24} className="text-indigo-600" /> Multilingual Keyboard
           </h2>
        </div>
        
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl">
          {Object.entries(INDIC_SCRIPTS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveLang(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeLang === key ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {data.native}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[40px] blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
        <div className="relative bg-white border border-slate-200 rounded-[38px] overflow-hidden shadow-inner">
           <textarea 
             ref={textareaRef}
             value={text}
             onChange={handleManualChange}
             placeholder={`Start typing in ${script.name}...`}
             dir="auto"
             className="w-full min-h-[160px] p-8 bg-transparent outline-none resize-none text-2xl font-medium text-slate-800 placeholder:text-slate-300 leading-relaxed"
           />
           <div className="flex justify-between items-center px-8 pb-6">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleUndo}
                    disabled={historyIndex === 0}
                    className={`p-2 rounded-xl transition-all ${historyIndex === 0 ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
                    title="Undo"
                  >
                    <Undo size={18} />
                  </button>
                  <button 
                    onClick={handleRedo}
                    disabled={historyIndex === history.length - 1}
                    className={`p-2 rounded-xl transition-all ${historyIndex === history.length - 1 ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
                    title="Redo"
                  >
                    <Redo size={18} />
                  </button>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Characters</span>
                  <span className="text-sm font-bold text-slate-700">{text.length}</span>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Script</span>
                   <span className="text-sm font-bold text-indigo-600">{script.name}</span>
                </div>
             </div>
             <div className="flex gap-2">
               <button onClick={clear} className="p-3 text-slate-400 hover:text-red-500 transition-colors" title="Clear all">
                 <Trash2 size={20} />
               </button>
               <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}
               >
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 {copied ? 'Copied' : 'Copy Text'}
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Keyboard Container */}
      <div className="bg-slate-50 rounded-[48px] p-6 md:p-10 border border-slate-100 space-y-10 shadow-inner">
        
        {/* Vowels */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vowels (Swar)</h4>
           </div>
           <div className="flex flex-wrap gap-2">
              {script.vowels.map(char => (
                <button 
                  key={char} 
                  onClick={() => handleCharClick(char)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all active:scale-90"
                >
                  {char}
                </button>
              ))}
           </div>
        </div>

        {/* Consonants */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consonants (Vyanjan)</h4>
           </div>
           <div className="flex flex-wrap gap-2">
              {script.consonants.map(char => (
                <button 
                  key={char} 
                  onClick={() => handleCharClick(char)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg transition-all active:scale-90"
                >
                  {char}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Signs / Matras */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 ml-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vowel Signs (Matras)</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                 {script.signs.map(char => (
                   <button 
                     key={char} 
                     onClick={() => handleCharClick(char)}
                     className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-xl font-bold text-amber-700 hover:border-amber-400 hover:bg-white hover:shadow-lg transition-all active:scale-90"
                   >
                     ◌{char}
                   </button>
                 ))}
              </div>
           </div>

           {/* Digits & Actions */}
           <div className="space-y-4">
              <div className="flex items-center gap-3 ml-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digits & Controls</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                 {script.digits.map(char => (
                   <button 
                     key={char} 
                     onClick={() => handleCharClick(char)}
                     className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-600 hover:border-slate-400 hover:bg-white hover:shadow-lg transition-all active:scale-90"
                   >
                     {char}
                   </button>
                 ))}
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleCharClick(' ')}
                      className="h-12 md:h-14 px-8 bg-slate-200 border border-slate-300 rounded-xl text-xs font-black text-slate-500 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all active:scale-95 flex items-center gap-2"
                    >
                      SPACE
                    </button>
                    <button 
                      onClick={() => handleCharClick('\n')}
                      className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                    >
                      <CornerDownLeft size={20} />
                    </button>
                    <button 
                      onClick={handleBackspace}
                      className="w-12 h-12 md:w-14 md:h-14 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                      <Delete size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
            <Languages size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">Universal Compatibility</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              These characters are standard Unicode and will work in any modern application, including MS Word, Facebook, and WhatsApp.
            </p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600">
            <Type size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">Phonetic Grouping</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Keys are arranged according to the logical phonetic order of Indic scripts (Varga system), making it intuitive for native speakers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicKeyboard;
