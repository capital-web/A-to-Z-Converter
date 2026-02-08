
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink, RefreshCcw, AlertCircle, History, Trash2, Edit3, Globe, Cloud } from 'lucide-react';
import { SupabaseDB } from '../services/supabaseService';

interface LinkShortenerProps {
  syncKey?: string;
}

interface ShortenedLink {
  id: string;
  original: string;
  short: string;
  timestamp: number;
}

const LinkShortener: React.FC<LinkShortenerProps> = ({ syncKey }) => {
  const [url, setUrl] = useState<string>('');
  const [alias, setAlias] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortenedLink[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load history from Supabase if syncKey exists, else localStorage
  useEffect(() => {
    const loadHistory = async () => {
      if (syncKey) {
        setIsSyncing(true);
        const dbData = await SupabaseDB.getHistory(syncKey);
        // Filter for 'Link' type records
        const links = dbData.filter((r: any) => r.tool_type === 'Link').map((r: any) => ({
          id: r.id,
          original: r.record_data.original,
          short: r.result,
          timestamp: new Date(r.created_at).getTime()
        }));
        setHistory(links);
        setIsSyncing(false);
      } else {
        const saved = localStorage.getItem('omni_link_history');
        if (saved) {
          try { setHistory(JSON.parse(saved)); } catch (e) {}
        }
      }
    };
    loadHistory();
  }, [syncKey]);

  const saveLink = async (original: string, short: string) => {
    if (syncKey) {
      await SupabaseDB.pushHistory(syncKey, 'Link', short.replace('https://', ''), short, { original });
      // Reload to get the ID from DB
      const dbData = await SupabaseDB.getHistory(syncKey);
      const links = dbData.filter((r: any) => r.tool_type === 'Link').map((r: any) => ({
        id: r.id,
        original: r.record_data.original,
        short: r.result,
        timestamp: new Date(r.created_at).getTime()
      }));
      setHistory(links);
    } else {
      const newEntry: ShortenedLink = {
        id: Math.random().toString(36).substr(2, 9),
        original,
        short,
        timestamp: Date.now()
      };
      const updated = [newEntry, ...history].slice(0, 5); // Keep last 5 locally
      setHistory(updated);
      localStorage.setItem('omni_link_history', JSON.stringify(updated));
    }
  };

  const shortenLink = async () => {
    if (!url) { setError('Please enter a destination URL'); return; }
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;

    try { new URL(finalUrl); } catch (e) { setError('Invalid URL format.'); return; }

    setLoading(true); setError(''); setShortUrl('');

    try {
      let apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(finalUrl)}`;
      if (alias.trim()) apiUrl += `&shorturl=${encodeURIComponent(alias.trim())}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.shorturl) {
        setShortUrl(data.shorturl);
        await saveLink(finalUrl, data.shorturl);
        setAlias('');
      } else if (data.errormessage) {
        setError(data.errormessage);
      } else {
        setError('Service unavailable.');
      }
    } catch (err) { setError('Connection error.'); } finally { setLoading(false); }
  };

  const handleCopy = (text: string, id: string = 'main') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Link2 size={14} /> 1. Destination URL</label>
            <div className="relative group">
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com/page" className={`w-full p-5 bg-slate-50 border ${error ? 'border-red-200' : 'border-slate-200'} rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium`} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block"><Globe size={20} /></div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Edit3 size={14} /> 2. Alias (Optional)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">is.gd/</span>
              <input type="text" value={alias} onChange={(e) => setAlias(e.target.value.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''))} placeholder="my-link" className="w-full p-5 pl-[3.8rem] bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-indigo-600" />
            </div>
          </div>
        </div>

        <button onClick={shortenLink} disabled={loading} className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-[32px] flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98] shadow-2xl shadow-indigo-200">
          {loading ? <><RefreshCcw size={24} className="animate-spin" /><span>Shortening...</span></> : <><Link2 size={24} /><span>Create Magic Link</span></>}
        </button>

        {error && <div className="flex items-center gap-3 p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100"><AlertCircle size={20} /><p className="text-sm font-bold">{error}</p></div>}

        {shortUrl && (
          <div className="animate-in zoom-in-95 duration-300 bg-gradient-to-br from-indigo-600 to-violet-700 border-2 border-white/20 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-wrap items-center gap-6">
              <span className="text-3xl md:text-5xl font-black text-white break-all tracking-tight">{shortUrl}</span>
              <div className="flex gap-3">
                <button onClick={() => handleCopy(shortUrl, 'main')} className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/30 text-white hover:bg-white/20 transition-all">{copiedId === 'main' ? <Check size={28} /> : <Copy size={28} />}</button>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-indigo-600 p-4 rounded-2xl shadow-xl hover:scale-105 transition-all"><ExternalLink size={28} /></a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-10 border-t border-slate-100">
        <div className="flex justify-between items-center px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={14} /> Link History {syncKey && <Cloud size={14} className="text-indigo-500"/>}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.length > 0 ? history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200/50 rounded-3xl group hover:border-indigo-300 hover:bg-white transition-all shadow-sm">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-lg font-black text-slate-800 break-all">{item.short.replace('https://', '')}</p>
                <p className="text-[10px] text-slate-400 truncate mt-1 font-medium">{item.original}</p>
              </div>
              <button onClick={() => handleCopy(item.short, item.id)} className={`p-3 rounded-xl transition-all ${copiedId === item.id ? 'bg-green-100 text-green-600' : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}>{copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}</button>
            </div>
          )) : <div className="col-span-2 text-center text-slate-400 text-sm py-4 italic">No history available</div>}
        </div>
      </div>
    </div>
  );
};

export default LinkShortener;
