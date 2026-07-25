import { CATEGORIES, PARTS, findPart } from './catalog.js';

const FORM_FACTOR_SIZE = { 'Mini-ITX': 1, 'Micro-ATX': 2, ATX: 3 };

/** Base draw for fans, board peripherals, etc. */
const BASE_SYSTEM_WATTS = 30;
/** Headroom multiplier applied to estimated load when recommending a PSU. */
export const PSU_HEADROOM = 1.3;

/**
 * @param {Record<string, string>} selection map of category id -> part id
 * @returns {{parts: Record<string, object|null>, total: number, wattage: number,
 *            recommendedPsu: number, issues: Array<{level: string, category: string, message: string}>,
 *            complete: boolean}}
 */
export function evaluateBuild(selection = {}) {
  const parts = {};
  for (const { id } of CATEGORIES) parts[id] = findPart(id, selection[id]);

  const issues = [];
  const err = (category, message) => issues.push({ level: 'error', category, message });
  const warn = (category, message) => issues.push({ level: 'warning', category, message });

  const { cpu, cooler, motherboard, memory, gpu, storage, psu } = parts;
  const pcCase = parts.case;

  // --- Missing required parts -------------------------------------------
  for (const cat of CATEGORIES) {
    if (cat.required && !parts[cat.id]) {
      issues.push({ level: 'info', category: cat.id, message: `Select a ${cat.label.toLowerCase()} to complete the build.` });
    }
  }

  // --- Socket ------------------------------------------------------------
  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    err('motherboard', `${motherboard.name} uses socket ${motherboard.socket}, but ${cpu.name} is ${cpu.socket}.`);
  }
  if (cpu && cooler && !cooler.sockets.includes(cpu.socket)) {
    err('cooler', `${cooler.name} does not support socket ${cpu.socket}.`);
  }
  if (cpu && cooler && cooler.tdpRating < cpu.tdp) {
    warn('cooler', `${cooler.name} is rated for ${cooler.tdpRating}W but ${cpu.name} can draw ${cpu.tdp}W. Expect thermal throttling.`);
  }

  // --- Memory ------------------------------------------------------------
  if (memory && motherboard && memory.memoryType !== motherboard.memoryType) {
    err('memory', `${memory.name} is ${memory.memoryType}; ${motherboard.name} accepts ${motherboard.memoryType}.`);
  }
  if (memory && cpu && memory.memoryType !== cpu.memoryType) {
    err('memory', `${cpu.name} requires ${cpu.memoryType} memory.`);
  }
  if (memory && motherboard && memory.modules > motherboard.memorySlots) {
    err('memory', `${memory.name} needs ${memory.modules} slots; ${motherboard.name} has ${motherboard.memorySlots}.`);
  }
  if (memory && motherboard && memory.speed > motherboard.maxMemorySpeed) {
    warn('memory', `${motherboard.name} officially supports up to DDR-${motherboard.maxMemorySpeed}; the kit will run below its rated ${memory.speed} MT/s.`);
  }
  if (memory && cpu && memory.speed > cpu.maxMemorySpeed) {
    warn('memory', `${cpu.name} is validated to DDR-${cpu.maxMemorySpeed}; DDR-${memory.speed} requires overclocking.`);
  }

  // --- Case fit ----------------------------------------------------------
  if (motherboard && pcCase && !pcCase.formFactors.includes(motherboard.formFactor)) {
    err('case', `${pcCase.name} does not fit a ${motherboard.formFactor} motherboard.`);
  }
  if (psu && pcCase && !pcCase.psuFormFactors.includes(psu.formFactor)) {
    err('psu', `${pcCase.name} requires a ${pcCase.psuFormFactors.join('/')} power supply; ${psu.name} is ${psu.formFactor}.`);
  }
  if (cooler && pcCase) {
    if (cooler.radiatorMm > 0) {
      if (cooler.radiatorMm > pcCase.radiatorSupportMm) {
        err('cooler', `${pcCase.name} supports radiators up to ${pcCase.radiatorSupportMm}mm; ${cooler.name} needs ${cooler.radiatorMm}mm.`);
      }
    } else if (cooler.heightMm > pcCase.maxCoolerHeightMm) {
      err('cooler', `${cooler.name} is ${cooler.heightMm}mm tall; ${pcCase.name} allows ${pcCase.maxCoolerHeightMm}mm.`);
    }
  }
  if (gpu && pcCase) {
    if (gpu.lengthMm > pcCase.maxGpuLengthMm) {
      err('gpu', `${gpu.name} is ${gpu.lengthMm}mm long; ${pcCase.name} allows ${pcCase.maxGpuLengthMm}mm.`);
    }
    if (gpu.slots > pcCase.expansionSlots) {
      err('gpu', `${gpu.name} occupies ${gpu.slots} expansion slots; ${pcCase.name} has ${pcCase.expansionSlots}.`);
    } else if (pcCase.maxGpuLengthMm - gpu.lengthMm < 15 && gpu.lengthMm <= pcCase.maxGpuLengthMm) {
      warn('gpu', `${gpu.name} leaves under 15mm of clearance in ${pcCase.name}. Cable routing will be tight.`);
    }
  }

  // --- Storage interface --------------------------------------------------
  if (storage && motherboard) {
    if (storage.interface === 'M.2' && motherboard.m2Slots < 1) {
      err('storage', `${motherboard.name} has no M.2 slot.`);
    }
    if (storage.interface === 'SATA' && motherboard.sataPorts < 1) {
      err('storage', `${motherboard.name} has no SATA ports.`);
    }
  }

  // --- Graphics -----------------------------------------------------------
  if (cpu && !gpu && !cpu.integratedGraphics) {
    err('gpu', `${cpu.name} has no integrated graphics — a graphics card is required for video output.`);
  }

  // --- Power --------------------------------------------------------------
  const wattage = estimateWattage(parts);
  const recommendedPsu = recommendPsuWatts(wattage);
  if (psu) {
    if (psu.watts < wattage) {
      err('psu', `Estimated load is ${wattage}W but ${psu.name} delivers ${psu.watts}W.`);
    } else if (psu.watts < recommendedPsu) {
      warn('psu', `${psu.watts}W leaves little headroom. At least ${recommendedPsu}W is recommended for a ${wattage}W load.`);
    }
    if (gpu && psu.watts < gpu.recommendedPsu) {
      warn('psu', `${gpu.name} recommends a ${gpu.recommendedPsu}W supply.`);
    }
  }

  const total = Object.values(parts).reduce((sum, p) => sum + (p ? p.price : 0), 0);
  const complete = CATEGORIES.every((c) => !c.required || parts[c.id]);

  return {
    parts,
    total,
    wattage,
    recommendedPsu,
    issues,
    complete,
    valid: complete && !issues.some((i) => i.level === 'error')
  };
}

