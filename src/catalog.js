// Parts catalog. Prices in USD. Wattage figures are typical peak draw.

export const CATEGORIES = [
  { id: 'cpu', label: 'Processor', required: true },
  { id: 'cooler', label: 'CPU Cooler', required: true },
  { id: 'motherboard', label: 'Motherboard', required: true },
  { id: 'memory', label: 'Memory', required: true },
  { id: 'gpu', label: 'Graphics Card', required: false },
  { id: 'storage', label: 'Storage', required: true },
  { id: 'psu', label: 'Power Supply', required: true },
  { id: 'case', label: 'Case', required: true }
];

export const PARTS = {
  cpu: [
    { id: 'cpu-r5-7600', name: 'AMD Ryzen 5 7600', price: 199, socket: 'AM5', tdp: 105, cores: 6, integratedGraphics: true, memoryType: 'DDR5', maxMemorySpeed: 5200 },
    { id: 'cpu-r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', price: 359, socket: 'AM5', tdp: 120, cores: 8, integratedGraphics: true, memoryType: 'DDR5', maxMemorySpeed: 5200 },
    { id: 'cpu-r9-7950x', name: 'AMD Ryzen 9 7950X', price: 549, socket: 'AM5', tdp: 230, cores: 16, integratedGraphics: true, memoryType: 'DDR5', maxMemorySpeed: 5200 },
    { id: 'cpu-r5-5600', name: 'AMD Ryzen 5 5600', price: 129, socket: 'AM4', tdp: 88, cores: 6, integratedGraphics: false, memoryType: 'DDR4', maxMemorySpeed: 3200 },
    { id: 'cpu-i5-14600k', name: 'Intel Core i5-14600K', price: 289, socket: 'LGA1700', tdp: 181, cores: 14, integratedGraphics: true, memoryType: 'DDR5', maxMemorySpeed: 5600 },
    { id: 'cpu-i7-14700k', name: 'Intel Core i7-14700K', price: 399, socket: 'LGA1700', tdp: 253, cores: 20, integratedGraphics: true, memoryType: 'DDR5', maxMemorySpeed: 5600 },
    { id: 'cpu-i9-14900k', name: 'Intel Core i9-14900K', price: 579, socket: 'LGA1700', tdp: 253, cores: 24, integratedGraphics: true, memoryType: 'DDR5', maxMemorySpeed: 5600 }
  ],
  cooler: [
    { id: 'cool-stock', name: 'Stock Air Cooler', price: 0, sockets: ['AM4', 'AM5', 'LGA1700'], tdpRating: 95, heightMm: 70, radiatorMm: 0 },
    { id: 'cool-pa120', name: 'Thermalright Peerless Assassin 120', price: 39, sockets: ['AM4', 'AM5', 'LGA1700'], tdpRating: 220, heightMm: 155, radiatorMm: 0 },
    { id: 'cool-nhd15', name: 'Noctua NH-D15', price: 109, sockets: ['AM4', 'AM5', 'LGA1700'], tdpRating: 250, heightMm: 165, radiatorMm: 0 },
    { id: 'cool-nhl9', name: 'Noctua NH-L9a Low Profile', price: 55, sockets: ['AM4', 'AM5'], tdpRating: 95, heightMm: 37, radiatorMm: 0 },
    { id: 'cool-aio240', name: 'Corsair H100i 240mm AIO', price: 129, sockets: ['AM4', 'AM5', 'LGA1700'], tdpRating: 250, heightMm: 0, radiatorMm: 240 },
    { id: 'cool-aio360', name: 'Arctic Liquid Freezer III 360mm', price: 149, sockets: ['AM4', 'AM5', 'LGA1700'], tdpRating: 300, heightMm: 0, radiatorMm: 360 }
  ],
  motherboard: [
    { id: 'mb-b650-atx', name: 'MSI B650 Tomahawk (ATX)', price: 219, socket: 'AM5', memoryType: 'DDR5', memorySlots: 4, maxMemorySpeed: 6400, formFactor: 'ATX', m2Slots: 2, sataPorts: 6, pcieX16: 1, wattage: 40 },
    { id: 'mb-b650-itx', name: 'Gigabyte B650I AX (Mini-ITX)', price: 229, socket: 'AM5', memoryType: 'DDR5', memorySlots: 2, maxMemorySpeed: 6400, formFactor: 'Mini-ITX', m2Slots: 2, sataPorts: 4, pcieX16: 1, wattage: 35 },
    { id: 'mb-x670e-atx', name: 'ASUS ROG X670E-E (ATX)', price: 439, socket: 'AM5', memoryType: 'DDR5', memorySlots: 4, maxMemorySpeed: 6600, formFactor: 'ATX', m2Slots: 4, sataPorts: 6, pcieX16: 2, wattage: 50 },
    { id: 'mb-b550-matx', name: 'ASRock B550M Pro4 (Micro-ATX)', price: 109, socket: 'AM4', memoryType: 'DDR4', memorySlots: 4, maxMemorySpeed: 4400, formFactor: 'Micro-ATX', m2Slots: 2, sataPorts: 6, pcieX16: 1, wattage: 35 },
    { id: 'mb-b760-ddr5', name: 'MSI B760 Gaming Plus DDR5 (ATX)', price: 179, socket: 'LGA1700', memoryType: 'DDR5', memorySlots: 4, maxMemorySpeed: 6800, formFactor: 'ATX', m2Slots: 3, sataPorts: 4, pcieX16: 1, wattage: 40 },
    { id: 'mb-z790-atx', name: 'ASUS ROG Strix Z790-A (ATX)', price: 379, socket: 'LGA1700', memoryType: 'DDR5', memorySlots: 4, maxMemorySpeed: 7800, formFactor: 'ATX', m2Slots: 4, sataPorts: 6, pcieX16: 2, wattage: 50 },
    { id: 'mb-b760-itx', name: 'ASRock B760I Lightning (Mini-ITX)', price: 199, socket: 'LGA1700', memoryType: 'DDR5', memorySlots: 2, maxMemorySpeed: 6800, formFactor: 'Mini-ITX', m2Slots: 2, sataPorts: 4, pcieX16: 1, wattage: 35 }
  ],
  memory: [
    { id: 'mem-ddr4-16', name: 'Corsair Vengeance 16GB (2x8) DDR4-3200', price: 39, memoryType: 'DDR4', modules: 2, capacityGb: 16, speed: 3200, wattage: 8 },
    { id: 'mem-ddr4-32', name: 'Corsair Vengeance 32GB (2x16) DDR4-3600', price: 69, memoryType: 'DDR4', modules: 2, capacityGb: 32, speed: 3600, wattage: 10 },
    { id: 'mem-ddr5-16', name: 'Kingston Fury 16GB (2x8) DDR5-5600', price: 59, memoryType: 'DDR5', modules: 2, capacityGb: 16, speed: 5600, wattage: 10 },
    { id: 'mem-ddr5-32', name: 'G.Skill Trident Z5 32GB (2x16) DDR5-6000', price: 109, memoryType: 'DDR5', modules: 2, capacityGb: 32, speed: 6000, wattage: 12 },
    { id: 'mem-ddr5-64', name: 'G.Skill Ripjaws S5 64GB (4x16) DDR5-6000', price: 209, memoryType: 'DDR5', modules: 4, capacityGb: 64, speed: 6000, wattage: 20 },
    { id: 'mem-ddr5-96', name: 'Corsair Dominator 96GB (2x48) DDR5-6600', price: 379, memoryType: 'DDR5', modules: 2, capacityGb: 96, speed: 6600, wattage: 16 }
  ],
  gpu: [
    { id: 'gpu-rtx4060', name: 'NVIDIA RTX 4060 8GB', price: 299, wattage: 115, lengthMm: 245, slots: 2, recommendedPsu: 450 },
    { id: 'gpu-rtx4070s', name: 'NVIDIA RTX 4070 SUPER 12GB', price: 599, wattage: 220, lengthMm: 285, slots: 2, recommendedPsu: 650 },
    { id: 'gpu-rtx4080s', name: 'NVIDIA RTX 4080 SUPER 16GB', price: 999, wattage: 320, lengthMm: 310, slots: 3, recommendedPsu: 750 },
    { id: 'gpu-rtx4090', name: 'NVIDIA RTX 4090 24GB', price: 1799, wattage: 450, lengthMm: 336, slots: 3, recommendedPsu: 850 },
    { id: 'gpu-rx7600', name: 'AMD Radeon RX 7600 8GB', price: 259, wattage: 165, lengthMm: 240, slots: 2, recommendedPsu: 450 },
    { id: 'gpu-rx7900xtx', name: 'AMD Radeon RX 7900 XTX 24GB', price: 949, wattage: 355, lengthMm: 287, slots: 3, recommendedPsu: 800 }
  ],
  storage: [
    { id: 'ssd-sn770-1t', name: 'WD Black SN770 1TB NVMe', price: 69, interface: 'M.2', capacityGb: 1000, wattage: 7 },
    { id: 'ssd-990-2t', name: 'Samsung 990 PRO 2TB NVMe', price: 169, interface: 'M.2', capacityGb: 2000, wattage: 9 },
    { id: 'ssd-990-4t', name: 'Samsung 990 PRO 4TB NVMe', price: 329, interface: 'M.2', capacityGb: 4000, wattage: 10 },
    { id: 'ssd-870-1t', name: 'Samsung 870 EVO 1TB SATA SSD', price: 79, interface: 'SATA', capacityGb: 1000, wattage: 4 },
    { id: 'hdd-4t', name: 'Seagate BarraCuda 4TB HDD', price: 89, interface: 'SATA', capacityGb: 4000, wattage: 9 }
  ],
  psu: [
    { id: 'psu-450', name: 'EVGA 450 BR 450W 80+ Bronze', price: 49, watts: 450, formFactor: 'ATX', efficiency: 'Bronze' },
    { id: 'psu-650', name: 'Corsair RM650e 650W 80+ Gold', price: 89, watts: 650, formFactor: 'ATX', efficiency: 'Gold' },
    { id: 'psu-850', name: 'Corsair RM850x 850W 80+ Gold', price: 139, watts: 850, formFactor: 'ATX', efficiency: 'Gold' },
    { id: 'psu-1000', name: 'Seasonic Vertex 1000W 80+ Platinum', price: 199, watts: 1000, formFactor: 'ATX', efficiency: 'Platinum' },
    { id: 'psu-1200', name: 'be quiet! Dark Power 13 1200W 80+ Titanium', price: 349, watts: 1200, formFactor: 'ATX', efficiency: 'Titanium' },
    { id: 'psu-sfx-750', name: 'Corsair SF750 750W SFX 80+ Platinum', price: 179, watts: 750, formFactor: 'SFX', efficiency: 'Platinum' }
  ],
  case: [
    { id: 'case-4000d', name: 'Corsair 4000D Airflow (Mid Tower)', price: 94, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 360, maxCoolerHeightMm: 170, radiatorSupportMm: 360, psuFormFactors: ['ATX'], expansionSlots: 7, m2Bays: 99, sataBays: 4 },
    { id: 'case-lancool3', name: 'Lian Li Lancool III (Full Tower)', price: 149, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 420, maxCoolerHeightMm: 180, radiatorSupportMm: 420, psuFormFactors: ['ATX'], expansionSlots: 8, m2Bays: 99, sataBays: 6 },
    { id: 'case-nr200', name: 'Cooler Master NR200P (Mini-ITX)', price: 109, formFactors: ['Mini-ITX'], maxGpuLengthMm: 330, maxCoolerHeightMm: 155, radiatorSupportMm: 280, psuFormFactors: ['SFX'], expansionSlots: 3, m2Bays: 99, sataBays: 2 },
    { id: 'case-a4h20', name: 'DAN Cases A4-H2O (Small Form Factor)', price: 219, formFactors: ['Mini-ITX'], maxGpuLengthMm: 322, maxCoolerHeightMm: 48, radiatorSupportMm: 120, psuFormFactors: ['SFX'], expansionSlots: 2, m2Bays: 99, sataBays: 1 },
    { id: 'case-h510', name: 'NZXT H5 Flow (Mid Tower)', price: 89, formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLengthMm: 365, maxCoolerHeightMm: 165, radiatorSupportMm: 280, psuFormFactors: ['ATX'], expansionSlots: 7, m2Bays: 99, sataBays: 2 }
  ]
};

