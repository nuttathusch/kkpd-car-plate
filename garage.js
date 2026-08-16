/**
 * KKPD MASTER GARAGE & VEHICLE REGISTRY ENGINE
 * Standalone vehicle ownership database with automatic sequential plate generation
 * and 6-digit PIN protection.
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

const MASTER_6DIGIT_PIN = "993600";
const CLOUD_GARAGE_URL = "https://kvdb.io/NoTM4bJXjrCUgQWLBcgR3F/kkpd_garage_master";
const STORAGE_KEY = "kkpd_garage_master_vehicles_v1";

const ALL_MODELS_CONFIG = {
  Sugoi: { name: "Sugoi", icon: "fa-car-side", color: "#38bdf8" },
  Visione: { name: "Visione", icon: "fa-bolt", color: "#e879f9" },
  R32: { name: "Elegy R32", icon: "fa-flag-checkered", color: "#34d399" },
  Banshee: { name: "Banshee 900R", icon: "fa-gauge-high", color: "#f87171" },
  T20: { name: "Progen T20", icon: "fa-fire", color: "#fb923c" },
  C8: { name: "Corvette C8", icon: "fa-car-side", color: "#facc15" },
  Corsita: { name: "Corsita", icon: "fa-gem", color: "#a78bfa" },
  Furia: { name: "Grotti Furia", icon: "fa-shield-halved", color: "#f43f5e" },
  I8: { name: "BMW i8", icon: "fa-cloud", color: "#60a5fa" },
  Turismo3: { name: "Turismo 3", icon: "fa-road", color: "#fb923c" },
  Kuruma: { name: "Kuruma", icon: "fa-shield-cat", color: "#4ade80" },
  Thrax: { name: "Trufade Thrax", icon: "fa-crown", color: "#c084fc" },
  Mustang: { name: "Mustang", icon: "fa-horse", color: "#fb7185" },
  ADMTour: { name: "ADM Tour Bus", icon: "fa-van-shuttle", color: "#94a3b8" },
  Other: { name: "อื่นๆ / ไม่ระบุ", icon: "fa-car", color: "#64748b" }
};

const INITIAL_VEHICLES = [
  {
    "plate": "KKPD 00",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Txrbo",
    "old_plate": "HEKG 874",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 01",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Txrbo",
    "old_plate": "ZTTX 331",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 02",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Txrbo",
    "old_plate": "LBNJ 852",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 03",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sakkarin",
    "old_plate": "OFKH 751",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 04",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Sakkarin",
    "old_plate": "TSAK 963",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 05",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "JaJa",
    "old_plate": "TBDN 000",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 06",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "JaJa",
    "old_plate": "POCC 838",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 07",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Suwit",
    "old_plate": "NOWT 707",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 08",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Suwit",
    "old_plate": "GWZH 707",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 09",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Akki",
    "old_plate": "UEQL 016",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 10",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Akki",
    "old_plate": "FBXE 610",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 11",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thoshilo",
    "old_plate": "EPMF 589",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 12",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Thoshilo",
    "old_plate": "FYTW 755",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 13",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "MiLO",
    "old_plate": "YRBR 888",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 14",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "MiLO",
    "old_plate": "ONDZ 333",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 15",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sumoil",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 16",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Sumoil",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 17",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Scandally",
    "old_plate": "VUNN 830",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 18",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Scandally",
    "old_plate": "AGQS 916",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 19",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Georgie",
    "old_plate": "BSUS 595",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 20",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Georgie",
    "old_plate": "SOZZ 824",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 21",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Dark",
    "old_plate": "WWIA 638",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 22",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Dark",
    "old_plate": "TYDV 701",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 23",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tatto",
    "old_plate": "XCGX 555",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 24",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Tatto",
    "old_plate": "TAOM 710",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 25",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chanchai",
    "old_plate": "UPAR 457",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 26",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Chanchai",
    "old_plate": "VEXP 197",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 27",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Eric",
    "old_plate": "GBSR 555",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 28",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Eric",
    "old_plate": "RRMU 730",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 29",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tom",
    "old_plate": "TQMS 313",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 30",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Tom",
    "old_plate": "NCHE 001",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 31",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jame",
    "old_plate": "MHBH 007",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 32",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Jame",
    "old_plate": "YYII 009",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 33",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khummuen",
    "old_plate": "KCGN 874",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 34",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Khummuen",
    "old_plate": "JGIW 394",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 35",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Freddy",
    "old_plate": "FEXB 624",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 36",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Freddy",
    "old_plate": "CRWI 666",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 37",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "jack",
    "old_plate": "BZCN 797",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 38",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "jack",
    "old_plate": "ZLYX 001",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 39",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mateo",
    "old_plate": "IVNO 110",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 40",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Mateo",
    "old_plate": "CBPP 006",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 41",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Alex",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 42",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Dew",
    "old_plate": "DEEW 574",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 43",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Home",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 44",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "phet",
    "old_plate": "HDYA 519",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 45",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "smoky",
    "old_plate": "TVOY 747",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 46",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chucky",
    "old_plate": "IHRO 240",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 47",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "zendo",
    "old_plate": "IDHY 872",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 48",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "pluto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 49",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ronin",
    "old_plate": "BBIL000",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 50",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Copper",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 51",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Baygon",
    "old_plate": "OWIV 116",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 52",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mini",
    "old_plate": "MBQR 017",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 53",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Yoare",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 54",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Burapha",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 55",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Borsalino",
    "old_plate": "LJLM778",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 56",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Snape",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 57",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 58",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "WHY",
    "old_plate": "VRKX 520",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 59",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Winter",
    "old_plate": "EBDT 801",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 60",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "khoompaa",
    "old_plate": "WOVE 315",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 61",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Yam",
    "old_plate": "LSDW 444",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 62",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khaijeow",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 63",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "alice",
    "old_plate": "PSXR 439",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 64",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Punrums",
    "old_plate": "UCCE 277",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 65",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Honey",
    "old_plate": "ROKP 631",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 66",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bel",
    "old_plate": "QFQO 452",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 67",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jinjun",
    "old_plate": "CRTD 343",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 68",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Palaloy",
    "old_plate": "BTIK 888",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 69",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Lpa",
    "old_plate": "JEAA 712",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 70",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Root",
    "old_plate": "MWFX 404",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 71",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Giraffe",
    "old_plate": "JCBK 754",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 72",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sakda",
    "old_plate": "HCYU 106",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 73",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Cinrata",
    "old_plate": "KIJZ 890",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 74",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kluay",
    "old_plate": "QNSL818",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 75",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kluay",
    "old_plate": "VAAN464",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 76",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Doy",
    "old_plate": "ITJM 881",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 77",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Harper Harp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 78",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ainz D. Camillos",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 79",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chanom Kaimook",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 80",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khaijiao Motalino",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 81",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kung Nahmungsri",
    "old_plate": "FONP 895",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 82",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Padungpol Somsom",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 83",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Photo mini",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 84",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Rachada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 85",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jud Jang",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 86",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Dew",
    "old_plate": "MPLL 008",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 87",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CJ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 88",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "CJ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 89",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Darren",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 90",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Nitro J kiss",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 91",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Jaman",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 92",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Krating",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 93",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kai Yoi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 94",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Doom Dam",
    "old_plate": "AQIM 725",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 95",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chalong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 96",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "DEMO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 97",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khun Na Bangkok",
    "old_plate": "WDLM 954",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 98",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thoy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 99",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Yam",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 100",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Chucky",
    "old_plate": "TCBA448",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 101",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Norun Theejingjai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 102",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SongG Cassano",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 103",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tod",
    "old_plate": "OVDJ 346",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 104",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thongdee",
    "old_plate": "URAN 764",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 105",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tony",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 106",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Numnung",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 107",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "MiLo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 108",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "JaJa Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 109",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Suwit.S",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 110",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "James Norrington",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 111",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Ainz D. Camillos",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 112",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Mini chabuu",
    "old_plate": "AMNB 837",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 113",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "John Ratchada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 114",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Tatto Horsepower",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 115",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Sakkarin Dowlie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 116",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 117",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "WHY WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 118",
    "model": "Kuruma",
    "raw_model": "Kurumapd",
    "name": "MiLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 119",
    "model": "Kuruma",
    "raw_model": "Kurumapd",
    "name": "Harper Harp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 120",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "smoky",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 121",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chayen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 122",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Somtui",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 123",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "LiLKKRIRK",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 124",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "MilLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 125",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Somtui",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 126",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Brave",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 127",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Oil Ler",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 128",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Snim Croft",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 129",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 130",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ukalyp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 131",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Chucky",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 132",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "JaJa Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 133",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "MiLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 134",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 135",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 136",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Luke",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 137",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "WHY WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 138",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Mini chabuu",
    "old_plate": "BIRZ 801",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 139",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Key",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 140",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 141",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 142",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Baron Winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 143",
    "model": "Mustang",
    "raw_model": "Mustang",
    "name": "Key",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 144",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CYen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 145",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Recker",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 146",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Doktone",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 147",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "ไม่ระบุชื่อ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 148",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kaoraw",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 149",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Lukso",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 150",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mheewai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 151",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mhee Naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 152",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 153",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tag",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 154",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ailap",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 155",
    "model": "R32",
    "raw_model": "R32",
    "name": "Snim",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 156",
    "model": "R32",
    "raw_model": "R32",
    "name": "Cyan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 157",
    "model": "R32",
    "raw_model": "R32",
    "name": "Mini chabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 158",
    "model": "R32",
    "raw_model": "R32",
    "name": "Ukalyp Tus",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 159",
    "model": "R32",
    "raw_model": "R32",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 160",
    "model": "R32",
    "raw_model": "R32",
    "name": "John",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 161",
    "model": "R32",
    "raw_model": "R32",
    "name": "Chucky",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 162",
    "model": "R32",
    "raw_model": "R32",
    "name": "Brave",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 163",
    "model": "R32",
    "raw_model": "R32",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 164",
    "model": "R32",
    "raw_model": "R32",
    "name": "Lukso",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 165",
    "model": "R32",
    "raw_model": "R32",
    "name": "NamNungs",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 166",
    "model": "R32",
    "raw_model": "R32",
    "name": "DOOM",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 167",
    "model": "R32",
    "raw_model": "R32",
    "name": "Key",
    "old_plate": "",
    "source": "existing",
    "note": "ออก"
  },
  {
    "plate": "KKPD 168",
    "model": "R32",
    "raw_model": "R32",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 169",
    "model": "R32",
    "raw_model": "R32",
    "name": "Jack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 170",
    "model": "R32",
    "raw_model": "R32",
    "name": "Dew",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 171",
    "model": "R32",
    "raw_model": "R32",
    "name": "Suwit.S",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 172",
    "model": "R32",
    "raw_model": "R32",
    "name": "Jaja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 173",
    "model": "R32",
    "raw_model": "R32",
    "name": "WHY",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 174",
    "model": "R32",
    "raw_model": "R32",
    "name": "luke",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 175",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Niran",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 176",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Roo Ratchada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 177",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Menz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 178",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Hinata",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 179",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jinny",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 180",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Ploy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 181",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bacon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 182",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "RPure",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 183",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 184",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jawbong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 185",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 186",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 187",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 188",
    "model": "R32",
    "raw_model": "R32",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 189",
    "model": "T20",
    "raw_model": "T20",
    "name": "ไม่ระบุชื่อ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 190",
    "model": "T20",
    "raw_model": "T20",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 191",
    "model": "T20",
    "raw_model": "T20",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 192",
    "model": "T20",
    "raw_model": "T20",
    "name": "Minichabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 193",
    "model": "T20",
    "raw_model": "T20",
    "name": "Dew",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 194",
    "model": "T20",
    "raw_model": "T20",
    "name": "Roo Ratchada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 195",
    "model": "T20",
    "raw_model": "T20",
    "name": "THoy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 196",
    "model": "T20",
    "raw_model": "T20",
    "name": "Lpa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 197",
    "model": "T20",
    "raw_model": "T20",
    "name": "Hmee naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 198",
    "model": "T20",
    "raw_model": "T20",
    "name": "jack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 199",
    "model": "T20",
    "raw_model": "T20",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 200",
    "model": "T20",
    "raw_model": "T20",
    "name": "JaJa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 201",
    "model": "T20",
    "raw_model": "T20",
    "name": "WHY",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 202",
    "model": "T20",
    "raw_model": "T20",
    "name": "Root Kim Mein",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 203",
    "model": "T20",
    "raw_model": "T20",
    "name": "Ukalyp Tus",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 204",
    "model": "T20",
    "raw_model": "T20",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 205",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ares Pipe Targaryenx",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 206",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Shai Spenser",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 207",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 208",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 209",
    "model": "Thrax",
    "raw_model": "Thrax",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 210",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 211",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "Anwar",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 212",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Anwar",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 213",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "Ares Pipe Targaryenx",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 214",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "Shai Spenser",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 215",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Samuel Hiclass",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 216",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SEA Diswxrd",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 217",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Rai Ford",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 218",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Enzo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 219",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "JR. Exces",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 220",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tow cola",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 221",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Higheak Jayce",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 222",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Chanom",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 223",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mano Yawnan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 224",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "John R",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 225",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Leo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 226",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Black TalkAlot",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 227",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Paulita Stephen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 228",
    "model": "I8",
    "raw_model": "I8",
    "name": "Samuel Hiclass",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 229",
    "model": "I8",
    "raw_model": "I8",
    "name": "Ares Pipe Targaryenx",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 230",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kush cake",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 231",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "wasan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 232",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "VARI SNOW",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 233",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Thoy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 234",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Koe Burapha",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 235",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Doom Dam",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 236",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mini",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 237",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "NYXARIA",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 238",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Karl",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 239",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 240",
    "model": "Thrax",
    "raw_model": "Thrax",
    "name": "jaja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 241",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Higheak Jayce",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 242",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Raijin",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 243",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CIGAR",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 244",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Shadow",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 245",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 246",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Angelica Eve",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 247",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Ukalyp Tus",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 248",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 249",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Hmee naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 250",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Leo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 251",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Mini chabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 252",
    "model": "R32",
    "raw_model": "R32",
    "name": "jinjun",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 253",
    "model": "R32",
    "raw_model": "R32",
    "name": "moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 254",
    "model": "R32",
    "raw_model": "R32",
    "name": "lpa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 255",
    "model": "T20",
    "raw_model": "T20",
    "name": "Black",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 256",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Babe",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 257",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kylie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 258",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mmauut",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 259",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Naruto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 260",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "REX",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 261",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thomas",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 262",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Pleak Somsom",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 263",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "BARon kennedy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 264",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tony Lohittawan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 265",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SI LINDA",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 266",
    "model": "C8",
    "raw_model": "c8",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 267",
    "model": "C8",
    "raw_model": "c8",
    "name": "Bel Grindel",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 268",
    "model": "C8",
    "raw_model": "c8",
    "name": "Karl Heisenerg",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 269",
    "model": "C8",
    "raw_model": "c8",
    "name": "Jawbong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 270",
    "model": "C8",
    "raw_model": "c8",
    "name": "Jack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 271",
    "model": "C8",
    "raw_model": "c8",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 272",
    "model": "C8",
    "raw_model": "c8",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 273",
    "model": "C8",
    "raw_model": "c8",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 274",
    "model": "C8",
    "raw_model": "c8",
    "name": "Ukalyp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 275",
    "model": "C8",
    "raw_model": "c8",
    "name": "Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 276",
    "model": "C8",
    "raw_model": "c8",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 277",
    "model": "C8",
    "raw_model": "c8",
    "name": "Hmee naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 278",
    "model": "C8",
    "raw_model": "c8",
    "name": "Winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 279",
    "model": "C8",
    "raw_model": "c8",
    "name": "WHY",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 280",
    "model": "C8",
    "raw_model": "c8",
    "name": "JaJa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 281",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Din",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 282",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "PGOlf",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 283",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "KOiiJi koji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 284",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Nueaynai Sosleep",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 285",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "YIFan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 286",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Rice Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 287",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bravo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 288",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Wendy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 289",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jin Jin",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 290",
    "model": "I8",
    "raw_model": "I8",
    "name": "Milo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 291",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "White Waikonloei",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 292",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 293",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mello",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 294",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 295",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Snim",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 296",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "song",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 297",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "LAZER Dim",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 298",
    "model": "ADMTour",
    "raw_model": "ADMTour",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 299",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Ainz D. Camillos",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 300",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "JaJa Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 301",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 302",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Bel Grindel",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 303",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "WHY WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 304",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Jack Barrett",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 305",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Lpa PaLong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 306",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 307",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Mello",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 308",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Mini chabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 309",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "MOJI WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 310",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "NamNungs",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 311",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 312",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "WHITE Waikonloei",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 313",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "MiLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 314",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tiger Chaps",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 315",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Summer",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 316",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "ROOT Kim Mein",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 317",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ahngoon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 318",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Margie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 319",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Bel Grindel",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 320",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "FabioJin Vincenzo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 321",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "GET",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 322",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "XANO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 323",
    "model": "I8",
    "raw_model": "I8",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 324",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 325",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kimmy Qiis",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 326",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Brave Starter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 327",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "NamNungs",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 328",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Lpa PaLong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 329",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "TSUSHIMA KOJI",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 330",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Phakhawin KTWOB",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 331",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Marn Horsepower",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 332",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Owen Sunshine",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 333",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mikeiyw tomyum",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 334",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Yasen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 335",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Reggie Mesnack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 336",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "ITO Vindecia",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 337",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "DINO CAVALLONE",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 338",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Willeam Stxxrmborn",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 339",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Misterchai madhu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 340",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jeff Forger",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 341",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "KaiR Raku",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 342",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mendi Kolalov",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 343",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sink SR",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 344",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SUXSON W LESOO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 345",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Seua Sakphong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 346",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Cedric Diff",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 347",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Penguin Penguin",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 348",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "ERIKA CLAUS",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 349",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kenta Agela",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 350",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Supakorn Zaewang",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 351",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Light Room",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 352",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "BRA Code",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 353",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "FilM KUB",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 354",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Blackb winterstar",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 355",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jame Roland",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 356",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Claren Ratana",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 357",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sky Blue",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 358",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Toshiuya Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 359",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Marcus Punpoon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 360",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "PEAYIM MUSAP",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 361",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Zeen Zable",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 362",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jackie Phanakorn",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 363",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CHALAM NOI",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 364",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jay Horizon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 365",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khunkhai Inoue",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 366",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ball Money",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 367",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mooping XVVV",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 368",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Nxme Dukduk",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 369",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Qiling Zhang",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 370",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jaturong Horsepower",
    "old_plate": "",
    "source": "existing",
    "note": "รอเปลี่ยน"
  },
  {
    "plate": "KKPD 371",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Doe",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 372",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Asgard Deejingjing",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 373",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Ukalyp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 374",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "khai yoi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 375",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "mon thong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 376",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "six oliver",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 377",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "jojo never",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 378",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Dos padriw",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 379",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "jonathan sawagkata",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 380",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Crane Field",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 381",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Win uppercat",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 382",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Lux Xhuries",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 383",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Pucca Heart",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 384",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "PP Marshmellow",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 385",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "First Uppercat",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 386",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Zubie Foust",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 387",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Peti Vidyard",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 388",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khana Fahwabwab",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 389",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "DILLAN BRAGG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 390",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "FRANKY GAVITO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 391",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tapra Ruck",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 392",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jigsaw Bellini",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 393",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Phak Bandoleros",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 394",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Eclair Jphnsmith",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 395",
    "model": "Other",
    "raw_model": "",
    "name": "Milo",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 396",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Gaiar Marzano",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 397",
    "model": "Other",
    "raw_model": "",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 398",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Alone Leet",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 399",
    "model": "Other",
    "raw_model": "",
    "name": "Alone Leet",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 400",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bualoy Suwanphakdee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 401",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Aurora Mars",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 402",
    "model": "Other",
    "raw_model": "",
    "name": "King",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 403",
    "model": "Other",
    "raw_model": "",
    "name": "Resoa",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 404",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jungji xers",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 405",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kkr Kaliona",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 406",
    "model": "I8",
    "raw_model": "I8",
    "name": "NoeyWhan Bakery",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 407",
    "model": "C8",
    "raw_model": "C8",
    "name": "[kkpd]sakkarin dowlie",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 1)"
  },
  {
    "plate": "KKPD 408",
    "model": "C8",
    "raw_model": "C8",
    "name": "[KKPD] Kimmy Siriphapa",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 2)"
  },
  {
    "plate": "KKPD 409",
    "model": "C8",
    "raw_model": "C8",
    "name": "[KKPD] KHUNKHAI Eisenwall",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 3)"
  },
  {
    "plate": "KKPD 410",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Seua Osi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 4)"
  },
  {
    "plate": "KKPD 411",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Kair Osi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 5)"
  },
  {
    "plate": "KKPD 412",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Chalam Noi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 6)"
  },
  {
    "plate": "KKPD 413",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Kkr Kaliona",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 7)"
  },
  {
    "plate": "KKPD 414",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Tarik Monique",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 8)"
  },
  {
    "plate": "KKPD 415",
    "model": "T20",
    "raw_model": "T20",
    "name": "[KKPD] ASGARD DEEJINGJING",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 9)"
  },
  {
    "plate": "KKPD 416",
    "model": "T20",
    "raw_model": "T20",
    "name": "[KKPD] Chanom Howzler",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 10)"
  },
  {
    "plate": "KKPD 417",
    "model": "Corsita",
    "raw_model": "Corsita",
    "name": "[KKPD] Song Marzano",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 11)"
  },
  {
    "plate": "KKPD 418",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "[KKPD] John Doe",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 12)"
  },
  {
    "plate": "KKPD 419",
    "model": "T20",
    "raw_model": "T20",
    "name": "[KKPD]Dillan Bragg",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 13)"
  },
  {
    "plate": "KKPD 420",
    "model": "Corsita",
    "raw_model": "Corsita",
    "name": "[KKPD] Milo Emilian Marquez",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 14)"
  },
  {
    "plate": "KKPD 421",
    "model": "R32",
    "raw_model": "R32",
    "name": "[KKPD] Thoshilo Bakery",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 15)"
  },
  {
    "plate": "KKPD 422",
    "model": "Corsita",
    "raw_model": "Corsita",
    "name": "[KKPD] Pucca Kor IGjaOcRoi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 16)"
  },
  {
    "plate": "KKPD 423",
    "model": "R32",
    "raw_model": "R32",
    "name": "[KKPD] Akki Autsawapatcharakul",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 17)"
  },
  {
    "plate": "KKPD 424",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "[KKPD] LAZER DIM",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 18)"
  },
  {
    "plate": "KKPD 425",
    "model": "R32",
    "raw_model": "R32",
    "name": "[KKPD] Gaiar OsiMarzanoJingjing",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 19)"
  },
  {
    "plate": "KKPD 426",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "[KKPD] Khana Fahwabwab",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 20)"
  }
];

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================

let garageState = {
  vehicles: [],
  search: "",
  filter: "all",
  view: "vehicles", // 'vehicles' | 'members' | 'model'
  soundEnabled: true
};

// ==========================================
// 3. AUDIO SYNTHESIS ENGINE
// ==========================================

const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  play(type) {
    if (!garageState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      const now = this.ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(160, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {}
  }
};

// ==========================================
// 4. STORAGE & REAL-TIME CLOUD SYNC
// ==========================================

function loadLocalVehicles() {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_VEHICLES.length) {
        return parsed;
      }
    }
  } catch (e) {}
  return [...INITIAL_VEHICLES];
}

function saveLocalVehicles(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

const CloudSync = {
  isSyncing: false,
  async fetchLatest() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    const statusText = document.getElementById("cloudStatusText");
    const cloudIcon = document.getElementById("cloudIcon");

    try {
      const resp = await fetch(`${CLOUD_GARAGE_URL}?_t=${Date.now()}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (resp.ok) {
        const cloudData = await resp.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          if (cloudData.length >= garageState.vehicles.length) {
            garageState.vehicles = cloudData;
            saveLocalVehicles(cloudData);
            renderAll();
          }
        }
        if (statusText) statusText.innerText = "ออนไลน์ ✓";
        if (cloudIcon) cloudIcon.className = "fa-solid fa-cloud-arrow-up";
      } else if (resp.status === 404) {
        await this.pushLatest();
      }
    } catch (err) {
      if (statusText) statusText.innerText = "ออฟไลน์ (Local)";
    } finally {
      this.isSyncing = false;
    }
  },

  async pushLatest() {
    try {
      await fetch(CLOUD_GARAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(garageState.vehicles)
      });
    } catch (e) {}
  }
};

// ==========================================
// 5. SEQUENTIAL PLATE CALCULATOR
// ==========================================

function getNextPlateNumber() {
  let maxNum = 426;

  garageState.vehicles.forEach(v => {
    if (v.plate) {
      const match = v.plate.match(/^KKPD\s*(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  return `KKPD ${maxNum + 1}`;
}

// ==========================================
// 6. TOAST NOTIFICATIONS
// ==========================================

function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-triangle-exclamation" : "fa-circle-info";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================
// 7. RENDERING & UI LOGIC
// ==========================================

function renderAll() {
  renderBadgesAndStats();
  renderFilterChips();
  renderViews();
  updateNextPlatePreview();
  populateMemberDataList();
}

function renderBadgesAndStats() {
  const container = document.getElementById("masterCarBadgesRow");
  const statTotalCars = document.getElementById("statTotalCars");
  const headerTotalCars = document.getElementById("headerTotalCars");
  const statTotalMembers = document.getElementById("statTotalMembers");
  const statMultiCarMembers = document.getElementById("statMultiCarMembers");
  const headerNextPlate = document.getElementById("headerNextPlate");

  const counts = {};
  const memberSet = new Set();
  const memberCounts = {};

  garageState.vehicles.forEach(v => {
    counts[v.model] = (counts[v.model] || 0) + 1;
    memberSet.add(v.name);
    memberCounts[v.name] = (memberCounts[v.name] || 0) + 1;
  });

  const multiCount = Object.values(memberCounts).filter(c => c >= 2).length;
  const nextPlate = getNextPlateNumber();

  if (statTotalCars) statTotalCars.innerHTML = `${garageState.vehicles.length} <small>คัน</small>`;
  if (headerTotalCars) headerTotalCars.innerText = garageState.vehicles.length;
  if (statTotalMembers) statTotalMembers.innerHTML = `${memberSet.size} <small>คน</small>`;
  if (statMultiCarMembers) statMultiCarMembers.innerHTML = `${multiCount} <small>คน</small>`;
  if (headerNextPlate) headerNextPlate.innerText = nextPlate;

  if (container) {
    container.innerHTML = "";
    const sortedModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (counts[m] || 0) > 0).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));

    sortedModels.forEach(key => {
      const conf = ALL_MODELS_CONFIG[key] || { name: key, icon: "fa-car", color: "#38bdf8" };
      const badge = document.createElement("div");
      badge.className = "master-car-badge";
      badge.style.setProperty("--car-color", conf.color);
      badge.innerHTML = `
        <span class="master-car-badge-name"><i class="fa-solid ${conf.icon}"></i> ${conf.name}</span>
        <span class="master-car-badge-count">${counts[key] || 0} คัน</span>
      `;

      badge.addEventListener("click", () => {
        const chip = document.querySelector(`#masterFilterChips .filter-chip[data-filter="${key}"]`);
        if (chip) chip.click();
      });

      container.appendChild(badge);
    });
  }
}

function renderFilterChips() {
  const container = document.getElementById("masterFilterChips");
  if (!container) return;

  const counts = {};
  let event8Count = 0;
  garageState.vehicles.forEach(v => {
    counts[v.model] = (counts[v.model] || 0) + 1;
    if (v.source === "event8") event8Count++;
  });

  const memberCounts = {};
  garageState.vehicles.forEach(v => {
    memberCounts[v.name] = (memberCounts[v.name] || 0) + 1;
  });
  const multiCount = Object.values(memberCounts).filter(c => c >= 2).length;

  const chips = [
    { key: "all", label: `ทั้งหมด (${garageState.vehicles.length})` },
    { key: "event8", label: `🌟 จาก Event 8 (${event8Count})` },
    { key: "multi", label: `⚡ มี 2+ คัน (${multiCount})` }
  ];

  const sortedModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (counts[m] || 0) > 0).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
  sortedModels.forEach(m => {
    chips.push({ key: m, label: `${ALL_MODELS_CONFIG[m]?.name || m} (${counts[m]})` });
  });

  container.innerHTML = chips.map((c) => `
    <button class="filter-chip ${c.key === garageState.filter ? 'active' : ''}" data-filter="${c.key}">${c.label}</button>
  `).join("");

  container.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      AudioEngine.play('click');
      container.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      chip.classList.add("active");
      garageState.filter = chip.dataset.filter;
      renderViews();
    });
  });
}

function getFilteredVehicles() {
  const memberCounts = {};
  garageState.vehicles.forEach(v => {
    memberCounts[v.name] = (memberCounts[v.name] || 0) + 1;
  });

  return garageState.vehicles.filter(item => {
    if (garageState.search) {
      const q = garageState.search;
      const nameMatch = item.name.toLowerCase().includes(q);
      const plateMatch = item.plate.toLowerCase().includes(q);
      const oldPlateMatch = (item.old_plate || "").toLowerCase().includes(q);
      const modelMatch = item.model.toLowerCase().includes(q) || (ALL_MODELS_CONFIG[item.model]?.name || "").toLowerCase().includes(q);
      const noteMatch = (item.note || "").toLowerCase().includes(q);
      if (!nameMatch && !plateMatch && !oldPlateMatch && !modelMatch && !noteMatch) return false;
    }

    if (garageState.filter === "all") return true;
    if (garageState.filter === "event8") return item.source === "event8";
    if (garageState.filter === "multi") return (memberCounts[item.name] || 0) >= 2;
    return item.model === garageState.filter;
  });
}

function renderViews() {
  const list = getFilteredVehicles();
  renderVehiclesTable(list);
  renderMembersTable(list);
  renderModelRosters(list);
}

function renderVehiclesTable(list) {
  const tbody = document.getElementById("masterVehiclesTableBody");
  const countEl = document.getElementById("countViewVehicles");
  if (countEl) countEl.innerText = list.length;
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--text-muted); font-size:0.95rem;">🔍 ไม่พบข้อมูลทะเบียนรถที่ตรงกับเงื่อนไขการค้นหา</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((item, idx) => {
    const conf = ALL_MODELS_CONFIG[item.model] || { name: item.model, icon: "fa-car", color: "#38bdf8" };
    const isEvent8 = item.source === "event8";

    let sourceClass = "existing";
    let sourceLabel = item.note || "ข้อมูลเดิม";
    if (isEvent8) {
      sourceClass = "event8";
      sourceLabel = item.note;
    }

    return `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-family: var(--font-heading); font-weight:700;">${idx + 1}</td>
        <td style="text-align: center;">
          <div class="plate-pill ${isEvent8 ? 'event8' : ''}">
            <i class="fa-solid fa-id-card"></i> ${item.plate}
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid ${conf.icon}" style="color:${conf.color}; font-size:0.9rem;"></i>
            <span style="font-weight:600; color:#fff;">${conf.name}</span>
          </div>
        </td>
        <td style="font-weight: 600; color: var(--text-primary);">${item.name}</td>
        <td style="text-align: center; color: var(--text-secondary); font-family: var(--font-heading); font-size:0.85rem;">${item.old_plate || '-'}</td>
        <td>
          <span class="source-badge ${sourceClass}">${sourceLabel}</span>
        </td>
      </tr>
    `;
  }).join("");
}

function renderMembersTable(list) {
  const tbody = document.getElementById("masterMembersTableBody");
  const countEl = document.getElementById("countViewMembers");
  if (!tbody) return;

  const map = new Map();
  list.forEach(v => {
    if (!map.has(v.name)) {
      map.set(v.name, []);
    }
    map.get(v.name).push(v);
  });

  const memberList = Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  if (countEl) countEl.innerText = memberList.length;

  if (!memberList.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:36px; color:var(--text-muted); font-size:0.95rem;">🔍 ไม่พบรายชื่อสมาชิกที่ตรงกับเงื่อนไขการค้นหา</td></tr>`;
    return;
  }

  tbody.innerHTML = memberList.map(([memberName, cars], idx) => {
    const hasEvent8 = cars.some(c => c.source === "event8");
    const hasExisting = cars.some(c => c.source === "existing");
    let sourceBadge = `<span class="source-badge existing">เดิม</span>`;
    if (hasEvent8 && hasExisting) {
      sourceBadge = `<span class="source-badge both">เดิม + Event 8</span>`;
    } else if (hasEvent8) {
      sourceBadge = `<span class="source-badge event8">Event 8</span>`;
    }

    const carPills = cars.map(c => {
      const conf = ALL_MODELS_CONFIG[c.model] || { name: c.model, color: "#38bdf8" };
      return `
        <div style="display:inline-flex; align-items:center; gap:6px; background:var(--bg-surface); padding:4px 10px; border-radius:6px; border:1px solid var(--border-subtle); margin:2px 4px;">
          <span style="font-size:0.8rem; font-weight:700; color:${conf.color};">${conf.name}</span>
          <div class="plate-pill ${c.source === 'event8' ? 'event8' : ''}" style="padding:1px 6px; font-size:0.68rem;"><i class="fa-solid fa-id-card"></i> ${c.plate}</div>
        </div>
      `;
    }).join("");

    return `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-family: var(--font-heading); font-weight:700;">${idx + 1}</td>
        <td style="font-weight: 700; color: #fff; font-size:0.95rem;">${memberName}</td>
        <td style="text-align: center;">
          <span class="badge-total-cars ${cars.length >= 2 ? 'multi' : 'single'}">${cars.length} คัน</span>
        </td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:4px;">${carPills}</div>
        </td>
        <td>${sourceBadge}</td>
      </tr>
    `;
  }).join("");
}

function renderModelRosters(list) {
  const container = document.getElementById("modelRosterGrid");
  const countEl = document.getElementById("countViewModel");
  if (!container) return;

  const modelMap = {};
  list.forEach(v => {
    if (!modelMap[v.model]) modelMap[v.model] = [];
    modelMap[v.model].push(v);
  });

  const activeModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (modelMap[m] && modelMap[m].length > 0) || garageState.filter === m);
  if (countEl) countEl.innerText = activeModels.length;

  container.innerHTML = "";
  if (!activeModels.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">🔍 ไม่พบรุ่นรถที่ตรงกับเงื่อนไข</div>`;
    return;
  }

  activeModels.forEach(modelKey => {
    const conf = ALL_MODELS_CONFIG[modelKey] || { name: modelKey, icon: "fa-car", color: "#38bdf8" };
    const owners = modelMap[modelKey] || [];

    const card = document.createElement("div");
    card.className = "model-roster-card";
    card.style.setProperty("--car-color", conf.color);

    card.innerHTML = `
      <div class="model-roster-header">
        <div class="model-roster-title">
          <i class="fa-solid ${conf.icon}" style="color:${conf.color}"></i>
          <span>${conf.name}</span>
        </div>
        <span class="model-roster-count">${owners.length} คัน</span>
      </div>
      <div class="model-roster-owners-list">
        ${owners.length ? owners.map((o, i) => `
          <div class="model-owner-item">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--text-muted); font-size:0.75rem; min-width:20px;">${i + 1}.</span>
              <span class="model-owner-name">${o.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <div class="plate-pill ${o.source === 'event8' ? 'event8' : ''}"><i class="fa-solid fa-id-card"></i> ${o.plate}</div>
              <span class="source-badge ${o.source === 'event8' ? 'event8' : 'existing'}">${o.source === 'event8' ? 'Event 8' : 'เดิม'}</span>
            </div>
          </div>
        `).join("") : `<div style="color:var(--text-muted); text-align:center; padding:20px 0;">ไม่มีรายชื่อที่ตรงกับเงื่อนไข</div>`}
      </div>
    `;

    container.appendChild(card);
  });
}

function updateNextPlatePreview() {
  const previewEl = document.getElementById("previewNewPlate");
  if (previewEl) {
    const nextPlate = getNextPlateNumber();
    previewEl.innerHTML = `<i class="fa-solid fa-id-card"></i> ${nextPlate}`;
  }
}

function populateMemberDataList() {
  const datalist = document.getElementById("membersDataList");
  if (!datalist) return;

  const names = Array.from(new Set(garageState.vehicles.map(v => v.name))).sort();
  datalist.innerHTML = names.map(n => `<option value="${n}">`).join("");
}

// ==========================================
// 8. ADD NEW VEHICLE CONTROLLER (6-DIGIT PIN)
// ==========================================

function setupAddVehicleModal() {
  const modal = document.getElementById("addVehicleModal");
  const btnOpen = document.getElementById("btnOpenAddVehicleModal");
  const btnClose = document.getElementById("btnCloseAddVehicleModal");
  const btnCancel = document.getElementById("btnCancelAddVehicle");
  const btnSubmit = document.getElementById("btnSubmitNewVehicle");
  const selectModel = document.getElementById("newVehicleModel");
  const customModelGroup = document.getElementById("customModelGroup");
  const customModelInput = document.getElementById("customModelInput");
  const ownerInput = document.getElementById("newVehicleOwner");
  const oldPlateInput = document.getElementById("newVehicleOldPlate");
  const noteInput = document.getElementById("newVehicleNote");
  const pinInput = document.getElementById("addVehiclePinInput");
  const pinError = document.getElementById("addVehiclePinError");

  if (selectModel && customModelGroup) {
    selectModel.addEventListener("change", () => {
      if (selectModel.value === "CUSTOM") {
        customModelGroup.classList.remove("hidden");
        customModelInput.focus();
      } else {
        customModelGroup.classList.add("hidden");
      }
    });
  }

  const openModal = () => {
    AudioEngine.play('click');
    modal.classList.remove("hidden");
    updateNextPlatePreview();
    pinError.classList.add("hidden");
    pinInput.value = "";
    ownerInput.value = "";
    oldPlateInput.value = "";
    noteInput.value = "";
    if (selectModel) selectModel.value = "Sugoi";
    if (customModelGroup) customModelGroup.classList.add("hidden");
    setTimeout(() => ownerInput.focus(), 100);
  };

  const closeModal = () => {
    AudioEngine.play('click');
    modal.classList.add("hidden");
  };

  if (btnOpen) btnOpen.addEventListener("click", openModal);
  if (btnClose) btnClose.addEventListener("click", closeModal);
  if (btnCancel) btnCancel.addEventListener("click", closeModal);

  if (btnSubmit) {
    btnSubmit.addEventListener("click", () => {
      const ownerName = ownerInput.value.trim();
      let modelName = selectModel.value;
      if (modelName === "CUSTOM") {
        modelName = customModelInput.value.trim() || "Other";
      }
      const oldPlate = oldPlateInput.value.trim();
      const note = noteInput.value.trim() || "เพิ่มใหม่";
      const enteredPin = pinInput.value.trim();

      if (!ownerName) {
        AudioEngine.play('error');
        showToast("กรุณากรอกชื่อผู้ครอบครอง", "error");
        ownerInput.focus();
        return;
      }

      // Validate 6-Digit PIN
      if (!enteredPin || enteredPin !== MASTER_6DIGIT_PIN) {
        AudioEngine.play('error');
        pinError.classList.remove("hidden");
        pinInput.focus();
        return;
      }

      pinError.classList.add("hidden");

      // Generate next sequential plate
      const nextPlate = getNextPlateNumber();

      const newVehicle = {
        plate: nextPlate,
        model: modelName,
        raw_model: modelName,
        name: ownerName,
        old_plate: oldPlate,
        source: "existing",
        note: note
      };

      garageState.vehicles.push(newVehicle);
      saveLocalVehicles(garageState.vehicles);
      CloudSync.pushLatest();

      AudioEngine.play('success');
      showToast(`🎉 ลงทะเบียน ${modelName} ป้ายทะเบียน [${nextPlate}] สำเร็จแล้ว!`, "success");

      closeModal();
      renderAll();
    });
  }
}

// ==========================================
// 9. EXPORT HANDLERS
// ==========================================

function copyMasterDataDiscord() {
  let text = `📊 **สรุปฐานข้อมูลทะเบียนรถ KKPD Master Vehicle Database (รวม ${garageState.vehicles.length} คัน)** 🏎️✨\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const counts = {};
  garageState.vehicles.forEach(v => {
    counts[v.model] = (counts[v.model] || 0) + 1;
  });

  const sortedModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (counts[m] || 0) > 0).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));

  sortedModels.forEach(modelKey => {
    const conf = ALL_MODELS_CONFIG[modelKey] || { name: modelKey };
    const vehiclesInModel = garageState.vehicles.filter(v => v.model === modelKey);
    text += `🏎️ **${conf.name}** (${vehiclesInModel.length} คัน):\n`;
    vehiclesInModel.forEach((v, i) => {
      const tag = v.source === 'event8' ? ' *(Event 8)*' : '';
      text += `  ${(i + 1).toString().padStart(2, ' ')}. \`[${v.plate}]\` ${v.name}${tag}\n`;
    });
    text += `\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👥 รวมรถทั้งหมด: ${garageState.vehicles.length} คัน`;

  navigator.clipboard.writeText(text).then(() => {
    AudioEngine.play('success');
    showToast("คัดลอกสรุปสำหรับ Discord เรียบร้อยแล้ว!", "success");
  });
}

function exportMasterDataCSV() {
  let csv = "\uFEFFลำดับ,ป้ายทะเบียน,รุ่นรถ,ชื่อผู้ครอบครอง,ทะเบียนเดิม,ที่มา,หมายเหตุ\n";
  garageState.vehicles.forEach((v, i) => {
    const conf = ALL_MODELS_CONFIG[v.model] || { name: v.model };
    csv += `"${i + 1}","${v.plate}","${conf.name}","${v.name}","${v.old_plate || ''}","${v.source === 'event8' ? 'Event 8' : 'ข้อมูลเดิม'}","${v.note || ''}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `kkpd_master_all_vehicles_${Date.now()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  AudioEngine.play('success');
  showToast("ส่งออกไฟล์ CSV ฐานข้อมูลรถสำเร็จแล้ว", "success");
}

// ==========================================
// 10. INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  garageState.vehicles = loadLocalVehicles();

  const searchInput = document.getElementById("masterSearchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");
  const btnViewVehicles = document.getElementById("btnViewVehicles");
  const btnViewMembers = document.getElementById("btnViewMembers");
  const btnViewModel = document.getElementById("btnViewModel");
  const btnCopyMasterDiscord = document.getElementById("btnCopyMasterDiscord");
  const btnExportMasterCSV = document.getElementById("btnExportMasterCSV");
  const btnSoundToggle = document.getElementById("btnSoundToggle");
  const soundIcon = document.getElementById("soundIcon");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      garageState.search = e.target.value.trim().toLowerCase();
      if (garageState.search) {
        btnClearSearch.classList.remove("hidden");
      } else {
        btnClearSearch.classList.add("hidden");
      }
      renderViews();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      searchInput.value = "";
      garageState.search = "";
      btnClearSearch.classList.add("hidden");
      renderViews();
      searchInput.focus();
    });
  }

  if (btnViewVehicles && btnViewMembers && btnViewModel) {
    btnViewVehicles.addEventListener("click", () => {
      AudioEngine.play('click');
      btnViewVehicles.classList.add("active");
      btnViewMembers.classList.remove("active");
      btnViewModel.classList.remove("active");
      document.getElementById("masterVehiclesView").classList.remove("hidden");
      document.getElementById("masterMembersView").classList.add("hidden");
      document.getElementById("masterModelView").classList.add("hidden");
      garageState.view = "vehicles";
    });

    btnViewMembers.addEventListener("click", () => {
      AudioEngine.play('click');
      btnViewMembers.classList.add("active");
      btnViewVehicles.classList.remove("active");
      btnViewModel.classList.remove("active");
      document.getElementById("masterMembersView").classList.remove("hidden");
      document.getElementById("masterVehiclesView").classList.add("hidden");
      document.getElementById("masterModelView").classList.add("hidden");
      garageState.view = "members";
    });

    btnViewModel.addEventListener("click", () => {
      AudioEngine.play('click');
      btnViewModel.classList.add("active");
      btnViewVehicles.classList.remove("active");
      btnViewMembers.classList.remove("active");
      document.getElementById("masterModelView").classList.remove("hidden");
      document.getElementById("masterVehiclesView").classList.add("hidden");
      document.getElementById("masterMembersView").classList.add("hidden");
      garageState.view = "model";
    });
  }

  if (btnCopyMasterDiscord) {
    btnCopyMasterDiscord.addEventListener("click", copyMasterDataDiscord);
  }

  if (btnExportMasterCSV) {
    btnExportMasterCSV.addEventListener("click", exportMasterDataCSV);
  }

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      garageState.soundEnabled = !garageState.soundEnabled;
      if (soundIcon) {
        soundIcon.className = garageState.soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
      }
      showToast(garageState.soundEnabled ? "เปิดเสียงเอฟเฟกต์แล้ว" : "ปิดเสียงเอฟเฟกต์แล้ว", "info");
    });
  }

  setupAddVehicleModal();

  const cloudCard = document.getElementById("cloudSyncStatusCard");
  if (cloudCard) {
    cloudCard.style.cursor = "pointer";
    cloudCard.addEventListener("click", () => {
      AudioEngine.play('click');
      CloudSync.fetchLatest();
    });
  }

  renderAll();
  CloudSync.fetchLatest();

  setInterval(() => {
    CloudSync.fetchLatest();
  }, 3500);

  window.addEventListener("focus", () => {
    CloudSync.fetchLatest();
  });
});
