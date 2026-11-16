import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface GLTFModelTemplate {
  name: string;
  scene: THREE.Group;
  radius: number;
  minY: number;
}

export interface PropAssetBank {
  boulder01: GLTFModelTemplate;
  coastRocks01: GLTFModelTemplate;
  coastRocks02: GLTFModelTemplate;
  fern02: GLTFModelTemplate;
  wineBarrel: GLTFModelTemplate;
  ceramicPot: GLTFModelTemplate;
  woodenBench: GLTFModelTemplate;
}

async function loadTemplate(
  loader: GLTFLoader,
  name: string,
  url: string,
  targetSizeMeters: number
): Promise<GLTFModelTemplate> {
  const gltf = await loader.loadAsync(url);
  const root = gltf.scene;
  const rawBox = new THREE.Box3().setFromObject(root);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);
  const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
  const normScale = targetSizeMeters / maxDim;
  root.scale.multiplyScalar(normScale);
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // Center XZ and align bottom origin strictly to y = 0 so terrain raycast grounds base cleanly!
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box.min.y;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.envMapIntensity = 0.8;
          }
        }
      }
    }
  });
  const wrapper = new THREE.Group();
  wrapper.add(root);

  return {
    name,
    scene: wrapper,
    radius: Math.max(size.x, size.z) * 0.5,
    minY: 0,
  };
}

export async function loadPropAssetBank(): Promise<PropAssetBank> {
  const loader = new GLTFLoader();
  const [
    boulder01,
    coastRocks01,
    coastRocks02,
    fern02,
    wineBarrel,
    ceramicPot,
    woodenBench,
  ] = await Promise.all([
    loadTemplate(loader, 'boulder_01', './assets/models/boulder_01/boulder_01_1k.gltf', 2.2),
    loadTemplate(loader, 'coast_rocks_01', './assets/models/coast_rocks_01/coast_rocks_01_1k.gltf', 3.4),
    loadTemplate(loader, 'coast_rocks_02', './assets/models/coast_rocks_02/coast_rocks_02_1k.gltf', 3.2),
    loadTemplate(loader, 'fern_02', './assets/models/fern_02/fern_02_1k.gltf', 1.1),
    loadTemplate(loader, 'wine_barrel_01', './assets/models/wine_barrel_01/wine_barrel_01_1k.gltf', 0.95),
    loadTemplate(loader, 'ceramic_pot', './assets/models/ceramic_pot/ceramic_pot_1k.gltf', 0.75),
    loadTemplate(loader, 'painted_wooden_bench', './assets/models/painted_wooden_bench/painted_wooden_bench_1k.gltf', 1.85),
  ]);

  return {
    boulder01,
    coastRocks01,
    coastRocks02,
    fern02,
    wineBarrel,
    ceramicPot,
    woodenBench,
  };
}
