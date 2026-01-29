
import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, AlertCircle, CheckCircle2, TrendingUp, BarChart3, ExternalLink } from 'lucide-react';

const DomainAnalyzer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Deterministic random generator based on string
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const analyzeDomain = () => {
    if (!domain.includes('.')) {
      alert("Please enter a valid domain (e.g., example.com)");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    // Simulate API delay
    setTimeout(() => {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').toLowerCase();
      const hash = getHash(cleanDomain);
      
      // Calculate "Structural Score"
      const lengthScore = Math.max(0, 100 - (cleanDomain.length * 2));
      const tld = cleanDomain.split('.').pop() || '';
      const tldScore = ['.com', '.org', '.net', '.edu', '.gov'].includes('.' + tld) ? 20 : 5;
      const hyphenPenalty = (cleanDomain.split('-').length - 1) * 10;
      const numPenalty = (cleanDomain.match(/\d/g) || []).length * 5;
      
      let structuralScore = 50 + tldScore - hyphenPenalty - numPenalty;
      if (cleanDomain.length < 15) structuralScore += 15;
      structuralScore = Math.min(100, Math.max(10, structuralScore));

      // Deterministic "Authority" Simulation
      const simDA = (hash % 90) + 5; // 5-95
      const simPA = (hash % 10) + simDA - 5; // Close to DA
      const spamScore = (hash % 20); // 0-20%

      setResult({
        domain: cleanDomain,
        da: simDA,
        pa: Math.max(1, Math.min(100, simPA)),
        spam: spamScore,
        structure: structuralScore,
        tld: '.' + tld,
        length: cleanDomain.length,
        isHyphenated: cleanDomain.includes('-'),
        hasNumbers: /\d/.test(cleanDomain)
      });
      setAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 10) return 'text-green-500';
      if (score < 30) return 'text-amber-500';
      return 'text-red-500';
    }
    if (score > 70) return 'text-green-500';
    if (score > 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBarColor = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 10) return 'bg-green-500';
      if (score < 30) return 'bg-amber-500';
      return 'bg-red-500';
    }
    if (score > 70) return 'bg-green-500';
    if (score > 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} /> Domain Name
          </label>
          <div className="relative group">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              onKeyDown={(e) => e.key === 'Enter' && analyzeDomain()}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-lg text-slate-700 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={20} />
            </div>
          </div>
        </div>
        <button 
          onClick={analyzeDomain}
          disabled={analyzing || !domain}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {analyzing ? 'Analyzing...' : 'Check Authority'}
        </button>
      </div>

      {/* Results Area */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DA Card */}
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Domain Authority (Simulated)</p>
              <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full border-4 border-slate-200 bg-white shadow-sm">
                <span className={`text-3xl font-black ${getScoreColor(result.da)}`}>{result.da}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center px-4">Estimated authority based on domain heuristics</p>
            </div>

            {/* PA Card */}
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <BarChart3 size={80} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Page Authority (Simulated)</p>
              <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full border-4 border-slate-200 bg-white shadow-sm">
                <span className={`text-3xl font-black ${getScoreColor(result.pa)}`}>{result.pa}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center px-4">Estimated predictive ranking strength</p>
            </div>

            {/* Spam Score Card */}
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <AlertCircle size={80} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Spam Score (Risk)</p>
              <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full border-4 border-slate-200 bg-white shadow-sm">
                <span className={`text-3xl font-black ${getScoreColor(result.spam, true)}`}>{result.spam}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center px-4">Risk based on keyword patterns & TLD</p>
            </div>
          </div>

          {/* Structural Analysis */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
              <TrendingUp className="text-indigo-600" /> Structural Analysis
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Overall Quality Score</span>
                  <span className={`text-xs font-black ${getScoreColor(result.structure)}`}>{result.structure}/100</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColor(result.structure)} transition-all duration-1000`} 
                    style={{ width: `${result.structure}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {result.length < 15 ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-amber-500" />}
                  <div>
                    <p className="text-xs font-bold text-slate-700">Length: {result.length} chars</p>
                    <p className="text-[10px] text-slate-400">{result.length < 15 ? 'Short & Memorable' : 'Consider shortening'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {['.com','.org','.net'].includes(result.tld) ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-blue-500" />}
                  <div>
                    <p className="text-xs font-bold text-slate-700">Extension: {result.tld}</p>
                    <p className="text-[10px] text-slate-400">{['.com','.org','.net'].includes(result.tld) ? 'Top Level Domain' : 'Niche Extension'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {!result.isHyphenated ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-amber-500" />}
                  <div>
                    <p className="text-xs font-bold text-slate-700">Hyphens: {result.isHyphenated ? 'Yes' : 'None'}</p>
                    <p className="text-[10px] text-slate-400">{!result.isHyphenated ? 'Clean Structure' : 'May reduce readability'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {!result.hasNumbers ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-amber-500" />}
                  <div>
                    <p className="text-xs font-bold text-slate-700">Numbers: {result.hasNumbers ? 'Yes' : 'None'}</p>
                    <p className="text-[10px] text-slate-400">{!result.hasNumbers ? 'Professional' : 'Context dependent'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
             <p className="text-xs text-indigo-800 font-medium mb-3">Check Real-Time Data on External Tools</p>
             <div className="flex flex-wrap justify-center gap-3">
               <a href={`https://who.is/whois/${result.domain}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-indigo-600 flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                 <ExternalLink size={14} /> Whois Lookup
               </a>
               <a href={`https://web.archive.org/web/*/${result.domain}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-indigo-600 flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                 <ExternalLink size={14} /> Wayback Machine
               </a>
               <a href={`https://www.google.com/search?q=site:${result.domain}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-indigo-600 flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                 <ExternalLink size={14} /> Indexed Pages
               </a>
             </div>
          </div>

        </div>
      )}

      {!result && !analyzing && (
        <div className="text-center py-10 opacity-50">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Globe size={32} className="text-slate-300" />
           </div>
           <p className="text-sm font-medium text-slate-400">Enter a URL to analyze its authority and structure.</p>
        </div>
      )}
    </div>
  );
};

export default DomainAnalyzer;
