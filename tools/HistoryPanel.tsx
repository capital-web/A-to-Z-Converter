
import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, Link2, Trash2, RefreshCw, Clock, ChevronRight, AlertCircle, Cloud } from 'lucide-react';
import { SupabaseDB } from '../services/supabaseService';

const HistoryPanel: React.FC<{ syncKey?: string }> = ({ syncKey }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!syncKey) return;
    setLoading(true);
    const data = await SupabaseDB.getHistory(syncKey);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [syncKey]);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this record?')) {
      await SupabaseDB.deleteHistory(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  if (!syncKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Database size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-700">Database Not Connected</h3>
        <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">
          To view and save records, please generate a Cloud Sync Key in the Admin Panel and link this device.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Cloud className="text-indigo-600" size={24} /> Cloud Database Records
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Sync Key: <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{syncKey}</span>
          </p>
        </div>
        <button 
          onClick={fetchData} 
          className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Records...</div>
      ) : records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-lg transition-all group flex flex-col md:flex-row md:items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                record.tool_type === 'EMI' ? 'bg-indigo-50 text-indigo-600' : 
                record.tool_type === 'Link' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
              }`}>
                {record.tool_type === 'EMI' ? <TrendingUp size={20}/> : record.tool_type === 'Link' ? <Link2 size={20}/> : <Database size={20}/>}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">{record.tool_type}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {new Date(record.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg truncate">{record.label}</h4>
                <p className="text-sm text-slate-500 font-medium truncate">{record.result}</p>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5">
                 <button 
                   onClick={() => handleDelete(record.id)}
                   className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                   title="Delete Record"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
           <Database size={32} className="text-slate-300 mb-4" />
           <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No records found</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
