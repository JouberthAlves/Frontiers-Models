import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { clamp, mix } from './course.js';
import { VEHICLE } from './simulation.js';

export const MODELS = [
  { name: 'Veloce GT', family: 'Mid-engine GT', note: 'Low nose, long tail, close-ratio gearbox', weight: '1,240 kg' },
  { name: 'Nerita RS', family: 'Touring coupé', note: 'Upright cabin, compact tail, short gearing', weight: '1,320 kg' },
];
export const LIVERIES = [
  { name: 'Rosso Tramonto', paint: 0xb83220, accent: 0xf4b34c, number: '07' },
  { name: 'Azzurro Vetro', paint: 0x144895, accent: 0xb9ecff, number: '12' },
  { name: 'Verde Pino', paint: 0x306951, accent: 0xc9d75a, number: '24' },
  { name: 'Giallo Sole', paint: 0xd68b17, accent: 0x292a32, number: '31' },
  { name: 'Bianco Sale', paint: 0xc1cbca, accent: 0x184d65, number: '46' },
  { name: 'Viola Notte', paint: 0x62488d, accent: 0xf3b9d8, number: '83' },
];

const SHAPES = [
  [
    [-2.23,.79,.57,.61,.72],[-2.06,.885,.69,.64,.77],[-1.80,.955,.79,.65,.81],
    [-1.33,1.005,.854,.672,.853],[-.89,.95,.78,.67,.83],[-.56,.916,.748,.65,.817],
    [.19,.902,.744,.647,.800],[.88,.953,.772,.658,.797],[1.33,1.003,.856,.657,.788],
    [1.75,.966,.770,.615,.744],[2.05,.865,.689,.582,.693],[2.24,.738,.578,.521,.614],
  ],
  [
    [-2.14,.829,.663,.639,.788],[-1.97,.922,.747,.667,.845],[-1.76,.958,.817,.686,.870],
    [-1.33,.997,.886,.701,.898],[-.89,.924,.836,.69,.868],[-.56,.874,.815,.669,.852],
    [.24,.865,.826,.667,.857],[.882,.941,.858,.699,.871],[1.33,.995,.901,.700,.884],
    [1.76,.967,.860,.661,.858],[2.03,.903,.786,.609,.811],[2.18,.819,.741,.574,.757],
  ],
];

function section(stations, z) {
  const i = clamp(stations.findIndex(section => section[0] >= z) - 1, 0, stations.length - 2);
  const a = stations[i], b = stations[i + 1];
  const f = clamp((z - a[0]) / (b[0] - a[0]), 0, 1);
  return a.slice(1).map((value, index) => mix(value, b[index + 1], f));
}

function geometry(positions, uv, indices) {
  const buffer = new T.BufferGeometry();
  buffer.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  buffer.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  buffer.setIndex(indices);
  buffer.computeVertexNormals();
  return buffer;
}

function patch(stepsU, stepsV, point, flip = false) {
  const positions = [], uv = [], indices = [];
  for (let i = 0; i <= stepsU; i++) {
    for (let j = 0; j <= stepsV; j++) {
      positions.push(...point(i / stepsU, j / stepsV));
      uv.push(j / stepsV, i / stepsU);
      if (i === stepsU || j === stepsV) continue;
      const a = i * (stepsV + 1) + j, b = a + 1, c = a + stepsV + 1, d = c + 1;
      indices.push(...(flip ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
    }
  }
  return geometry(positions, uv, indices);
}

function panel(points, flip = false) {
  const triangle = [];
  for (let i = 1; i < points.length - 1; i++) triangle.push(...(flip ? [0, i + 1, i] : [0, i, i + 1]));
  return geometry(points.flat(), points.flatMap((_, i) => [i % 2, Number(i > 1)]), triangle);
}

function box(w, h, d, x, y, z) {
  return new T.BoxGeometry(w, h, d).translate(x, y, z);
}

function rod(a, b, r, r2 = r, sides = 9) {
  const p = new T.Vector3(...a), q = new T.Vector3(...b);
  const vector = q.clone().sub(p);
  const e = new T.Matrix4().compose(
    p.addScaledVector(vector, .5),
    new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), vector.clone().normalize()),
    new T.Vector3(1, 1, 1),
  );
  return new T.CylinderGeometry(r2, r, vector.length(), sides, 1, false).applyMatrix4(e);
}

class Parts {
  constructor() { this.groups = new Map(); }
  add(material, meshGeometry) {
    if (!this.groups.has(material)) this.groups.set(material, []);
    this.groups.get(material).push(meshGeometry.index ? meshGeometry : indexedTriangles(meshGeometry));
  }
  copyInto(group, shadows = true) {
    this.groups.forEach((geometries, mat) => {
      const result = mergeGeometries(geometries);
      if (!result) throw new Error('Incompatible car panels');
      const mesh = new T.Mesh(result, mat);
      mesh.name = mat.name;
      mesh.castShadow = shadows && !mat.transparent;
      mesh.receiveShadow = true;
      group.add(mesh);
      geometries.forEach(g => g.dispose());
    });
  }
}

