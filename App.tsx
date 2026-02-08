
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  User, 
  IndianRupee, 
  Type, 
  Calendar, 
  Percent, 
  Receipt, 
  Ruler, 
  CaseUpper,
  Menu,
  X,
  ChevronRight, 
  QrCode,
  Link2,
  Mail,
  Phone,
  Settings,
  TrendingUp,
  FileText,
  PlusMinus,
  Binary,
  CalendarClock,
  MessageCircle,
  Sparkles,
  Languages,
  Search,
  MapPin,
  LogOut,
  ShieldAlert,
  Cloud,
  Database,
  History
} from 'lucide-react';
import { ToolType, NavItem } from './types';
import BasicCalculator from './tools/BasicCalculator';
import ScientificCalculator from './tools/ScientificCalculator';
import EMICalculator from './tools/EMICalculator';
import FinancialCalculator from './tools/FinancialCalculator';
import AgeCalculator from './tools/AgeCalculator';
import CurrencyCounter from './tools/CurrencyCounter';
import NumberToWords from './tools/NumberToWords';
import DayCounter from './tools/DayCounter';
import DateOffsetCalculator from './tools/DateOffsetCalculator';
import PercentageFinder from './tools/PercentageFinder';
import GSTCalculator from './tools/GSTCalculator';
import HSNCodeFinder from './tools/HSNCodeFinder';
import MeasurementConverter from './tools/MeasurementConverter';
import TextConverter from './tools/TextConverter';
import FancyTextGenerator from './tools/FancyTextGenerator';
import IndicKeyboard from './tools/IndicKeyboard';
import QRCodeGenerator from './tools/QRCodeGenerator';
import LinkShortener from './tools/LinkShortener';
import WhatsAppGenerator from './tools/WhatsAppGenerator';
import SeoMetaGenerator from './tools/SeoMetaGenerator';
import FakeAddressGenerator from './tools/FakeAddressGenerator';
import HistoryPanel from './tools/HistoryPanel';
import AdminPanel from './tools/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { DEFAULT_DIRECTORY_DATABASE } from './data/hsnDefaults';
import { SupabaseDB } from './services/supabaseService';

