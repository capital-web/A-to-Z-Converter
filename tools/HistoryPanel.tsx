
import React, { useState, useEffect } from 'react';
import { Database, Trash2, BrainCircuit, Calendar, TrendingUp, User, ChevronRight, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const HistoryPanel: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('omni_history_db');
    if (saved) {
      try {
        setRecords(JSON.parse(saved).reverse());
      } catch (e) {
        console.error("DB Load Error");
      }
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Permanently delete all database records?")) {
      localStorage.removeItem('omni_history_db');
      setRecords([]);
      setInsight(null);
    }
  };

  const generateAIInsight = async () => {
    if (records.length === 0) return;
    setAnalyzing(true);
    setInsight(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze the following user calculation history from a multi-utility app. 
      Provide a brief, professional financial or life insight (2-3 sentences) based on their patterns.
      History Data: ${JSON.stringify(records.slice(0, 10))}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "No insights available at this time.");
    } catch (error) {
      setInsight("Unable to connect to AI engine. Please check your network or API key.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Calculation Database</h2>
          <p className="text-sm text-slate-400 font-medium">Your persistent activity log and AI advisor</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateAIInsight}
            disabled={analyzing || records.length === 0}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
          >
            {analyzing ? <BrainCircuit className="animate-spin" /> : <BrainCircuit />} AI Insights
          </button>
          <button 
            onClick={clearHistory}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[32px] text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={120} /></div>
           <div className="relative z-10 space-y-3">
             <div className="flex items-center gap-2">
               <div className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">AI Financial Advisor</div>
             </div>
             <p className="text-lg font-medium leading-relaxed italic">"{insight}"</p>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {records.length > 0 ? (
          records.map((rec, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rec.type === 'EMI' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                  {rec.type === 'EMI' ? <TrendingUp size={20} /> : <User size={20} />}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{rec.type} Calculation</p>
                  <h4 className="text-base font-bold text-slate-700">{rec.label}</h4>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                 <p className="text-lg font-black text-indigo-600">{rec.result}</p>
                 <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1"><Clock size={10} /> {new Date(rec.timestamp).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-indigo-400 transition-colors ml-4" />
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
             <Database size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found in database</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
