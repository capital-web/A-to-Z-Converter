
import React, { useState } from 'react';
import { Search, Network, Globe, AlertCircle, CheckCircle, Server, Mail, Layers, FileCode } from 'lucide-react';

interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = [
  { type: 'A', id: 1, icon: <Globe size={14} />, desc: 'IPv4 Address' },
  { type: 'AAAA', id: 28, icon: <Globe size={14} />, desc: 'IPv6 Address' },
  { type: 'CNAME', id: 5, icon: <Network size={14} />, desc: 'Canonical Name' },
  { type: 'MX', id: 15, icon: <Mail size={14} />, desc: 'Mail Exchange' },
  { type: 'NS', id: 2, icon: <Server size={14} />, desc: 'Name Server' },
  { type: 'TXT', id: 16, icon: <FileCode size={14} />, desc: 'Text Record' },
  { type: 'SOA', id: 6, icon: <Layers size={14} />, desc: 'Start of Authority' },
];

const DNSChecker: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [selectedType, setSelectedType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DNSRecord[] | null>(null);
  const [error, setError] = useState('');

  const checkDNS = async () => {
    if (!domain) return;
    
    // Basic domain validation/cleaning
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
    if (!cleanDomain.includes('.')) {
        setError('Please enter a valid domain name.');
        return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Use Google DNS-over-HTTPS API
      const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${selectedType}`);
      const data = await response.json();

      if (data.Status !== 0) {
        setError(data.Comment || `DNS Error Code: ${data.Status}`);
      } else if (!data.Answer) {
        setError('No records found for this type.');
      } else {
        setResults(data.Answer);
      }
    } catch (err) {
      setError('Failed to fetch DNS records. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') checkDNS();
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Domain Name</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="google.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-bold text-lg text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>
          <button 
            onClick={checkDNS}
            disabled={loading || !domain}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? 'Resolving...' : 'Lookup DNS'}
          </button>
        </div>

        {/* Record Type Selector */}
        <div className="space-y-2">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Record Type</label>
           <div className="flex flex-wrap gap-2">
             {RECORD_TYPES.map(type => (
               <button
                 key={type.type}
                 onClick={() => { setSelectedType(type.type); setResults(null); setError(''); }}
                 className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${selectedType === type.type ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
               >
                 {type.icon}
                 {type.type}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="min-h-[200px]">
        {loading && (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 animate-pulse">
             <Network size={48} className="mb-4 opacity-20" />
             <p className="font-medium text-sm">Querying DNS Servers...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
             <div className="p-2 bg-white rounded-full text-red-500 shadow-sm"><AlertCircle size={20} /></div>
             <div>
               <h4 className="font-bold text-red-700">Lookup Failed</h4>
               <p className="text-sm text-red-600 mt-1">{error}</p>
             </div>
          </div>
        )}

        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Found {results.length} Records
                </h3>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg">{selectedType}</span>
             </div>

             <div className="grid gap-3">
               {results.map((record, index) => (
                 <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="flex-1 break-all font-mono text-sm font-medium text-slate-700 leading-relaxed">
                         {record.data}
                       </div>
                       <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0">
                          <div className="flex flex-col">
                             <span className="text-[9px] uppercase tracking-wider mb-0.5">TTL</span>
                             <span className="text-indigo-600">{record.TTL}s</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] uppercase tracking-wider mb-0.5">Type</span>
                             <span>{RECORD_TYPES.find(r => r.id === record.type)?.type || record.type}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {!loading && !results && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <Network size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">Ready to Analyze</h3>
             <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
               Enter a domain to retrieve real-time DNS propagation data directly from Google's Public DNS.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DNSChecker;
