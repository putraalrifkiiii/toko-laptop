export type CategorySlug =
  | "laptop"
  | "pc-gaming"
  | "komponen"
  | "monitor"
  | "periferal";

export type StockStatus = "in" | "low" | "out";

export interface SpkSpec {
  cpu: number;
  gpu: number;
  ramGb: number;
  storageGb: number;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: StockStatus;
  image: string;
  gallery: string[];
  tags: string[];
  description: string;
  specs: SpecRow[];
  spk?: SpkSpec;
}

export interface Category {
  slug: CategorySlug;
  label: string;
  tagline: string;
  image: string;
}

/* --------------------------------- images -------------------------------- */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const HERO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/70907fb7-a908-498d-bc43-c13fd212294f/images/a79e1f4ceebb61843e8da604ddc19fb7ecffaf868492afa941557c2fe0375492.jpeg";

export const PROMO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/70907fb7-a908-498d-bc43-c13fd212294f/images/fc756ea66ecdf43ce18d49bdd9fa2dc0ba30a8357858c7d33b19f0b584ab9da1.jpeg";

const IMG = {
  laptopDarkRed: "photo-1658262530868-f7460e2f071f",
  laptopGamer: "photo-1640955014216-75201056c829",
  laptopDesk: "photo-1684127987312-43455fd95925",
  laptopBlackTable: "photo-1611078489935-0cb964de46d6",
  laptopGlowKeys: "photo-1610465299993-e6675c9f9efa",
  laptopSilver: "photo-1531297484001-80022131f5a1",
  laptopStudio: "photo-1525547719571-a2d4ac8945e2",
  pcCaseFans: "photo-1587202372775-e229f172b9d7",
  pcCaseInterior: "photo-1660855551740-4474188debdb",
  pcSetupPurple: "photo-1696710257827-75e2e5954059",
  gpuNvidia: "photo-1716967318503-05b7064afa41",
  cpuChip: "photo-1494083306499-e22e4a457632",
  circuitMacro: "photo-1518770660439-4636190af475",
  wafer: "photo-1587845323226-bad89242c735",
  monitorRed: "photo-1603481588273-2f908a9a7a1b",
  monitorDark: "photo-1626218174358-7769486c4b79",
  monitorDual: "photo-1598550476439-6847785fcea6",
  monitorBlue: "photo-1614179924047-e1ab49a0a0cf",
  keyboardRed: "photo-1635987391914-cb84b567e68f",
  keyboardOrange: "photo-1618384887929-16ec33fab9ef",
  mouseRed: "photo-1605773527852-c546a8584ea3",
  mouseBlue: "photo-1629429408209-1f912961dbd8",
  headsetRed: "photo-1629429407756-4a7703614972",
  headsetDark: "photo-1610041321327-b794c052db27",
} as const;

function gal(main: string, pool: string[]): string[] {
  const rest = pool.filter((p) => p !== main).slice(0, 2);
  return [main, ...rest];
}

const LAPTOP_POOL = [
  IMG.laptopDarkRed,
  IMG.laptopGamer,
  IMG.laptopDesk,
  IMG.laptopBlackTable,
  IMG.laptopGlowKeys,
  IMG.laptopSilver,
];
const PC_POOL = [IMG.pcCaseFans, IMG.pcCaseInterior, IMG.pcSetupPurple];
const KOMPONEN_POOL = [IMG.gpuNvidia, IMG.cpuChip, IMG.circuitMacro];
const MONITOR_POOL = [
  IMG.monitorRed,
  IMG.monitorDark,
  IMG.monitorBlue,
  IMG.monitorDual,
];
const PERIFERAL_POOL = [
  IMG.keyboardRed,
  IMG.keyboardOrange,
  IMG.mouseRed,
  IMG.mouseBlue,
  IMG.headsetRed,
  IMG.headsetDark,
];

/* -------------------------------- categories ------------------------------ */

