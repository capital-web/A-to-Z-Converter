
import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Copy, Check, RefreshCw, Palette, Settings2, FileType, 
  Link2, Type, Mail, Phone, MessageSquare, UserCircle, MapPin, Wifi, Calendar, Layout, Maximize,
  Hexagon, Circle, Square, Zap, ShieldCheck, Pipette, Building2, Globe, AlignLeft, Image as ImageIcon, Trash2, Scissors
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import Dropdown, { DropdownOption } from '../components/Dropdown';

type QRDataType = 'URL' | 'Text' | 'Email' | 'Phone' | 'SMS' | 'Vcard' | 'Mecard' | 'Location' | 'Wifi' | 'Event';

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#0ea5e9', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#1e293b', // Slate 800
  '#ffffff', // White
];

const QRCodeGenerator: React.FC = () => {
  const [dataType, setDataType] = useState<QRDataType>('URL');
  const [qrData, setQrData] = useState<any>({ url: 'https://google.com' });
  const [size, setSize] = useState<number>(300);
  const [fgColor, setFgColor] = useState<string>('#4f46e5');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [margin, setMargin] = useState<number>(10);
  const [errorCorrection, setErrorCorrection] = useState<any>('M');
  
  // Customization Options
  const [dotType, setDotType] = useState<any>('square');
  const [cornerType, setCornerType] = useState<any>('square');
  const [cornerDotType, setCornerDotType] = useState<any>('square');

  // Logo Options
  const [logo, setLogo] = useState<string | null>(null);
  const [originalLogo, setOriginalLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(0.4);
  const [logoMargin, setLogoMargin] = useState<number>(5);
  const [hideLogoBackground, setHideLogoBackground] = useState<boolean>(true);
  const [logoShape, setLogoShape] = useState<'square' | 'circle'>('square');

  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrStyling = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.replace(/[-:]/g, '') + '00';
  };

  const constructDataString = () => {
    switch (dataType) {
      case 'URL': return qrData.url || '';
      case 'Text': return qrData.text || '';
      case 'Email': 
        const email = qrData.email || '';
        const subject = qrData.subject || '';
        const body = qrData.body || '';
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      case 'Phone': return `tel:${qrData.phone || ''}`;
      case 'SMS': 
        const smsPhone = qrData.phone || '';
        const smsMessage = qrData.message || '';
        return `sms:${smsPhone}${smsMessage ? `?body=${encodeURIComponent(smsMessage)}` : ''}`;
      case 'Wifi': return `WIFI:T:${qrData.encryption || 'WPA'};S:${qrData.ssid || ''};P:${qrData.password || ''};;`;
      case 'Location': return `geo:${qrData.lat || '0'},${qrData.lng || '0'}`;
      case 'Vcard': 
        return `BEGIN:VCARD\nVERSION:3.0\nN:${qrData.lastName || ''};${qrData.firstName || ''}\nFN:${qrData.firstName || ''} ${qrData.lastName || ''}\nTEL;TYPE=CELL:${qrData.phone || ''}\nEMAIL:${qrData.email || ''}\nORG:${qrData.org || ''}\nURL:${qrData.website || ''}\nEND:VCARD`;
      case 'Mecard':
        return `MECARD:N:${qrData.lastName || ''},${qrData.firstName || ''};TEL:${qrData.phone || ''};EMAIL:${qrData.email || ''};URL:${qrData.website || ''};;`;
      case 'Event':
        const start = formatEventDate(qrData.start);
        const end = formatEventDate(qrData.end);
        return `BEGIN:VEVENT\nSUMMARY:${qrData.title || ''}\nLOCATION:${qrData.location || ''}\nDESCRIPTION:${qrData.desc || ''}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT`;
      default: return '';
    }
  };

  const processImage = (base64: string, shape: 'square' | 'circle') => {
    if (shape === 'square') {
      setLogo(base64);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
        setLogo(canvas.toDataURL());
      }
    };
    img.src = base64;
  };

  useEffect(() => {
    if (originalLogo) {
      processImage(originalLogo, logoShape);
    }
  }, [logoShape, originalLogo]);

  useEffect(() => {
    const dataString = constructDataString();
    
    const options: any = {
      width: size,
      height: size,
      data: dataString,
      dotsOptions: { color: fgColor, type: dotType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: cornerType },
      cornersDotOptions: { color: fgColor, type: cornerDotType },
      qrOptions: { errorCorrectionLevel: errorCorrection },
      margin: margin,
      image: logo || undefined,
      imageOptions: {
        hideBackgroundDots: hideLogoBackground,
        imageSize: logoSize,
        margin: logoMargin,
        crossOrigin: 'anonymous',
      }
    };

    if (!qrStyling.current) {
      qrStyling.current = new QRCodeStyling(options);
      if (qrRef.current) qrStyling.current.append(qrRef.current);
    } else {
      qrStyling.current.update(options);
    }
  }, [qrData, dataType, fgColor, bgColor, dotType, cornerType, cornerDotType, size, margin, errorCorrection, logo, logoSize, logoMargin, hideLogoBackground]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setOriginalLogo(base64);
        processImage(base64, logoShape);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (format: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (!qrStyling.current) return;
    if (format === 'pdf') {
      const doc = new jsPDF();
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const dim = size / 5; 
        doc.addImage(imgData, 'PNG', 10, 10, dim, dim);
        doc.save(`qr-code-${Date.now()}.pdf`);
      }
    } else {
      qrStyling.current.download({ name: `qr-code-${Date.now()}`, extension: format });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(constructDataString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateQrData = (key: string, value: string) => {
    setQrData((prev: any) => ({ ...prev, [key]: value }));
  };

  const dataTypes: { id: QRDataType; icon: any; label: string }[] = [
    { id: 'URL', icon: <Link2 size={14} />, label: 'URL' },
    { id: 'Text', icon: <Type size={14} />, label: 'Text' },
    { id: 'Email', icon: <Mail size={14} />, label: 'Email' },
    { id: 'Phone', icon: <Phone size={14} />, label: 'Phone' },
    { id: 'SMS', icon: <MessageSquare size={14} />, label: 'SMS' },
    { id: 'Wifi', icon: <Wifi size={14} />, label: 'WiFi' },
    { id: 'Location', icon: <MapPin size={14} />, label: 'Location' },
    { id: 'Vcard', icon: <UserCircle size={14} />, label: 'Vcard' },
    { id: 'Mecard', icon: <UserCircle size={14} />, label: 'Mecard' },
    { id: 'Event', icon: <Calendar size={14} />, label: 'Event' },
  ];

  const renderInputs = () => {
    const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-medium transition-all";
    const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

    switch (dataType) {
      case 'URL':
        return (
          <div className="space-y-2">
            <label className={labelClass}>Website URL</label>
            <input type="text" value={qrData.url || ''} onChange={e => updateQrData('url', e.target.value)} placeholder="https://example.com" className={inputClass} />
          </div>
        );
      case 'Text':
        return (
          <div className="space-y-2">
            <label className={labelClass}>Plain Text</label>
            <textarea value={qrData.text || ''} onChange={e => updateQrData('text', e.target.value)} placeholder="Enter your text here..." className={inputClass + " h-32 resize-none"} />
          </div>
        );
      case 'Email':
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Recipient Email</label>
              <input type="email" value={qrData.email || ''} onChange={e => updateQrData('email', e.target.value)} placeholder="hello@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subject Line</label>
              <input type="text" value={qrData.subject || ''} onChange={e => updateQrData('subject', e.target.value)} placeholder="Inquiry about services" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Message Body</label>
              <textarea value={qrData.body || ''} onChange={e => updateQrData('body', e.target.value)} placeholder="Type your email content..." className={inputClass + " h-24 resize-none"} />
            </div>
          </div>
        );
      case 'Phone':
        return (
          <div className="space-y-2">
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={qrData.phone || ''} onChange={e => updateQrData('phone', e.target.value)} placeholder="+1 234 567 8900" className={inputClass} />
          </div>
        );
      case 'SMS':
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Recipient Number</label>
              <input type="tel" value={qrData.phone || ''} onChange={e => updateQrData('phone', e.target.value)} placeholder="+1 234 567 8900" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SMS Text</label>
              <textarea value={qrData.message || ''} onChange={e => updateQrData('message', e.target.value)} placeholder="Enter your SMS content..." className={inputClass + " h-24 resize-none"} />
            </div>
          </div>
        );
      case 'Wifi':
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Network Name (SSID)</label>
              <input type="text" value={qrData.ssid || ''} onChange={e => updateQrData('ssid', e.target.value)} placeholder="My Home WiFi" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="text" value={qrData.password || ''} onChange={e => updateQrData('password', e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Encryption Type</label>
              <Dropdown 
                value={qrData.encryption || 'WPA'} 
                options={[
                  { value: 'WPA', label: 'WPA/WPA2' },
                  { value: 'WEP', label: 'WEP' },
                  { value: 'nopass', label: 'None (Open)' }
                ]} 
                onChange={v => updateQrData('encryption', v)}
              />
            </div>
          </div>
        );
      case 'Location':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Latitude</label>
              <input type="text" value={qrData.lat || ''} onChange={e => updateQrData('lat', e.target.value)} placeholder="37.7749" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input type="text" value={qrData.lng || ''} onChange={e => updateQrData('lng', e.target.value)} placeholder="-122.4194" className={inputClass} />
            </div>
          </div>
        );
      case 'Vcard':
      case 'Mecard':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" value={qrData.firstName || ''} onChange={e => updateQrData('firstName', e.target.value)} placeholder="John" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" value={qrData.lastName || ''} onChange={e => updateQrData('lastName', e.target.value)} placeholder="Doe" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={qrData.phone || ''} onChange={e => updateQrData('phone', e.target.value)} placeholder="+1 234 567 8900" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={qrData.email || ''} onChange={e => updateQrData('email', e.target.value)} placeholder="john@doe.com" className={inputClass} />
            </div>
            {dataType === 'Vcard' && (
              <div>
                <label className={labelClass}>Organization</label>
                <input type="text" value={qrData.org || ''} onChange={e => updateQrData('org', e.target.value)} placeholder="Tech Inc." className={inputClass} />
              </div>
            )}
            <div>
              <label className={labelClass}>Website</label>
              <input type="text" value={qrData.website || ''} onChange={e => updateQrData('website', e.target.value)} placeholder="https://johndoe.com" className={inputClass} />
            </div>
          </div>
        );
      case 'Event':
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Event Title</label>
              <input type="text" value={qrData.title || ''} onChange={e => updateQrData('title', e.target.value)} placeholder="Annual Conference 2024" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" value={qrData.location || ''} onChange={e => updateQrData('location', e.target.value)} placeholder="Grand Ballroom, Hotel" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={qrData.desc || ''} onChange={e => updateQrData('desc', e.target.value)} placeholder="Brief description of the event..." className={inputClass + " h-20 resize-none"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Start Date & Time</label>
                <input type="datetime-local" value={qrData.start || ''} onChange={e => updateQrData('start', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End Date & Time</label>
                <input type="datetime-local" value={qrData.end || ''} onChange={e => updateQrData('end', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium text-sm">Input fields for this type are coming soon.</div>;
    }
  };

  const shapeOptions = [
    { value: 'square', icon: <Square size={14} /> },
    { value: 'dots', icon: <Circle size={14} /> },
    { value: 'rounded', icon: <Square size={14} className="rounded" /> },
    { value: 'extra-rounded', icon: <Square size={14} className="rounded-md" /> },
    { value: 'classy', icon: <Zap size={14} /> },
    { value: 'classy-rounded', icon: <Zap size={14} className="rounded" /> }
  ];

  const ColorSelector = ({ label, color, onChange, presets }: any) => {
    return (
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Palette size={10} /> {label}
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
              <input 
                type="color" 
                value={color} 
                onChange={e => onChange(e.target.value)} 
                className="absolute inset-0 w-full h-full scale-150 cursor-pointer bg-transparent border-none" 
              />
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={color.toUpperCase()} 
                onChange={e => onChange(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 uppercase transition-all"
                maxLength={7}
              />
              <Pipette size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p: string) => (
              <button 
                key={p} 
                onClick={() => onChange(p)}
                className={`w-6 h-6 rounded-lg border-2 transition-all hover:scale-110 active:scale-90 ${color.toLowerCase() === p.toLowerCase() ? 'border-indigo-600 scale-110 ring-2 ring-indigo-50' : 'border-white shadow-sm'}`}
                style={{ backgroundColor: p }}
                title={p}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
      <div className="lg:col-span-7 space-y-10">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layout size={14} /> 1. Content Type
          </label>
          <div className="flex flex-wrap gap-2">
            {dataTypes.map(dt => (
              <button 
                key={dt.id}
                onClick={() => { setDataType(dt.id); setQrData({}); }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${dataType === dt.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'}`}
              >
                {dt.icon} {dt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Settings2 size={14} /> 2. Data Details
          </label>
          {renderInputs()}
        </div>

        {/* Logo Customization Section */}
        <div className="space-y-6 pt-8 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={14} /> 3. Logo Customization
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Upload Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all group overflow-hidden relative"
              >
                {logo ? (
                  <>
                    <img src={logo} alt="QR Logo" className="h-20 w-auto object-contain rounded-lg" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLogo(null); setOriginalLogo(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon className="text-slate-300 group-hover:text-indigo-400 transition-colors" size={24} />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">Click to upload logo</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Logo Shape (Crop)</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setLogoShape('square')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${logoShape === 'square' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  <Square size={14} /> Square
                </button>
                <button 
                  onClick={() => setLogoShape('circle')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${logoShape === 'circle' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  <Circle size={14} /> Circle
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Hide Dots Behind</label>
                  <button 
                    onClick={() => setHideLogoBackground(!hideLogoBackground)}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-black transition-all border ${hideLogoBackground ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 border-slate-100'}`}
                  >
                    {hideLogoBackground ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Logo Size</label>
                <span className="text-[10px] font-black text-indigo-600">{Math.round(logoSize * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="0.5" step="0.01" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Logo Margin</label>
                <span className="text-[10px] font-black text-indigo-600">{logoMargin}px</span>
              </div>
              <input type="range" min="0" max="20" step="1" value={logoMargin} onChange={(e) => setLogoMargin(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Maximize size={14} /> Canvas Size
              </label>
              <div className="bg-indigo-50 px-2.5 py-1 rounded-lg text-xs font-black text-indigo-600">{size}px</div>
            </div>
            <input type="range" min="100" max="1000" step="10" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          
          <div className="space-y-5">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} /> Error Correction
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {['L', 'M', 'Q', 'H'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setErrorCorrection(lvl)}
                  className={`py-3.5 rounded-xl text-xs font-black transition-all border ${errorCorrection === lvl ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-indigo-300'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12 pt-8 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Dropdown label="Body Shape" icon={<Zap size={10} />} value={dotType} options={shapeOptions} onChange={setDotType} />
              <Dropdown label="Eye Frame" icon={<Square size={10} />} value={cornerType} options={shapeOptions.slice(0, 3)} onChange={setCornerType} />
              <Dropdown label="Eye Ball" icon={<Circle size={10} />} value={cornerDotType} options={shapeOptions.slice(0, 2)} onChange={setCornerDotType} />
            </div>

            <div className="space-y-10 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 shadow-inner">
              <ColorSelector 
                label="Foreground Color" 
                color={fgColor} 
                onChange={setFgColor} 
                presets={PRESET_COLORS} 
              />
              <ColorSelector 
                label="Background Color" 
                color={bgColor} 
                onChange={setBgColor} 
                presets={PRESET_COLORS} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center space-y-10 min-h-0">
        <div className="sticky top-8 w-full flex flex-col items-center">
          <div className="p-8 md:p-12 bg-slate-50 rounded-[56px] border-2 border-dashed border-slate-200 shadow-inner group w-full flex justify-center items-center overflow-hidden">
            <div ref={qrRef} className="bg-white p-6 rounded-[40px] shadow-2xl transition-all duration-500 group-hover:scale-105 [&>canvas]:max-w-full [&>canvas]:h-auto flex justify-center items-center border border-white" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-[400px]">
            <button onClick={() => handleDownload('png')} className="px-6 py-[10px] bg-indigo-600 text-white rounded-2xl font-black text-[16px] flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100"><FileType size={20} /> PNG</button>
            <button onClick={() => handleDownload('jpeg')} className="px-6 py-[10px] bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-[16px] flex items-center justify-center gap-2 hover:border-indigo-600 active:scale-95 shadow-sm"><FileType size={20} /> JPG</button>
            <button onClick={() => handleDownload('svg')} className="px-6 py-[10px] bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-[16px] flex items-center justify-center gap-2 hover:border-indigo-600 active:scale-95 shadow-sm"><FileType size={20} /> SVG</button>
            <button onClick={() => handleDownload('pdf')} className="px-6 py-[10px] bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-[16px] flex items-center justify-center gap-2 hover:border-indigo-600 active:scale-95 shadow-sm"><FileType size={20} /> PDF</button>
          </div>
          <button onClick={handleCopy} className="mt-5 w-full max-w-[400px] py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95">{copied ? <><Check size={16} className="text-green-500" /> Source Copied</> : <><Copy size={16} /> Copy Content</>}</button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