function indexedTriangles(g) {
  g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
  return g;
}

const solid = (name, color, metalness = 0, roughness = .52, extra = {}) =>
  new T.MeshStandardMaterial({ name, color, metalness, roughness, side: T.DoubleSide, ...extra });

function markCarMaterials({ textureBank, model, livery }) {
  const color = LIVERIES[livery];
  const materials={
    paint: new T.MeshPhysicalMaterial({ name: 'Metallic clearcoat', color: color.paint, metalness: .57, roughness: .24, clearcoat: 1, clearcoatRoughness: .18, side: T.DoubleSide, envMapIntensity: .84 }),
    accent: solid('Livery accent', color.accent, .12, .36),
    trim: solid('Graphite aero trim', 0x20242a, .38, .45),
    dark: solid('Wheel wells and inlets', 0x0d1117, .09, .89),
    chrome: solid('Machined aluminum', model ? 0xabaeaf : 0xa6a5a3, .78, .28),
    disc: solid('Brake rotor', 0x525b65, .69, .51),
    bolt: solid('Fasteners', 0xd9d9d2, .75, .42),
    caliper: solid('Calipers', model ? 0xe8ba47 : 0xca3c25, .18, .51),
    rubber: textureBank.surface('rubber', { name: 'Profiled tire rubber', color: 0x53595e, roughness: .93, side: T.DoubleSide, normalScale: new T.Vector2(.46, .46) }),
    tread: textureBank.surface('tread', { name: 'Tire tread relief', color: 0x4b5258, roughness: .93, side: T.DoubleSide, normalScale: new T.Vector2(.60, .60) }),
    suede: textureBank.surface('suede', { name: 'Cockpit suede', color: 0x747d85, roughness: .92, side: T.DoubleSide, normalScale: new T.Vector2(.72, .72) }),
    glass: new T.MeshPhysicalMaterial({ name: 'Tinted reflective glazing', color: 0x76a4b6, metalness: .11, roughness: .11, clearcoat: .9, clearcoatRoughness: .09, transparent: true, opacity: .34, depthWrite: false, side: T.DoubleSide, envMapIntensity: .85 }),
    visor: solid('Lamp housing', 0x131a23, .31, .33),
    head: solid('Headlamp LED', 0xd0e3ff, .16, .20, { emissive: 0xb7d5ff, emissiveIntensity: .85 }),
    tail: solid('Tail and brake LEDs', 0xb11714, .21, .32, { emissive: 0xff2612, emissiveIntensity: 1.25 }),
    reverse: solid('Reverse lamp lenses', 0xabc9d7, .2, .27, { emissive: 0xbdd8ed, emissiveIntensity: .04 }),
    white: solid('Number stencil', 0xfaf5de, .05, .57),
  };
  for(const name of ['rubber','tread','suede']) materials[name].userData.primary=name;
  return materials;
}

function deckHeight(profile, x) {
  const [width, shoulder, inner, crown] = profile;
  const span = Math.abs(x);
  if (span <= inner) return crown - (crown - shoulder) * .12 * (span / inner) ** 2;
  return shoulder + (crown - shoulder) * .88 * (1 - (span - inner) / (width - inner)) ** 1.4;
}

function upperDeck(parts, stations, m, model) {
  const end = stations.at(-1)[0], tail = stations[0][0];
  for (const [a, b] of [[tail, -1.40], [-1.40, .79], [.79, end]]) {
    if (a !== -1.40) {
      parts.add(m.paint, patch(29, 12, (s, f) => {
        const z = mix(a, b, s);
        const profile = section(stations, z);
        const x = profile[2] * (f * 2 - 1);
        return [x, deckHeight(profile, x), z];
      }));
    }
    for (const side of [-1, 1]) {
      parts.add(m.paint, patch(29, 6, (s, f) => {
        const z = mix(a, b, s);
        const [w, y, inner, upper] = section(stations, z);
        return [side * mix(inner + .004, w, f), y + (upper - y) * (.88 * (1 - f) ** 1.4), z];
      }, side > 0));
    }
  }
  // Raised shoulders and an inset joint running through each corner of the bonnet.
  for (const side of [-1, 1]) {
    parts.add(m.trim, patch(30, 1, (s, f) => {
      const z = mix(.81, end - .045, s);
      const [, y, inner, top] = section(stations, z);
      return [side * (inner - .008 + f * .017), mix(y, top, .885) + .0007, z];
    }, side > 0));
    parts.add(m.accent, patch(25, 2, (s, f) => {
      const z = mix(.88, end - .027, s), [, y, inner, top] = section(stations, z);
      const x = side * (model ? .155 + .101 * f : .094 + .050 * f);
      return [x, top - (top - y) * .12 * (x / inner) ** 2 + .0011, z];
    }, side > 0));
  }
  if (model === 0) {
    for (const side of [-1, 1]) {
      parts.add(m.dark, patch(10, 2, (s, f) => {
        const z = mix(1.03, 1.57, s), [, y, inner, top] = section(stations, z);
        const x = side * (.40 + s * .077 + (.098 - s * .055) * f);
        return [x, top - (top - y) * .12 * (x / inner) ** 2 + .0014, z];
      }));
    }
  }
}