export const CATEGORIES: Category[] = [
  {
    slug: "laptop",
    label: "Laptop",
    tagline: "Gaming, kreator, dan kerja",
    image: u(IMG.laptopBlackTable),
  },
  {
    slug: "pc-gaming",
    label: "PC Gaming",
    tagline: "Rakitan & desktop siap pakai",
    image: u(IMG.pcCaseInterior),
  },
  {
    slug: "komponen",
    label: "Komponen PC",
    tagline: "VGA, processor, dan lainnya",
    image: u(IMG.gpuNvidia),
  },
  {
    slug: "monitor",
    label: "Monitor",
    tagline: "Refresh rate tinggi, warna akurat",
    image: u(IMG.monitorRed),
  },
  {
    slug: "periferal",
    label: "Periferal",
    tagline: "Keyboard, mouse, headset",
    image: u(IMG.keyboardRed),
  },
];

export const CATEGORY_LABEL: Record<CategorySlug, string> = {
  laptop: "Laptop",
  "pc-gaming": "PC Gaming",
  komponen: "Komponen PC",
  monitor: "Monitor",
  periferal: "Periferal",
};

export const HOME_TILES = [
  {
    label: "Gaming Laptop",
    href: "/kategori/laptop",
    image: u(IMG.laptopDarkRed),
    note: "RTX & layar 240Hz",
  },
  {
    label: "PC Gaming",
    href: "/kategori/pc-gaming",
    image: u(IMG.pcSetupPurple),
    note: "Rakitan siap pakai",
  },
  {
    label: "VGA / GPU",
    href: "/kategori/komponen",
    image: u(IMG.gpuNvidia),
    note: "RTX 40 & RX 7000",
  },
  {
    label: "Processor",
    href: "/kategori/komponen",
    image: u(IMG.cpuChip),
    note: "Intel Core & AMD Ryzen",
  },
  {
    label: "Monitor",
    href: "/kategori/monitor",
    image: u(IMG.monitorDark),
    note: "QHD hingga OLED",
  },
  {
    label: "Aksesoris",
    href: "/kategori/periferal",
    image: u(IMG.headsetDark),
    note: "Keyboard, mouse, headset",
  },
];

/* --------------------------------- products ------------------------------- */

const OS_WIN = { label: "Sistem Operasi", value: "Windows 11 Home" };
const WARRANTY = { label: "Garansi", value: "2 Tahun Resmi" };

function laptopSpecs(
  cpu: string,
  gpu: string,
  ram: string,
  storage: string,
  display: string,
): SpecRow[] {
  return [
    { label: "Processor", value: cpu },
    { label: "GPU", value: gpu },
    { label: "RAM", value: ram },
    { label: "Storage", value: storage },
    { label: "Layar", value: display },
    OS_WIN,
    WARRANTY,
  ];
}