// Default Settings
const defaultSettings = {
  appName: 'OmniCalc Pro',
  browserTitle: 'OmniCalc Pro - All in One Tool',
  logoUrl: '',
  faviconUrl: '',
  footerText: 'Precision Tools for Everyday Calculations',
  supportEmail: 'support@omnicalc.pro',
  supportPhone: '',
  adminId: 'admin',
  adminEmail: 'admin@omnicalc.pro',
  adminPassword: 'admin',
  syncKey: '', // Added for Supabase Sync
  enabledTools: Object.fromEntries(Object.values(ToolType).map(t => [t, true])),
  toolOrder: Object.values(ToolType),
  financialToolOrder: ['SIP', 'Lumpsum', 'EBITDA'],
  hsnDirectory: DEFAULT_DIRECTORY_DATABASE
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.BASIC_CALC);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  
  // Admin Flow State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Load Settings & Check for Admin URL & Sync with Supabase
  useEffect(() => {
    const initApp = async () => {
      const savedSettings = localStorage.getItem('omnicalc_settings');
      let currentSettings = defaultSettings;
      
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          currentSettings = { 
            ...defaultSettings, 
            ...parsed, 
            enabledTools: { ...defaultSettings.enabledTools, ...parsed.enabledTools },
          };
        } catch (e) {}
      }

      // Check URL for Sync Key (Easier to pair new devices)
      const params = new URLSearchParams(window.location.search);
      const urlSyncKey = params.get('sync');
      if (urlSyncKey) {
        currentSettings.syncKey = urlSyncKey;
      }

      // Fetch from Supabase if Sync Key exists
      if (currentSettings.syncKey) {
        setIsCloudSyncing(true);
        const cloudData = await SupabaseDB.getSettings(currentSettings.syncKey);
        if (cloudData) {
          currentSettings = { ...currentSettings, ...cloudData, syncKey: currentSettings.syncKey };
        }
        setIsCloudSyncing(false);
      }
      
      setSettings(currentSettings);
      
      if (params.has('admin') || params.get('mode') === 'admin') {
        setShowAdminLogin(true);
      }
      setLoaded(true);
    };

    initApp();
  }, []);

  // Apply Branding (Title & Favicon)
  useEffect(() => {
    if (!loaded) return;
    
    // Update Title
    document.title = settings.browserTitle || settings.appName;

    // Update Favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (settings.faviconUrl) {
      link.href = settings.faviconUrl;
    }
  }, [settings, loaded]);

  const saveSettings = async (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('omnicalc_settings', JSON.stringify(newSettings));
    
    // Push to cloud if sync key exists
    if (newSettings.syncKey) {
      setIsCloudSyncing(true);
      await SupabaseDB.saveSettings(newSettings.syncKey, newSettings);
      setIsCloudSyncing(false);
    }
  };

  const handleAdminLogin = (id: string, pass: string) => {
    if (id === settings.adminId && pass === settings.adminPassword) {
      setIsAdminAuth(true);
      setShowAdminLogin(false);
      setActiveTool(ToolType.ADMIN);
      setLoginError('');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setLoginError('Invalid Admin ID or Password');
    }
  };

  const handleToolClick = (toolId: ToolType) => {
    if (toolId === ToolType.ADMIN && !isAdminAuth) {
      setShowAdminLogin(true);
    } else {
      setActiveTool(toolId);
    }
    setIsSidebarOpen(false);
  };

  const navItems: NavItem[] = [
    { id: ToolType.BASIC_CALC, icon: <Calculator size={20} />, description: 'Standard Arithmetic Tool' },
    { id: ToolType.SCIENTIFIC_CALC, icon: <Binary size={20} />, description: 'Advanced Mathematical Functions' },
    { id: ToolType.EMI_CALC, icon: <Calculator size={20} />, description: 'Loan & EMI Calculators' },
    { id: ToolType.FINANCIAL_CALC, icon: <TrendingUp size={20} />, description: 'SIP & Lumpsum Investments' },
    { id: ToolType.AGE_CALC, icon: <User size={20} />, description: 'Age & Birthday Tracker' },
    { id: ToolType.HISTORY, icon: <Database size={20} />, description: 'Saved Records & Database' },
    { id: ToolType.CURRENCY_COUNTER, icon: <IndianRupee size={20} />, description: 'Cash Counter & Denominations' },
    { id: ToolType.NUMBER_WORDS, icon: <Type size={20} />, description: 'Currency to Words Converter' },
    { id: ToolType.DAY_COUNTER, icon: <Calendar size={20} />, description: 'Date Difference Finder' },
    { id: ToolType.DATE_OFFSET_CALC, icon: <CalendarClock size={20} />, description: 'Find Past or Future Dates' },
    { id: ToolType.PERCENT_FINDER, icon: <Percent size={20} />, description: 'Percentage & Margin Tools' },
    { id: ToolType.GST_CALC, icon: <Receipt size={20} />, description: 'GST (Tax) Calculator' },
    { id: ToolType.HSN_FINDER, icon: <FileText size={20} />, description: 'HSN Code & GST Rates' },
    { id: ToolType.MEASUREMENT, icon: <Ruler size={20} />, description: 'Universal Unit Converter' },
    { id: ToolType.TEXT_CONVERTER, icon: <CaseUpper size={20} />, description: 'Advanced Text Utilities' },
    { id: ToolType.FANCY_TEXT, icon: <Sparkles size={20} />, description: 'Stylish Font & Text Generator' },
    { id: ToolType.INDIC_KEYBOARD, icon: <Languages size={20} />, description: 'Type in Hindi, Tamil, Bengali & more' },
    { id: ToolType.QR_GENERATOR, icon: <QrCode size={20} />, description: 'Instant QR Code Creator' },
    { id: ToolType.LINK_SHORTENER, icon: <Link2 size={20} />, description: 'Quick Link Management' },
    { id: ToolType.WHATSAPP_LINK, icon: <MessageCircle size={20} />, description: 'Message Link Generator' },
    { id: ToolType.SEO_META_GEN, icon: <Search size={20} />, description: 'SERP Preview & Generator' },
    { id: ToolType.FAKE_ADDRESS_GEN, icon: <MapPin size={20} />, description: 'Random Identity & Address' },
    { id: ToolType.ADMIN, icon: <Settings size={20} />, description: 'Application Settings' },
  ];

  const getOrderedNavItems = () => {
    const itemMap = new Map(navItems.map(item => [item.id, item]));
    return settings.toolOrder
      .map((id: string) => itemMap.get(id as ToolType))
      .filter((item: NavItem | undefined): item is NavItem => item !== undefined);
  };

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.ADMIN: return isAdminAuth ? <AdminPanel settings={settings} onSave={saveSettings} /> : null;
      case ToolType.HISTORY: return <HistoryPanel syncKey={settings.syncKey} />;
      case ToolType.BASIC_CALC: return <BasicCalculator />;
      case ToolType.SCIENTIFIC_CALC: return <ScientificCalculator />;
      case ToolType.EMI_CALC: return <EMICalculator syncKey={settings.syncKey} />;
      case ToolType.FINANCIAL_CALC: return <FinancialCalculator settings={settings} />;
      case ToolType.AGE_CALC: return <AgeCalculator />;
      case ToolType.CURRENCY_COUNTER: return <CurrencyCounter />;
      case ToolType.NUMBER_WORDS: return <NumberToWords />;
      case ToolType.DAY_COUNTER: return <DayCounter />;
      case ToolType.DATE_OFFSET_CALC: return <DateOffsetCalculator />;
      case ToolType.PERCENT_FINDER: return <PercentageFinder />;
      case ToolType.GST_CALC: return <GSTCalculator />;
      case ToolType.HSN_FINDER: return <HSNCodeFinder data={settings.hsnDirectory} />;
      case ToolType.MEASUREMENT: return <MeasurementConverter />;
      case ToolType.TEXT_CONVERTER: return <TextConverter />;
      case ToolType.FANCY_TEXT: return <FancyTextGenerator />;
      case ToolType.INDIC_KEYBOARD: return <IndicKeyboard />;
      case ToolType.QR_GENERATOR: return <QRCodeGenerator />;
      case ToolType.LINK_SHORTENER: return <LinkShortener syncKey={settings.syncKey} />;
      case ToolType.WHATSAPP_LINK: return <WhatsAppGenerator />;
      case ToolType.SEO_META_GEN: return <SeoMetaGenerator />;
      case ToolType.FAKE_ADDRESS_GEN: return <FakeAddressGenerator />;
      default: return <BasicCalculator />;
    }
  };

  if (!loaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-indigo-600 animate-pulse uppercase tracking-widest">Loading Omni Pro...</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 overflow-hidden">
      
      {showAdminLogin && !isAdminAuth && (
        <AdminLogin 
          onLogin={handleAdminLogin} 
          onCancel={() => {
            setShowAdminLogin(false);
            window.history.replaceState({}, document.title, window.location.pathname);
          }} 
          error={loginError}
        />
      )}

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">{settings.appName.charAt(0)}</div>
          )}
          {!settings.logoUrl && <span className="font-bold text-xl tracking-tight">{settings.appName}</span>}
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-0 z-40 bg-white border-r w-72 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex flex-col h-full">
          <div className="p-6 pb-2">
            <div className="hidden md:flex items-center gap-3 mb-6 px-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.appName} className="max-h-12 w-auto max-w-full object-contain" />
              ) : (
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 flex-shrink-0">{settings.appName.charAt(0)}</div>
              )}
              
              {!settings.logoUrl && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg leading-tight truncate max-w-[120px]">{settings.appName}</span>
                    {settings.syncKey && <Cloud size={14} className={isCloudSyncing ? 'text-indigo-600 animate-pulse' : 'text-emerald-500'} />}
                  </div>
                  <span className="text-sm text-slate-400">{isAdminAuth ? 'Manager View' : 'Toolbox'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-2 custom-scrollbar">
            <nav className="space-y-1">
              {getOrderedNavItems().filter(item => settings.enabledTools[item.id] !== false).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleToolClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTool === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  <span className={activeTool === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}>
                    {item.id === ToolType.ADMIN ? <Settings size={20} /> : item.icon}
                  </span>
                  <div className="flex flex-col items-start text-left min-w-0">
                    <span className="font-semibold text-sm leading-none mb-1 truncate w-full">{item.id}</span>
                    <span className={`text-xs truncate w-full ${activeTool === item.id ? 'text-indigo-100' : 'text-slate-400'}`}>{item.description}</span>
                  </div>
                  {activeTool === item.id && <ChevronRight size={14} className="ml-auto flex-shrink-0" />}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 pt-0 space-y-4 flex-shrink-0 bg-white">
            {!isAdminAuth ? (
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
              >
                <Settings size={16} /> Admin Portal
              </button>
            ) : (
              <button
                onClick={() => { setIsAdminAuth(false); setActiveTool(ToolType.BASIC_CALC); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
              >
                <LogOut size={16} /> Logout Admin
              </button>
            )}
          </div>
        </div>
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 transition-all flex flex-col">
        <div className="max-w-[1920px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
          <div className="mb-4 sm:mb-6 ml-2 flex justify-between items-end">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{activeTool}</h1>
              <p className="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
                {navItems.find(i => i.id === activeTool)?.description || (activeTool === ToolType.ADMIN ? 'Manage Application Settings' : '')}
              </p>
            </div>
            {settings.syncKey && (
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm mb-1">
                 <Database size={14} className={isCloudSyncing ? 'text-indigo-600 animate-pulse' : 'text-indigo-500'} />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cloud Synced</span>
               </div>
            )}
          </div>
          
          <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-slate-200/50 p-4 sm:p-6 md:p-10 lg:p-12 border border-slate-100 min-h-[400px]">
            {renderTool()}
          </div>
        </div>

        {settings.footerText && <div className="mt-8 text-center pb-4"><p className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest">{settings.footerText}</p></div>}
      </main>
    </div>
  );
};

export default App;
