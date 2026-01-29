
import React, { useState } from 'react';
import { Search, Globe, Fingerprint, ExternalLink, Check, X, Shield, Info, Link2 } from 'lucide-react';

const WhoisLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'available' | 'registered' | 'error'>('idle');
  const [tldInfo, setTldInfo] = useState<string>('');

  const checkAvailability = async () => {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim().toLowerCase();
    if (!cleanDomain.includes('.')) {
      alert("Please enter a valid domain (e.g. example.com)");
      return;
    }

    setAnalyzing(true);
    setStatus('idle');
    setTldInfo('');

    try {
      // We use Google DNS to check for NXDOMAIN. 
      // If NXDOMAIN (Status: 3), the domain is *likely* available (not registered).
      // If Status: 0 (NOERROR), it exists (Registered).
      const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=A`);
      const data = await response.json();

      if (data.Status === 3) { // NXDOMAIN
        setStatus('available');
      } else if (data.Status === 0) { // NOERROR
        setStatus('registered');
      } else {
        setStatus('registered'); // Fallback assume registered/reserved if other codes
      }

      // Simple TLD Info logic
      const tld = cleanDomain.split('.').pop() || '';
      if (tld === 'com') setTldInfo('Generic Commercial');
      else if (tld === 'org') setTldInfo('Non-profit Organization');
      else if (tld === 'net') setTldInfo('Network Infrastructure');
      else if (tld === 'in') setTldInfo('India Country Code');
      else if (tld === 'io') setTldInfo('Input/Output (Tech Popular)');
      else if (tld === 'ai') setTldInfo('Artificial Intelligence (Anguilla)');
      else setTldInfo('Country Code / Generic TLD');

    } catch (e) {
      setStatus('error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') checkAvailability();
  };

  return (
    <div className="space-y-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
           <h2 className="text-2xl font-black text-slate-800">Domain Intelligence & Whois</h2>
           <p className="text-slate-500 font-medium">Check availability and access ownership records</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[20px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex bg-white p-2 rounded-[18px] shadow-xl">
            <div className="flex-1 flex items-center px-4 gap-3">
               <Globe className="text-slate-400" size={24} />
               <input 
                 type="text" 
                 value={domain}
                 onChange={(e) => setDomain(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Enter domain (e.g. google.com)"
                 className="w-full py-4 bg-transparent outline-none font-bold text-xl text-slate-700 placeholder:text-slate-300"
               />
            </div>
            <button 
              onClick={checkAvailability}
              disabled={analyzing}
              className="bg-slate-900 text-white px-8 rounded-2xl font-bold uppercase tracking-wider text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'Checking...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
           {status !== 'idle' && (
             <div className={`p-8 rounded-[32px] border-2 text-center animate-in zoom-in-95 duration-300 flex flex-col items-center gap-4 ${status === 'available' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm ${status === 'available' ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>
                   {status === 'available' ? <Check size={40} /> : <Shield size={40} />}
                </div>
                
                <div>
                   <h3 className={`text-2xl font-black ${status === 'available' ? 'text-green-700' : 'text-slate-700'}`}>
                     {status === 'available' ? 'Domain Available!' : 'Domain Registered'}
                   </h3>
                   <p className="text-sm font-medium mt-1 opacity-70">
                     {status === 'available' 
                        ? 'This domain appears to be unregistered.' 
                        : 'This domain is already taken. Use the links below to view owner info.'}
                   </p>
                </div>

                {tldInfo && (
                  <div className="px-4 py-2 bg-white/50 rounded-full text-xs font-bold uppercase tracking-widest opacity-60">
                    TLD Type: {tldInfo}
                  </div>
                )}
             </div>
           )}

           {/* Deep Links Section - Always show if domain is entered */}
           {domain && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
               <div className="flex items-center justify-between px-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Fingerprint size={14} /> Official Whois Sources
                 </h4>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <a 
                   href={`https://lookup.icann.org/en/lookup?q=${domain}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-300 hover:shadow-lg transition-all group"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">IC</div>
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-700">ICANN Lookup</span>
                          <span className="text-[10px] text-slate-400 font-medium">Official Registry Data</span>
                       </div>
                    </div>
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-indigo-600" />
                 </a>

                 <a 
                   href={`https://who.is/whois/${domain}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-300 hover:shadow-lg transition-all group"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">WI</div>
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-700">Who.is</span>
                          <span className="text-[10px] text-slate-400 font-medium">Detailed Records</span>
                       </div>
                    </div>
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-indigo-600" />
                 </a>

                 <a 
                   href={`https://www.godaddy.com/whois/results.aspx?domain=${domain}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-300 hover:shadow-lg transition-all group"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold">GD</div>
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-700">GoDaddy Whois</span>
                          <span className="text-[10px] text-slate-400 font-medium">Broker & Purchase Info</span>
                       </div>
                    </div>
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-indigo-600" />
                 </a>

                 <a 
                   href={`https://www.namecheap.com/domains/whois/result?domain=${domain}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-300 hover:shadow-lg transition-all group"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold">NC</div>
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-700">Namecheap</span>
                          <span className="text-[10px] text-slate-400 font-medium">Alternative Registrar</span>
                       </div>
                    </div>
                    <ExternalLink size={18} className="text-slate-300 group-hover:text-indigo-600" />
                 </a>
               </div>
             </div>
           )}
        </div>

        {!domain && (
          <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex items-start gap-4 opacity-75">
             <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm"><Info size={18} /></div>
             <div>
               <h4 className="text-sm font-bold text-slate-700 mb-1">Privacy Notice</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                 Due to GDPR and browser security restrictions, full personal contact details (Name, Email, Phone) are often redacted in automated lookups. Use the official ICANN link for the most authoritative data.
               </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoisLookup;
