import { CATEGORIES, PARTS, PRESETS, findPart } from './catalog.js';
import { evaluateBuild, compatibleParts } from './engine.js';

const els = {
  categories: document.getElementById('categories'),
  preset: document.getElementById('preset'),
  reset: document.getElementById('reset'),
  hideIncompatible: document.getElementById('hide-incompatible'),
  total: document.getElementById('total'),
  wattage: document.getElementById('wattage'),
  recommended: document.getElementById('recommended'),
  status: document.getElementById('status'),
  issues: document.getElementById('issues'),
  partsList: document.getElementById('parts-list'),
  share: document.getElementById('share'),
  export: document.getElementById('export')
};

let selection = readSelectionFromUrl();

const money = (n) => '$' + n.toLocaleString('en-US');

function readSelectionFromUrl() {
  const params = new URLSearchParams(location.search);
  const result = {};
  for (const { id } of CATEGORIES) {
    const value = params.get(id);
    if (value && findPart(id, value)) result[id] = value;
  }
  return result;
}

function writeSelectionToUrl() {
  const params = new URLSearchParams();
  for (const { id } of CATEGORIES) if (selection[id]) params.set(id, selection[id]);
  const query = params.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

function buildPresetOptions() {
  for (const [key, preset] of Object.entries(PRESETS)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = preset.label;
    els.preset.append(opt);
  }
}

function buildRows() {
  els.categories.innerHTML = '';
  for (const cat of CATEGORIES) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.category = cat.id;

    const label = document.createElement('div');
    label.className = 'label';
    label.innerHTML = `${cat.label}<small>${cat.required ? 'Required' : 'Optional'}</small>`;

    const select = document.createElement('select');
    select.dataset.category = cat.id;
    select.setAttribute('aria-label', cat.label);
    select.addEventListener('change', () => {
      if (select.value) selection[cat.id] = select.value;
      else delete selection[cat.id];
      els.preset.value = '';
      render();
    });

    const price = document.createElement('div');
    price.className = 'price';

    row.append(label, select, price);
    els.categories.append(row);
  }
}

function render() {
  const build = evaluateBuild(selection);
  const hideIncompatible = els.hideIncompatible.checked;

  for (const cat of CATEGORIES) {
    const row = els.categories.querySelector(`.row[data-category="${cat.id}"]`);
    const select = row.querySelector('select');
    const allowed = hideIncompatible ? compatibleParts(cat.id, selection) : PARTS[cat.id];
    const allowedIds = new Set(allowed.map((p) => p.id));

    select.innerHTML = '';
    const none = document.createElement('option');
    none.value = '';
    none.textContent = cat.required ? '— choose —' : '— none (skip) —';
    select.append(none);

    for (const part of PARTS[cat.id]) {
      const compatible = allowedIds.has(part.id);
      if (!compatible && hideIncompatible && selection[cat.id] !== part.id) continue;
      const opt = document.createElement('option');
      opt.value = part.id;
      opt.textContent = `${part.name} — ${money(part.price)}${compatible ? '' : ' (incompatible)'}`;
      opt.disabled = !compatible && selection[cat.id] !== part.id;
      select.append(opt);
    }
    select.value = selection[cat.id] || '';

    const chosen = build.parts[cat.id];
    row.querySelector('.price').textContent = chosen ? money(chosen.price) : '';
    row.classList.toggle('has-error', build.issues.some((i) => i.level === 'error' && i.category === cat.id));
  }

  els.total.textContent = money(build.total);
  els.wattage.textContent = `${build.wattage} W`;
  els.recommended.textContent = `${build.recommendedPsu} W`;

  const errors = build.issues.filter((i) => i.level === 'error').length;
  if (errors) {
    els.status.className = 'status err';
    els.status.textContent = `${errors} compatibility ${errors === 1 ? 'problem' : 'problems'}`;
  } else if (!build.complete) {
    els.status.className = 'status pending';
    els.status.textContent = 'Build incomplete.';
  } else {
    els.status.className = 'status ok';
    els.status.textContent = 'All components are compatible.';
  }

  els.issues.innerHTML = '';
  for (const issue of build.issues) {
    const li = document.createElement('li');
    li.className = issue.level;
    li.textContent = issue.message;
    els.issues.append(li);
  }

  els.partsList.innerHTML = '';
  for (const cat of CATEGORIES) {
    const part = build.parts[cat.id];
    const li = document.createElement('li');
    if (!part) li.className = 'empty';
    li.innerHTML = `<span class="name">${part ? part.name : `No ${cat.label.toLowerCase()}`}</span>` +
      `<span class="cost">${part ? money(part.price) : '—'}</span>`;
    els.partsList.append(li);
  }

  writeSelectionToUrl();
}

els.preset.addEventListener('change', () => {
  const preset = PRESETS[els.preset.value];
  selection = preset ? { ...preset.parts } : {};
  render();
});

els.reset.addEventListener('click', () => {
  selection = {};
  els.preset.value = '';
  render();
});

els.hideIncompatible.addEventListener('change', render);

els.share.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    flash(els.share, 'Copied!');
  } catch {
    flash(els.share, 'Copy failed');
  }
});

els.export.addEventListener('click', () => {
  const build = evaluateBuild(selection);
  const payload = {
    total: build.total,
    estimatedWatts: build.wattage,
    recommendedPsuWatts: build.recommendedPsu,
    valid: build.valid,
    parts: Object.fromEntries(
      Object.entries(build.parts).filter(([, p]) => p).map(([k, p]) => [k, { name: p.name, price: p.price }])
    ),
    issues: build.issues
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'build.json';
  a.click();
  URL.revokeObjectURL(url);
});

function flash(button, text) {
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => { button.textContent = original; }, 1200);
}

buildPresetOptions();
buildRows();
render();
