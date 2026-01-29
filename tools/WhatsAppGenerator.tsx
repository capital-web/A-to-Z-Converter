
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Copy, ExternalLink, Bold, Italic, Strikethrough, Code, Phone, Check, RefreshCcw, Smile, QrCode, X, Download, List, ListOrdered, Quote } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import QRCodeStyling from 'qr-code-styling';

// Full list of country codes
const COUNTRY_CODES = [
  { value: '93', label: 'Afghanistan (+93)' },
  { value: '355', label: 'Albania (+355)' },
  { value: '213', label: 'Algeria (+213)' },
  { value: '1684', label: 'American Samoa (+1684)' },
  { value: '376', label: 'Andorra (+376)' },
  { value: '244', label: 'Angola (+244)' },
  { value: '1264', label: 'Anguilla (+1264)' },
  { value: '672', label: 'Antarctica (+672)' },
  { value: '1268', label: 'Antigua and Barbuda (+1268)' },
  { value: '54', label: 'Argentina (+54)' },
  { value: '374', label: 'Armenia (+374)' },
  { value: '297', label: 'Aruba (+297)' },
  { value: '61', label: 'Australia (+61)' },
  { value: '43', label: 'Austria (+43)' },
  { value: '994', label: 'Azerbaijan (+994)' },
  { value: '1242', label: 'Bahamas (+1242)' },
  { value: '973', label: 'Bahrain (+973)' },
  { value: '880', label: 'Bangladesh (+880)' },
  { value: '1246', label: 'Barbados (+1246)' },
  { value: '375', label: 'Belarus (+375)' },
  { value: '32', label: 'Belgium (+32)' },
  { value: '501', label: 'Belize (+501)' },
  { value: '229', label: 'Benin (+229)' },
  { value: '1441', label: 'Bermuda (+1441)' },
  { value: '975', label: 'Bhutan (+975)' },
  { value: '591', label: 'Bolivia (+591)' },
  { value: '387', label: 'Bosnia and Herzegovina (+387)' },
  { value: '267', label: 'Botswana (+267)' },
  { value: '55', label: 'Brazil (+55)' },
  { value: '246', label: 'British Indian Ocean Territory (+246)' },
  { value: '1284', label: 'British Virgin Islands (+1284)' },
  { value: '673', label: 'Brunei (+673)' },
  { value: '359', label: 'Bulgaria (+359)' },
  { value: '226', label: 'Burkina Faso (+226)' },
  { value: '257', label: 'Burundi (+257)' },
  { value: '855', label: 'Cambodia (+855)' },
  { value: '237', label: 'Cameroon (+237)' },
  { value: '1', label: 'Canada (+1)' },
  { value: '238', label: 'Cape Verde (+238)' },
  { value: '1345', label: 'Cayman Islands (+1345)' },
  { value: '236', label: 'Central African Republic (+236)' },
  { value: '235', label: 'Chad (+235)' },
  { value: '56', label: 'Chile (+56)' },
  { value: '86', label: 'China (+86)' },
  { value: '61', label: 'Christmas Island (+61)' },
  { value: '61', label: 'Cocos Islands (+61)' },
  { value: '57', label: 'Colombia (+57)' },
  { value: '269', label: 'Comoros (+269)' },
  { value: '682', label: 'Cook Islands (+682)' },
  { value: '506', label: 'Costa Rica (+506)' },
  { value: '385', label: 'Croatia (+385)' },
  { value: '53', label: 'Cuba (+53)' },
  { value: '599', label: 'Curacao (+599)' },
  { value: '357', label: 'Cyprus (+357)' },
  { value: '420', label: 'Czech Republic (+420)' },
  { value: '243', label: 'Democratic Republic of the Congo (+243)' },
  { value: '45', label: 'Denmark (+45)' },
  { value: '253', label: 'Djibouti (+253)' },
  { value: '1767', label: 'Dominica (+1767)' },
  { value: '1809', label: 'Dominican Republic (+1809)' },
  { value: '670', label: 'East Timor (+670)' },
  { value: '593', label: 'Ecuador (+593)' },
  { value: '20', label: 'Egypt (+20)' },
  { value: '503', label: 'El Salvador (+503)' },
  { value: '240', label: 'Equatorial Guinea (+240)' },
  { value: '291', label: 'Eritrea (+291)' },
  { value: '372', label: 'Estonia (+372)' },
  { value: '251', label: 'Ethiopia (+251)' },
  { value: '500', label: 'Falkland Islands (+500)' },
  { value: '298', label: 'Faroe Islands (+298)' },
  { value: '679', label: 'Fiji (+679)' },
  { value: '358', label: 'Finland (+358)' },
  { value: '33', label: 'France (+33)' },
  { value: '594', label: 'French Guiana (+594)' },
  { value: '689', label: 'French Polynesia (+689)' },
  { value: '241', label: 'Gabon (+241)' },
  { value: '220', label: 'Gambia (+220)' },
  { value: '995', label: 'Georgia (+995)' },
  { value: '49', label: 'Germany (+49)' },
  { value: '233', label: 'Ghana (+233)' },
  { value: '350', label: 'Gibraltar (+350)' },
  { value: '30', label: 'Greece (+30)' },
  { value: '299', label: 'Greenland (+299)' },
  { value: '1473', label: 'Grenada (+1473)' },
  { value: '590', label: 'Guadeloupe (+590)' },
  { value: '1671', label: 'Guam (+1671)' },
  { value: '502', label: 'Guatemala (+502)' },
  { value: '44', label: 'Guernsey (+44)' },
  { value: '224', label: 'Guinea (+224)' },
  { value: '245', label: 'Guinea-Bissau (+245)' },
  { value: '592', label: 'Guyana (+592)' },
  { value: '509', label: 'Haiti (+509)' },
  { value: '504', label: 'Honduras (+504)' },
  { value: '852', label: 'Hong Kong (+852)' },
  { value: '36', label: 'Hungary (+36)' },
  { value: '354', label: 'Iceland (+354)' },
  { value: '91', label: 'India (+91)' },
  { value: '62', label: 'Indonesia (+62)' },
  { value: '98', label: 'Iran (+98)' },
  { value: '964', label: 'Iraq (+964)' },
  { value: '353', label: 'Ireland (+353)' },
  { value: '44', label: 'Isle of Man (+44)' },
  { value: '972', label: 'Israel (+972)' },
  { value: '39', label: 'Italy (+39)' },
  { value: '225', label: 'Ivory Coast (+225)' },
  { value: '1876', label: 'Jamaica (+1876)' },
  { value: '81', label: 'Japan (+81)' },
  { value: '44', label: 'Jersey (+44)' },
  { value: '962', label: 'Jordan (+962)' },
  { value: '7', label: 'Kazakhstan (+7)' },
  { value: '254', label: 'Kenya (+254)' },
  { value: '686', label: 'Kiribati (+686)' },
  { value: '383', label: 'Kosovo (+383)' },
  { value: '965', label: 'Kuwait (+965)' },
  { value: '996', label: 'Kyrgyzstan (+996)' },
  { value: '856', label: 'Laos (+856)' },
  { value: '371', label: 'Latvia (+371)' },
  { value: '961', label: 'Lebanon (+961)' },
  { value: '266', label: 'Lesotho (+266)' },
  { value: '231', label: 'Liberia (+231)' },
  { value: '218', label: 'Libya (+218)' },
  { value: '423', label: 'Liechtenstein (+423)' },
  { value: '370', label: 'Lithuania (+370)' },
  { value: '352', label: 'Luxembourg (+352)' },
  { value: '853', label: 'Macau (+853)' },
  { value: '389', label: 'Macedonia (+389)' },
  { value: '261', label: 'Madagascar (+261)' },
  { value: '265', label: 'Malawi (+265)' },
  { value: '60', label: 'Malaysia (+60)' },
  { value: '960', label: 'Maldives (+960)' },
  { value: '223', label: 'Mali (+223)' },
  { value: '356', label: 'Malta (+356)' },
  { value: '692', label: 'Marshall Islands (+692)' },
  { value: '222', label: 'Mauritania (+222)' },
  { value: '230', label: 'Mauritius (+230)' },
  { value: '262', label: 'Mayotte (+262)' },
  { value: '52', label: 'Mexico (+52)' },
  { value: '691', label: 'Micronesia (+691)' },
  { value: '373', label: 'Moldova (+373)' },
  { value: '377', label: 'Monaco (+377)' },
  { value: '976', label: 'Mongolia (+976)' },
  { value: '382', label: 'Montenegro (+382)' },
  { value: '1664', label: 'Montserrat (+1664)' },
  { value: '212', label: 'Morocco (+212)' },
  { value: '258', label: 'Mozambique (+258)' },
  { value: '95', label: 'Myanmar (+95)' },
  { value: '264', label: 'Namibia (+264)' },
  { value: '674', label: 'Nauru (+674)' },
  { value: '977', label: 'Nepal (+977)' },
  { value: '31', label: 'Netherlands (+31)' },
  { value: '599', label: 'Netherlands Antilles (+599)' },
  { value: '687', label: 'New Caledonia (+687)' },
  { value: '64', label: 'New Zealand (+64)' },
  { value: '505', label: 'Nicaragua (+505)' },
  { value: '227', label: 'Niger (+227)' },
  { value: '234', label: 'Nigeria (+234)' },
  { value: '683', label: 'Niue (+683)' },
  { value: '850', label: 'North Korea (+850)' },
  { value: '1670', label: 'Northern Mariana Islands (+1670)' },
  { value: '47', label: 'Norway (+47)' },
  { value: '968', label: 'Oman (+968)' },
  { value: '92', label: 'Pakistan (+92)' },
  { value: '680', label: 'Palau (+680)' },
  { value: '970', label: 'Palestine (+970)' },
  { value: '507', label: 'Panama (+507)' },
  { value: '675', label: 'Papua New Guinea (+675)' },
  { value: '595', label: 'Paraguay (+595)' },
  { value: '51', label: 'Peru (+51)' },
  { value: '63', label: 'Philippines (+63)' },
  { value: '64', label: 'Pitcairn (+64)' },
  { value: '48', label: 'Poland (+48)' },
  { value: '351', label: 'Portugal (+351)' },
  { value: '1787', label: 'Puerto Rico (+1787)' },
  { value: '974', label: 'Qatar (+974)' },
  { value: '242', label: 'Republic of the Congo (+242)' },
  { value: '262', label: 'Reunion (+262)' },
  { value: '40', label: 'Romania (+40)' },
  { value: '7', label: 'Russia (+7)' },
  { value: '250', label: 'Rwanda (+250)' },
  { value: '590', label: 'Saint Barthelemy (+590)' },
  { value: '290', label: 'Saint Helena (+290)' },
  { value: '1869', label: 'Saint Kitts and Nevis (+1869)' },
  { value: '1758', label: 'Saint Lucia (+1758)' },
  { value: '590', label: 'Saint Martin (+590)' },
  { value: '508', label: 'Saint Pierre and Miquelon (+508)' },
  { value: '1784', label: 'Saint Vincent and the Grenadines (+1784)' },
  { value: '685', label: 'Samoa (+685)' },
  { value: '378', label: 'San Marino (+378)' },
  { value: '239', label: 'Sao Tome and Principe (+239)' },
  { value: '966', label: 'Saudi Arabia (+966)' },
  { value: '221', label: 'Senegal (+221)' },
  { value: '381', label: 'Serbia (+381)' },
  { value: '248', label: 'Seychelles (+248)' },
  { value: '232', label: 'Sierra Leone (+232)' },
  { value: '65', label: 'Singapore (+65)' },
  { value: '1721', label: 'Sint Maarten (+1721)' },
  { value: '421', label: 'Slovakia (+421)' },
  { value: '386', label: 'Slovenia (+386)' },
  { value: '677', label: 'Solomon Islands (+677)' },
  { value: '252', label: 'Somalia (+252)' },
  { value: '27', label: 'South Africa (+27)' },
  { value: '82', label: 'South Korea (+82)' },
  { value: '211', label: 'South Sudan (+211)' },
  { value: '34', label: 'Spain (+34)' },
  { value: '94', label: 'Sri Lanka (+94)' },
  { value: '249', label: 'Sudan (+249)' },
  { value: '597', label: 'Suriname (+597)' },
  { value: '47', label: 'Svalbard and Jan Mayen (+47)' },
  { value: '268', label: 'Swaziland (+268)' },
  { value: '46', label: 'Sweden (+46)' },
  { value: '41', label: 'Switzerland (+41)' },
  { value: '963', label: 'Syria (+963)' },
  { value: '886', label: 'Taiwan (+886)' },
  { value: '992', label: 'Tajikistan (+992)' },
  { value: '255', label: 'Tanzania (+255)' },
  { value: '66', label: 'Thailand (+66)' },
  { value: '228', label: 'Togo (+228)' },
  { value: '690', label: 'Tokelau (+690)' },
  { value: '676', label: 'Tonga (+676)' },
  { value: '1868', label: 'Trinidad and Tobago (+1868)' },
  { value: '216', label: 'Tunisia (+216)' },
  { value: '90', label: 'Turkey (+90)' },
  { value: '993', label: 'Turkmenistan (+993)' },
  { value: '1649', label: 'Turks and Caicos Islands (+1649)' },
  { value: '688', label: 'Tuvalu (+688)' },
  { value: '1340', label: 'U.S. Virgin Islands (+1340)' },
  { value: '256', label: 'Uganda (+256)' },
  { value: '380', label: 'Ukraine (+380)' },
  { value: '971', label: 'United Arab Emirates (+971)' },
  { value: '44', label: 'United Kingdom (+44)' },
  { value: '1', label: 'United States (+1)' },
  { value: '598', label: 'Uruguay (+598)' },
  { value: '998', label: 'Uzbekistan (+998)' },
  { value: '678', label: 'Vanuatu (+678)' },
  { value: '379', label: 'Vatican (+379)' },
  { value: '58', label: 'Venezuela (+58)' },
  { value: '84', label: 'Vietnam (+84)' },
  { value: '681', label: 'Wallis and Futuna (+681)' },
  { value: '212', label: 'Western Sahara (+212)' },
  { value: '967', label: 'Yemen (+967)' },
  { value: '260', label: 'Zambia (+260)' },
  { value: '263', label: 'Zimbabwe (+263)' }
];

