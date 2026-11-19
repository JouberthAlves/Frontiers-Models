import * as T from 'three';
import config from '../track.json';
import { angle, Course, validateWorld } from './course.js';
import { FIXED_STEP, Race, readControls, VEHICLE } from './simulation.js';
import { cameraSafe, roadAndGround, roadMark } from './geometry.js';

const root = document.querySelector('#game');
const keys = new Set();
const verify = new URLSearchParams(location.search).has('verify');
const course = new Course(config);
const worldCheck = validateWorld(course);
if (worldCheck.errors.length) throw new Error(worldCheck.errors.join('\n'));

const scene = new T.Scene();
scene.background = new T.Color(0xc5d7df);
scene.fog = new T.FogExp2(0xc5d7df, .0013);
const renderer = new T.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xc5d7df);
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFShadowMap;
root.appendChild(renderer.domElement);
scene.add(new T.HemisphereLight(0xc7e1f3, 0x9c765c, 2.3));
const sun = new T.DirectionalLight(0xffe3b3, 2.9);
sun.position.set(170, 155, 58);
scene.add(sun);

const fixed = roadAndGround(course);
scene.add(fixed.group);
const water = new T.Mesh(new T.PlaneGeometry(9000, 9000), new T.MeshStandardMaterial({ color: 0x4e8b97, roughness: .53 }));
water.rotation.x = -Math.PI / 2;
scene.add(water);
const lineMat = new T.MeshStandardMaterial({ color: 0xe2d2aa, roughness: .83, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
for (const edge of [-1, 1]) {
  scene.add(roadMark(course, 0, course.length, p => [edge * (p.half - .17) - .045, edge * (p.half - .17) + .045], null, lineMat));
}

const camera = new T.PerspectiveCamera(60, innerWidth / innerHeight, .11, 9800);
const car = new T.Group();
const body = new T.Mesh(new T.BoxGeometry(1.86, .56, 4.42), new T.MeshStandardMaterial({ color: 0xc4512c, metalness: .2, roughness: .35 }));
body.position.y = .54;
car.add(body);
const cabin = new T.Mesh(new T.BoxGeometry(1.43, .45, 1.7), new T.MeshStandardMaterial({ color: 0x282e32, roughness: .35 }));
cabin.position.set(0, 1.03, -.12);
car.add(cabin);
const wheelMat = new T.MeshStandardMaterial({ color: 0x171919, roughness: .8 });
for (const z of [-VEHICLE.axle, VEHICLE.axle]) {
  for (const x of [-VEHICLE.track, VEHICLE.track]) {
    const w = new T.Mesh(new T.CylinderGeometry(VEHICLE.tire, VEHICLE.tire, .25, 28), wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, VEHICLE.tire, z);
    car.add(w);
  }
}
scene.add(car);
let race = new Race(course, { opponents: 0, laps: 1 });
let overhead = verify;
let accumulator = 0, previous = performance.now();
const hud = document.createElement('aside');
root.append(hud);
Object.assign(hud.style, { position: 'absolute', bottom: '34px', right: '38px', font: '600 20px system-ui', color: '#fff5db', textShadow: '0 2px 6px black' });
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

function render() {
  const p = race.player;
  car.position.set(p.x, p.y, p.z);
  car.rotation.set(p.pitch, Math.PI / 2 - p.heading, p.roll, 'YXZ');
  if (overhead) {
    scene.fog.density = 0.000045;
    camera.near = 850;
    camera.far = 2200;
    camera.position.set(-32, 1370, 63);
    camera.up.set(0, 0, -1);
    camera.lookAt(-32, 8, 63);
    hud.textContent = 'Cala di Vetra / ' + (course.length / 1000).toFixed(2) + ' km';
  } else {
    scene.fog.density = .0012;
    camera.near = .13;
    camera.far = 9800;
    const dx = Math.cos(p.heading), dz = Math.sin(p.heading);
    camera.up.set(0, 1, 0);
    camera.position.set(p.x - dx * 6, p.y + 2.25, p.z - dz * 6);
    const target = new T.Vector3(p.x + dx * 8, p.y + .55, p.z + dz * 8);
    cameraSafe(course, camera.position, new T.Vector3(p.x, p.y + 1.2, p.z));
    camera.lookAt(target);
    hud.textContent = Math.round(p.speed * 3.6) + ' km/h';
  }
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

function frame(now) {
  if (!verify) {
    accumulator += Math.min(.09, (now - previous) / 1000);
    while (accumulator >= FIXED_STEP) {
      race.step(readControls(keys, navigator.getGamepads?.()[0]));
      accumulator -= FIXED_STEP;
    }
    render();
  }
  previous = now;
  requestAnimationFrame(frame);
}

window.addEventListener('keydown', e => {
  keys.add(e.code);
  if (e.code === 'KeyM') overhead = !overhead;
  if (e.code.startsWith('Arrow') || e.code.startsWith('Shift')) e.preventDefault();
});
window.addEventListener('keyup', e => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  render();
});

if (verify) {
  const snapshot = () => ({
    speed: race.player.speed, nitro: race.player.nitro, grip: race.player.slip,
    lateral: course.nearest(race.player.x, race.player.z).lateral,
    heading: angle(race.player.heading - course.at(race.player.s).heading),
    lap: race.player.lap, lapTime: race.player.lastLap, resets: race.resets,
  });
  window.p1 = {
    world: worldCheck, length: course.length,
    reset: () => { race = new Race(course, { opponents: 0, laps: 1 }); },
    advance(seconds, auto = false) {
      for (let i = 0; i < Math.round(seconds / FIXED_STEP) && !race.finished; i++) race.step(readControls(keys), auto);
      return snapshot();
    },
    screenshot(showMap) { overhead = showMap; render(); },
  };
}
render();
requestAnimationFrame(frame);