function sidePanels(parts, stations, m, model) {
  const low = .185, radius = .474, center = VEHICLE.tire;
  const extent = Math.acos((low - center) / radius) - Math.PI / 2;
  const edge = radius * Math.cos(extent);
  for (const side of [-1, 1]) {
    const xAt = (z, f) => {
      const [w] = section(stations, z);
      return side * (w + .002 - .054 * (1 - f) ** 1.24);
    };
    const makeSide = (z, base, f) => {
      const [, top] = section(stations, z);
      return [xAt(z, f), mix(base, top, f), z];
    };
    const front = VEHICLE.axle, rear = -VEHICLE.axle;
    const skirt = [stations[0][0], rear - edge, rear + edge, front - edge, front + edge, stations.at(-1)[0]];
    for (const [a, b] of [[skirt[0], skirt[1]], [skirt[2], skirt[3]], [skirt[4], skirt[5]]]) {
      parts.add(m.paint, patch(20, 5, (s, f) => makeSide(mix(a, b, s), low, f), side > 0));
    }
    parts.add(m.trim, patch(17, 4, (s, f) => {
      const z = mix(skirt[2] + .011, skirt[3] - .011, s);
      return [xAt(z, f * .11) + side * .035 * Math.sin(Math.PI * s), .152 + f * .105, z];
    }, side > 0));
    for (const axle of [rear, front]) {
      const rim = (s, f = 0) => {
        const theta = mix(Math.PI + extent, -extent, s);
        const z = axle + (radius - f * .017) * Math.cos(theta);
        const y = center + (radius - f * .017) * Math.sin(theta);
        return { z, y };
      };
      parts.add(m.paint, patch(44, 7, (s, f) => {
        const { z, y } = rim(s);
        const [, top] = section(stations, z);
        const x = mix(xAt(z, 0) + side * .047, xAt(z, 1), f);
        return [x, mix(y, Math.max(top, y + .026), f), z];
      }, side > 0));
      parts.add(m.paint, patch(44, 2, (s, f) => {
        const { z, y } = rim(s, f);
        return [xAt(z, 0) + side * (.047 - .024 * f), y, z];
      }, side > 0));
      parts.add(m.dark, patch(44, 3, (s, f) => {
        const { z, y } = rim(s, 1);
        return [mix(xAt(z, 0) + side * .023, side * .565, f), y + .012 * f, z];
      }, side > 0));
    }
    const doorEnd = model ? -.62 : -.73;
    for (const z of [doorEnd, .63]) {
      parts.add(m.dark, patch(8, 1, (s, f) => {
        const shift = .112 * s * (z < 0 ? -1 : 1);
        const q = makeSide(z + shift + f * .009, low, mix(.16, .98, s));
        q[0] += side * .0035;
        return q;
      }, side > 0));
    }
    if (!model) {
      parts.add(m.visor, panel([[-.82,.44],[-.59,.43],[-.43,.63],[-.78,.70]].map(([z, y]) => {
        const [w, h] = section(stations, z);
        return [side * (w + .011 - .044 * (1 - (y - low) / (h - low))), y, z];
      }), side < 0));
    }
    parts.add(m.trim, box(.027,.032,.122,xAt(-.41,.75) + side * .011,.651,-.41));
  }
}

