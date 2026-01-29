import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, MapPin, User, Phone, Mail, Calendar, Globe, Flag, Building } from 'lucide-react';
import Dropdown from '../components/Dropdown';

// --- DATA SETS ---

const COUNTRIES = [
  { id: 'US', name: 'United States', phonePrefix: '+1', flag: '🇺🇸' },
  { id: 'CA', name: 'Canada', phonePrefix: '+1', flag: '🇨🇦' },
  { id: 'UK', name: 'United Kingdom', phonePrefix: '+44', flag: '🇬🇧' },
  { id: 'IN', name: 'India', phonePrefix: '+91', flag: '🇮🇳' },
];

const NAMES = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Liam', 'Noah', 'Oliver', 'Elijah', 'Lucas'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Olivia', 'Emma', 'Ava', 'Charlotte', 'Sophia'],
  last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark'],
  
  // Specific Indian Names
  in_male: ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Reyansh', 'Muhammad', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Ayaan', 'Dhruv', 'Kabir', 'Riyan', 'Vivaan', 'Rahul', 'Amit', 'Suresh', 'Ramesh', 'Sanjay'],
  in_female: ['Aadya', 'Diya', 'Saanvi', 'Ananya', 'Kiara', 'Pari', 'Anika', 'Myra', 'Aaradhya', 'Saira', 'Amaya', 'Riya', 'Kavya', 'Priya', 'Sneha', 'Pooja', 'Neha', 'Anjali', 'Meera', 'Nisha'],
  in_last: ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Bhatia', 'Saxena', 'Mehta', 'Chopra', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Rao', 'Iyer', 'Menon', 'Joshi', 'Desai', 'Jain', 'Agarwal', 'Khan', 'Mishra', 'Das', 'Roy']
};

const STREETS = {
  US: ['Main St', 'Maple Ave', 'Oak St', 'Washington St', 'Park Ave', 'Broadway', 'Highland Ave', 'Elm St', 'Cedar Ln', 'Sunset Blvd', 'Pine St', 'Lakeview Dr', 'Hillside Ave'],
  CA: ['Queen St', 'King St', 'Main St', 'Wellington St', 'Victoria St', 'Princess St', 'Front St', 'Bay St', 'Dundas St', 'Rideau St', 'Maple Leaf Dr', 'Confederation Way'],
  UK: ['High Street', 'Station Road', 'London Road', 'Victoria Road', 'Church Lane', 'Manor Road', 'Park Road', 'Queens Road', 'Mill Lane', 'Kings Road', 'Green Lane', 'West Street'],
  IN: ['MG Road', 'Station Road', 'Gandhi Marg', 'Ring Road', 'Link Road', 'Civil Lines', 'Park Street', 'Temple Road', 'Market Road', 'College Road', 'Residency Road', 'Lalbagh Road']
};

