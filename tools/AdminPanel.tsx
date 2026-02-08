
import React, { useState, useEffect, useMemo } from 'react';
import { Save, RefreshCw, LayoutTemplate, Phone, Mail, Type, ToggleLeft, ToggleRight, ShieldCheck, UserCog, Key, AtSign, ArrowUp, ArrowDown, ListOrdered, FileText, Plus, Trash2, Edit, Search, X, Package, Briefcase, Settings2, Database, Cloud, Share2, Copy, Check, Globe, Image as ImageIcon, Lock, Eye, EyeOff } from 'lucide-react';
import { ToolType } from '../types';
import { HSN_SECTIONS, SAC_GROUPS, DirectoryEntry, CodeType } from '../data/hsnDefaults';
import { SupabaseDB } from '../services/supabaseService';
import Dropdown from '../components/Dropdown';

interface AdminPanelProps {
  settings: any;
  onSave: (newSettings: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaved, setShowSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'hsn' | 'cloud' | 'security'>('settings');
  const [copiedKey, setCopiedKey] = useState(false);
  const [manualKey, setManualKey] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // HSN Management State
  const [hsnSearch, setHsnSearch] = useState('');
  const [editingHsn, setEditingHsn] = useState<DirectoryEntry | null>(null);
  const [isAddingHsn, setIsAddingHsn] = useState(false);
  const [hsnForm, setHsnForm] = useState<Partial<DirectoryEntry>>({
    code: '',
    description: '',
    rate: 18,
    type: 'goods',
    chapter: '',
    categoryId: '1'
  });

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (section: string, key: string, value: any) => {
    if (section === 'root') {
      setLocalSettings((prev: any) => ({ ...prev, [key]: value }));
    } else if (section === 'enabledTools') {
      setLocalSettings((prev: any) => ({
        ...prev,
        enabledTools: { ...prev.enabledTools, [key]: value }
      }));
    }
  };

  const handleSave = () => {
    onSave(localSettings);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('omnicalc_settings');
      window.location.reload();
    }
  };

  const handleGenerateKey = () => {
    const newKey = SupabaseDB.generateKey();
    setLocalSettings((prev: any) => ({ ...prev, syncKey: newKey }));
  };

  const handleLinkDevice = async () => {
    if (!manualKey.trim()) return;
    setIsLinking(true);
    const remoteData = await SupabaseDB.getSettings(manualKey.trim());
    if (remoteData) {
      setLocalSettings({ ...remoteData, syncKey: manualKey.trim() });
      alert('Cloud Link Successful! Settings have been synchronized.');
      setManualKey('');
    } else {
      alert('Could not find any data for this Sync Key.');
    }
    setIsLinking(false);
  };