function endPanels(parts, stations, m, model) {
  for (const direction of [-1, 1]) {
    const z = stations[direction < 0 ? 0 : stations.length - 1][0];
    const profile = section(stations, z);
    const [width, , , top] = profile;
    const face = (x, f, outset = 0) => [
      x * (1 - .070 * (1 - f)),
      mix(.186, deckHeight(profile, x), f),
      z + direction * (.091 * Math.sin(f * Math.PI) * (1 - (x / width) ** 2) + outset),
    ];
    parts.add(m.paint, patch(32, 16, (s, f) => face(mix(-width, width, s), f), direction < 0));
    const chin = width * 1.023;
    parts.add(m.trim, patch(20, 4, (s, f) => {
      const x = mix(-chin, chin, s);
      return [x, .139 + f * .050, z + direction * (.044 * (1 - Math.abs(x)) - (1 - f) * .043)];
    }, direction < 0));
    const inlets = !model && direction > 0 ? [[-.91,-.51],[-.435,.435],[.51,.91]] : [[-.84,.84]];
    for (const [l,r] of inlets) {
      const inlet = (u,f,offset) => {
        const lo = .119 + .040 * Math.abs(l + r);
        const hi = direction > 0 ? .522 + .025 * Math.abs(l + r) : .492;
        const x = width * mix(l,r,u) * (1 - f * .087);
        return face(x,mix(lo,hi,f),offset);
      };
      parts.add(m.dark,patch(24,10,(u,f)=>inlet(u,f,.0036), direction < 0));
      for (let i = 1; i <= 4; i++) {
        parts.add(m.trim,patch(24,2,(u,f)=>inlet(u,i*.197 + f*.045,.007),direction < 0));
      }
    }
    for (const side of [-1, 1]) {
      if (direction > 0) {
        const x = side;
        const makeLamp = (v, f, out) => face(x * mix(.225, width * .94, v),
          (model ? .72 : .67) + .145 * v + .11 * f, out);
        parts.add(m.visor, patch(12, 2, (s, f) => makeLamp(s, f, .008), direction * side > 0));
        parts.add(m.head, patch(12, 2, (s, f) => makeLamp(mix(.045,.96,s), .172 + .305 * f, .013), direction * side > 0));
        parts.add(m.head, patch(5, 1, (s, f) => makeLamp(mix(.66,.95,s), .68 + .220 * f, .014), direction * side > 0));
      } else {
        const makeLamp = (v, f, out) => face(side * mix(.134,width * .94,v), (model ? .706 : .729) + .048 * v + .16 * f, out);
        parts.add(m.visor, patch(12, 3, (s, f) => makeLamp(s, f, .009)));
        for (const rail of [.12, .63]) {
          parts.add(m.tail, patch(12, 1, (s, f) => makeLamp(mix(.045, .99, s), rail + .21 * f, .017)));
        }
        parts.add(m.reverse, patch(5, 1, (s, f) => makeLamp(mix(.09,.29,s), .38 + .17 * f, .011)));
        for (const x of [.23, .42, .61]) parts.add(m.trim, box(.029,.092,.31,side * x,.193,z + .12));
        const tubeX = side * (model ? .56 : .612);
        const profile = [[.040,.0],[.062,.0],[.062,.064],[.079,.103],[.079,.121],[.063,.121],[.063,.034]]
          .map(p => new T.Vector2(...p));
        parts.add(m.chrome, new T.LatheGeometry(profile, 28).rotateX(-Math.PI / 2).translate(tubeX,.268,z + .071));
      }
    }
    parts.add(m.accent, box(.098,.018,.016,0,top - .054,z + direction * .016));
  }
}