// Comprehensive Location Data
const LOCATIONS = {
  US: [
    { state: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile'], zipBase: '350' },
    { state: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau'], zipBase: '995' },
    { state: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler'], zipBase: '850' },
    { state: 'Arkansas', cities: ['Little Rock', 'Fort Smith', 'Fayetteville'], zipBase: '722' },
    { state: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'], zipBase: '900' },
    { state: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora'], zipBase: '802' },
    { state: 'Connecticut', cities: ['Bridgeport', 'New Haven', 'Stamford'], zipBase: '066' },
    { state: 'Delaware', cities: ['Wilmington', 'Dover'], zipBase: '198' },
    { state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'], zipBase: '331' },
    { state: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah'], zipBase: '303' },
    { state: 'Hawaii', cities: ['Honolulu', 'Hilo', 'Kailua'], zipBase: '968' },
    { state: 'Idaho', cities: ['Boise', 'Meridian', 'Nampa'], zipBase: '837' },
    { state: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Springfield'], zipBase: '606' },
    { state: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Evansville'], zipBase: '462' },
    { state: 'Iowa', cities: ['Des Moines', 'Cedar Rapids', 'Davenport'], zipBase: '503' },
    { state: 'Kansas', cities: ['Wichita', 'Overland Park', 'Kansas City'], zipBase: '672' },
    { state: 'Kentucky', cities: ['Louisville', 'Lexington', 'Bowling Green'], zipBase: '402' },
    { state: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport'], zipBase: '701' },
    { state: 'Maine', cities: ['Portland', 'Lewiston', 'Bangor'], zipBase: '041' },
    { state: 'Maryland', cities: ['Baltimore', 'Frederick', 'Rockville'], zipBase: '212' },
    { state: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield'], zipBase: '021' },
    { state: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Warren'], zipBase: '482' },
    { state: 'Minnesota', cities: ['Minneapolis', 'Saint Paul', 'Rochester'], zipBase: '554' },
    { state: 'Mississippi', cities: ['Jackson', 'Gulfport', 'Southaven'], zipBase: '392' },
    { state: 'Missouri', cities: ['Kansas City', 'Saint Louis', 'Springfield'], zipBase: '641' },
    { state: 'Montana', cities: ['Billings', 'Missoula', 'Great Falls'], zipBase: '591' },
    { state: 'Nebraska', cities: ['Omaha', 'Lincoln', 'Bellevue'], zipBase: '681' },
    { state: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno'], zipBase: '891' },
    { state: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord'], zipBase: '031' },
    { state: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson'], zipBase: '071' },
    { state: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho'], zipBase: '871' },
    { state: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'], zipBase: '100' },
    { state: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro'], zipBase: '282' },
    { state: 'North Dakota', cities: ['Fargo', 'Bismarck', 'Grand Forks'], zipBase: '581' },
    { state: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'], zipBase: '432' },
    { state: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman'], zipBase: '731' },
    { state: 'Oregon', cities: ['Portland', 'Salem', 'Eugene'], zipBase: '972' },
    { state: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown'], zipBase: '191' },
    { state: 'Rhode Island', cities: ['Providence', 'Warwick', 'Cranston'], zipBase: '029' },
    { state: 'South Carolina', cities: ['Charleston', 'Columbia', 'North Charleston'], zipBase: '294' },
    { state: 'South Dakota', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen'], zipBase: '571' },
    { state: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville'], zipBase: '372' },
    { state: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'], zipBase: '750' },
    { state: 'Utah', cities: ['Salt Lake City', 'West Valley City', 'Provo'], zipBase: '841' },
    { state: 'Vermont', cities: ['Burlington', 'South Burlington', 'Rutland'], zipBase: '054' },
    { state: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond'], zipBase: '234' },
    { state: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma'], zipBase: '981' },
    { state: 'West Virginia', cities: ['Charleston', 'Huntington', 'Morgantown'], zipBase: '253' },
    { state: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay'], zipBase: '532' },
    { state: 'Wyoming', cities: ['Cheyenne', 'Casper', 'Laramie'], zipBase: '820' },
  ],
  CA: [
    { state: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'], zipBase: 'T' },
    { state: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'], zipBase: 'V' },
    { state: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach'], zipBase: 'R' },
    { state: 'New Brunswick', cities: ['Moncton', 'Saint John', 'Fredericton'], zipBase: 'E' },
    { state: 'Newfoundland and Labrador', cities: ['St. John\'s', 'Mount Pearl', 'Corner Brook'], zipBase: 'A' },
    { state: 'Nova Scotia', cities: ['Halifax', 'Dartmouth', 'Sydney'], zipBase: 'B' },
    { state: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'], zipBase: 'M' },
    { state: 'Prince Edward Island', cities: ['Charlottetown', 'Summerside'], zipBase: 'C' },
    { state: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'], zipBase: 'H' },
    { state: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert'], zipBase: 'S' },
    { state: 'Northwest Territories', cities: ['Yellowknife'], zipBase: 'X' },
    { state: 'Nunavut', cities: ['Iqaluit'], zipBase: 'X' },
    { state: 'Yukon', cities: ['Whitehorse'], zipBase: 'Y' },
  ],
  UK: [
    { state: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol', 'Leeds'], zipBase: 'SW1' },
    { state: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'], zipBase: 'EH1' },
    { state: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Bangor'], zipBase: 'CF1' },
    { state: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn'], zipBase: 'BT1' },
  ],
  IN: [
    { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur'], zipBase: '530' },
    { state: 'Assam', cities: ['Guwahati', 'Silchar', 'Dibrugarh'], zipBase: '781' },
    { state: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur'], zipBase: '800' },
    { state: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi'], zipBase: '110' },
    { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'], zipBase: '380' },
    { state: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'], zipBase: '560' },
    { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'], zipBase: '695' },
    { state: 'Madhya Pradesh', cities: ['Indore', 'Bhopal', 'Jabalpur'], zipBase: '452' },
    { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'], zipBase: '400' },
    { state: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar'], zipBase: '141' },
    { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur'], zipBase: '302' },
    { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'], zipBase: '600' },
    { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad'], zipBase: '500' },
    { state: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'], zipBase: '226' },
    { state: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur'], zipBase: '700' },
  ]
};

const FakeAddressGenerator: React.FC = () => {
  const [country, setCountry] = useState('US');
  const [stateFilter, setStateFilter] = useState('All');
  const [gender, setGender] = useState('Random');
  const [profile, setProfile] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Generate initial profile
  useEffect(() => {
    generateProfile();
  }, []); // Run once on mount

  // Update states dropdown when country changes
  useEffect(() => {
    setStateFilter('All');
  }, [country]);

  const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  // Helper to generate formatted zip/postal codes
  const generateZip = (country: string, base: string) => {
    if (country === 'US') {
      // US: 5 digits (e.g., 90210)
      const randomSuffix = Math.floor(Math.random() * 900) + 100; // ensures 3 digits
      return `${base}${randomSuffix.toString().slice(0, 5 - base.length)}`;
    }
    if (country === 'CA') {
      // CA: A1A 1A1
      const chars = 'ABCABCEGHJKLMNPRSTVXY'; // Valid first letters
      const nums = '0123456789';
      const c1 = base.length > 0 ? base[0] : getRandomItem(chars.split(''));
      const n1 = getRandomItem(nums.split(''));
      const c2 = getRandomItem(chars.split(''));
      const n2 = getRandomItem(nums.split(''));
      const c3 = getRandomItem(chars.split(''));
      const n3 = getRandomItem(nums.split(''));
      return `${c1}${n1}${c2} ${n2}${c3}${n3}`;
    }
    if (country === 'UK') {
      // UK: SW1A 1AA or similar
      const baseArea = base || 'SW1';
      const district = Math.floor(Math.random() * 9) + 1;
      const chars = 'ABDEFGHJLNPQRSTUWXYZ';
      const c1 = getRandomItem(chars.split(''));
      const c2 = getRandomItem(chars.split(''));
      return `${baseArea} ${district}${c1}${c2}`;
    }
    if (country === 'IN') {
      // IN: 6 digits (e.g., 400001)
      const suffix = Math.floor(Math.random() * 899) + 100;
      return `${base}${suffix}`;
    }
    return '00000';
  };

  const generateProfile = () => {
    // 1. Gender & Name
    const selectedGender = gender === 'Random' ? (Math.random() > 0.5 ? 'male' : 'female') : gender.toLowerCase();
    
    let nameSource: { male: string[], female: string[], last: string[] };
    if (country === 'IN') {
      nameSource = {
        male: NAMES.in_male,
        female: NAMES.in_female,
        last: NAMES.in_last
      };
    } else {
      nameSource = NAMES;
    }

    const firstName = getRandomItem(nameSource[selectedGender as keyof typeof nameSource]);
    const lastName = getRandomItem(nameSource.last);
    
    // 2. Location
    const countryLocs = LOCATIONS[country as keyof typeof LOCATIONS];
    let locationPool = countryLocs;
    if (stateFilter !== 'All') {
      locationPool = countryLocs.filter(l => l.state === stateFilter);
    }
    
    // Fallback if filter matches nothing (shouldn't happen with correct logic)
    if (locationPool.length === 0) locationPool = countryLocs;

    const loc = getRandomItem(locationPool);
    const city = getRandomItem(loc.cities);
    const streetNum = Math.floor(Math.random() * 9999) + 1;
    const streetName = getRandomItem(STREETS[country as keyof typeof STREETS] || STREETS.US);
    
    // Zip randomization
    const zip = generateZip(country, loc.zipBase);

    // 3. Contact
    const countryData = COUNTRIES.find(c => c.id === country);
    const phone = `${countryData?.phonePrefix} ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@${getRandomItem(domains)}`;

    // 4. DOB
    const year = 1960 + Math.floor(Math.random() * 45);
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const dob = new Date(year, month, day).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    setProfile({
      fullName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      gender: selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1),
      address: `${streetNum} ${streetName}`,
      city,
      state: loc.state,
      zip,
      country: countryData?.name,
      phone,
      email,
      dob
    });
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const copyAll = () => {
    if (!profile) return;
    const text = `Name: ${profile.fullName}\nAddress: ${profile.address}, ${profile.city}, ${profile.state} ${profile.zip}, ${profile.country}\nPhone: ${profile.phone}\nEmail: ${profile.email}\nDOB: ${profile.dob}`;
    copyToClipboard(text, 'all');
  };

  const getStateOptions = () => {
    const locs = LOCATIONS[country as keyof typeof LOCATIONS];
    // Sort states alphabetically
    const sortedLocs = [...locs].sort((a, b) => a.state.localeCompare(b.state));
    const opts = sortedLocs.map(l => ({ value: l.state, label: l.state }));
    return [{ value: 'All', label: 'All States / Regions' }, ...opts];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Controls Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Region Settings
            </h3>
            
            <Dropdown 
              label="Country"
              value={country}
              options={COUNTRIES.map(c => ({ value: c.id, label: `${c.flag} ${c.name}` }))}
              onChange={setCountry}
            />

            <Dropdown 
              label={country === 'UK' ? 'Region / Country' : country === 'CA' ? 'Province / Territory' : 'State / Region'}
              value={stateFilter}
              options={getStateOptions()}
              onChange={setStateFilter}
              searchable={true}
            />

            <Dropdown 
              label="Gender"
              value={gender}
              options={[
                { value: 'Random', label: 'Random' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' }
              ]}
              onChange={setGender}
            />
          </div>

          <button 
            onClick={generateProfile}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RefreshCw size={18} /> Generate Identity
          </button>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] text-center">
           <p className="text-xs text-slate-400 font-medium leading-relaxed">
             Data is randomly generated for testing, development, and privacy protection purposes. It is not real user data.
           </p>
        </div>
      </div>

      {/* Results Display */}
      <div className="lg:col-span-8">
        {profile && (
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
               <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm ${profile.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                    {profile.firstName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">{profile.fullName}</h2>
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      {profile.gender} • {profile.dob}
                    </p>
                  </div>
               </div>
               <button 
                 onClick={copyAll}
                 className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
               >
                 {copiedField === 'all' ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                 {copiedField === 'all' ? 'Copied' : 'Copy All'}
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Address Details
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Street Address</p>
                       <p className="font-bold text-slate-700">{profile.address}</p>
                       <button onClick={() => copyToClipboard(profile.address, 'addr')} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                         {copiedField === 'addr' ? <Check size={16} /> : <Copy size={16} />}
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">City</p>
                           <p className="font-bold text-slate-700 truncate">{profile.city}</p>
                           <button onClick={() => copyToClipboard(profile.city, 'city')} className="absolute top-2 right-2 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                             {copiedField === 'city' ? <Check size={14} /> : <Copy size={14} />}
                           </button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{country === 'UK' ? 'Region' : country === 'CA' ? 'Province' : 'State'}</p>
                           <p className="font-bold text-slate-700 truncate">{profile.state}</p>
                           <button onClick={() => copyToClipboard(profile.state, 'state')} className="absolute top-2 right-2 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                             {copiedField === 'state' ? <Check size={14} /> : <Copy size={14} />}
                           </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{country === 'US' ? 'Zip Code' : 'Postal Code'}</p>
                           <p className="font-bold text-slate-700">{profile.zip}</p>
                           <button onClick={() => copyToClipboard(profile.zip, 'zip')} className="absolute top-2 right-2 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                             {copiedField === 'zip' ? <Check size={14} /> : <Copy size={14} />}
                           </button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Country</p>
                           <p className="font-bold text-slate-700">{profile.country}</p>
                        </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Personal Details
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Phone size={10} /> Phone Number</p>
                       <p className="font-bold text-slate-700">{profile.phone}</p>
                       <button onClick={() => copyToClipboard(profile.phone, 'phone')} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                         {copiedField === 'phone' ? <Check size={16} /> : <Copy size={16} />}
                       </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Mail size={10} /> Email Address</p>
                       <p className="font-bold text-slate-700 truncate">{profile.email}</p>
                       <button onClick={() => copyToClipboard(profile.email, 'email')} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                         {copiedField === 'email' ? <Check size={16} /> : <Copy size={16} />}
                       </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group relative">
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={10} /> Date of Birth</p>
                       <p className="font-bold text-slate-700">{profile.dob}</p>
                       <button onClick={() => copyToClipboard(profile.dob, 'dob')} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                         {copiedField === 'dob' ? <Check size={16} /> : <Copy size={16} />}
                       </button>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default FakeAddressGenerator;