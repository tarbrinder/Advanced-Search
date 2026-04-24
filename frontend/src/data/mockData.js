// Mock data for the B2B Buyer Dashboard

export const CITIES = [
  "Dharamsala", "Mumbai", "Delhi", "Bangalore", "Ahmedabad", "Pune",
  "Chennai", "Kolkata", "Hyderabad", "Jaipur", "Lucknow", "Noida",
  "Gurgaon", "Greater Noida", "Faridabad", "Chandigarh", "Surat",
  "Indore", "Bhopal", "Coimbatore", "Nagpur", "Vadodara", "Patna",
];

export const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "profile", label: "My Profile", icon: "user", progress: 63 },
  { id: "messages", label: "Messages", icon: "chat" },
  { id: "knowseller", label: "Know Your Seller", icon: "shield", badge: "NEW" },
  { id: "payment", label: "Payment Protection", icon: "credit" },
  { id: "trustseal", label: "TrustSEAL Buyer", icon: "seal" },
  { id: "loans", label: "Loans", icon: "rupee" },
  { id: "ship", label: "Ship with IM", icon: "truck" },
  { id: "credit", label: "Credit Score", icon: "trend" },
];

export const ACTIVE_ORDER = {
  image: "https://5.imimg.com/data5/SELLER/Default/2026/1/573410129/NS/FZ/MO/33858364/125kva-three-phase-diesel-generator.png",
  name: "Diesel Generator",
  posted: "22 Feb 2026",
  specs: [
    { label: "Power Output", value: "125 kVA" },
    { label: "Phase", value: "Three Phase" },
    { label: "Fuel Type", value: "Diesel" },
    { label: "Usage", value: "Industrial" },
    { label: "Voltage", value: "415V" },
  ],
  sellers: [
    { name: "Mahindra Powerol", newCount: 2, location: "Pune, Maharashtra", rating: 4.72, reviews: 348, price: "₹3,85,000", gst: true, trustSeal: true, memberSince: 2018, tag: null },
    { name: "Kirloskar Electric", newCount: 0, location: "Bangalore, Karnataka", rating: 4.58, reviews: 215, price: "₹4,12,000", gst: true, trustSeal: false, memberSince: 2020, tag: null },
    { name: "Cummins India", newCount: 3, location: "Pune, Maharashtra", rating: 4.85, reviews: 512, price: "₹4,25,000", gst: true, trustSeal: true, memberSince: 2015, tag: "Top Rated" },
    { name: "Greaves Power", newCount: 1, location: "Chennai, Tamil Nadu", rating: 4.42, reviews: 189, price: "₹3,95,000", gst: true, trustSeal: true, memberSince: 2019, tag: null },
    { name: "Escorts Power", newCount: 0, location: "Faridabad, Haryana", rating: 4.33, reviews: 156, price: "₹3,78,000", gst: true, trustSeal: false, memberSince: 2021, tag: "Lowest Price" },
    { name: "Ashok Leyland", newCount: 2, location: "Chennai, Tamil Nadu", rating: 4.68, reviews: 298, price: "₹4,05,000", gst: true, trustSeal: true, memberSince: 2017, tag: null },
  ],
};

