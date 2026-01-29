
import React, { useState, useEffect, useMemo } from 'react';
import { Save, RefreshCw, LayoutTemplate, Phone, Mail, Type, ToggleLeft, ToggleRight, ShieldCheck, UserCog, Key, AtSign, ArrowUp, ArrowDown, ListOrdered, FileText, Plus, Trash2, Edit, Search, X, Package, Briefcase, Settings2, Database } from 'lucide-react';
import { ToolType } from '../types';
import { HSN_SECTIONS, SAC_GROUPS, DirectoryEntry, CodeType } from '../data/hsnDefaults';
import Dropdown from '../components/Dropdown';

interface AdminPanelProps {
  settings: any;
  onSave: (newSettings: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaved, setShowSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'hsn'>('settings');
  
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

    const results = list.filter((item: DirectoryEntry) => 
      item.code.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term)
    );

    // Sort to prioritize exact matches
    results.sort((a, b) => {
      const aCode = a.code.toLowerCase();
      const bCode = b.code.toLowerCase();
      
      // 1. Exact Code Match
      if (aCode === term && bCode !== term) return -1;
      if (bCode === term && aCode !== term) return 1;

      // 2. Code Starts With Term
      if (aCode.startsWith(term) && !bCode.startsWith(term)) return -1;
      if (bCode.startsWith(term) && !aCode.startsWith(term)) return 1;

      // 3. Description Starts With Term (secondary)
      const aDesc = a.description.toLowerCase();
      const bDesc = b.description.toLowerCase();
      if (aDesc.startsWith(term) && !bDesc.startsWith(term)) return -1;
      if (bDesc.startsWith(term) && !aDesc.startsWith(term)) return 1;
      
      return 0;
    });