function roofAndGlass(parts, m, model) {
  const a = model ? [.95,.862,.665] : [.92,.784,.670];
  const b = model ? [.44,1.341,.615] : [.26,1.235,.585];
  const c = model ? [-.755,1.343,.619] : [-.630,1.238,.555];
  const d = model ? [-1.72,.843,.716] : [-1.62,.801,.655];
  const profile = (u, f, p, q, bulge) => {
    const x = f * 2 - 1;
    return [x * mix(p[2], q[2], u), mix(p[1], q[1], u) + bulge * (1 - x * x), mix(p[0], q[0], u) + .035 * (1 - x * x)];
  };
  parts.add(m.paint, patch(22, 12, (s, f) => profile(s, f, c, b, model ? .062 : .056)));
  parts.add(m.suede, patch(16, 10, (s, f) => {
    const [x,y,z] = profile(s, f, c, b, model ? .062 : .056);
    return [x*.99,y-.013,z];
  }, true));
  parts.add(m.glass, patch(20, 17, (s, f) => profile(s, f, a, b, .044)));
  parts.add(m.glass, patch(20, 17, (s, f) => profile(s, f, c, d, .038)));
  for (const side of [-1, 1]) {
    const sidePoint = (s, f) => {
      const z = mix(d[0] + .11, a[0] - .07, s);
      let highest = b[1] + .005;
      if (z > b[0]) highest = mix(b[1], a[1], (z - b[0]) / (a[0] - b[0]));
      if (z < c[0]) highest = mix(c[1], d[1], (z - c[0]) / (d[0] - c[0]));
      const low = model ? .851 : .821;
      return [side * mix(.690, .581, (highest - low) * 2.25 * f), mix(low, highest, f), z];
    };
    for (const [u, v] of [[.04, .395], [.418, .975]]) {
      parts.add(m.glass, patch(18, 7, (s, f) => sidePoint(mix(u, v, s), mix(.03,.945,f)), side < 0));
    }
    const pillar = (p, q, width) => {
      parts.add(m.trim, rod([side * p[2], p[1]+.018, p[0]], [side * q[2], q[1]+.038,q[0]], width*.77,width,9));
    };
    pillar(a, b, .035);
    pillar(c, d, .049);
    pillar(b, c, .025);
    parts.add(m.trim, rod(sidePoint(.405,0),sidePoint(.405,1), .019, .022, 8));
    parts.add(m.trim, rod([side * .694,.812,.70],[side * 1.043,.876,.595],.027,.035,9));
    parts.add(m.paint, new T.SphereGeometry(1, 20, 12).scale(.130,.058,.122).translate(side * 1.043,.889,.601));
    parts.add(m.chrome, new T.CircleGeometry(.085, 24).scale(1.21,.51,1).rotateY(Math.PI).translate(side * 1.05,.892,.520));
    if (!model) {
      parts.add(m.trim, rod([side * .49,.754,-1.93],[side * .43,1.001,-2.01],.022,.027,8));
    }
  }
  if (!model) {
    parts.add(m.trim, patch(30, 6, (s, f) => [mix(-.957,.957,s), 1.004 + .038 * Math.sin(f*Math.PI), -2.168 + .323 * f]));
    for (const side of [-1, 1]) {
      parts.add(m.paint, panel([[side*.955,.977,-2.16],[side*.955,1.092,-2.13],[side*.955,1.075,-1.82],[side*.955,.992,-1.82]]));
    }
  } else {
    parts.add(m.paint, patch(24, 5, (s, f) => [mix(-.86,.86,s),.820+.14*f,-2.02-.15*f]));
  }
}

function driverCluster() {
  const surface = document.createElement('canvas');
  surface.width = 384;
  surface.height = 175;
  const context = surface.getContext('2d');
  const texture = new T.CanvasTexture(surface);
  texture.colorSpace = T.SRGBColorSpace;
  texture.name = 'Live instrument readout';
  let previous = '';
  return {
    texture,
    draw(state) {
      const speed = Math.round(Math.abs(state.speed) * 3.6), rpm = Math.round(state.rpm / 100);
      const gear = state.speed < -.1 ? 'R' : state.gear;
      const nitro = Math.round(state.nitro * 15);
      const fingerprint = `${speed}/${rpm}/${gear}/${nitro}`;
      if (fingerprint === previous) return;
      previous = fingerprint;
      context.fillStyle = '#091018';
      context.fillRect(0, 0, 384, 175);
      context.font = '600 68px system-ui';
      context.fillStyle = '#f4e8cf';
      context.fillText(String(speed).padStart(3, '0'), 28, 107);
      context.font = '600 54px system-ui';
      context.fillText(gear, 280, 105);
      context.font = '600 16px system-ui';
      context.fillStyle = '#a4d6da';
      context.fillText('KM/H', 45, 133);
      context.fillText('GEAR', 278, 133);
      for (let i = 0; i < 17; i++) {
        context.fillStyle = i * 5 <= rpm ? i > 13 ? '#ff9251' : '#ebcb78' : '#22303d';
        context.fillRect(17 + i * 21, 13, 17, 13);
      }
      for (let i = 0; i < 15; i++) {
        context.fillStyle = i < nitro ? '#82e1ec' : '#243745';
        context.fillRect(18 + 24 * i, 153, 19, 6);
      }
      texture.needsUpdate = true;
    },
  };
}

