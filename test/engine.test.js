import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS } from '../src/catalog.js';
import { evaluateBuild, compatibleParts, recommendPsuWatts, estimateWattage } from '../src/engine.js';

const errors = (sel) => evaluateBuild(sel).issues.filter((i) => i.level === 'error');
const warnings = (sel) => evaluateBuild(sel).issues.filter((i) => i.level === 'warning');

test('every preset is a valid, complete build', () => {
  for (const [key, preset] of Object.entries(PRESETS)) {
    const build = evaluateBuild(preset.parts);
    assert.equal(build.complete, true, `${key} is incomplete`);
    assert.deepEqual(
      build.issues.filter((i) => i.level === 'error').map((i) => i.message),
      [],
      `${key} has errors`
    );
  }
});

test('mismatched CPU socket and motherboard is an error', () => {
  const found = errors({ cpu: 'cpu-i5-14600k', motherboard: 'mb-b650-atx' });
  assert.ok(found.some((e) => /socket AM5/.test(e.message)));
});

test('cooler must support the CPU socket', () => {
  const found = errors({ cpu: 'cpu-i9-14900k', cooler: 'cool-nhl9' });
  assert.ok(found.some((e) => e.category === 'cooler' && /does not support/.test(e.message)));
});

test('undersized cooler warns about throttling', () => {
  const found = warnings({ cpu: 'cpu-r9-7950x', cooler: 'cool-stock' });
  assert.ok(found.some((e) => /thermal throttling/i.test(e.message)));
});

test('DDR4 memory in a DDR5 board is an error', () => {
  const found = errors({ motherboard: 'mb-b650-atx', memory: 'mem-ddr4-16' });
  assert.ok(found.some((e) => e.category === 'memory'));
});

test('four-module kit does not fit a two-slot ITX board', () => {
  const found = errors({ motherboard: 'mb-b650-itx', memory: 'mem-ddr5-64' });
  assert.ok(found.some((e) => /slots/.test(e.message)));
});

test('ATX board does not fit a Mini-ITX case', () => {
  const found = errors({ motherboard: 'mb-b650-atx', case: 'case-nr200' });
  assert.ok(found.some((e) => e.category === 'case'));
});

test('ATX PSU rejected by an SFX-only case', () => {
  const found = errors({ case: 'case-nr200', psu: 'psu-850' });
  assert.ok(found.some((e) => e.category === 'psu' && /SFX/.test(e.message)));
});

test('oversized GPU rejected by a small case', () => {
  const found = errors({ case: 'case-a4h20', gpu: 'gpu-rtx4090' });
  assert.ok(found.some((e) => e.category === 'gpu'));
});

test('tall air cooler rejected by a low-profile case', () => {
  const found = errors({ cooler: 'cool-nhd15', case: 'case-a4h20' });
  assert.ok(found.some((e) => /tall/.test(e.message)));
});

test('360mm radiator rejected by a 280mm case', () => {
  const found = errors({ cooler: 'cool-aio360', case: 'case-h510' });
  assert.ok(found.some((e) => /radiators up to/.test(e.message)));
});

test('CPU without integrated graphics requires a GPU', () => {
  const found = errors({ cpu: 'cpu-r5-5600' });
  assert.ok(found.some((e) => e.category === 'gpu'));
  assert.equal(errors({ cpu: 'cpu-r5-5600', gpu: 'gpu-rx7600' }).length, 0);
});

test('undersized PSU is an error, tight PSU is a warning', () => {
  const heavy = { cpu: 'cpu-i9-14900k', motherboard: 'mb-z790-atx', memory: 'mem-ddr5-32', gpu: 'gpu-rtx4090', storage: 'ssd-990-2t' };
  assert.ok(errors({ ...heavy, psu: 'psu-650' }).some((e) => e.category === 'psu'));
  assert.ok(warnings({ ...heavy, psu: 'psu-850' }).some((e) => e.category === 'psu'));
  assert.equal(errors({ ...heavy, psu: 'psu-1200' }).length, 0);
});

test('wattage estimate sums component draw plus base overhead', () => {
  const build = evaluateBuild({ cpu: 'cpu-r5-7600', motherboard: 'mb-b650-atx', memory: 'mem-ddr5-32', gpu: 'gpu-rtx4060', storage: 'ssd-sn770-1t' });
  // 30 base + 105 cpu + 40 board + 12 mem + 115 gpu + 7 ssd
  assert.equal(build.wattage, 309);
  assert.equal(estimateWattage(build.parts), 309);
});

test('recommended PSU rounds up to the next standard size', () => {
  assert.equal(recommendPsuWatts(300), 450);
  assert.equal(recommendPsuWatts(500), 650);
  assert.equal(recommendPsuWatts(700), 1000);
});

test('total price is the sum of selected parts', () => {
  const build = evaluateBuild(PRESETS.budget.parts);
  assert.equal(build.total, 129 + 39 + 109 + 39 + 259 + 69 + 89 + 89);
});

test('incomplete builds are not valid', () => {
  assert.equal(evaluateBuild({ cpu: 'cpu-r5-7600' }).valid, false);
  assert.equal(evaluateBuild(PRESETS.gaming.parts).valid, true);
});

test('compatibleParts filters to options that fit the build', () => {
  const cases = compatibleParts('case', { motherboard: 'mb-b650-atx' }).map((p) => p.id);
  assert.ok(cases.includes('case-4000d'));
  assert.ok(!cases.includes('case-nr200'));

  const boards = compatibleParts('motherboard', { cpu: 'cpu-i5-14600k' }).map((p) => p.id);
  assert.ok(boards.every((id) => id.startsWith('mb-b760') || id === 'mb-z790-atx'));
});

test('compatibleParts ignores the currently selected part in that category', () => {
  const sel = { cpu: 'cpu-i5-14600k', motherboard: 'mb-b650-atx' };
  const cpus = compatibleParts('cpu', sel).map((p) => p.id);
  assert.ok(cpus.includes('cpu-r5-7600'), 'AM5 CPUs should be offered for an AM5 board');
  assert.ok(!cpus.includes('cpu-i9-14900k'));
});

test('unknown part ids are ignored rather than throwing', () => {
  const build = evaluateBuild({ cpu: 'nope', gpu: 'also-nope' });
  assert.equal(build.parts.cpu, null);
  assert.equal(build.total, 0);
});