export const PRESETS = {
  budget: {
    label: 'Budget Gaming',
    parts: { cpu: 'cpu-r5-5600', cooler: 'cool-pa120', motherboard: 'mb-b550-matx', memory: 'mem-ddr4-16', gpu: 'gpu-rx7600', storage: 'ssd-sn770-1t', psu: 'psu-650', case: 'case-h510' }
  },
  gaming: {
    label: 'High-End Gaming',
    parts: { cpu: 'cpu-r7-7800x3d', cooler: 'cool-aio240', motherboard: 'mb-b650-atx', memory: 'mem-ddr5-32', gpu: 'gpu-rtx4080s', storage: 'ssd-990-2t', psu: 'psu-850', case: 'case-4000d' }
  },
  workstation: {
    label: 'Workstation',
    parts: { cpu: 'cpu-i9-14900k', cooler: 'cool-aio360', motherboard: 'mb-z790-atx', memory: 'mem-ddr5-96', gpu: 'gpu-rtx4090', storage: 'ssd-990-4t', psu: 'psu-1200', case: 'case-lancool3' }
  },
  sff: {
    label: 'Small Form Factor',
    parts: { cpu: 'cpu-r5-7600', cooler: 'cool-nhl9', motherboard: 'mb-b650-itx', memory: 'mem-ddr5-32', gpu: 'gpu-rtx4060', storage: 'ssd-sn770-1t', psu: 'psu-sfx-750', case: 'case-nr200' }
  }
};

export function findPart(category, id) {
  if (!id) return null;
  return (PARTS[category] || []).find((p) => p.id === id) || null;
}