export const PRODUCTS: Product[] = [
  /* ---------------------------------- laptop ------------------------------ */
  {
    id: "asus-rog-strix-g16",
    name: "ASUS ROG Strix G16 G614",
    brand: "ASUS",
    category: "laptop",
    price: 28999000,
    oldPrice: 31999000,
    rating: 4.9,
    reviews: 214,
    stock: "in",
    image: u(IMG.laptopDarkRed),
    gallery: gal(
      u(IMG.laptopDarkRed),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["i9-14900HX", "RTX 4070", "RAM 32GB", "SSD 1TB", "240Hz"],
    description:
      "Flagship gaming dengan Intel Core i9-14900HX dan RTX 4070. Layar 16 inci QHD+ 240Hz, sistem pendingin ROG Intelligent Cooling, dan chassis tahan lama untuk sesi gaming berat.",
    specs: laptopSpecs(
      "Intel Core i9-14900HX",
      "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "32GB DDR5-5600",
      "1TB PCIe 4.0 NVMe SSD",
      '16" QHD+ 2560x1600, 240Hz',
    ),
    spk: { cpu: 96, gpu: 86, ramGb: 32, storageGb: 1024 },
  },
  {
    id: "lenovo-legion-pro-5",
    name: "Lenovo Legion Pro 5 16",
    brand: "Lenovo",
    category: "laptop",
    price: 21499000,
    rating: 4.8,
    reviews: 186,
    stock: "in",
    image: u(IMG.laptopGamer),
    gallery: gal(
      u(IMG.laptopGamer),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["Ryzen 7 7745HX", "RTX 4060", "RAM 16GB", "165Hz"],
    description:
      "Gaming laptop seimbang antara performa dan harga. Ryzen 7 7745HX plus RTX 4060 dengan layar WQXGA 165Hz dan pendingin Legion Coldfront 5.0.",
    specs: laptopSpecs(
      "AMD Ryzen 7 7745HX",
      "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "16GB DDR5-5200",
      "512GB PCIe 4.0 NVMe SSD",
      '16" WQXGA 2560x1600, 165Hz',
    ),
    spk: { cpu: 88, gpu: 78, ramGb: 16, storageGb: 512 },
  },
  {
    id: "acer-predator-helios-neo-16",
    name: "Acer Predator Helios Neo 16",
    brand: "Acer",
    category: "laptop",
    price: 19999000,
    oldPrice: 21999000,
    rating: 4.7,
    reviews: 152,
    stock: "low",
    image: u(IMG.laptopDesk),
    gallery: gal(
      u(IMG.laptopDesk),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["i7-13650HX", "RTX 4060", "SSD 1TB", "165Hz"],
    description:
      "Predator Helios Neo 16 membawa performa kelas flagship ke harga menengah: i7-13650HX, RTX 4060, dan sistem pendingin dengan dual fan 5th-gen AeroBlade.",
    specs: laptopSpecs(
      "Intel Core i7-13650HX",
      "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "16GB DDR5-5600",
      "1TB PCIe 4.0 NVMe SSD",
      '16" WQXGA 2560x1600, 165Hz',
    ),
    spk: { cpu: 84, gpu: 78, ramGb: 16, storageGb: 1024 },
  },
  {
    id: "asus-proart-studiobook-16",
    name: "ASUS ProArt Studiobook 16 OLED",
    brand: "ASUS",
    category: "laptop",
    price: 32999000,
    rating: 4.8,
    reviews: 97,
    stock: "in",
    image: u(IMG.laptopStudio),
    gallery: gal(
      u(IMG.laptopStudio),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["Ultra 9 185H", "RTX 4060", "RAM 32GB", "OLED 3.2K"],
    description:
      "Laptop kreator premium: layar 3.2K OLED 120Hz dengan kalibrasi Pantone, Core Ultra 9, dan RTX 4060 untuk render video dan desain berat.",
    specs: laptopSpecs(
      "Intel Core Ultra 9 185H",
      "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "32GB LPDDR5X-7467",
      "1TB PCIe 4.0 NVMe SSD",
      '16" 3.2K OLED touch, 120Hz, Pantone',
    ),
    spk: { cpu: 92, gpu: 78, ramGb: 32, storageGb: 1024 },
  },
  {
    id: "asus-tuf-gaming-a15",
    name: "ASUS TUF Gaming A15",
    brand: "ASUS",
    category: "laptop",
    price: 15499000,
    rating: 4.6,
    reviews: 243,
    stock: "in",
    image: u(IMG.laptopBlackTable),
    gallery: gal(
      u(IMG.laptopBlackTable),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["Ryzen 7 7735HS", "RTX 4050", "MIL-STD-810H"],
    description:
      "Tahan banting dengan sertifikasi MIL-STD-810H, Ryzen 7 7735HS dan RTX 4050. Pilihan awet untuk gaming mobile dan tugas kuliah.",
    specs: laptopSpecs(
      "AMD Ryzen 7 7735HS",
      "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "16GB DDR5-4800",
      "512GB PCIe 4.0 NVMe SSD",
      '15.6" FHD 1920x1080, 144Hz',
    ),
    spk: { cpu: 76, gpu: 68, ramGb: 16, storageGb: 512 },
  },
  {
    id: "msi-katana-15",
    name: "MSI Katana 15 B13V",
    brand: "MSI",
    category: "laptop",
    price: 14999000,
    oldPrice: 15999000,
    rating: 4.5,
    reviews: 198,
    stock: "in",
    image: u(IMG.laptopGlowKeys),
    gallery: gal(
      u(IMG.laptopGlowKeys),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["i7-13620H", "RTX 4050", "Cooler Boost 5"],
    description:
      "Katana 15 dengan Cooler Boost 5 menjaga suhu tetap stabil saat gaming lama. i7-13620H dan RTX 4050 untuk 1080p high settings.",
    specs: laptopSpecs(
      "Intel Core i7-13620H",
      "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "16GB DDR5-5200",
      "512GB PCIe 4.0 NVMe SSD",
      '15.6" FHD 1920x1080, 144Hz',
    ),
    spk: { cpu: 80, gpu: 68, ramGb: 16, storageGb: 512 },
  },
  {
    id: "hp-victus-16",
    name: "HP Victus 16",
    brand: "HP",
    category: "laptop",
    price: 13499000,
    oldPrice: 14499000,
    rating: 4.4,
    reviews: 312,
    stock: "in",
    image: u(IMG.laptopSilver),
    gallery: gal(
      u(IMG.laptopSilver),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["i5-13500H", "RTX 4050", 'Layar 16.1"'],
    description:
      "Victus 16 menawarkan layar besar 16.1 inci dan RTX 4050 dengan harga bersahabat — cocok untuk gaming dan multitasking harian.",
    specs: laptopSpecs(
      "Intel Core i5-13500H",
      "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "16GB DDR4-3200",
      "512GB PCIe NVMe SSD",
      '16.1" FHD 1920x1080, 144Hz',
    ),
    spk: { cpu: 70, gpu: 68, ramGb: 16, storageGb: 512 },
  },
  {
    id: "lenovo-loq-15",
    name: "Lenovo LOQ 15",
    brand: "Lenovo",
    category: "laptop",
    price: 11999000,
    rating: 4.3,
    reviews: 267,
    stock: "in",
    image: u(IMG.laptopDarkRed),
    gallery: gal(
      u(IMG.laptopDarkRed),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["i5-12450HX", "RTX 3050", "Entry Gaming"],
    description:
      "Gerbang masuk dunia gaming: LOQ 15 dengan i5-12450HX dan RTX 3050 6GB, cukup untuk e-sports title di 1080p.",
    specs: laptopSpecs(
      "Intel Core i5-12450HX",
      "NVIDIA GeForce RTX 3050 6GB GDDR6",
      "16GB DDR5-4800",
      "512GB PCIe NVMe SSD",
      '15.6" FHD 1920x1080, 144Hz',
    ),
    spk: { cpu: 60, gpu: 52, ramGb: 16, storageGb: 512 },
  },
  {
    id: "acer-nitro-v-15",
    name: "Acer Nitro V 15",
    brand: "Acer",
    category: "laptop",
    price: 10499000,
    rating: 4.2,
    reviews: 389,
    stock: "low",
    image: u(IMG.laptopDesk),
    gallery: gal(
      u(IMG.laptopDesk),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["i5-13420H", "RTX 3050", "Budget"],
    description:
      "Nitro V 15 adalah gaming laptop paling terjangkau di katalog kami — pas untuk pelajar dan gamer hemat biaya.",
    specs: laptopSpecs(
      "Intel Core i5-13420H",
      "NVIDIA GeForce RTX 3050 6GB GDDR6",
      "8GB DDR5-4800",
      "512GB PCIe NVMe SSD",
      '15.6" FHD 1920x1080, 144Hz',
    ),
    spk: { cpu: 64, gpu: 52, ramGb: 8, storageGb: 512 },
  },
  {
    id: "lenovo-ideapad-slim-5",
    name: "Lenovo IdeaPad Slim 5",
    brand: "Lenovo",
    category: "laptop",
    price: 8999000,
    rating: 4.5,
    reviews: 421,
    stock: "in",
    image: u(IMG.laptopStudio),
    gallery: gal(
      u(IMG.laptopStudio),
      LAPTOP_POOL.map((p) => u(p)),
    ),
    tags: ["Ryzen 5 7530U", "Tipis", "Kerja & Kuliah"],
    description:
      "Laptop tipis dan ringan untuk produktivitas: Ryzen 5 7530U, baterai tahan lama, dan bodi aluminium atap soft-touch.",
    specs: laptopSpecs(
      "AMD Ryzen 5 7530U",
      "AMD Radeon Graphics (terintegrasi)",
      "16GB LPDDR4X",
      "512GB PCIe NVMe SSD",
      '15.6" FHD 1920x1080, IPS 300nits',
    ),
    spk: { cpu: 55, gpu: 25, ramGb: 16, storageGb: 512 },
  },

  /* --------------------------------- pc gaming ----------------------------- */
  {
    id: "msi-aegis-r2",
    name: "MSI Aegis R2 Gaming Desktop",
    brand: "MSI",
    category: "pc-gaming",
    price: 27999000,
    rating: 4.8,
    reviews: 64,
    stock: "in",
    image: u(IMG.pcCaseFans),
    gallery: gal(
      u(IMG.pcCaseFans),
      PC_POOL.map((p) => u(p)),
    ),
    tags: ["i7-14700F", "RTX 4070 Super", "RAM 32GB"],
    description:
      "Desktop gaming siap pakai dengan i7-14700F dan RTX 4070 Super — 1440p ultra settings tanpa kompromi.",
    specs: [
      { label: "Processor", value: "Intel Core i7-14700F" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 Super 12GB" },
      { label: "RAM", value: "32GB DDR5-5600" },
      { label: "Storage", value: "1TB NVMe SSD" },
      WARRANTY,
    ],
  },
  {
    id: "techstore-rig-vanguard",
    name: "TechStore Rig Vanguard (Custom)",
    brand: "TechStore Custom",
    category: "pc-gaming",
    price: 24999000,
    rating: 4.9,
    reviews: 38,
    stock: "low",
    image: u(IMG.pcCaseInterior),
    gallery: gal(
      u(IMG.pcCaseInterior),
      PC_POOL.map((p) => u(p)),
    ),
    tags: ["Ryzen 7 7700", "RTX 4070", "Rakitan Ahli"],
    description:
      "Rakitan montir TechStore: Ryzen 7 7700, RTX 4070, tubing rapi, dan stress-test 24 jam sebelum dikirim.",
    specs: [
      { label: "Processor", value: "AMD Ryzen 7 7700" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 12GB" },
      { label: "RAM", value: "32GB DDR5-6000" },
      { label: "Storage", value: "1TB NVMe SSD Gen4" },
      { label: "Pendingin", value: "AIO 240mm ARGB" },
      WARRANTY,
    ],
  },
  {
    id: "lenovo-legion-tower-5",
    name: "Lenovo Legion Tower 5",
    brand: "Lenovo",
    category: "pc-gaming",
    price: 17999000,
    oldPrice: 19499000,
    rating: 4.6,
    reviews: 77,
    stock: "in",
    image: u(IMG.pcSetupPurple),
    gallery: gal(
      u(IMG.pcSetupPurple),
      PC_POOL.map((p) => u(p)),
    ),
    tags: ["Ryzen 5 7600", "RTX 4060", "Upgrade-friendly"],
    description:
      "Tower rapi dengan ruang upgrade lega. Ryzen 5 7600 dan RTX 4060 untuk gaming 1080p/1440p.",
    specs: [
      { label: "Processor", value: "AMD Ryzen 5 7600" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4060 8GB" },
      { label: "RAM", value: "16GB DDR5-5200" },
      { label: "Storage", value: "512GB NVMe SSD" },
      WARRANTY,
    ],
  },

  /* ----------------------------- komponen: VGA ----------------------------- */
  {
    id: "asus-rog-strix-rtx-4070-super",
    name: "ASUS ROG Strix GeForce RTX 4070 Super",
    brand: "ASUS",
    category: "komponen",
    price: 13499000,
    rating: 4.9,
    reviews: 45,
    stock: "in",
    image: u(IMG.gpuNvidia),
    gallery: gal(
      u(IMG.gpuNvidia),
      KOMPONEN_POOL.map((p) => u(p)),
    ),
    tags: ["RTX 4070 Super", "12GB GDDR6X", "Triple Fan"],
    description:
      "GPU flagship kelas menengah dengan cooling ROG Strix triple-fan — 1440p high refresh siap tanpa drama.",
    specs: [
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 Super" },
      { label: "Memori", value: "12GB GDDR6X 192-bit" },
      { label: "Clock", value: "2610 MHz (OC Mode)" },
      { label: "Pendingin", value: "Triple Axial-tech Fan" },
      WARRANTY,
    ],
  },
  {
    id: "gigabyte-rx-7800-xt",
    name: "GIGABYTE Radeon RX 7800 XT Gaming OC",
    brand: "GIGABYTE",
    category: "komponen",
    price: 9499000,
    oldPrice: 10499000,
    rating: 4.7,
    reviews: 52,
    stock: "in",
    image: u(IMG.pcCaseInterior),
    gallery: gal(
      u(IMG.pcCaseInterior),
      KOMPONEN_POOL.map((p) => u(p)),
    ),
    tags: ["RX 7800 XT", "16GB GDDR6", "1440p"],
    description:
      "16GB VRAM untuk 1440p maksimal. Pilihan value terbaik untuk build gaming kelas atas.",
    specs: [
      { label: "GPU", value: "AMD Radeon RX 7800 XT" },
      { label: "Memori", value: "16GB GDDR6 256-bit" },
      { label: "Pendingin", value: "WINDFORCE 3x Fan" },
      WARRANTY,
    ],
  },
  {
    id: "gigabyte-rtx-4060-eagle",
    name: "GIGABYTE GeForce RTX 4060 Eagle OC",
    brand: "GIGABYTE",
    category: "komponen",
    price: 5999000,
    rating: 4.6,
    reviews: 88,
    stock: "in",
    image: u(IMG.pcCaseFans),
    gallery: gal(
      u(IMG.pcCaseFans),
      KOMPONEN_POOL.map((p) => u(p)),
    ),
    tags: ["RTX 4060", "8GB GDDR6", "Efisien"],
    description:
      "GPU 1080p paling populer: efisien, dingin, dan mendukung DLSS 3 Frame Generation.",
    specs: [
      { label: "GPU", value: "NVIDIA GeForce RTX 4060" },
      { label: "Memori", value: "8GB GDDR6 128-bit" },
      { label: "Pendingin", value: "WINDFORCE Dual Fan" },
      WARRANTY,
    ],
  },

  /* --------------------------- komponen: processor ------------------------- */
  {
    id: "amd-ryzen-7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    category: "komponen",
    price: 5399000,
    rating: 4.9,
    reviews: 132,
    stock: "in",
    image: u(IMG.cpuChip),
    gallery: gal(
      u(IMG.cpuChip),
      KOMPONEN_POOL.map((p) => u(p)),
    ),
    tags: ["8C/16T", "3D V-Cache", "AM5"],
    description:
      "Raja gaming: 3D V-Cache membuat 7800X3D unggul di hampir semua game dibanding kompetitor di kelasnya.",
    specs: [
      { label: "Socket", value: "AMD AM5" },
      { label: "Core / Thread", value: "8 Core / 16 Thread" },
      { label: "Boost", value: "Hingga 5.0 GHz" },
      { label: "Cache", value: "96MB L3 (3D V-Cache)" },
      WARRANTY,
    ],
  },
  {
    id: "intel-core-i5-14600k",
    name: "Intel Core i5-14600K",
    brand: "Intel",
    category: "komponen",
    price: 4299000,
    rating: 4.8,
    reviews: 118,
    stock: "in",
    image: u(IMG.circuitMacro),
    gallery: gal(
      u(IMG.circuitMacro),
      KOMPONEN_POOL.map((p) => u(p)),
    ),
    tags: ["14C/20T", "LGA1700", "Gaming & Kerja"],
    description:
      "All-rounder 14 core: gaming, streaming, dan rendering sekaligus tanpa terengah-engah.",
    specs: [
      { label: "Socket", value: "Intel LGA1700" },
      { label: "Core / Thread", value: "14 Core (6P+8E) / 20 Thread" },
      { label: "Boost", value: "Hingga 5.3 GHz" },
      WARRANTY,
    ],
  },
  {
    id: "intel-core-i9-14900k",
    name: "Intel Core i9-14900K",
    brand: "Intel",
    category: "komponen",
    price: 9499000,
    oldPrice: 10999000,
    rating: 4.7,
    reviews: 64,
    stock: "low",
    image: u(IMG.wafer),
    gallery: gal(
      u(IMG.wafer),
      KOMPONEN_POOL.map((p) => u(p)),
    ),
    tags: ["24C/32T", "Halo Flagship", "LGA1700"],
    description:
      "Flagship 24 core untuk creator dan enthusiast yang butuh performa multi-thread maksimal.",
    specs: [
      { label: "Socket", value: "Intel LGA1700" },
      { label: "Core / Thread", value: "24 Core (8P+16E) / 32 Thread" },
      { label: "Boost", value: "Hingga 6.0 GHz" },
      WARRANTY,
    ],
  },

  /* --------------------------------- monitor ------------------------------- */
  {
    id: "lg-ultragear-27gp850",
    name: 'LG UltraGear 27" 27GP850-B',
    brand: "LG",
    category: "monitor",
    price: 5799000,
    rating: 4.8,
    reviews: 96,
    stock: "in",
    image: u(IMG.monitorRed),
    gallery: gal(
      u(IMG.monitorRed),
      MONITOR_POOL.map((p) => u(p)),
    ),
    tags: ['27" QHD', "165Hz", "Nano IPS"],
    description:
      "Nano IPS 165Hz dengan 1ms GtG — standar emas monitor gaming 1440p.",
    specs: [
      { label: "Panel", value: '27" QHD Nano IPS' },
      { label: "Refresh Rate", value: "165Hz (OC 180Hz)" },
      { label: "Respons", value: "1ms GtG" },
      { label: "Sinkronisasi", value: "G-SYNC Compatible + FreeSync" },
      WARRANTY,
    ],
  },
  {
    id: "msi-mag-274qrf-qd",
    name: "MSI MAG 274QRF QD E2",
    brand: "MSI",
    category: "monitor",
    price: 3799000,
    rating: 4.7,
    reviews: 143,
    stock: "in",
    image: u(IMG.monitorDark),
    gallery: gal(
      u(IMG.monitorDark),
      MONITOR_POOL.map((p) => u(p)),
    ),
    tags: ['27" QHD', "180Hz", "Quantum Dot"],
    description:
      "Quantum Dot 180Hz dengan cakupan warna lebar — gaming dan kerja desain dalam satu monitor.",
    specs: [
      { label: "Panel", value: '27" QHD Rapid IPS Quantum Dot' },
      { label: "Refresh Rate", value: "180Hz" },
      { label: "Warna", value: "97% DCI-P3" },
      WARRANTY,
    ],
  },
  {
    id: "lenovo-legion-y27q-30",
    name: "Lenovo Legion Y27q-30",
    brand: "Lenovo",
    category: "monitor",
    price: 4299000,
    rating: 4.6,
    reviews: 71,
    stock: "in",
    image: u(IMG.monitorDual),
    gallery: gal(
      u(IMG.monitorDual),
      MONITOR_POOL.map((p) => u(p)),
    ),
    tags: ['27" QHD', "180Hz", "HDR400"],
    description:
      "Legion Y27q-30 menawarkan 180Hz, HDR400, dan ergonomi lengkap dengan harga bersaing.",
    specs: [
      { label: "Panel", value: '27" QHD IPS' },
      { label: "Refresh Rate", value: "180Hz" },
      { label: "HDR", value: "DisplayHDR 400" },
      WARRANTY,
    ],
  },
  {
    id: "asus-rog-swift-pg27aqdm",
    name: "ASUS ROG Swift OLED PG27AQDM",
    brand: "ASUS",
    category: "monitor",
    price: 13999000,
    rating: 4.9,
    reviews: 29,
    stock: "low",
    image: u(IMG.monitorBlue),
    gallery: gal(
      u(IMG.monitorBlue),
      MONITOR_POOL.map((p) => u(p)),
    ),
    tags: ["QD-OLED", "240Hz", "0.03ms"],
    description:
      "QD-OLED 240Hz dengan respons 0.03ms — hitam sejati dan claritas warna untuk competitive gaming premium.",
    specs: [
      { label: "Panel", value: '27" QHD QD-OLED' },
      { label: "Refresh Rate", value: "240Hz" },
      { label: "Respons", value: "0.03ms GtG" },
      WARRANTY,
    ],
  },

  /* -------------------------------- periferal ------------------------------ */
  {
    id: "razer-blackwidow-v4-75",
    name: "Razer BlackWidow V4 75%",
    brand: "Razer",
    category: "periferal",
    price: 2199000,
    rating: 4.7,
    reviews: 84,
    stock: "in",
    image: u(IMG.keyboardRed),
    gallery: gal(
      u(IMG.keyboardRed),
      PERIFERAL_POOL.map((p) => u(p)),
    ),
    tags: ["75%", "Hot-swappable", "Razer Green"],
    description:
      "Keyboard mekanis 75% dengan gasket mount, hot-swappable, dan roda komando untuk macro.",
    specs: [
      { label: "Switch", value: "Razer Green (hot-swappable)" },
      { label: "Layout", value: "75% Compact" },
      { label: "Konektivitas", value: "Wired USB-C" },
      WARRANTY,
    ],
  },
  {
    id: "logitech-g-pro-x-tkl",
    name: "Logitech G Pro X TKL",
    brand: "Logitech G",
    category: "periferal",
    price: 2899000,
    rating: 4.6,
    reviews: 57,
    stock: "in",
    image: u(IMG.keyboardOrange),
    gallery: gal(
      u(IMG.keyboardOrange),
      PERIFERAL_POOL.map((p) => u(p)),
    ),
    tags: ["TKL", "GX Red Linear", "Esports"],
    description:
      "Keyboard standar esports: tenkeyless, keycaps PBT, dan switch GX yang smooth dan presisi.",
    specs: [
      { label: "Switch", value: "GX Red Linear" },
      { label: "Layout", value: "Tenkeyless (TKL)" },
      { label: "Keycaps", value: "PBT Double-shot" },
      WARRANTY,
    ],
  },
  {
    id: "logitech-g-pro-x-superlight-2",
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech G",
    category: "periferal",
    price: 2399000,
    rating: 4.9,
    reviews: 156,
    stock: "in",
    image: u(IMG.mouseRed),
    gallery: gal(
      u(IMG.mouseRed),
      PERIFERAL_POOL.map((p) => u(p)),
    ),
    tags: ["60g", "HERO 2", "Wireless"],
    description:
      "Mouse wireless 60 gram favorit pemain pro — sensor HERO 2 dan polling rate 2K Hz.",
    specs: [
      { label: "Sensor", value: "HERO 2, 32K DPI" },
      { label: "Bobot", value: "60 gram" },
      { label: "Konektivitas", value: "LIGHTSPEED Wireless" },
      WARRANTY,
    ],
  },
  {
    id: "hyperx-cloud-iii",
    name: "HyperX Cloud III",
    brand: "HyperX",
    category: "periferal",
    price: 1699000,
    oldPrice: 1899000,
    rating: 4.8,
    reviews: 203,
    stock: "in",
    image: u(IMG.headsetRed),
    gallery: gal(
      u(IMG.headsetRed),
      PERIFERAL_POOL.map((p) => u(p)),
    ),
    tags: ["Surround 7.1", "Nyaman", "DTS"],
    description:
      "Headset gaming legendaris generasi baru: bantalan memory foam, driver 53mm, dan DTS Spatial Audio.",
    specs: [
      { label: "Driver", value: "53mm, neodymium" },
      { label: "Audio", value: "DTS Headphone:X Spatial" },
      { label: "Konektivitas", value: "USB / 3.5mm" },
      WARRANTY,
    ],
  },
];

/* --------------------------------- helpers -------------------------------- */

export const LAPTOPS = PRODUCTS.filter((p) => p.category === "laptop" && p.spk);

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export const FEATURED_IDS = [
  "asus-rog-strix-g16",
  "lenovo-legion-pro-5",
  "asus-proart-studiobook-16",
  "msi-katana-15",
  "msi-aegis-r2",
  "asus-rog-strix-rtx-4070-super",
  "amd-ryzen-7-7800x3d",
  "logitech-g-pro-x-tkl",
  "lg-ultragear-27gp850",
];

export const BRANDS = [
  "ASUS ROG",
  "MSI",
  "LENOVO LEGION",
  "ACER PREDATOR",
  "HP OMEN",
  "RAZER",
  "LOGITECH G",
  "NVIDIA",
  "AMD",
  "HYPERX",
];

export const STOCK_LABEL: Record<StockStatus, string> = {
  in: "Stok Tersedia",
  low: "Stok Terbatas",
  out: "Stok Habis",
};