function interior(parts, root, m, model, instruments) {
  const cockpit = new T.Group();
  cockpit.name = 'Cockpit interior';
  const seatH = model ? .79 : .73;
  const dashH = model ? .925 : .853;
  const driverX = .351;
  const wheelY = dashH - .123;
  for (const side of [-1, 1]) {
    parts.add(m.suede, new T.SphereGeometry(1, 18, 10).scale(.223,.311,.079).rotateX(-.12).translate(side*.339,.525,-.59));
    parts.add(m.suede, new T.SphereGeometry(1, 18, 10).scale(.243,.082,.233).translate(side*.339,.253,-.36));
    parts.add(m.suede, new T.SphereGeometry(1, 16, 10).scale(.145,.147,.068).translate(side*.339,seatH,-.62));
    parts.add(m.dark, rod([side*.59,.288,-.59],[side*.58,.67,.70],.058,.041,12));
  }
  parts.add(m.suede, patch(18, 16, (u, v) => {
    const x = mix(-.655,.655,u);
    return [x, dashH + .037*Math.cos(x*5) - .123*(1 - v)**2, mix(.48 + x*x*.24,.925,v)];
  }));
  parts.add(m.dark, patch(16, 12, (u, v) => {
    const x = mix(-.65,.65,u);
    return [x, mix(.297,dashH + .037*Math.cos(x*5) - .124,v), .48 + x*x*.24 - .027*Math.sin(Math.PI*v)];
  }));
  parts.add(m.trim, patch(14, 13, (u,v) => {
    const x = mix(-.123,.123,u);
    return [x,.296+.199*v+.040*Math.sin(u*Math.PI),mix(-.50,.60,v)];
  }));
  parts.add(m.trim, box(.215,.026,.083,-.281,dashH-.058,.541));
  for (let i = 0; i < 3; i++) parts.add(m.chrome, box(.191,.004,.018,-.283,dashH-.066+i*.013,.495));
  for (let i = 0; i < 4; i++) parts.add(m.bolt, new T.CylinderGeometry(.018,.019,.015,14).translate(-.055 + (i % 2)*.075,.370,-.02+Math.floor(i/2)*.06));
  parts.add(m.dark, box(1.59,.060,3.84,0,.187,.015));
  parts.add(m.trim, box(.200,.045,.047,0,model?1.231:1.163,.322));
  parts.add(m.chrome, box(.184,.031,.004,0,model?1.231:1.163,.296));
  parts.add(m.trim, rod([0,model?1.248:1.181,.325],[0,model?1.36:1.255,.262], .011,.013,8));
  const wheel = new T.Group();
  wheel.name = 'Responsive steering wheel';
  const wheelAxis = new T.Group();
  wheelAxis.rotation.x = .30;
  wheelAxis.position.set(driverX,wheelY,.337);
  wheelAxis.add(wheel);
  cockpit.add(wheelAxis);
  const wheelParts = new Parts();
  wheelParts.add(m.suede, new T.TorusGeometry(.162,.022,12,52));
  wheelParts.add(m.trim, new T.CylinderGeometry(.065,.063,.040,25).rotateX(Math.PI/2));
  for (const a of [.33,Math.PI-.33,4.71]) {
    wheelParts.add(m.chrome, rod([Math.cos(a)*.049,Math.sin(a)*.049,.002],[Math.cos(a)*.143,Math.sin(a)*.143,.002],.019,.023,9));
  }
  wheelParts.add(m.accent,box(.015,.032,.024,0,.172,-.012));
  wheelParts.copyInto(wheel, true);
  let cluster;
  if (instruments) {
    cluster = driverCluster();
    const clusterMat = new T.MeshBasicMaterial({ name:'Illuminated gauge display', map:cluster.texture, toneMapped:false, side:T.DoubleSide });
    const clusterScreen = new T.Mesh(new T.PlaneGeometry(.282,.129).rotateY(Math.PI), clusterMat);
    clusterScreen.position.set(driverX,dashH+.013,.539);
    clusterScreen.rotation.x = -.11;
    cockpit.add(clusterScreen);
    parts.add(m.trim, box(.326,.144,.056,driverX,dashH+.013,.576));
  }
  root.add(cockpit);
  return { wheel, cluster, eye: new T.Vector3(driverX, model ? 1.166 : 1.075, -.385) };
}

const numeralParts = {
  '0':'abcdef', '1':'bc', '2':'abdeg', '3':'abcdg', '4':'bcfg', '5':'acdfg', '6':'acdefg', '7':'abc', '8':'abcdefg', '9':'abcdfg',
};
const strokes = { a:[.5,.92,.8,.125], b:[.91,.71,.13,.38], c:[.91,.28,.13,.37], d:[.5,.06,.8,.125], e:[.09,.28,.13,.37], f:[.09,.71,.13,.38], g:[.5,.49,.8,.125] };

function doorNumbers(parts, stations, m, livery) {
  const digits = LIVERIES[livery].number;
  for (const side of [-1, 1]) {
    const plate = (u,v,raise) => {
      const z = -side * (-.380 + .58 * u + .065 * v);
      const y = .379 + v * .249;
      const [w,h] = section(stations,z);
      return [side * (w + .002 - .054*(1-(y-.185)/(h-.185))**1.24 + raise),y,z];
    };
    parts.add(m.trim, patch(12,4,(u,v)=>plate(u,v,.004),side < 0));
    parts.add(m.accent, patch(12,1,(u,v)=>plate(u,v*.11,.006),side < 0));
    for (let d=0;d<2;d++) {
      for (const ch of numeralParts[digits[d]]) {
        const [cx,cy,w,h] = strokes[ch];
        parts.add(m.white, patch(4,1,(u,v)=>plate(.19+.328*d+.303*(cx+(u-.5)*w),.20+.67*(cy+(v-.5)*h),.008),side < 0));
      }
    }
  }
}

