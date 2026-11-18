// Density and composition audit of the generated world (sections 4, 5.3, 5.4 and 5.4.1 of the
// brief). Everything is counted once, by the centre of the object projected on the spline, in
// consecutive non-overlapping 100 m windows measured from the entry of each zone (props: from the
// start line). Runs in Node (npm run validate / verify) and in the browser (scene audit).

const WINDOW = 100;

function windowsOf(length) {
  const out = []; for (let a = 0; a < length - 1e-6; a += WINDOW) { const b = Math.min(length, a + WINDOW); out.push({ from: +a.toFixed(1), to: +b.toFixed(1), length: +(b - a).toFixed(1), complete: b - a >= WINDOW - 1e-6 }); } return out;
}

export function auditWorld(world) {
  const track = world.track, sp = track.spline, objs = world.objects, L = sp.length; const V = world.lists.village || { units: [], streets: [] };
  const res = { pass: true, failures: [] };
  const fail = (msg) => { res.pass = false; res.failures.push(msg); };
  const idx = (s) => Math.floor(sp.wrapS(s) / sp.ds) % sp.n;

  // ---- zones: order, length, climb of the cliff road
  res.zones = track.zones.map((z) => {
    let lo = 1e9, hi = -1e9; for (let o = 0; o <= z.length; o += 2) { const y = sp.y[idx(z.from + o)]; if (y < lo) lo = y; if (y > hi) hi = y; }
    return { id: z.id, name: z.name, from: +z.from.toFixed(1), length: +z.length.toFixed(1), minY: +lo.toFixed(1), maxY: +hi.toFixed(1) };
  });
  { const z = track.zones[1]; const y0 = sp.y[idx(z.from)], y1 = Math.max(...res.zones.filter((q) => q.id === z.id).map((q) => q.maxY)); res.cliffClimb = +(y1 - y0).toFixed(1);
    if (res.cliffClimb < 40) fail(`Z2 climbs ${res.cliffClimb} m (minimum 40)`);
    const curves = (world.json.segments || []).filter((sg) => { const m = sp.wrapS((sg.from + (sg.to < sg.from ? sg.to + L : sg.to)) / 2); return track.zoneIndexAt(m) === 1 && Math.abs(sp.kappa[idx(m)]) > 1 / 200; }).length;
    res.cliffCurves = curves; if (curves < 3) fail(`Z2 has ${curves} curves (minimum 3)`); }

  // ---- props per 100 m of track (whole lap, from the start line)
  { const wins = windowsOf(L); for (const w of wins) w.props = 0;
    for (const o of objs) if (o.kind === 'prop') { const w = wins[Math.min(wins.length - 1, Math.floor(sp.wrapS(o.s) / WINDOW))]; w.props++; }
    for (const w of wins) { w.need = Math.ceil(12 * w.length / WINDOW); w.pass = w.props >= w.need; if (!w.pass) fail(`props: ${w.props} in window ${w.from}-${w.to} m (minimum ${w.need})`); }
    res.props = { total: objs.filter((o) => o.kind === 'prop').length, min: Math.min(...wins.filter((w) => w.complete).map((w) => w.props)), windows: wins }; }

  // ---- village (Z3)
  { const z = track.zones[2]; const units = V.units.filter((u) => u.unit); const near = units.filter((u) => u.clear <= 30);
    const wins = windowsOf(z.length); for (const w of wins) { w.units = 0; w.fronts = 0; }
    for (const u of near) { if (u.zone !== 2) continue; const off = track.zoneOffset(2, u.s); const w = wins[Math.min(wins.length - 1, Math.floor(off / WINDOW))]; w.units++; if (u.front) w.fronts++; }
    for (const w of wins) { w.need = w.complete ? 12 : 0; w.pass = w.fronts >= w.need; if (!w.pass) fail(`village: ${w.fronts} street fronts in window ${w.from}-${w.to} m of Z3 (minimum 12)`); }
    const variations = [...new Set(units.map((u) => u.archetype))]; const colours = new Set(units.map((u) => u.spec && u.spec.wall));
    const floors = units.filter((u) => u.archetype !== 'church').map((u) => u.floors);
    res.village = {
      streetLength: +z.length.toFixed(1), units: units.length, unitsWithin30m: near.length, fronts: near.filter((u) => u.front).length,
      variations, wallColours: colours.size, floorsMin: Math.min(...floors), floorsMax: Math.max(...floors),
      sideStreets: V.streets.length, sideStreetUnits: V.streets.map((s) => s.units), plaza: !!V.plaza, landmark: V.church ? 'church with bell tower' : null,
      withBalcony: units.filter((u) => u.spec && u.spec.feat && u.spec.feat.balcony).length, withAwning: units.filter((u) => u.spec && u.spec.feat && u.spec.feat.awning).length,
      withFlowerBoxes: units.filter((u) => u.spec && u.spec.feat && u.spec.feat.flowerbox).length, withChimney: units.filter((u) => u.spec && u.spec.feat && u.spec.feat.chimney).length,
      frontGardens: units.filter((u) => u.garden).length, windows: wins,
    };
    if (z.length < 400) fail(`village street is ${z.length.toFixed(0)} m long (minimum 400)`);
    if (near.length < 60) fail(`village: ${near.length} units within 30 m (minimum 60)`);
    if (variations.length < 5) fail(`village: ${variations.length} architectural variations (minimum 5)`);
    if (V.streets.length < 2) fail('village: fewer than 2 side streets');
    if (!V.plaza) fail('village: no square'); if (!V.church) fail('village: no landmark');
    for (const u of units) { if (u.archetype === 'church') continue; const f = u.spec.feat; if (!(f.balcony || f.awning || f.flowerbox || f.chimney)) fail(`village unit ${u.id} has neither balcony, awning, flower box nor chimney`); if (u.floors < 2 || u.floors > 3) fail(`village unit ${u.id} has ${u.floors} floors`); } }

  // ---- wood (Z4): trees / shrub masses / ground cover within 40 m, quotas scaled by the plantable length
  { const z = track.zones[3]; const wins = windowsOf(z.length);
    for (const w of wins) {
      let plant = 0; for (let o = w.from; o < w.to - 1e-6; o += 1) { const i = idx(z.from + o + 0.5); if (!track.bridge[i]) plant += Math.min(1, w.to - o); }
      w.L = +Math.min(WINDOW, plant).toFixed(1); w.f = +(w.L / WINDOW).toFixed(3); w.trees = 0; w.shrubs = 0; w.ground = 0; w.species = {};
      w.need = { trees: Math.ceil(16 * w.f), shrubs: Math.ceil(10 * w.f), ground: Math.ceil(12 * w.f) };
    }
    for (const o of objs) {
      if (o.zone !== 3 || o.clear > 40) continue; const k = o.kind === 'tree' ? 'trees' : o.kind === 'shrub' ? 'shrubs' : o.kind === 'ground' ? 'ground' : null; if (!k) continue;
      const w = wins[Math.min(wins.length - 1, Math.floor(track.zoneOffset(3, o.s) / WINDOW))]; w[k]++; if (o.kind === 'tree') w.species[o.type] = (w.species[o.type] || 0) + 1;
    }
    for (const w of wins) { w.pass = w.trees >= w.need.trees && w.shrubs >= w.need.shrubs && w.ground >= w.need.ground; if (!w.pass && w.complete) fail(`wood: window ${w.from}-${w.to} m of Z4 has ${w.trees} trees / ${w.shrubs} shrubs / ${w.ground} ground cover (needs ${w.need.trees} / ${w.need.shrubs} / ${w.need.ground}, L = ${w.L} m)`); }
    const species = {}; for (const o of objs) if (o.kind === 'tree') species[o.type] = (species[o.type] || 0) + 1;
    res.wood = { length: +z.length.toFixed(1), windows: wins, bridge: world.json.bridge ? { from: world.json.bridge.from, to: world.json.bridge.to, length: +(world.json.bridge.to - world.json.bridge.from).toFixed(1) } : null };
    res.flora = { treeSpecies: species, shrubTypes: [...new Set(objs.filter((o) => o.kind === 'shrub').map((o) => o.type))], groundTypes: [...new Set(objs.filter((o) => o.kind === 'ground').map((o) => o.type))] };
    if (Object.keys(species).length < 4) fail(`only ${Object.keys(species).length} tree species (minimum 4)`); }

  res.objects = objs.reduce((a, o) => { a[o.kind] = (a[o.kind] || 0) + 1; return a; }, {});
  return res;
}