export const SUGGESTED_PRODUCTS = [
  { name: "Industrial Safety Helmet", price: "₹385", company: "SafetyFirst Industries", location: "Mumbai, Maharashtra", gst: true, trustSeal: true, memberSince: 2019, image: "https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Heavy Duty Work Gloves", price: "₹245", company: "ProGrip Manufacturing", location: "Pune, Maharashtra", gst: true, trustSeal: false, memberSince: 2020, image: "https://images.pexels.com/photos/257970/pexels-photo-257970.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Steel Toe Safety Boots", price: "₹1,250", company: "SafeStep Footwear", location: "Delhi, NCR", gst: true, trustSeal: true, memberSince: 2018, image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "High Visibility Vest", price: "₹450", company: "VizWear Solutions", location: "Bangalore, Karnataka", gst: false, trustSeal: true, memberSince: 2021, image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Industrial Ear Protection", price: "₹320", company: "SoundShield Industries", location: "Chennai, Tamil Nadu", gst: true, trustSeal: true, memberSince: 2017, image: "https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Safety Goggles", price: "₹280", company: "ClearVision Safety", location: "Ahmedabad, Gujarat", gst: true, trustSeal: false, memberSince: 2019, image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

export const CATEGORIES = [
  { name: "Medical Supplies", image: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { name: "Fresh Fruits", image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { name: "Kids Wear", image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { name: "Knitted Kids Wear", image: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { name: "Industrial Equipment", image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { name: "Agricultural Tools", image: "https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=500" },
];

export const PAST_ORDER = {
  name: "Heavy Duty Conveyor Belts",
  type: "Epoxy-based",
  coverage: "50-60 m²/L",
  sellers: [
    { name: "ColorTech Industries", location: "Noida, Uttar Pradesh", rating: 4.8, reviews: 312, gst: true, trustSeal: true, tag: "Best Price" },
    { name: "Utsav Graphics", location: "Delhi", rating: 4.6, reviews: 87, gst: true, trustSeal: false, tag: "Top Rated" },
    { name: "PaintPro Solutions", location: "Bangalore, Karnataka", rating: 4.3, reviews: 204, gst: false, trustSeal: true, tag: "Fastest Response" },
    { name: "Supreme Coatings", location: "Mumbai, Maharashtra", rating: 4.1, reviews: 56, gst: true, trustSeal: false, tag: null },
    { name: "Industrial Paint Co.", location: "Pune, Maharashtra", rating: 3.9, reviews: 143, gst: false, trustSeal: false, tag: null },
  ],
};

export const MESSAGES = [
  { company: "Precision Belting Solutions", product: "Industrial Air Compressor", message: "We can offer you a better price for bulk orders", time: "2h ago", unread: true },
  { company: "SteelCraft Industries", product: "MS Steel Round Bars", message: "Your order has been dispatched", time: "5h ago", unread: true },
  { company: "CompressTech Pvt Ltd", product: "Hydraulic Gear Pump", message: "Can we schedule a call to discuss requirements?", time: "1d ago", unread: true },
  { company: "FluidPower Systems", product: "Thermal Insulation Sheets", message: "Technical specifications document attached", time: "2d ago", unread: false },
];

export const PRICE_TRENDS = [
  { title: "Diesel Generator - 125 kVA, Three Phase", date: "10 Mar 2026", range: "₹3,78,000 - ₹4,25,000/Unit" },
  { title: "Diesel Generator - 100 kVA, Silent Type", date: "08 Mar 2026", range: "₹3,15,000 - ₹3,65,000/Unit" },
  { title: "Diesel Generator - 150 kVA, Water Cooled", date: "05 Mar 2026", range: "₹4,45,000 - ₹5,10,000/Unit" },
  { title: "Diesel Generator - 82.5 kVA, Air Cooled", date: "01 Mar 2026", range: "₹2,85,000 - ₹3,35,000/Unit" },
];

export const MORE_FOR_YOU = [
  { title: "Get Best Price", desc: "Share your requirement and receive quotes from verified sellers", cta: "Get Quotes →", icon: "tag" },
  { title: "Verify Before You Buy", desc: "Check seller authenticity, ratings, and transaction history", cta: "Know your seller →", icon: "user-check" },
  { title: "Smarter, safer buying", desc: "Dedicated procurement help, trusted sellers, and secure payments up to ₹10L", cta: "Apply for TrustSEAL →", icon: "shield-check" },
  { title: "Grow your business online", desc: "Reach crores of buyers and start selling in minutes", cta: "Sell on IndiaMART →", icon: "store" },
  { title: "Stay updated on the go", desc: "Get instant enquiries and updates anywhere", cta: "Download App →", icon: "download" },
  { title: "Tally on Mobile", desc: "With Live Keeping, SME's can now connect their Tally offline data to mobile app", cta: "Learn More →", icon: "calculator" },
];

// Search catalog - rich seller directory for search
const SEARCH_CATALOG = [
  // Diesel Generator
  { keywords: ["diesel", "generator", "genset", "power"], sellers: [
    { name: "Mahindra Powerol", price: "₹3,85,000", location: "Pune, Maharashtra", rating: 4.72, reviews: 348, gst: true, image: "https://5.imimg.com/data5/SELLER/Default/2026/1/573410129/NS/FZ/MO/33858364/125kva-three-phase-diesel-generator.png" },
    { name: "Cummins India", price: "₹4,25,000", location: "Pune, Maharashtra", rating: 4.85, reviews: 512, gst: true, image: "https://images.pexels.com/photos/162568/oil-pump-jack-sunset-clouds-silhouette-162568.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Kirloskar Electric", price: "₹4,12,000", location: "Bangalore, Karnataka", rating: 4.58, reviews: 215, gst: true, image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Greaves Power Ltd", price: "₹3,95,000", location: "Chennai, Tamil Nadu", rating: 4.42, reviews: 189, gst: true, image: "https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Escorts Power Ltd", price: "₹3,78,000", location: "Faridabad, Haryana", rating: 4.33, reviews: 156, gst: true, image: "https://images.pexels.com/photos/4483609/pexels-photo-4483609.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Ashok Leyland Power", price: "₹4,05,000", location: "Chennai, Tamil Nadu", rating: 4.68, reviews: 298, gst: true, image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Safety / Helmet / PPE
  { keywords: ["helmet", "safety", "ppe", "head"], sellers: [
    { name: "SafetyFirst Industries", price: "₹385", location: "Mumbai, Maharashtra", rating: 4.5, reviews: 284, gst: true, image: "https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "GuardPro Safety", price: "₹425", location: "Delhi, NCR", rating: 4.3, reviews: 198, gst: true, image: "https://images.pexels.com/photos/8961020/pexels-photo-8961020.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ShieldCore Industries", price: "₹320", location: "Pune, Maharashtra", rating: 4.1, reviews: 145, gst: false, image: "https://images.pexels.com/photos/1216544/pexels-photo-1216544.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ProTech Safety Gear", price: "₹510", location: "Ahmedabad, Gujarat", rating: 4.6, reviews: 312, gst: true, image: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "HardHat Masters", price: "₹450", location: "Chennai, Tamil Nadu", rating: 4.2, reviews: 167, gst: true, image: "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SafeZone Supplies", price: "₹395", location: "Hyderabad, Telangana", rating: 4.4, reviews: 221, gst: true, image: "https://images.pexels.com/photos/8961017/pexels-photo-8961017.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Gloves
  { keywords: ["glove", "gloves", "hand"], sellers: [
    { name: "ProGrip Manufacturing", price: "₹245", location: "Pune, Maharashtra", rating: 4.4, reviews: 198, gst: true, image: "https://images.pexels.com/photos/257970/pexels-photo-257970.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "HandShield Co.", price: "₹180", location: "Delhi, NCR", rating: 4.1, reviews: 134, gst: true, image: "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SafetyGrip Industries", price: "₹295", location: "Mumbai, Maharashtra", rating: 4.6, reviews: 287, gst: true, image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "WorkSafe Enterprises", price: "₹210", location: "Chennai, Tamil Nadu", rating: 4.2, reviews: 156, gst: false, image: "https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Tiles
  { keywords: ["tile", "tiles", "wall", "floor", "ceramic"], sellers: [
    { name: "Sheenam Polymers", price: "₹16", location: "New Delhi, Delhi", rating: 4.2, reviews: 14, gst: true, image: "https://images.pexels.com/photos/5974058/pexels-photo-5974058.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "SDN Network Solution", price: "₹50", location: "New Delhi, Delhi", rating: 4.4, reviews: 208, gst: true, image: "https://images.pexels.com/photos/3718469/pexels-photo-3718469.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "R R Industries", price: "₹45", location: "New Delhi, Delhi", rating: 4.2, reviews: 23, gst: true, image: "https://images.pexels.com/photos/3935328/pexels-photo-3935328.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Jack Pipes Industries", price: "₹57", location: "New Delhi, Delhi", rating: 4.2, reviews: 38, gst: true, image: "https://images.pexels.com/photos/6474339/pexels-photo-6474339.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Noble Electric Corporation", price: "₹40", location: "New Delhi, Delhi", rating: 3.4, reviews: 8, gst: true, image: "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Geeta Traders", price: "₹135", location: "New Delhi, Delhi", rating: 3.9, reviews: 27, gst: true, image: "https://images.pexels.com/photos/6474472/pexels-photo-6474472.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Conveyor Belt
  { keywords: ["conveyor", "belt", "belting"], sellers: [
    { name: "Precision Belting Solutions", price: "₹8,500", location: "Mumbai, Maharashtra", rating: 4.6, reviews: 234, gst: true, image: "https://images.pexels.com/photos/4480457/pexels-photo-4480457.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "ConveyTech Industries", price: "₹7,200", location: "Pune, Maharashtra", rating: 4.4, reviews: 178, gst: true, image: "https://images.pexels.com/photos/3846218/pexels-photo-3846218.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "BeltMaster Pro", price: "₹9,100", location: "Delhi, NCR", rating: 4.8, reviews: 345, gst: true, image: "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "IndustrialBelt Co.", price: "₹6,800", location: "Chennai, Tamil Nadu", rating: 4.1, reviews: 98, gst: false, image: "https://images.pexels.com/photos/4481943/pexels-photo-4481943.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Steel
  { keywords: ["steel", "metal", "iron", "rod", "bar"], sellers: [
    { name: "SteelCraft Industries", price: "₹68", location: "Mumbai, Maharashtra", rating: 4.5, reviews: 423, gst: true, image: "https://images.pexels.com/photos/2760242/pexels-photo-2760242.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Tata Steel Dealers", price: "₹72", location: "Jamshedpur, Jharkhand", rating: 4.8, reviews: 678, gst: true, image: "https://images.pexels.com/photos/162539/hand-sparks-iron-steel-162539.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "JSW Steel Distributor", price: "₹70", location: "Bangalore, Karnataka", rating: 4.6, reviews: 512, gst: true, image: "https://images.pexels.com/photos/2846205/pexels-photo-2846205.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Compressor
  { keywords: ["compressor", "air"], sellers: [
    { name: "CompressTech Pvt Ltd", price: "₹45,000", location: "Pune, Maharashtra", rating: 4.5, reviews: 298, gst: true, image: "https://images.pexels.com/photos/4480457/pexels-photo-4480457.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "AirForce Systems", price: "₹52,000", location: "Delhi, NCR", rating: 4.7, reviews: 421, gst: true, image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "PneumaticPro", price: "₹38,500", location: "Mumbai, Maharashtra", rating: 4.3, reviews: 167, gst: true, image: "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Pump
  { keywords: ["pump", "hydraulic", "fluid"], sellers: [
    { name: "FluidPower Systems", price: "₹12,500", location: "Chennai, Tamil Nadu", rating: 4.4, reviews: 276, gst: true, image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "HydroMech Industries", price: "₹14,800", location: "Ahmedabad, Gujarat", rating: 4.6, reviews: 389, gst: true, image: "https://images.pexels.com/photos/4483609/pexels-photo-4483609.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "PumpCraft Ltd", price: "₹11,200", location: "Pune, Maharashtra", rating: 4.2, reviews: 134, gst: false, image: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Fruits
  { keywords: ["fruit", "fruits", "fresh", "mango", "apple"], sellers: [
    { name: "FreshFarm Exports", price: "₹120/kg", location: "Nashik, Maharashtra", rating: 4.5, reviews: 198, gst: true, image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "Green Valley Fruits", price: "₹95/kg", location: "Shimla, Himachal Pradesh", rating: 4.7, reviews: 342, gst: true, image: "https://images.pexels.com/photos/1002778/pexels-photo-1002778.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "OrchardPro Suppliers", price: "₹140/kg", location: "Srinagar, J&K", rating: 4.3, reviews: 156, gst: false, image: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Medical
  { keywords: ["medical", "medicine", "health", "hospital"], sellers: [
    { name: "MedEquip Solutions", price: "₹2,500", location: "Delhi, NCR", rating: 4.6, reviews: 412, gst: true, image: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "HealthPlus Suppliers", price: "₹1,800", location: "Mumbai, Maharashtra", rating: 4.4, reviews: 278, gst: true, image: "https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "MediCare Distributors", price: "₹3,200", location: "Bangalore, Karnataka", rating: 4.5, reviews: 334, gst: true, image: "https://images.pexels.com/photos/4031818/pexels-photo-4031818.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
  // Kids Wear
  { keywords: ["kids", "children", "wear", "clothing", "garment"], sellers: [
    { name: "TinyTots Garments", price: "₹350", location: "Tirupur, Tamil Nadu", rating: 4.5, reviews: 234, gst: true, image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { name: "KiddoStyle Fashion", price: "₹420", location: "Ludhiana, Punjab", rating: 4.3, reviews: 178, gst: true, image: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ]},
];

export function searchSellers(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const matches = [];
  SEARCH_CATALOG.forEach((cat) => {
    if (cat.keywords.some((k) => k.includes(q) || q.includes(k))) {
      matches.push(...cat.sellers);
    }
  });
  if (matches.length === 0) {
    // fallback: return a generic shuffled set
    return SEARCH_CATALOG.flatMap((c) => c.sellers).slice(0, 6);
  }
  // dedupe by name
  const seen = new Set();
  return matches.filter((s) => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });
}

// Suggestions for autocomplete
export const SEARCH_SUGGESTIONS = [
  "Diesel Generator", "Industrial Safety Helmet", "Heavy Duty Work Gloves",
  "Steel Toe Safety Boots", "Conveyor Belt", "Air Compressor",
  "Hydraulic Pump", "MS Steel Round Bars", "Wall Tiles", "Floor Tiles",
  "Medical Supplies", "Fresh Fruits", "Kids Wear", "Safety Goggles",
  "Ear Protection", "High Visibility Vest", "Industrial Equipment",
  "Thermal Insulation Sheets", "Epoxy Paint", "Agricultural Tools",
];