function makeWheel(root, m, x, z, model) {
  const side = Math.sign(x);
  const pivot = new T.Group();
  const front = z > 0;
  pivot.name = `${front ? 'Front' : 'Rear'} ${side > 0 ? 'left' : 'right'} hub`;
  pivot.position.set(x, VEHICLE.tire, z);
  root.add(pivot);
  const spin = new T.Group(), spinShell = new T.Group();
  spin.name = 'Wheel spin';
  pivot.add(spin);
  spin.add(spinShell);
  spinShell.scale.x = side;
  const wheel = new Parts(), brake = new Parts();
  const lathe = (profile, segments) => new T.LatheGeometry(profile.map(([r,h])=>new T.Vector2(r,h)),segments).rotateZ(-Math.PI/2);
  const sidewall = [[.238,-.124],[.260,-.134],[.284,-.139],[.311,-.134],[.331,-.115],[.345,-.092],
    [.345,.092],[.331,.115],[.311,.134],[.286,.140],[.259,.134],[.238,.125]];
  wheel.add(m.rubber, lathe(sidewall, 84));
  wheel.add(m.tread, lathe([[.345,-.098],[.350,-.083],[.353,-.052],[.354,-.022],[.354,.022],[.353,.052],[.350,.083],[.345,.098]],84));
  const barrel = [[.222,-.119],[.237,-.127],[.245,-.122],[.251,-.114],[.249,.109],[.259,.125],[.255,.138],
    [.234,.140],[.224,.133],[.221,.115],[.219,.102],[.213,.090],[.212,-.104],[.222,-.119]];
  wheel.add(m.chrome, lathe(barrel, 72));
  const hub = new T.CylinderGeometry(.071,.076,.063,36,3).rotateZ(-Math.PI/2).translate(.119,0,0);
  wheel.add(m.chrome, hub);
  const spokes = model ? 8 : 10;
  const point = (a,r,depth) => [depth, Math.cos(a)*r, Math.sin(a)*r];
  for (let i=0;i<spokes;i++) {
    const a=i/spokes*Math.PI*2;
    const inner=.065, outer=.233, lean=model ? .091 : .197;
    const face = [
      point(a-.29,inner,.151), point(a+.28,inner,.150),point(a+lean+.074,outer,.126),
      point(a+lean-.052,outer,.125),
    ];
    wheel.add(m.chrome,panel(face));
    wheel.add(m.disc,panel([face[0],face[3],point(a+lean-.051,outer,.089),point(a-.28,inner,.096)]));
  }
  for (let i=0;i<5;i++) {
    const a=i*2*Math.PI/5;
    wheel.add(m.bolt,new T.CylinderGeometry(.0093,.010,.012,8).rotateZ(-Math.PI/2).translate(.157,.043*Math.cos(a),.043*Math.sin(a)));
  }
  wheel.add(m.caliper,new T.CylinderGeometry(.021,.021,.013,22).rotateZ(-Math.PI/2).translate(.157,0,0));
  wheel.add(m.disc, lathe([[.066,.028],[.182,.028],[.198,.036],[.198,.062],[.186,.073],[.075,.073],[.066,.028]],72));
  for (let i=0;i<20;i++) {
    const a=i*Math.PI/10;
    wheel.add(m.dark,new T.CircleGeometry(.006,9).rotateY(Math.PI/2).translate(.074,.163*Math.cos(a),.163*Math.sin(a)));
    wheel.add(m.dark,new T.CircleGeometry(.004,8).rotateY(Math.PI/2).translate(.074,.142*Math.cos(a+.11),.142*Math.sin(a+.11)));
  }
  brake.add(m.caliper,new T.CapsuleGeometry(.032,.109,6,12).rotateX(.10).translate(.061,.092,.155));
  brake.add(m.bolt,box(.035,.078,.046,.081,.100,.164));
  const fixed = new T.Group();
  fixed.scale.x = side;
  pivot.add(fixed);
  wheel.copyInto(spinShell, true);
  brake.copyInto(fixed, false);
  return { pivot, spin, front, x, z };
}

