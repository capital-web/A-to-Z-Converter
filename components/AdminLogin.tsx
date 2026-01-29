
import React, { useState } from 'react';
import { Lock, User, Key, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (id: string, pass: string) => void;
  onCancel: () => void;
  error?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel, error }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(adminId, password);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-indigo-900/20 overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <Lock size={180} className="absolute -top-10 -right-10 rotate-12" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md mb-4 border border-white/30">
               <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Admin Access</h2>
            <p className="text-indigo-100 text-sm font-medium opacity-80">Management authentication required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-shake">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin ID</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter admin ID"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Authenticate <ArrowRight size={18} />
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secure Configuration Node</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