  const copySyncKey = () => {
    navigator.clipboard.writeText(localSettings.syncKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const moveItem = (listKey: string, index: number, direction: 'up' | 'down') => {
    const list = [...(localSettings[listKey] || [])];
    if (direction === 'up' && index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    }
    setLocalSettings((prev: any) => ({ ...prev, [listKey]: list }));
  };

  // --- HSN Management ---
  const filteredHsnList = useMemo(() => {
    const term = hsnSearch.toLowerCase().trim();
    const list = [...(localSettings.hsnDirectory || [])];
    if (!term) return list;
    return list.filter((item: DirectoryEntry) => 
      item.code.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term)
    );
  }, [localSettings.hsnDirectory, hsnSearch]);

  const handleDeleteHsn = (code: string) => {
    if (confirm(`Are you sure you want to delete code ${code}?`)) {
      const newList = localSettings.hsnDirectory.filter((i: DirectoryEntry) => i.code !== code);
      setLocalSettings((prev: any) => ({ ...prev, hsnDirectory: newList }));
    }
  };

  const handleEditHsn = (item: DirectoryEntry) => {
    setEditingHsn(item);
    setHsnForm({ ...item });
    setIsAddingHsn(true);
  };

  const handleAddHsn = () => {
    setEditingHsn(null);
    setHsnForm({ code: '', description: '', rate: 18, type: 'goods', chapter: '', categoryId: '1' });
    setIsAddingHsn(true);
  };

  const saveHsnEntry = () => {
    if (!hsnForm.code || !hsnForm.description) {
      alert('Code and Description are required');
      return;
    }
    let newList = [...(localSettings.hsnDirectory || [])];
    if (editingHsn) newList = newList.map(item => item.code === editingHsn.code ? { ...hsnForm as DirectoryEntry } : item);
    else {
      if (newList.find(item => item.code === hsnForm.code)) { alert('Code already exists!'); return; }
      newList.unshift(hsnForm as DirectoryEntry);
    }
    setLocalSettings((prev: any) => ({ ...prev, hsnDirectory: newList }));
    setIsAddingHsn(false);
    setEditingHsn(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Admin Control Center</h2>
          <p className="text-slate-400 text-sm mt-1">Configure your cloud-synced application workspace</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all" title="Reset to Defaults"><RefreshCw size={20} /></button>
          <button onClick={handleSave} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"><Save size={18} /> {showSaved ? 'Saved!' : 'Save Changes'}</button>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl w-full md:w-auto self-start overflow-x-auto no-scrollbar">
         <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Settings2 size={16} /> Branding & App</button>
         <button onClick={() => setActiveTab('security')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'security' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><ShieldCheck size={16} /> Admin Security</button>
         <button onClick={() => setActiveTab('cloud')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'cloud' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Cloud size={16} /> Cloud Sync</button>
         <button onClick={() => setActiveTab('hsn')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'hsn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Database size={16} /> HSN Database</button>
      </div>

      {/* --- TAB: CLOUD SYNC --- */}
      {activeTab === 'cloud' && (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
           <div className="bg-indigo-600 p-8 md:p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Cloud size={180} /></div>
              <div className="relative z-10 space-y-6">
                 <div>
                    <h3 className="text-2xl font-black mb-2">Cross-Device Synchronization</h3>
                    <p className="text-indigo-100 font-medium text-sm leading-relaxed max-w-lg">Enable cloud storage to sync your custom HSN codes, application branding, and tool arrangement across all your devices instantly.</p>
                 </div>
                 
                 {!localSettings.syncKey ? (
                   <button onClick={handleGenerateKey} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">Initialize Cloud Connection</button>
                 ) : (
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Your Private Sync Key</label>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 font-mono font-bold text-lg overflow-hidden truncate">
                             {localSettings.syncKey}
                           </div>
                           <button onClick={copySyncKey} className="p-4 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-90">
                              {copiedKey ? <Check size={20} /> : <Copy size={20} />}
                           </button>
                        </div>
                      </div>
                      <p className="text-xs text-indigo-200 flex items-center gap-2"><Share2 size={12} /> Use this key on other devices to access this configuration node.</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><RefreshCw size={16} className="text-indigo-600" /> Link Device</h4>
                 <div className="space-y-4">
                    <input type="text" placeholder="Paste Sync Key here..." value={manualKey} onChange={(e) => setManualKey(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
                    <button onClick={handleLinkDevice} disabled={isLinking || !manualKey.trim()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50">{isLinking ? 'Linking...' : 'Sync with Profile'}</button>
                 </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200/50 flex flex-col justify-center">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><ShieldCheck size={24} /></div>
                    <div>
                       <h4 className="font-bold text-slate-700">Encrypted PostgREST Sync</h4>
                       <p className="text-xs text-slate-400 mt-1 leading-relaxed">Profile-specific data is isolated by your Sync Key. No personal information is stored outside of your explicit app settings.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- TAB: SETTINGS / BRANDING --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><LayoutTemplate size={16} /> Branding & Display</h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">Application Name</label>
                        <div className="relative">
                            <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={localSettings.appName} onChange={(e) => handleChange('root', 'appName', e.target.value)} className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">Browser Tab Title</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={localSettings.browserTitle || ''} onChange={(e) => handleChange('root', 'browserTitle', e.target.value)} placeholder="OmniCalc Pro - Tools" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">Logo URL (Replaces Text Title)</label>
                        <div className="relative">
                            <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={localSettings.logoUrl || ''} onChange={(e) => handleChange('root', 'logoUrl', e.target.value)} placeholder="https://example.com/logo.png" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                        </div>
                        {localSettings.logoUrl && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-100 inline-block">
                                <img src={localSettings.logoUrl} alt="Preview" className="h-8 object-contain" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">Favicon URL</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={localSettings.faviconUrl || ''} onChange={(e) => handleChange('root', 'faviconUrl', e.target.value)} placeholder="https://example.com/favicon.ico" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">Footer Text</label>
                        <input type="text" value={localSettings.footerText} onChange={(e) => handleChange('root', 'footerText', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
                    </div>
                 </div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><ListOrdered size={16} /> Tool Order</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {localSettings.toolOrder.filter((t: string) => t !== ToolType.ADMIN).map((tool: string, index: number) => (
                  <div key={tool} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="flex-1 text-xs font-bold text-slate-700 truncate">{tool}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveItem('toolOrder', index, 'up')} disabled={index === 0} className="p-1.5 bg-white border rounded-lg hover:text-indigo-600 disabled:opacity-30"><ArrowUp size={14} /></button>
                      <button onClick={() => moveItem('toolOrder', index, 'down')} disabled={index === localSettings.toolOrder.length - 2} className="p-1.5 bg-white border rounded-lg hover:text-indigo-600 disabled:opacity-30"><ArrowDown size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      )}

      {/* --- TAB: SECURITY --- */}
      {activeTab === 'security' && (
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="p-2 bg-white rounded-full text-amber-500 shadow-sm"><Lock size={20} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-800">Admin Credentials</h4>
                        <p className="text-xs text-amber-600/80 mt-1">Changes here will immediately affect your next login. Please remember your new credentials.</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Username / ID</label>
                        <div className="relative">
                            <UserCog size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                value={localSettings.adminId} 
                                onChange={(e) => handleChange('root', 'adminId', e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                        <div className="relative">
                            <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="email" 
                                value={localSettings.adminEmail} 
                                onChange={(e) => handleChange('root', 'adminEmail', e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Password</label>
                        <div className="relative">
                            <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={localSettings.adminPassword} 
                                onChange={(e) => handleChange('root', 'adminPassword', e.target.value)} 
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- TAB: HSN --- */}
      {activeTab === 'hsn' && (
        <div className="animate-in fade-in duration-300">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black">Database Codes ({filteredHsnList.length})</h3>
                 <button onClick={handleAddHsn} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"><Plus size={16}/> New Code</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                 {filteredHsnList.slice(0, 50).map(item => (
                    <div key={item.code} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                       <div className="min-w-0"><p className="text-sm font-black">{item.code} - {item.rate}%</p><p className="text-[11px] text-slate-500 truncate">{item.description}</p></div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEditHsn(item)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit size={14}/></button><button onClick={() => handleDeleteHsn(item.code)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {isAddingHsn && (
         <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl p-10 space-y-6">
               <h4 className="text-xl font-black">{editingHsn ? 'Edit' : 'Add'} Code</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-slate-400">Code</label><input type="text" value={hsnForm.code} onChange={e => setHsnForm({...hsnForm, code: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-slate-400">Rate (%)</label><input type="number" value={hsnForm.rate} onChange={e => setHsnForm({...hsnForm, rate: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" /></div>
               </div>
               <div className="space-y-1"><label className="text-xs font-bold text-slate-400">Description</label><textarea value={hsnForm.description} onChange={e => setHsnForm({...hsnForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl text-sm min-h-[100px]" /></div>
               <div className="flex gap-3"><button onClick={() => setIsAddingHsn(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button><button onClick={saveHsnEntry} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Save Code</button></div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminPanel;