export function makeCar(textureBank, model, livery, player = false) {
  const stations = SHAPES[model];
  const m = markCarMaterials({ textureBank, model, livery });
  const chassis = new T.Group();
  chassis.name = MODELS[model].name + ' / ' + LIVERIES[livery].number;
  const parts = new Parts();
  upperDeck(parts, stations, m, model);
  sidePanels(parts, stations, m, model);
  endPanels(parts, stations, m, model);
  roofAndGlass(parts, m, model);
  doorNumbers(parts, stations, m, livery);
  const { wheel, cluster, eye } = interior(parts, chassis, m, model, player);
  const panels = new T.Group();
  panels.name = 'Body panels';
  chassis.add(panels);
  parts.copyInto(panels);
  // Sweep the overhang behind the lamps without moving either wheel opening.
  for (const mesh of panels.children) {
    const attribute = mesh.geometry.getAttribute('position');
    for (let i = 0; i < attribute.count; i++) {
      const x = attribute.getX(i), z = attribute.getZ(i);
      const end = z < 0 ? -stations[0][0] : stations.at(-1)[0];
      if (Math.abs(z) < 1.815) continue;
      const fraction = clamp((Math.abs(z) - 1.815) / (end - 1.815),0,1);
      const bow = (model ? .146 : .264) * fraction ** 1.75 * (Math.abs(x) / .87) ** 2;
      attribute.setZ(i,z - Math.sign(z) * bow);
    }
    mesh.geometry.computeVertexNormals();
  }
  const hubs = [];
  for (const z of [-VEHICLE.axle, VEHICLE.axle]) {
    for (const x of [-VEHICLE.track, VEHICLE.track]) hubs.push(makeWheel(chassis,m,x,z,model));
  }
  const lamp = new T.SpotLight(0xd5e6ff,0,84,.32,.59,1.57);
  lamp.position.set(0,.595,2.21);
  lamp.target.position.set(0,-.37,27);
  const tailLight = new T.PointLight(0xff1b0b,0,5.8,2);
  tailLight.position.set(0,.29,-2.35);
  chassis.add(lamp,lamp.target,tailLight);
  const glassHaze=new T.Mesh(new T.CylinderGeometry(1.97,.19,10.5,23,1,true).rotateX(Math.PI*.515).translate(0,.40,7.3),
    new T.ShaderMaterial({
      name:'Headlight atmospheric scattering',transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,
      uniforms:{tint:{value:new T.Color(0xc4d9ff)}},
      vertexShader:`varying vec2 rayUv; varying vec3 localView; varying vec3 normalDir;
        void main(){ rayUv=uv; vec4 view=modelViewMatrix*vec4(position,1.0); localView=view.xyz;
        normalDir=normalMatrix*normal; gl_Position=projectionMatrix*view; }`,
      fragmentShader:`uniform vec3 tint; varying vec2 rayUv; varying vec3 localView; varying vec3 normalDir;
        void main(){ float side=abs(dot(normalize(-localView),normalize(normalDir)));
        float haze=sin(rayUv.y*3.14159265)*(.005+.030*pow(side,2.1));
        gl_FragColor=vec4(tint,haze); }`,
    }));
  glassHaze.visible=false;
  glassHaze.name='Headlight haze';
  chassis.add(glassHaze);
  return { chassis, hubs, wheel, cluster, eye, lamp, tailLight, glassHaze, m, model, livery };
}

export function poseCar(car, state, night, nearby = true) {
  car.chassis.position.set(state.x,state.y,state.z);
  car.chassis.rotation.set(state.pitch,Math.PI / 2 - state.heading,state.roll,'YXZ');
  car.hubs.forEach(({ pivot, spin, front, x }, i) => {
    const steering = Math.abs(state.steer) < .0001 ? 0 : Math.atan(
      VEHICLE.wheelbase / (VEHICLE.wheelbase / Math.tan(state.steer) + x),
    );
    pivot.position.y = VEHICLE.tire + clamp(state.wheels[i],-.079,.089);
    pivot.rotation.y = front ? -steering : 0;
    spin.rotation.x = state.spin;
  });
  car.wheel.rotation.z = state.steer * 2.95;
  car.cluster?.draw(state);
  car.lamp.visible = night;
  car.tailLight.visible = night;
  car.glassHaze.visible = night && nearby;
  car.lamp.intensity = night && nearby ? (car.cluster ? 750 : 410) : 0;
  car.tailLight.intensity = night && nearby ? (state.braking ? 7.8 : 2.6) : 0;
  car.m.head.emissiveIntensity = night ? 3.6 : .52;
  car.m.tail.emissiveIntensity = state.braking ? 6.2 : night ? 3.3 : 1.15;
  car.m.reverse.emissiveIntensity = state.speed < -.2 ? 3.5 : .03;
  car.chassis.updateMatrixWorld(true);
}

export function carStats(car) {
  let triangles = 0;
  const mats = new Set();
  car.chassis.traverse(object => {
    if (!object.isMesh) return;
    triangles += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3;
    mats.add(object.material.name);
  });
  return { model: MODELS[car.model].name, triangles, materialCount: mats.size, materials: [...mats],
    directWheelHubs: car.hubs.filter(hub => hub.pivot.parent === car.chassis).length,
    interior: !!car.chassis.getObjectByName('Cockpit interior'), steeringWheel: !!car.wheel.parent,
    instrumentDisplay: !!car.cluster };
}