/** Estimated peak system draw in watts, excluding the PSU itself. */
export function estimateWattage(parts) {
  const add = (part, key = 'wattage') => (part && typeof part[key] === 'number' ? part[key] : 0);
  return (
    BASE_SYSTEM_WATTS +
    add(parts.cpu, 'tdp') +
    add(parts.motherboard) +
    add(parts.memory) +
    add(parts.gpu) +
    add(parts.storage)
  );
}

/** Rounds the headroom-adjusted load up to the next common PSU size. */
export function recommendPsuWatts(load) {
  const target = load * PSU_HEADROOM;
  const sizes = [450, 550, 650, 750, 850, 1000, 1200, 1600];
  return sizes.find((w) => w >= target) || sizes[sizes.length - 1];
}

/**
 * Parts of `category` that introduce no new errors given the rest of the build.
 * Used to grey out incompatible options in the UI.
 */
export function compatibleParts(category, selection) {
  const without = { ...selection };
  delete without[category];
  const baselineErrors = errorKeys(without);

  return PARTS[category].filter((part) => {
    const trial = { ...without, [category]: part.id };
    return errorKeys(trial).every((key) => baselineErrors.includes(key));
  });
}

function errorKeys(selection) {
  return evaluateBuild(selection)
    .issues.filter((i) => i.level === 'error')
    .map((i) => `${i.category}:${i.message}`);
}

export { CATEGORIES, PARTS, findPart };
