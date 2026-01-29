
import React, { useState, useEffect } from 'react';
import { Search, Globe, MoreVertical, Copy, Check, RefreshCw, Wand2, Eye, Sparkles } from 'lucide-react';

const SeoMetaGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  // Limits
  const TITLE_LIMIT = 60;
  const DESC_LIMIT = 160;

  // Auto-generate logic
  const generateMeta = () => {
    if (!keyword) return;
    const cleanKey = keyword.trim();
    const cappedKey = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
    
    setTitle(`${cappedKey}: Comprehensive Guide & Tips [${new Date().getFullYear()}]`);
    setDescription(`Discover everything about ${cleanKey}. Our expert guide covers key strategies, benefits, and tips to master ${cleanKey} effectively.`);
    setSlug(cleanKey.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const copyHTML = () => {
    const html = `
<!-- SEO Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="https://yoursite.com/${slug}" />
    `.trim();
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLengthColor = (current: number, max: number) => {
    if (current === 0) return 'bg-slate-200';
    if (current > max) return 'bg-red-500';
    if (current > max - 10) return 'bg-green-500'; // Sweet spot
    return 'bg-amber-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor Side */}
      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Target Keyword</span>
            <button onClick={generateMeta} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              <Wand2 size={12} /> Auto-Generate
            </button>
          </label>
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Digital Marketing"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page Title</label>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${title.length > TITLE_LIMIT ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
              {title.length} / {TITLE_LIMIT} chars
            </span>
          </div>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title..."
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
          />
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${getLengthColor(title.length, TITLE_LIMIT)}`} style={{ width: `${Math.min(100, (title.length / TITLE_LIMIT) * 100)}%` }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Description</label>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${description.length > DESC_LIMIT ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
              {description.length} / {DESC_LIMIT} chars
            </span>
          </div>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter meta description..."
            className="w-full h-32 p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium resize-none"
          />
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${getLengthColor(description.length, DESC_LIMIT)}`} style={{ width: `${Math.min(100, (description.length / DESC_LIMIT) * 100)}%` }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Slug</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1">
            <span className="pl-4 text-slate-400 text-sm font-medium hidden sm:inline">yoursite.com/</span>
            <input 
              type="text" 
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              placeholder="url-slug"
              className="flex-1 bg-transparent p-3 outline-none font-medium text-slate-700"
            />
          </div>
        </div>

        <button 
          onClick={copyHTML}
          className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg active:scale-95"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied HTML!' : 'Copy Meta Tags HTML'}
        </button>
      </div>

      {/* Preview Side */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 mb-6 text-slate-400">
            <Eye size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Google SERP Preview</span>
          </div>

          {/* Google Mobile View Simulation */}
          <div className="font-sans max-w-md mx-auto bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <Globe size={16} className="text-slate-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-slate-800 font-medium">Your Site Name</span>
                <span className="text-[12px] text-slate-500">yoursite.com {slug ? `› ${slug}` : ''}</span>
              </div>
              <MoreVertical size={16} className="ml-auto text-slate-400" />
            </div>
            
            <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-snug font-normal mb-1">
              {title || 'Page Title Placeholder'}
            </h3>
            
            <div className="text-[14px] text-[#4d5156] leading-normal break-words">
              {description || 'This is how your meta description will appear in search results. Keep it between 150-160 characters for best visibility.'}
            </div>
          </div>
        </div>

        {/* Tips Box */}
        <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
          <h4 className="text-sm font-black text-indigo-900 mb-3 flex items-center gap-2">
            <Sparkles size={16} /> SEO Best Practices
          </h4>
          <ul className="space-y-2 text-xs text-indigo-800 font-medium">
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 flex-shrink-0 opacity-50" /> 
              Title should be 50-60 characters long.
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 flex-shrink-0 opacity-50" /> 
              Include your primary keyword near the beginning of the title.
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 flex-shrink-0 opacity-50" /> 
              Meta description should be 150-160 characters.
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 flex-shrink-0 opacity-50" /> 
              Use a call-to-action in the description (e.g., "Learn more", "Buy now").
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SeoMetaGenerator;
