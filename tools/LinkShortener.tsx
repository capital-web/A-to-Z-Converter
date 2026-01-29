
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink, RefreshCcw, AlertCircle, History, Trash2, Edit3, Globe } from 'lucide-react';

interface ShortenedLink {
  id: string;
  original: string;
  short: string;
  timestamp: number;
}

const LinkShortener: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [alias, setAlias] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortenedLink[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('omni_link_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse link history');
      }
    }
  }, []);

  const saveToHistory = (original: string, short: string) => {
    const newEntry: ShortenedLink = {
      id: Math.random().toString(36).substr(2, 9),
      original,
      short,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...history].slice(0, 5); // Keep last 5
    setHistory(updated);
    localStorage.setItem('omni_link_history', JSON.stringify(updated));
  };

  const shortenLink = async () => {
    if (!url) {
      setError('Please enter a destination URL');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch (e) {
      setError('Invalid URL format. Check the domain name.');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      let apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(finalUrl)}`;
      if (alias.trim()) {
        apiUrl += `&shorturl=${encodeURIComponent(alias.trim())}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.shorturl) {
        setShortUrl(data.shorturl);
        saveToHistory(finalUrl, data.shorturl);
        setAlias(''); // Clear alias after success
      } else if (data.errormessage) {
        // Handle specific is.gd error messages (e.g., alias taken)
        setError(data.errormessage);
      } else {
        setError('Service unavailable. Try again in a moment.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string = 'main') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('omni_link_history');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Destination URL Input */}
          <div className="lg:col-span-8 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Link2 size={14} /> 1. Destination URL
            </label>
            <div className="relative group">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com/very-long-article-slug"
                className={`w-full p-5 bg-slate-50 border ${error ? 'border-red-200 focus:ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-3xl outline-none focus:ring-4 transition-all font-medium`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block">
                <Globe size={20} />
              </div>
            </div>
          </div>

          {/* Custom Alias Input */}
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Edit3 size={14} /> 2. Custom Name (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">is.gd/</span>
              <input 
                type="text" 
                value={alias}
                onChange={(e) => setAlias(e.target.value.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''))}
                placeholder="my-link"
                className="w-full p-5 pl-[3.8rem] bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={shortenLink}
          disabled={loading}
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-[32px] flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98] shadow-2xl shadow-indigo-200"
        >
          {loading ? (
            <>
              <RefreshCcw size={24} className="animate-spin" />
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <Link2 size={24} />
              <span>Create Magic Link</span>
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center gap-3 p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {shortUrl && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 border-2 border-white/20 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Link2 size={160} className="text-white" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs font-bold text-indigo-100 uppercase tracking-[0.2em]">Link Ready</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6 flex-wrap">
                    <span className="text-3xl md:text-5xl font-black text-white break-all tracking-tight">
                      {shortUrl}
                    </span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleCopy(shortUrl, 'main')}
                        className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/30 shadow-sm hover:bg-white/20 transition-all text-white group"
                        title="Copy to clipboard"
                      >
                        {copiedId === 'main' ? <Check size={28} /> : <Copy size={28} className="group-hover:scale-110 transition-transform" />}
                      </button>
                      <a 
                        href={shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-indigo-600 p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                        title="Open link"
                      >
                        <ExternalLink size={28} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-100 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History size={14} /> Recent Shortened Links
            </p>
            <button onClick={clearHistory} className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 font-black uppercase tracking-tighter">
              <Trash2 size={12} /> Clear History
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200/50 rounded-3xl group hover:border-indigo-300 hover:bg-white transition-all shadow-sm">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-lg font-black text-slate-800 break-all">{item.short.replace('https://', '')}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-1 font-medium">{item.original}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopy(item.short, item.id)}
                    className={`p-3 rounded-xl transition-all ${copiedId === item.id ? 'bg-green-100 text-green-600' : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                  >
                    {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <a 
                    href={item.short} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-xl"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!shortUrl && history.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Link2 size={24} />
            </div>
            <h4 className="text-md font-bold text-slate-800">No Signup</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Instantly shorten links without any account creation or personal data.</p>
          </div>
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <Check size={24} />
            </div>
            <h4 className="text-md font-bold text-slate-800">Fast & Secure</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Uses reliable API infrastructure for permanent and safe redirection.</p>
          </div>
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <RefreshCcw size={24} />
            </div>
            <h4 className="text-md font-bold text-slate-800">Custom Names</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Create memorable links with your own custom alias instead of random characters.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkShortener;
