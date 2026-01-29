
import React, { useState, useEffect, useMemo } from 'react';
import { Save, RefreshCw, LayoutTemplate, Phone, Mail, Type, ToggleLeft, ToggleRight, ShieldCheck, UserCog, Key, AtSign, ArrowUp, ArrowDown, ListOrdered, FileText, Plus, Trash2, Edit, Search, X, Package, Briefcase, Settings2, Database, Cloud, Share2, Copy, Check } from 'lucide-react';
import { ToolType } from '../types';
import { HSN_SECTIONS, SAC_GROUPS, DirectoryEntry, CodeType } from '../data/hsnDefaults';
import { CloudDB } from '../services/cloudDb';
import Dropdown from '../components/Dropdown';

interface AdminPanelProps {
  settings: any;
  onSave: (newSettings: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaved, setShowSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'hsn' | 'cloud'>('settings');
  const [copiedKey, setCopiedKey] = useState(false);
  const [manualKey, setManualKey] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  
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

  // --- CLOUD SYNC FUNCTIONS ---
  const handleGenerateKey = () => {
    const newKey = CloudDB.generateKey();
    setLocalSettings((prev: any) => ({ ...prev, syncKey: newKey }));
  };

  const handleLinkDevice = async () => {
    if (!manualKey.trim()) return;
    setIsLinking(true);
    const remoteData = await CloudDB.pull(manualKey.trim());
    if (remoteData) {
      setLocalSettings({ ...remoteData, syncKey: manualKey.trim() });
      alert('Device Linked Successfully! Cloud Database synchronized.');
      setManualKey('');
    } else {
      alert('Invalid Sync Key or Network Error.');
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

  // --- HSN Management Functions ---
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
    setHsnForm({
      code: '',
      description: '',
      rate: 18,
      type: 'goods',
      chapter: '',
      categoryId: '1'
    });
    setIsAddingHsn(true);
  };

  const saveHsnEntry = () => {
    if (!hsnForm.code || !hsnForm.description) {
      alert('Code and Description are required');
      return;
    }
    let newList = [...(localSettings.hsnDirectory || [])];
    if (editingHsn) {
      newList = newList.map(item => item.code === editingHsn.code ? { ...hsnForm as DirectoryEntry } : item);
    } else {
      if (newList.find(item => item.code === hsnForm.code)) {
        alert('Code already exists!');
        return;
      }
      newList.unshift(hsnForm as DirectoryEntry);
    }
    setLocalSettings((prev: any) => ({ ...prev, hsnDirectory: newList }));
    setIsAddingHsn(false);
    setEditingHsn(null);
  };

  const getCategoryOptions = () => {
    const list = hsnForm.type === 'goods' ? HSN_SECTIONS : SAC_GROUPS;
    return list.map(c => ({ value: c.id, label: `${c.code} - ${c.title}` }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Admin Control Center</h2>
          <p className="text-slate-400 text-sm mt-1">Configure global application behavior and cross-device sync</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleReset}
            className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
            title="Reset to Defaults"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Save size={18} /> {showSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-full md:w-auto self-start overflow-x-auto no-scrollbar">
         <button 
           onClick={() => setActiveTab('settings')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Settings2 size={16} /> General Settings
         </button>
         <button 
           onClick={() => setActiveTab('cloud')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeTab === 'cloud' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Cloud size={16} /> Cloud Database (Sync)
         </button>
         <button 
           onClick={() => setActiveTab('hsn')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeTab === 'hsn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Database size={16} /> HSN Directory
         </button>
      </div>

      {/* --- TAB: CLOUD SYNC --- */}
      {activeTab === 'cloud' && (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
           <div className="bg-indigo-600 p-8 md:p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                 <Cloud size={180} />
              </div>
              <div className="relative z-10 space-y-6">
                 <div>
                   <h3 className="text-2xl font-black mb-2">Cross-Device Synchronization</h3>
                   <p className="text-indigo-100 font-medium text-sm leading-relaxed max-w-lg">
                     Enable the Cloud Database to see your admin changes across all your devices instantly. 
                     Generate a key on this device and enter it on another to pair them.
                   </p>
                 </div>

                 {!localSettings.syncKey ? (
                   <button 
                     onClick={handleGenerateKey}
                     className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                   >
                     Initialize Cloud Database
                   </button>
                 ) : (
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Your Private Sync Key</label>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 font-mono font-bold text-lg overflow-hidden truncate">
                             {localSettings.syncKey}
                           </div>
                           <button 
                             onClick={copySyncKey}
                             className="p-4 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-90"
                           >
                             {copiedKey ? <Check size={20} /> : <Copy size={20} />}
                           </button>
                        </div>
                      </div>
                      <p className="text-xs text-indigo-200 flex items-center gap-2">
                        <Share2 size={12} /> Share this key with your other devices to sync this admin profile.
                      </p>
                   </div>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <RefreshCw size={16} className="text-indigo-600" /> Link Existing Device
                 </h4>
                 <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Paste Sync Key here..." 
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                    />
                    <button 
                      onClick={handleLinkDevice}
                      disabled={isLinking || !manualKey.trim()}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50"
                    >
                      {isLinking ? 'Synchronizing...' : 'Fetch Cloud Profile'}
                    </button>
                 </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200/50 flex flex-col justify-center">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><ShieldCheck size={24} /></div>
                    <div>
                      <h4 className="font-bold text-slate-700">Enterprise Database Model</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Data is stored in an encrypted JSON bucket. Changes are synced every time you click "Save Changes" at the top.
                      </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- TAB: SETTINGS --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutTemplate size={16} /> Branding & Footer
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">App Name</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Type size={16} className="text-slate-400" />
                    <input type="text" value={localSettings.appName} onChange={(e) => handleChange('root', 'appName', e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Footer Text</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Type size={16} className="text-slate-400" />
                    <input type="text" value={localSettings.footerText} onChange={(e) => handleChange('root', 'footerText', e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700" />
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Details & Admin Access same as before */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={16} /> Contact Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Support Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Mail size={16} className="text-slate-400" />
                    <input type="text" value={localSettings.supportEmail} onChange={(e) => handleChange('root', 'supportEmail', e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <UserCog size={16} /> Admin Access
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Admin ID</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <UserCog size={16} className="text-slate-400" />
                    <input type="text" value={localSettings.adminId} onChange={(e) => handleChange('root', 'adminId', e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Admin Password</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Key size={16} className="text-slate-400" />
                    <input type="text" value={localSettings.adminPassword} onChange={(e) => handleChange('root', 'adminPassword', e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {/* Reorder and Feature Toggles same as before */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <ListOrdered size={16} /> Module Arrangement
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <ShieldCheck size={16} /> Tool Visibility
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {localSettings.toolOrder.filter((t: string) => t !== ToolType.ADMIN).map((tool: string) => (
                  <div key={tool} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${localSettings.enabledTools[tool] !== false ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-70'}`}>
                    <span className="text-xs font-bold text-slate-700">{tool}</span>
                    <button onClick={() => handleChange('enabledTools', tool, !localSettings.enabledTools[tool])} className={`transition-all duration-300 ${localSettings.enabledTools[tool] !== false ? 'text-indigo-600' : 'text-slate-300'}`}>
                      {localSettings.enabledTools[tool] !== false ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: HSN DIRECTORY (Minimal version for space) --- */}
      {activeTab === 'hsn' && (
        <div className="animate-in fade-in duration-300">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black">Directory Items ({filteredHsnList.length})</h3>
                 <button onClick={handleAddHsn} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"><Plus size={16}/> New Code</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                 {filteredHsnList.slice(0, 50).map(item => (
                    <div key={item.code} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                       <div className="min-w-0">
                          <p className="text-sm font-black">{item.code} - {item.rate}%</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.description}</p>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditHsn(item)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit size={14}/></button>
                          <button onClick={() => handleDeleteHsn(item.code)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                       </div>
                    </div>
                 ))}
                 {filteredHsnList.length > 50 && <p className="text-center text-[10px] text-slate-400">Total list truncated for performance...</p>}
              </div>
           </div>
        </div>
      )}

      {isAddingHsn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full space-y-6 shadow-2xl">
              <h4 className="text-2xl font-black">{editingHsn ? 'Edit' : 'Add'} Code</h4>
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="Code" value={hsnForm.code} onChange={e => setHsnForm({...hsnForm, code: e.target.value})} className="p-4 bg-slate-50 rounded-2xl border outline-none"/>
                 <input type="number" placeholder="Rate %" value={hsnForm.rate} onChange={e => setHsnForm({...hsnForm, rate: Number(e.target.value)})} className="p-4 bg-slate-50 rounded-2xl border outline-none"/>
              </div>
              <textarea placeholder="Description" value={hsnForm.description} onChange={e => setHsnForm({...hsnForm, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border outline-none h-32"/>
              <div className="flex gap-4">
                 <button onClick={() => setIsAddingHsn(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                 <button onClick={saveHsnEntry} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Save Entry</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
