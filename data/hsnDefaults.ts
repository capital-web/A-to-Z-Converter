
export type CodeType = 'goods' | 'services';

export interface CategoryGroup {
  id: string;
  code: string; // Roman for Goods, Group Code for Services
  title: string;
}

export interface DirectoryEntry {
  code: string; // HSN or SAC code
  description: string;
  rate: number; // GST Rate
  categoryId: string; // Links to Section ID (Goods) or Group ID (Services)
  chapter: string;
  type: CodeType;
}

// --- DATA: GOODS (HSN SECTIONS) ---
export const HSN_SECTIONS: CategoryGroup[] = [
  { id: '1', code: 'I', title: 'Live Animals; Animal Products' },
  { id: '2', code: 'II', title: 'Vegetable Products' },
  { id: '3', code: 'III', title: 'Animal or Vegetable Fats and Oils' },
  { id: '4', code: 'IV', title: 'Prepared Foodstuffs; Beverages; Tobacco' },
  { id: '5', code: 'V', title: 'Mineral Products' },
  { id: '6', code: 'VI', title: 'Chemical & Allied Industries' },
  { id: '7', code: 'VII', title: 'Plastics, Rubber & Articles' },
  { id: '8', code: 'VIII', title: 'Leather, Furskins & Articles' },
  { id: '9', code: 'IX', title: 'Wood, Cork, Basketware' },
  { id: '10', code: 'X', title: 'Pulp of Wood; Paper & Paperboard' },
  { id: '11', code: 'XI', title: 'Textiles and Textile Articles' },
  { id: '12', code: 'XII', title: 'Footwear, Headgear, Umbrellas' },
  { id: '13', code: 'XIII', title: 'Stone, Plaster, Cement, Ceramic, Glass' },
  { id: '14', code: 'XIV', title: 'Pearls, Precious Stones, Metals' },
  { id: '15', code: 'XV', title: 'Base Metals & Articles' },
  { id: '16', code: 'XVI', title: 'Machinery & Mechanical Appliances; Electrical' },
  { id: '17', code: 'XVII', title: 'Vehicles, Aircraft, Vessels' },
  { id: '18', code: 'XVIII', title: 'Optical, Medical, Musical Instruments' },
  { id: '19', code: 'XIX', title: 'Arms and Ammunition' },
  { id: '20', code: 'XX', title: 'Miscellaneous Manufactured Articles' },
  { id: '21', code: 'XXI', title: 'Works of Art & Antiques' },
];

// --- DATA: SERVICES (SAC GROUPS) ---
export const SAC_GROUPS: CategoryGroup[] = [
  { id: '9954', code: '9954', title: 'Construction Services' },
  { id: '9961', code: '9961', title: 'Services in Wholesale Trade' },
  { id: '9962', code: '9962', title: 'Services in Retail Trade' },
  { id: '9963', code: '9963', title: 'Accommodation, Food & Beverage Services' },
  { id: '9964', code: '9964', title: 'Passenger Transport Services' },
  { id: '9965', code: '9965', title: 'Goods Transport Services' },
  { id: '9967', code: '9967', title: 'Supporting Transport Services' },
  { id: '9971', code: '9971', title: 'Financial & Related Services' },
  { id: '9972', code: '9972', title: 'Real Estate Services' },
  { id: '9973', code: '9973', title: 'Leasing or Rental Services' },
  { id: '9981', code: '9981', title: 'Research & Development Services' },
  { id: '9982', code: '9982', title: 'Legal & Accounting Services' },
  { id: '9983', code: '9983', title: 'IT, Design & Other Professional Services' },
  { id: '9984', code: '9984', title: 'Telecommunications & Info Supply' },
  { id: '9985', code: '9985', title: 'Support Services' },
  { id: '9986', code: '9986', title: 'Support Services to Agriculture, Hunting, Forestry, Fishing' },
  { id: '9987', code: '9987', title: 'Maintenance, Repair & Installation' },
  { id: '9988', code: '9988', title: 'Manufacturing Services on physical inputs owned by others' },
  { id: '9996', code: '9996', title: 'Recreational, Cultural & Sporting Services' },
];