const WhatsAppGenerator: React.FC = () => {
  const [countryCode, setCountryCode] = useState('91');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // QR Code State
  const [showQr, setShowQr] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Generate link whenever inputs change
    if (!phone) {
      setLink('');
      return;
    }

    // Clean phone number: remove non-numeric chars
    const cleanPhone = phone.replace(/\D/g, '');
    const fullNumber = `${countryCode}${cleanPhone}`;
    
    let generated = `https://wa.me/${fullNumber}`;
    if (message.trim()) {
      generated += `?text=${encodeURIComponent(message)}`;
    }
    
    setLink(generated);
  }, [countryCode, phone, message]);

  // QR Code Effect
  useEffect(() => {
    if (showQr && link && qrRef.current) {
        if (!qrCode.current) {
            qrCode.current = new QRCodeStyling({
                width: 280,
                height: 280,
                data: link,
                dotsOptions: { color: '#059669', type: 'rounded' }, // Emerald-600
                backgroundOptions: { color: '#ffffff' },
                imageOptions: { crossOrigin: 'anonymous', margin: 5 },
                cornersSquareOptions: { color: '#059669', type: 'extra-rounded' },
                cornersDotOptions: { color: '#059669' }
            });
            qrCode.current.append(qrRef.current);
        } else {
            qrCode.current.update({ data: link });
        }
    }
  }, [showQr, link]);

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertFormat = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // If text is selected, wrap it. If not, just insert symbols at cursor or around it
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${symbol}${selection}${symbol}${after}`;
    setMessage(newText);
    
    // Restore focus and cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, end + symbol.length);
    }, 0);
  };

  const insertList = (type: 'bullet' | 'number' | 'quote') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    let formatted = "";
    if (selection) {
      const lines = selection.split('\n');
      formatted = lines.map((line, i) => {
        if (type === 'bullet') return `* ${line}`;
        if (type === 'quote') return `> ${line}`;
        return `${i + 1}. ${line}`;
      }).join('\n');
    } else {
      if (type === 'bullet') formatted = "* ";
      else if (type === 'quote') formatted = "> ";
      else formatted = "1. ";
    }

    const newText = `${before}${formatted}${after}`;
    setMessage(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formatted.length, start + formatted.length);
    }, 0);
  };

  const handleEmojiClick = (emojiData: any) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const emoji = emojiData.emoji;

    const newText = text.substring(0, start) + emoji + text.substring(end);
    setMessage(newText);

    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
    setShowEmojiPicker(false);
  };

  const handleReset = () => {
    setPhone('');
    setMessage('');
  };

  const downloadQr = () => {
    qrCode.current?.download({ name: 'whatsapp-qr', extension: 'png' });
  };

  // Helper to render preview text with WhatsApp-style formatting
  const renderPreview = (text: string) => {
    if (!text) return <span className="text-slate-400 italic">Your message will appear here...</span>;
    
    // Process line by line for lists, quotes, and formatting
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      let content: React.ReactNode = line;
      let isList = false;
      let isQuote = false;
      let listMarker = "";

      // Check for bullet list
      if (line.trimStart().startsWith('* ') || line.trimStart().startsWith('- ')) {
        isList = true;
        listMarker = "•";
        content = line.trimStart().substring(2);
      } 
      // Check for numbered list
      else if (/^\d+\.\s/.test(line.trimStart())) {
        isList = true;
        const match = line.trimStart().match(/^(\d+\.\s)(.*)/);
        listMarker = match ? match[1] : "";
        content = match ? match[2] : line;
      }
      // Check for block quote
      else if (line.trimStart().startsWith('> ')) {
        isQuote = true;
        content = line.trimStart().substring(2);
      }

      const processInline = (t: string) => {
        const parts = t.split(/(\*.*?\*|_.*?_|~.*?~|```.*?```)/g);
        return parts.map((part, index) => {
          if (part.startsWith('*') && part.endsWith('*')) return <strong key={index}>{part.slice(1, -1)}</strong>;
          if (part.startsWith('_') && part.endsWith('_')) return <em key={index}>{part.slice(1, -1)}</em>;
          if (part.startsWith('~') && part.endsWith('~')) return <span key={index} className="line-through">{part.slice(1, -1)}</span>;
          if (part.startsWith('```') && part.endsWith('```')) return <code key={index} className="bg-slate-100 px-1 rounded text-xs">{part.slice(3, -3)}</code>;
          return <span key={index}>{part}</span>;
        });
      };

      return (
        <div 
            key={lineIdx} 
            className={`
                flex gap-2 min-h-[1.5em] 
                ${isList ? 'pl-2' : ''} 
                ${isQuote ? 'border-l-4 border-emerald-300 pl-3 italic text-slate-500 bg-emerald-50/30 rounded-r-lg py-0.5' : ''}
            `}
        >
          {isList && <span className="text-emerald-600 font-bold shrink-0">{listMarker}</span>}
          <div className="flex-1">{processInline(typeof content === 'string' ? content : line)}</div>
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Builder Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Phone size={14} /> WhatsApp Number
             </label>
             <button onClick={handleReset} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-widest transition-colors">
               <RefreshCcw size={10} /> Reset
             </button>
          </div>
          
          <div className="flex gap-3">
             <div className="w-48 flex-shrink-0">
               <Dropdown 
                 value={countryCode}
                 options={COUNTRY_CODES}
                 onChange={setCountryCode}
                 className="w-full"
                 searchable={true}
               />
             </div>
             <div className="flex-1 relative">
               <input 
                 type="tel"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 placeholder="9876543210"
                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-lg text-slate-700 tracking-wide transition-all"
               />
             </div>
          </div>
        </div>

        <div className="space-y-4 relative">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageCircle size={14} /> Message Template
          </label>
          
          <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent transition-all shadow-inner relative z-0">
             {/* Formatting Toolbar */}
             <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-100/50 flex-wrap">
               <button onClick={() => insertFormat('*')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Bold">
                 <Bold size={16} />
               </button>
               <button onClick={() => insertFormat('_')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Italic">
                 <Italic size={16} />
               </button>
               <button onClick={() => insertFormat('~')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Strikethrough">
                 <Strikethrough size={16} />
               </button>
               <button onClick={() => insertFormat('```')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Monospace">
                 <Code size={16} />
               </button>
               <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block" />
               <button onClick={() => insertList('bullet')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Bullet List">
                 <List size={16} />
               </button>
               <button onClick={() => insertList('number')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Numbered List">
                 <ListOrdered size={16} />
               </button>
               <button onClick={() => insertList('quote')} className="p-2 rounded-lg hover:bg-white hover:text-indigo-600 text-slate-500 transition-all" title="Block Quote">
                 <Quote size={16} />
               </button>
               <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block" />
               <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  className={`p-2 rounded-lg transition-all ${showEmojiPicker ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-white hover:text-indigo-600 text-slate-500'}`} 
                  title="Insert Emoji"
               >
                 <Smile size={16} />
               </button>
             </div>
             
             <textarea 
               ref={textareaRef}
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Hi! I'm interested in your services..."
               className="w-full h-40 p-4 bg-transparent outline-none resize-none text-slate-700 leading-relaxed"
             />
          </div>

          {showEmojiPicker && (
            <div className="absolute top-12 left-0 z-20 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
               <div className="fixed inset-0 z-10" onClick={() => setShowEmojiPicker(false)}></div>
               <div className="relative z-20">
                 <EmojiPicker 
                    onEmojiClick={handleEmojiClick} 
                    emojiStyle={EmojiStyle.NATIVE}
                    width={320}
                    height={400}
                    previewConfig={{ showPreview: false }}
                 />
               </div>
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-right">
             Supports WhatsApp formatting & Emojis
          </p>
        </div>
      </div>

      {/* Preview & Action Section */}
      <div className="space-y-8">
         <div className="bg-emerald-50 rounded-[40px] p-6 md:p-10 border border-emerald-100 flex flex-col h-full min-h-[400px]">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
               <MessageCircle size={14} /> Live Preview
            </h3>

            {/* Chat Bubble Simulation */}
            <div className="flex-1 flex flex-col justify-end space-y-4 mb-8">
               <div className="bg-white p-4 rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl shadow-sm self-end max-w-[90%] border border-emerald-100/50 relative">
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed overflow-x-hidden">
                     {renderPreview(message)}
                  </div>
                  <div className="flex justify-end items-center gap-1 mt-1">
                     <span className="text-[9px] text-slate-400 font-medium">12:00 PM</span>
                     <Check size={12} className="text-sky-500" />
                  </div>
                  {/* Triangle for bubble tail */}
                  <div className="absolute -bottom-[8px] right-0 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[0px] border-r-transparent filter drop-shadow-sm"></div>
               </div>
            </div>

            {/* Generated Link Box */}
            <div className="space-y-4">
              {link ? (
                 <div className="bg-white p-2 pl-4 rounded-2xl flex items-center justify-between border border-emerald-100 shadow-sm gap-2">
                    <span className="text-xs font-medium text-slate-500 truncate select-all">{link}</span>
                    <button 
                      onClick={handleCopy} 
                      className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                      title="Copy Link"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                 </div>
              ) : (
                 <div className="text-center p-4 text-emerald-400/60 text-xs font-bold uppercase tracking-wider border-2 border-dashed border-emerald-200/50 rounded-2xl">
                    Enter details to generate link
                 </div>
              )}

              <div className="flex gap-3">
                  <a 
                    href={link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex-[2] py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider shadow-xl transition-all
                      ${link 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200 cursor-pointer active:scale-95' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                    onClick={(e) => !link && e.preventDefault()}
                  >
                    <Send size={18} /> Open Chat
                  </a>
                  
                  <button
                    onClick={() => link && setShowQr(true)}
                    disabled={!link}
                    className={`
                      flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all border-2
                      ${link 
                        ? 'bg-white text-emerald-600 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer active:scale-95' 
                        : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'}
                    `}
                    title="Generate QR Code"
                  >
                    <QrCode size={20} /> <span className="hidden sm:inline">QR</span>
                  </button>
              </div>
            </div>
         </div>
      </div>

      {/* QR Modal Overlay */}
      {showQr && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-200">
               <button 
                 onClick={() => setShowQr(false)}
                 className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full transition-colors"
               >
                 <X size={20} />
               </button>
               
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-slate-800">Scan to Chat</h3>
                     <p className="text-sm text-slate-400">Share this QR code for instant access</p>
                  </div>
                  
                  <div className="p-4 bg-white border-2 border-emerald-500/20 rounded-3xl shadow-inner">
                     <div ref={qrRef} />
                  </div>

                  <button 
                    onClick={downloadQr}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                  >
                     <Download size={18} /> Download QR Image
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default WhatsAppGenerator;