    return results;
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
      // Update existing
      newList = newList.map(item => item.code === editingHsn.code ? { ...hsnForm as DirectoryEntry } : item);
    } else {
      // Check duplicate
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
          <p className="text-slate-400 text-sm mt-1">Customize application behavior and manage data</p>
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
      <div className="flex p-1 bg-slate-100 rounded-2xl w-full md:w-auto self-start overflow-x-auto">
         <button 
           onClick={() => setActiveTab('settings')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Settings2 size={16} /> App Settings
         </button>
         <button 
           onClick={() => setActiveTab('hsn')}
           className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeTab === 'hsn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Database size={16} /> HSN/SAC Directory
         </button>
      </div>

      {/* --- TAB: SETTINGS --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Branding & Contact & Admin */}
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
                    <input 
                      type="text" 
                      value={localSettings.appName} 
                      onChange={(e) => handleChange('root', 'appName', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Footer Text</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Type size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={localSettings.footerText} 
                      onChange={(e) => handleChange('root', 'footerText', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={16} /> Contact Details
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Support Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Mail size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={localSettings.supportEmail} 
                      onChange={(e) => handleChange('root', 'supportEmail', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Support Mobile</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Phone size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={localSettings.supportPhone} 
                      onChange={(e) => handleChange('root', 'supportPhone', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                    />
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
                    <input 
                      type="text" 
                      value={localSettings.adminId || ''} 
                      onChange={(e) => handleChange('root', 'adminId', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Admin Email</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <AtSign size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={localSettings.adminEmail || ''} 
                      onChange={(e) => handleChange('root', 'adminEmail', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Admin Password</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <Key size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={localSettings.adminPassword || ''} 
                      onChange={(e) => handleChange('root', 'adminPassword', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700"
                      placeholder="••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Management */}
          <div className="space-y-8">
             {/* Reorder Modules */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <ListOrdered size={16} /> Menu & Module Arrangement
               </h3>
               <div className="space-y-6">
                 
                 {/* Main Sidebar Order */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Main Sidebar Order</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {localSettings.toolOrder.filter((t: string) => t !== ToolType.ADMIN).map((tool: string, index: number) => (
                        <div key={tool} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <span className="flex-1 text-xs font-bold text-slate-700 truncate">{tool}</span>
                           <div className="flex gap-1">
                              <button 
                                onClick={() => moveItem('toolOrder', index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 bg-white border rounded-lg hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                onClick={() => moveItem('toolOrder', index, 'down')}
                                disabled={index === localSettings.toolOrder.length - 2} // -2 because ADMIN is excluded from view but in list
                                className="p-1.5 bg-white border rounded-lg hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown size={14} />
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Financial Submodules */}
                 <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase">Financial Calculator Tabs</label>
                    <div className="space-y-2">
                      {localSettings.financialToolOrder.map((tab: string, index: number) => (
                        <div key={tab} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <span className="flex-1 text-xs font-bold text-slate-700 truncate">{tab}</span>
                           <div className="flex gap-1">
                              <button 
                                onClick={() => moveItem('financialToolOrder', index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 bg-white border rounded-lg hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                onClick={() => moveItem('financialToolOrder', index, 'down')}
                                disabled={index === localSettings.financialToolOrder.length - 1}
                                className="p-1.5 bg-white border rounded-lg hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown size={14} />
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>

               </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <ShieldCheck size={16} /> Enable / Disable Features
              </h3>
              
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {localSettings.toolOrder.filter((t: string) => t !== ToolType.ADMIN).map((tool: string) => (
                  <div 
                    key={tool} 
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${localSettings.enabledTools[tool] !== false ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-70'}`}
                  >
                    <span className="text-xs font-bold text-slate-700">{tool}</span>
                    <button 
                      onClick={() => handleChange('enabledTools', tool, !localSettings.enabledTools[tool])}
                      className={`transition-all duration-300 ${localSettings.enabledTools[tool] !== false ? 'text-indigo-600' : 'text-slate-300'}`}
                    >
                      {localSettings.enabledTools[tool] !== false ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: HSN DIRECTORY --- */}
      {activeTab === 'hsn' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {/* HSN Code Management */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                   <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                     <FileText size={20} className="text-indigo-600" /> HSN/SAC Directory
                   </h3>
                   <p className="text-slate-400 text-xs mt-1 font-medium">Manage codes, descriptions and rates.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                   <div className="relative flex-1 sm:flex-none">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input 
                       type="text" 
                       placeholder="Search directory..." 
                       value={hsnSearch}
                       onChange={(e) => setHsnSearch(e.target.value)}
                       className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-50"
                     />
                   </div>
                   <button 
                      onClick={handleAddHsn}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-100 whitespace-nowrap"
                    >
                      <Plus size={16} /> Add New
                   </button>
                </div>
             </div>

             {/* List */}
             <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
               {filteredHsnList.length > 0 ? filteredHsnList.map((item: DirectoryEntry) => (
                 <div key={item.code} className="p-4 bg-white border border-slate-200/60 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group relative flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${item.type === 'goods' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                       {item.type === 'goods' ? 'HSN' : 'SAC'}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="font-black text-slate-800 text-lg">{item.code}</span>
                         <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{item.rate}% GST</span>
                         {item.chapter && <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] font-bold uppercase">CH {item.chapter}</span>}
                       </div>
                       <p className="text-sm font-medium text-slate-600 line-clamp-1 group-hover:line-clamp-none transition-all">{item.description}</p>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                       <button onClick={() => handleEditHsn(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18}/></button>
                       <button onClick={() => handleDeleteHsn(item.code)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                    </div>
                 </div>
               )) : (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Database size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No entries found</p>
                    <p className="text-xs mt-1">Try a different search or add a new code</p>
                 </div>
               )}
               {filteredHsnList.length > 100 && (
                 <p className="text-center text-[10px] text-slate-400 pt-4 pb-2">Showing matches. Refine search for specific results.</p>
               )}
             </div>

             {/* HSN Add/Edit Form Overlay */}
             {isAddingHsn && (
               <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div>
                       <h4 className="text-xl font-black text-slate-800">{editingHsn ? 'Edit Entry' : 'Add New Entry'}</h4>
                       <p className="text-xs text-slate-400 font-medium mt-0.5">Fill in the details for the HSN/SAC code.</p>
                    </div>
                    <button onClick={() => setIsAddingHsn(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"><X size={20}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-2xl mx-auto space-y-8">
                      {/* Type Selection */}
                      <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Entry Type</label>
                         <div className="grid grid-cols-2 gap-4">
                           <button
                             className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${hsnForm.type === 'goods' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                             onClick={() => setHsnForm({...hsnForm, type: 'goods', categoryId: '1'})}
                           >
                             <Package size={24} />
                             <span className="font-bold text-sm">Goods (HSN)</span>
                           </button>
                           <button
                             className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${hsnForm.type === 'services' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                             onClick={() => setHsnForm({...hsnForm, type: 'services', categoryId: '9954'})}
                           >
                             <Briefcase size={24} />
                             <span className="font-bold text-sm">Services (SAC)</span>
                           </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{hsnForm.type === 'goods' ? 'HSN Code' : 'SAC Code'}</label>
                           <input 
                              type="text" value={hsnForm.code} onChange={(e) => setHsnForm({...hsnForm, code: e.target.value})}
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-lg font-bold focus:ring-2 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                              placeholder="e.g. 1001"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">GST Rate (%)</label>
                           <input 
                              type="number" value={hsnForm.rate} onChange={(e) => setHsnForm({...hsnForm, rate: Number(e.target.value)})}
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-lg font-bold focus:ring-2 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category / Section</label>
                         <Dropdown 
                            value={hsnForm.categoryId || ''} 
                            options={getCategoryOptions()} 
                            onChange={(v) => setHsnForm({...hsnForm, categoryId: v})}
                            className="w-full"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                         <textarea 
                            value={hsnForm.description} onChange={(e) => setHsnForm({...hsnForm, description: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium h-32 resize-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                            placeholder="Detailed description of the item..."
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Chapter (Optional)</label>
                         <input 
                            type="text" value={hsnForm.chapter} onChange={(e) => setHsnForm({...hsnForm, chapter: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                            placeholder="e.g. 10"
                         />
                      </div>

                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-slate-100 bg-white">
                    <div className="max-w-2xl mx-auto flex gap-4">
                       <button onClick={() => setIsAddingHsn(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                       <button onClick={saveHsnEntry} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all">
                         {editingHsn ? 'Update Entry' : 'Add Entry'}
                       </button>
                    </div>
                  </div>
               </div>
             )}
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
