
import React, { useState, useMemo } from 'react';
import { Search, Info, AlertCircle, ShoppingBag, Folder, ChevronRight, Layers, BookOpen, Briefcase, Package, CalendarCheck, Filter } from 'lucide-react';
import { HSN_SECTIONS, SAC_GROUPS, DirectoryEntry, CodeType } from '../data/hsnDefaults';

interface HSNCodeFinderProps {
  data?: DirectoryEntry[];
}

const HSNCodeFinder: React.FC<HSNCodeFinderProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<CodeType>('goods');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('1');

  // Use props data or fallback
  const directoryData = data || [];

  // Ensure active category ID is valid when switching types
  React.useEffect(() => {
    if (activeType === 'goods') {
      if (!HSN_SECTIONS.find(s => s.id === activeCategoryId)) {
        setActiveCategoryId('1');
      }
    } else {
      if (!SAC_GROUPS.find(s => s.id === activeCategoryId)) {
        setActiveCategoryId('9954');
      }
    }
  }, [activeType]);

  // Filter logic
  const { filteredData, isSearchActive } = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    // 1. GLOBAL SEARCH: If search term exists, search EVERYTHING (ignore activeType tab)
    if (term.length > 0) {
      const results = directoryData.filter(item => 
          item.code.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term)
      );

      // Sort results to prioritize exact matches
      results.sort((a, b) => {
        const aCode = a.code.toLowerCase();
        const bCode = b.code.toLowerCase();
        const aDesc = a.description.toLowerCase();
        const bDesc = b.description.toLowerCase();

        // 1. Exact Code Match
        if (aCode === term && bCode !== term) return -1;
        if (bCode === term && aCode !== term) return 1;

        // 2. Code Starts With Term
        const aStarts = aCode.startsWith(term);
        const bStarts = bCode.startsWith(term);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // 3. Exact Description Match
        if (aDesc === term && bDesc !== term) return -1;
        if (bDesc === term && aDesc !== term) return 1;

        // 4. Description Starts With Term
        const aDescStarts = aDesc.startsWith(term);
        const bDescStarts = bDesc.startsWith(term);
        if (aDescStarts && !bDescStarts) return -1;
        if (!aDescStarts && bDescStarts) return 1;

        // 5. Shortest Code match
        if (aCode.length !== bCode.length) return aCode.length - bCode.length;

        return 0;
      });

      return { filteredData: results, isSearchActive: true };
    }

    // 2. BROWSE MODE: If no search, filter by selected type and category
    const results = directoryData.filter(item => 
      item.type === activeType && item.categoryId === activeCategoryId
    );
    return { filteredData: results, isSearchActive: false };
  }, [searchTerm, activeType, activeCategoryId, directoryData]);

  const activeCategoryList = activeType === 'goods' ? HSN_SECTIONS : SAC_GROUPS;
  const activeCategory = activeCategoryList.find(s => s.id === activeCategoryId);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header / Search Section */}
      <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ShoppingBag className="text-indigo-600" /> HSN & SAC Finder
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Complete GST Rate Directory for Goods (HSN) and Services (SAC).
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100">
            <CalendarCheck size={14} /> Database Updated: {currentDate}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Type Toggles - Visual cues for Browsing, but also informative for Search */}
            <div className={`flex gap-2 p-1 bg-slate-100 rounded-2xl w-full md:w-auto transition-opacity duration-300 ${isSearchActive ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
               <button 
                 onClick={() => { setActiveType('goods'); setSearchTerm(''); }}
                 className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeType === 'goods' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Package size={16} /> Goods (HSN)
               </button>
               <button 
                 onClick={() => { setActiveType('services'); setSearchTerm(''); }}
                 className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeType === 'services' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Briefcase size={16} /> Services (SAC)
               </button>
            </div>
            
            <div className="relative group flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search All Codes (e.g. 'Rice', 'Transport', '1001', '9954')" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Navigation - Only active when NOT searching */}
        <div className={`w-full lg:w-80 flex-shrink-0 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[600px] transition-all duration-300 ${isSearchActive ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={14} /> {activeType === 'goods' ? 'HSN Sections' : 'SAC Groups'}
            </p>
            {isSearchActive && <Filter size={14} className="text-slate-300" />}
          </div>
          <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar relative">
            {isSearchActive && <div className="absolute inset-0 bg-white/50 z-10" />}
            {activeCategoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategoryId(cat.id); setSearchTerm(''); }}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-start gap-3 group ${activeCategoryId === cat.id && !isSearchActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className={`flex-shrink-0 w-10 h-8 flex items-center justify-center rounded-lg text-[10px] font-black uppercase tracking-wider ${activeCategoryId === cat.id && !isSearchActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                  {cat.code}
                </span>
                <span className={`font-semibold line-clamp-2 leading-tight mt-1 ${activeCategoryId === cat.id && !isSearchActive ? 'text-indigo-900' : 'text-slate-600'}`}>
                  {cat.title}
                </span>
                {activeCategoryId === cat.id && !isSearchActive && <ChevronRight size={14} className="ml-auto mt-1.5 flex-shrink-0 text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Code List */}
        <div className="flex-1 min-w-0 w-full">
          <div className="mb-4 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isSearchActive ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                   {isSearchActive ? <Search size={18} /> : <Folder size={18} />}
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     {isSearchActive ? 'Global Search Results' : `${activeType === 'goods' ? 'Section' : 'Group'} ${activeCategory?.code}`}
                   </p>
                   <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                     {isSearchActive ? `Found ${filteredData.length} matching records` : activeCategory?.title}
                   </h3>
                </div>
             </div>
             {isSearchActive && (
               <button onClick={() => setSearchTerm('')} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">Clear Search</button>
             )}
          </div>

          {filteredData.length > 0 ? (
            <div className="space-y-3">
              {filteredData.map((item) => (
                <div key={item.code} className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group flex flex-col md:flex-row gap-5 items-start md:items-center">
                  
                  <div className="flex-shrink-0">
                    <div className={`px-4 py-3 rounded-2xl border transition-colors text-center min-w-[80px] ${item.type === 'goods' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-purple-50 border-purple-100 text-purple-700'}`}>
                       <span className="text-[10px] font-bold opacity-60 uppercase block mb-0.5">{item.type === 'goods' ? 'HSN' : 'SAC'}</span>
                       <span className="text-xl font-black tracking-tight">{item.code}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                        Chapter {item.chapter}
                      </span>
                      {isSearchActive && (
                         <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${item.type === 'goods' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                            {item.type === 'goods' ? 'Goods' : 'Services'}
                         </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">
                      {item.description}
                    </h3>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5 w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">GST Rate</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-xl font-black ${item.rate > 18 ? 'text-red-500' : item.rate === 0 ? 'text-green-500' : 'text-indigo-600'}`}>
                          {item.rate}%
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                 <AlertCircle size={32} className="text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-700">No Records Found</h3>
               <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                 {isSearchActive ? `No match found for "${searchTerm}" in HSN or SAC database.` : 'This category appears to be empty.'}
               </p>
               {isSearchActive && (
                 <button 
                   onClick={() => setSearchTerm('')}
                   className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                 >
                   Clear Search
                 </button>
               )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Layers size={14} className="text-indigo-400"/>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Directory Reference</p>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Contains data from official HSN Sections (Goods) and SAC Groups (Services). Rates are subject to periodic government notifications.
        </p>
      </div>
    </div>
  );
};

export default HSNCodeFinder;