export const DEFAULT_DIRECTORY_DATABASE: DirectoryEntry[] = [
  // Section I: Live Animals
  { type: 'goods', categoryId: '1', chapter: '01', code: '0101', description: 'Live horses, asses, mules and hinnies', rate: 12 },
  { type: 'goods', categoryId: '1', chapter: '01', code: '0102', description: 'Live bovine animals', rate: 12 },
  { type: 'goods', categoryId: '1', chapter: '01', code: '0105', description: 'Live poultry (cocks, hens, ducks, geese, turkeys)', rate: 0 },
  { type: 'goods', categoryId: '1', chapter: '02', code: '0201', description: 'Meat of bovine animals, fresh or chilled', rate: 0 },
  { type: 'goods', categoryId: '1', chapter: '02', code: '0207', description: 'Meat and edible offal of poultry, fresh, chilled or frozen', rate: 0 },
  { type: 'goods', categoryId: '1', chapter: '03', code: '0302', description: 'Fish, fresh or chilled, excluding fish fillets', rate: 0 },
  { type: 'goods', categoryId: '1', chapter: '03', code: '0306', description: 'Crustaceans, whether in shell or not, live, fresh, chilled', rate: 5 },
  { type: 'goods', categoryId: '1', chapter: '04', code: '0401', description: 'Milk and cream, not concentrated nor containing added sugar', rate: 5 },
  { type: 'goods', categoryId: '1', chapter: '04', code: '0402', description: 'Milk and cream, concentrated or containing added sugar', rate: 5 },
  { type: 'goods', categoryId: '1', chapter: '04', code: '0403', description: 'Yogurt; buttermilk, curdled milk and cream', rate: 5 },
  { type: 'goods', categoryId: '1', chapter: '04', code: '0405', description: 'Butter and other fats and oils derived from milk', rate: 12 },
  { type: 'goods', categoryId: '1', chapter: '04', code: '0406', description: 'Cheese and curd', rate: 12 },
  { type: 'goods', categoryId: '1', chapter: '04', code: '0409', description: 'Natural honey', rate: 5 },
  { type: 'goods', categoryId: '1', chapter: '05', code: '0501', description: 'Human hair, unworked, whether or not washed or scoured', rate: 0 },
  
  // Section II
  { type: 'goods', categoryId: '2', chapter: '06', code: '0603', description: 'Cut flowers and flower buds for bouquets', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '07', code: '0701', description: 'Potatoes, fresh or chilled', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '07', code: '0702', description: 'Tomatoes, fresh or chilled', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '07', code: '0703', description: 'Onions, shallots, garlic, leeks', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '07', code: '0709', description: 'Other vegetables, fresh or chilled (e.g., Chillies, Capsicum)', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '08', code: '0803', description: 'Bananas, including plantains, fresh or dried', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '08', code: '0804', description: 'Dates, figs, pineapples, avocados, guavas, mangoes', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '08', code: '0805', description: 'Citrus fruit, fresh or dried (Oranges, Lemons)', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '09', code: '0901', description: 'Coffee, roasted or decaffeinated', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '09', code: '0902', description: 'Tea, whether or not flavoured', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '09', code: '0904', description: 'Pepper/Capsicum (dried/crushed)', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '09', code: '0910', description: 'Ginger, saffron, turmeric (curcuma)', rate: 5 },
  { type: 'goods', categoryId: '2', chapter: '10', code: '1001', description: 'Wheat and meslin', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '10', code: '1006', description: 'Rice', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '11', code: '1101', description: 'Wheat or meslin flour', rate: 0 },
  { type: 'goods', categoryId: '2', chapter: '12', code: '1201', description: 'Soya beans, whether or not broken', rate: 5 },

  // Section III
  { type: 'goods', categoryId: '3', chapter: '15', code: '1509', description: 'Olive oil and its fractions', rate: 12 },
  { type: 'goods', categoryId: '3', chapter: '15', code: '1511', description: 'Palm oil and its fractions', rate: 5 },
  { type: 'goods', categoryId: '3', chapter: '15', code: '1512', description: 'Sunflower-seed, safflower or cotton-seed oil', rate: 5 },

  // Section IV
  { type: 'goods', categoryId: '4', chapter: '17', code: '1701', description: 'Cane or beet sugar and chemically pure sucrose', rate: 5 },
  { type: 'goods', categoryId: '4', chapter: '17', code: '1704', description: 'Sugar confectionery', rate: 18 },
  { type: 'goods', categoryId: '4', chapter: '18', code: '1806', description: 'Chocolate and other food preparations containing cocoa', rate: 18 },
  { type: 'goods', categoryId: '4', chapter: '19', code: '1902', description: 'Pasta, whether or not cooked or stuffed', rate: 12 },
  { type: 'goods', categoryId: '4', chapter: '19', code: '1905', description: 'Bread, pastry, cakes, biscuits', rate: 18 },
  { type: 'goods', categoryId: '4', chapter: '21', code: '2105', description: 'Ice cream and other edible ice', rate: 18 },
  { type: 'goods', categoryId: '4', chapter: '21', code: '2106', description: 'Food preparations not elsewhere specified', rate: 18 },
  { type: 'goods', categoryId: '4', chapter: '22', code: '2201', description: 'Waters, mineral waters and aerated waters', rate: 18 },
  { type: 'goods', categoryId: '4', chapter: '22', code: '2202', description: 'Soft drinks/Aerated waters with sugar', rate: 28 },
  { type: 'goods', categoryId: '4', chapter: '24', code: '2402', description: 'Cigars, cheroots, cigarillos and cigarettes', rate: 28 },

  // Section V
  { type: 'goods', categoryId: '5', chapter: '25', code: '2501', description: 'Salt (including table salt)', rate: 0 },
  { type: 'goods', categoryId: '5', chapter: '25', code: '2523', description: 'Portland cement, aluminous cement', rate: 28 },
  { type: 'goods', categoryId: '5', chapter: '26', code: '2601', description: 'Iron ores and concentrates', rate: 5 },
  { type: 'goods', categoryId: '5', chapter: '27', code: '2701', description: 'Coal; briquettes, ovoids', rate: 5 },
  { type: 'goods', categoryId: '5', chapter: '27', code: '2710', description: 'Petroleum oils', rate: 18 },
  { type: 'goods', categoryId: '5', chapter: '27', code: '2711', description: 'Petroleum gases and other gaseous hydrocarbons', rate: 5 },

  // Section VI
  { type: 'goods', categoryId: '6', chapter: '28', code: '2804', description: 'Hydrogen, rare gases (Oxygen)', rate: 12 },
  { type: 'goods', categoryId: '6', chapter: '30', code: '3003', description: 'Medicaments (Mixed)', rate: 12 },
  { type: 'goods', categoryId: '6', chapter: '30', code: '3004', description: 'Medicaments for therapeutic/prophylactic uses', rate: 12 },
  { type: 'goods', categoryId: '6', chapter: '30', code: '3006', description: 'Pharmaceutical goods', rate: 12 },
  { type: 'goods', categoryId: '6', chapter: '31', code: '3102', description: 'Mineral or chemical fertilisers, nitrogenous', rate: 5 },
  { type: 'goods', categoryId: '6', chapter: '32', code: '3208', description: 'Paints and varnishes', rate: 18 },
  { type: 'goods', categoryId: '6', chapter: '33', code: '3303', description: 'Perfumes and toilet waters', rate: 18 },
  { type: 'goods', categoryId: '6', chapter: '33', code: '3304', description: 'Beauty or make-up preparations', rate: 18 },
  { type: 'goods', categoryId: '6', chapter: '33', code: '3305', description: 'Hair preparations (Shampoo)', rate: 18 },
  { type: 'goods', categoryId: '6', chapter: '34', code: '3401', description: 'Soap; organic surface-active products', rate: 18 },
  { type: 'goods', categoryId: '6', chapter: '38', code: '3808', description: 'Insecticides, rodenticides, fungicides', rate: 18 },

  // Section VII
  { type: 'goods', categoryId: '7', chapter: '39', code: '3917', description: 'Tubes, pipes and hoses of plastics', rate: 18 },
  { type: 'goods', categoryId: '7', chapter: '39', code: '3923', description: 'Articles for packing of goods (Plastics)', rate: 18 },
  { type: 'goods', categoryId: '7', chapter: '39', code: '3924', description: 'Tableware, kitchenware of plastics', rate: 18 },
  { type: 'goods', categoryId: '7', chapter: '39', code: '3926', description: 'Other articles of plastics', rate: 18 },
  { type: 'goods', categoryId: '7', chapter: '40', code: '4011', description: 'New pneumatic tyres', rate: 28 },
  { type: 'goods', categoryId: '7', chapter: '40', code: '4015', description: 'Articles of apparel of vulcanised rubber', rate: 5 },

  // Section VIII
  { type: 'goods', categoryId: '8', chapter: '42', code: '4202', description: 'Trunks, suit-cases, brief-cases', rate: 18 },
  { type: 'goods', categoryId: '8', chapter: '42', code: '4203', description: 'Apparel and clothing accessories of leather', rate: 28 },
  { type: 'goods', categoryId: '8', chapter: '42', code: '4205', description: 'Other articles of leather', rate: 18 },

  // Section IX
  { type: 'goods', categoryId: '9', chapter: '44', code: '4401', description: 'Fuel wood', rate: 5 },
  { type: 'goods', categoryId: '9', chapter: '44', code: '4410', description: 'Particle board', rate: 18 },
  { type: 'goods', categoryId: '9', chapter: '44', code: '4412', description: 'Plywood, veneered panels', rate: 18 },
  { type: 'goods', categoryId: '9', chapter: '44', code: '4414', description: 'Wooden frames', rate: 18 },

  // Section X
  { type: 'goods', categoryId: '10', chapter: '48', code: '4802', description: 'Uncoated paper for writing/printing', rate: 12 },
  { type: 'goods', categoryId: '10', chapter: '48', code: '4818', description: 'Toilet paper, cellulose wadding', rate: 18 },
  { type: 'goods', categoryId: '10', chapter: '48', code: '4819', description: 'Cartons, boxes, cases, bags', rate: 18 },
  { type: 'goods', categoryId: '10', chapter: '48', code: '4820', description: 'Registers, account books', rate: 18 },
  { type: 'goods', categoryId: '10', chapter: '49', code: '4901', description: 'Printed books', rate: 0 },
  { type: 'goods', categoryId: '10', chapter: '49', code: '4902', description: 'Newspapers, journals', rate: 0 },

  // Section XI
  { type: 'goods', categoryId: '11', chapter: '50', code: '5007', description: 'Woven fabrics of silk', rate: 5 },
  { type: 'goods', categoryId: '11', chapter: '52', code: '5208', description: 'Woven fabrics of cotton', rate: 5 },
  { type: 'goods', categoryId: '11', chapter: '54', code: '5407', description: 'Woven fabrics of synthetic filament yarn', rate: 5 },
  { type: 'goods', categoryId: '11', chapter: '57', code: '5701', description: 'Carpets', rate: 12 },
  { type: 'goods', categoryId: '11', chapter: '61', code: '6109', description: 'T-shirts, singlets (Knitted)', rate: 5 },
  { type: 'goods', categoryId: '11', chapter: '62', code: '6203', description: 'Suits, jackets, trousers (Mens/Boys)', rate: 12 },
  { type: 'goods', categoryId: '11', chapter: '62', code: '6204', description: 'Suits, jackets, dresses (Womens/Girls)', rate: 12 },
  { type: 'goods', categoryId: '11', chapter: '63', code: '6302', description: 'Bed/Table/Kitchen linen', rate: 5 },

  // Section XII
  { type: 'goods', categoryId: '12', chapter: '64', code: '6403', description: 'Footwear (Leather uppers)', rate: 18 },
  { type: 'goods', categoryId: '12', chapter: '64', code: '6406', description: 'Parts of footwear', rate: 18 },
  { type: 'goods', categoryId: '12', chapter: '66', code: '6601', description: 'Umbrellas', rate: 12 },

  // Section XIII
  { type: 'goods', categoryId: '13', chapter: '68', code: '6802', description: 'Worked monumental stone (Granite)', rate: 18 },
  { type: 'goods', categoryId: '13', chapter: '69', code: '6907', description: 'Ceramic flags and paving tiles', rate: 18 },
  { type: 'goods', categoryId: '13', chapter: '69', code: '6910', description: 'Ceramic sinks, wash basins', rate: 18 },
  { type: 'goods', categoryId: '13', chapter: '70', code: '7009', description: 'Glass mirrors', rate: 18 },

  // Section XIV
  { type: 'goods', categoryId: '14', chapter: '71', code: '7108', description: 'Gold, unwrought', rate: 3 },
  { type: 'goods', categoryId: '14', chapter: '71', code: '7113', description: 'Articles of jewellery', rate: 3 },
  { type: 'goods', categoryId: '14', chapter: '71', code: '7117', description: 'Imitation jewellery', rate: 3 },

  // Section XV
  { type: 'goods', categoryId: '15', chapter: '72', code: '7214', description: 'Bars and rods of iron (TMT)', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '73', code: '7308', description: 'Structures of iron or steel', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '73', code: '7318', description: 'Screws, bolts, nuts', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '73', code: '7321', description: 'Stoves, ranges, cookers', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '74', code: '7403', description: 'Refined copper', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '76', code: '7604', description: 'Aluminium bars, rods', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '82', code: '8205', description: 'Hand tools', rate: 18 },
  { type: 'goods', categoryId: '15', chapter: '83', code: '8301', description: 'Padlocks and locks', rate: 18 },

  // Section XVI
  { type: 'goods', categoryId: '16', chapter: '84', code: '8414', description: 'Air/Vacuum pumps, compressors', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '84', code: '8415', description: 'Air conditioning machines', rate: 28 },
  { type: 'goods', categoryId: '16', chapter: '84', code: '8418', description: 'Refrigerators, freezers', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '84', code: '8421', description: 'Water Purifiers/Filtering machinery', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '84', code: '8450', description: 'Washing machines', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '84', code: '8471', description: 'Laptops/Computers', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8504', description: 'Transformers, UPS, Inverters', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8507', description: 'Batteries', rate: 28 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8517', description: 'Smartphones', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8528', description: 'Monitors, Televisions', rate: 28 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8536', description: 'Switches, Relays', rate: 18 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8539', description: 'LED Bulbs', rate: 12 },
  { type: 'goods', categoryId: '16', chapter: '85', code: '8544', description: 'Insulated wire/cable', rate: 18 },

  // Section XVII
  { type: 'goods', categoryId: '17', chapter: '87', code: '8703', description: 'Motor cars', rate: 28 },
  { type: 'goods', categoryId: '17', chapter: '87', code: '8708', description: 'Motor vehicle parts', rate: 28 },
  { type: 'goods', categoryId: '17', chapter: '87', code: '8711', description: 'Motorcycles', rate: 28 },
  { type: 'goods', categoryId: '17', chapter: '87', code: '8712', description: 'Bicycles', rate: 12 },
  { type: 'goods', categoryId: '17', chapter: '87', code: '8714', description: 'Parts of bicycles/motorcycles', rate: 12 },

  // Section XVIII
  { type: 'goods', categoryId: '18', chapter: '90', code: '9001', description: 'Optical fibres', rate: 18 },
  { type: 'goods', categoryId: '18', chapter: '90', code: '9004', description: 'Spectacles, goggles', rate: 12 },
  { type: 'goods', categoryId: '18', chapter: '90', code: '9018', description: 'Medical instruments', rate: 12 },
  { type: 'goods', categoryId: '18', chapter: '91', code: '9102', description: 'Wrist-watches', rate: 18 },

  // Section XIX
  { type: 'goods', categoryId: '19', chapter: '93', code: '9303', description: 'Firearms', rate: 28 },

  // Section XX
  { type: 'goods', categoryId: '20', chapter: '94', code: '9401', description: 'Seats', rate: 18 },
  { type: 'goods', categoryId: '20', chapter: '94', code: '9403', description: 'Other furniture', rate: 18 },
  { type: 'goods', categoryId: '20', chapter: '94', code: '9404', description: 'Mattresses', rate: 18 },
  { type: 'goods', categoryId: '20', chapter: '94', code: '9405', description: 'Lamps and lighting', rate: 18 },
  { type: 'goods', categoryId: '20', chapter: '95', code: '9503', description: 'Toys', rate: 12 },
  { type: 'goods', categoryId: '20', chapter: '95', code: '9504', description: 'Video games', rate: 28 },
  { type: 'goods', categoryId: '20', chapter: '96', code: '9608', description: 'Ball point pens', rate: 12 },

  // Section XXI
  { type: 'goods', categoryId: '21', chapter: '97', code: '9701', description: 'Paintings, drawings', rate: 12 },

  // --- SERVICES ---
  // Construction
  { type: 'services', categoryId: '9954', chapter: '99', code: '995411', description: 'Construction of residential buildings', rate: 12 },
  { type: 'services', categoryId: '9954', chapter: '99', code: '995412', description: 'Construction of industrial buildings', rate: 18 },
  { type: 'services', categoryId: '9954', chapter: '99', code: '995413', description: 'Construction of commercial buildings', rate: 18 },
  { type: 'services', categoryId: '9954', chapter: '99', code: '995421', description: 'Construction of roads/railways', rate: 12 },
  { type: 'services', categoryId: '9954', chapter: '99', code: '995431', description: 'Demolition services', rate: 18 },
  { type: 'services', categoryId: '9954', chapter: '99', code: '995471', description: 'Building completion services', rate: 18 },

  // Wholesale/Retail
  { type: 'services', categoryId: '9961', chapter: '99', code: '996111', description: 'Wholesale trade services', rate: 18 },
  { type: 'services', categoryId: '9962', chapter: '99', code: '996211', description: 'Retail trade services', rate: 18 },

  // Accommodation/Food
  { type: 'services', categoryId: '9963', chapter: '99', code: '996311', description: 'Hotel Accommodation (<1000)', rate: 0 },
  { type: 'services', categoryId: '9963', chapter: '99', code: '996311', description: 'Hotel Accommodation (1001-7500)', rate: 12 },
  { type: 'services', categoryId: '9963', chapter: '99', code: '996311', description: 'Hotel Accommodation (>7500)', rate: 18 },
  { type: 'services', categoryId: '9963', chapter: '99', code: '996331', description: 'Restaurant services', rate: 5 },
  { type: 'services', categoryId: '9963', chapter: '99', code: '996332', description: 'Outdoor Catering', rate: 5 },

  // Transport
  { type: 'services', categoryId: '9964', chapter: '99', code: '996411', description: 'Railways/Metro/Bus Transport', rate: 0 },
  { type: 'services', categoryId: '9964', chapter: '99', code: '996412', description: 'Taxi services', rate: 5 },
  { type: 'services', categoryId: '9964', chapter: '99', code: '996421', description: 'Long-distance transport', rate: 5 },
  { type: 'services', categoryId: '9965', chapter: '99', code: '996511', description: 'Goods Transport Agency (GTA)', rate: 5 },

  // Financial
  { type: 'services', categoryId: '9971', chapter: '99', code: '997111', description: 'Central banking services', rate: 18 },
  { type: 'services', categoryId: '9971', chapter: '99', code: '997119', description: 'Interest on loans/deposits', rate: 0 },
  { type: 'services', categoryId: '9971', chapter: '99', code: '997131', description: 'Life insurance', rate: 18 },
  { type: 'services', categoryId: '9971', chapter: '99', code: '997132', description: 'Non-life insurance', rate: 18 },
  { type: 'services', categoryId: '9971', chapter: '99', code: '997151', description: 'Portfolio management', rate: 18 },

  // Real Estate
  { type: 'services', categoryId: '9972', chapter: '99', code: '997211', description: 'Residential rental', rate: 0 },
  { type: 'services', categoryId: '9972', chapter: '99', code: '997212', description: 'Commercial rental', rate: 18 },

  // Leasing
  { type: 'services', categoryId: '9973', chapter: '99', code: '997311', description: 'Leasing of transport equipment', rate: 18 },
  { type: 'services', categoryId: '9973', chapter: '99', code: '997331', description: 'IP Licensing', rate: 18 },

  // Professional
  { type: 'services', categoryId: '9982', chapter: '99', code: '998211', description: 'Legal services', rate: 18 },
  { type: 'services', categoryId: '9982', chapter: '99', code: '998221', description: 'Auditing services', rate: 18 },
  { type: 'services', categoryId: '9982', chapter: '99', code: '998222', description: 'Accounting services', rate: 18 },
  { type: 'services', categoryId: '9983', chapter: '99', code: '998311', description: 'Management consulting', rate: 18 },
  { type: 'services', categoryId: '9983', chapter: '99', code: '998313', description: 'IT Consulting', rate: 18 },
  { type: 'services', categoryId: '9983', chapter: '99', code: '998314', description: 'Software Development', rate: 18 },
  { type: 'services', categoryId: '9983', chapter: '99', code: '998341', description: 'Architectural services', rate: 18 },
  { type: 'services', categoryId: '9983', chapter: '99', code: '998391', description: 'Interior Design', rate: 18 },

  // Telecom
  { type: 'services', categoryId: '9984', chapter: '99', code: '998411', description: 'Fixed telephony', rate: 18 },
  { type: 'services', categoryId: '9984', chapter: '99', code: '998412', description: 'Mobile telecommunications', rate: 18 },
  { type: 'services', categoryId: '9984', chapter: '99', code: '998413', description: 'Internet services', rate: 18 },

  // Support
  { type: 'services', categoryId: '9985', chapter: '99', code: '998511', description: 'Recruitment services', rate: 18 },
  { type: 'services', categoryId: '9985', chapter: '99', code: '998521', description: 'Security services', rate: 18 },
  { type: 'services', categoryId: '9985', chapter: '99', code: '998531', description: 'Cleaning services', rate: 18 },
  { type: 'services', categoryId: '9985', chapter: '99', code: '998541', description: 'Packaging services', rate: 18 },
  { type: 'services', categoryId: '9985', chapter: '99', code: '998551', description: 'Travel agency services', rate: 18 },

  // Agriculture
  { type: 'services', categoryId: '9986', chapter: '99', code: '998611', description: 'Agricultural support services', rate: 0 },

  // Maintenance
  { type: 'services', categoryId: '9987', chapter: '99', code: '998711', description: 'Repair of machinery', rate: 18 },
  { type: 'services', categoryId: '9987', chapter: '99', code: '998721', description: 'Repair of computers', rate: 18 },
  { type: 'services', categoryId: '9987', chapter: '99', code: '998731', description: 'Repair of motor vehicles', rate: 18 },

  // Job Work
  { type: 'services', categoryId: '9988', chapter: '99', code: '9988', description: 'Job work (Textile/Printing)', rate: 5 },
  { type: 'services', categoryId: '9988', chapter: '99', code: '9988', description: 'Job work (Engineering)', rate: 18 },

  // Recreation
  { type: 'services', categoryId: '9996', chapter: '99', code: '999611', description: 'Sound recording', rate: 18 },
  { type: 'services', categoryId: '9996', chapter: '99', code: '999631', description: 'Performing arts', rate: 18 },
];
