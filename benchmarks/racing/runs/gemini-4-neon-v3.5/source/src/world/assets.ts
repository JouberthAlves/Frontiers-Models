import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export interface PBRTextureSet {
  name: string;
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  aoMap?: THREE.Texture;
  width: number;
  height: number;
  anisotropy: number;
  sourceUrl: string;
}

export interface LoadedAssets {
  hdriGolden: THREE.Texture;
  hdriNight: THREE.Texture;
  envGolden: THREE.Texture;
  envNight: THREE.Texture;
  textures: Record<string, PBRTextureSet>;
  maxAnisotropy: number;
}

interface TextureDef {
  key: string;
  dir: string;
  albedoFile: string;
  hasAo?: boolean;
  repeat?: [number, number];
  anisotropy?: number;
}

const TEXTURE_DEFS: TextureDef[] = [
  { key: 'asphalt_main', dir: 'asphalt_main', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'asphalt_worn', dir: 'asphalt_worn', albedoFile: 'albedo.jpg', hasAo: false, repeat: [1, 1], anisotropy: 16 },
  { key: 'sand_beach', dir: 'sand_beach', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'cliff_rock', dir: 'cliff_rock', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'grass_med', dir: 'grass_med', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'forest_floor', dir: 'forest_floor', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'gravel_verge', dir: 'gravel_verge', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'sidewalk_stone', dir: 'sidewalk_stone', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 1], anisotropy: 16 },
  { key: 'plaster_warm', dir: 'plaster_warm', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 8 },
  { key: 'plaster_rustic', dir: 'plaster_rustic', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 8 },
  { key: 'plaster_blue', dir: 'plaster_blue', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 8 },
  { key: 'stone_wall', dir: 'stone_wall', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 8 },
  { key: 'coral_stone', dir: 'coral_stone', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 8 },
  { key: 'roof_terracotta', dir: 'roof_terracotta', albedoFile: 'albedo.jpg', hasAo: true, repeat: [3, 2], anisotropy: 8 },
  { key: 'concrete_bridge', dir: 'concrete_bridge', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 12 },
  { key: 'wood_planks', dir: 'wood_planks', albedoFile: 'albedo.jpg', hasAo: true, repeat: [2, 2], anisotropy: 8 },
  { key: 'bark_pine', dir: 'bark_pine', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 3], anisotropy: 8 },
  { key: 'bark_palm', dir: 'bark_palm', albedoFile: 'albedo.jpg', hasAo: true, repeat: [1, 4], anisotropy: 8 },
  { key: 'tire_rubber', dir: 'tire_rubber', albedoFile: 'albedo.jpg', hasAo: false, repeat: [4, 2], anisotropy: 8 },
  { key: 'cluster_pine', dir: 'cluster_pine', albedoFile: 'albedo.png', hasAo: false, repeat: [1, 1], anisotropy: 8 },
  { key: 'cluster_palm_frond', dir: 'cluster_palm_frond', albedoFile: 'albedo.png', hasAo: false, repeat: [1, 1], anisotropy: 8 },
  { key: 'cluster_olive', dir: 'cluster_olive', albedoFile: 'albedo.png', hasAo: false, repeat: [1, 1], anisotropy: 8 },
  { key: 'cluster_shrub', dir: 'cluster_shrub', albedoFile: 'albedo.png', hasAo: false, repeat: [1, 1], anisotropy: 8 },
  { key: 'cluster_grass_tuft', dir: 'cluster_grass_tuft', albedoFile: 'albedo.png', hasAo: false, repeat: [1, 1], anisotropy: 8 },
];

export async function loadAllAssets(
  renderer: THREE.WebGLRenderer,
  onProgress?: (pct: number, label: string) => void
): Promise<LoadedAssets> {
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const texLoader = new THREE.TextureLoader();
  const rgbeLoader = new RGBELoader();
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const totalSteps = TEXTURE_DEFS.length + 2;
  let done = 0;
  const tick = (label: string) => {
    done++;
    onProgress?.(Math.min(1, done / totalSteps), label);
  };

  const loadTex = (url: string, isColor: boolean, repeat: [number, number], aniso: number): Promise<THREE.Texture> =>
    new Promise((resolve, reject) => {
      texLoader.load(
        url,
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(repeat[0], repeat[1]);
          tex.anisotropy = Math.min(aniso, maxAniso);
          tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          tex.userData.sourceUrl = url;
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        (err) => reject(new Error(`Failed to load texture ${url}: ${String(err)}`))
      );
    });

  // Load HDRIs first
  const [hdriGolden, hdriNight] = await Promise.all([
    rgbeLoader.loadAsync('./assets/hdri/golden_hour.hdr').then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      t.userData.sourceUrl = './assets/hdri/golden_hour.hdr';
      tick('Golden Hour HDRI');
      return t;
    }),
    rgbeLoader.loadAsync('./assets/hdri/night.hdr').then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      t.userData.sourceUrl = './assets/hdri/night.hdr';
      tick('Night HDRI');
      return t;
    }),
  ]);

  const envGolden = pmrem.fromEquirectangular(hdriGolden).texture;
  const envNight = pmrem.fromEquirectangular(hdriNight).texture;
  pmrem.dispose();

  const textures: Record<string, PBRTextureSet> = {};

  // Load PBR sets in bounded batches for crisp progress reporting
  const batchSize = 6;
  for (let i = 0; i < TEXTURE_DEFS.length; i += batchSize) {
    const batch = TEXTURE_DEFS.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (def) => {
        const base = `./assets/textures/${def.dir}`;
        const rep = def.repeat ?? [1, 1];
        const aniso = Math.min(def.anisotropy ?? 8, maxAniso);
        const [map, normalMap, roughnessMap, aoMap] = await Promise.all([
          loadTex(`${base}/${def.albedoFile}`, true, rep, aniso),
          loadTex(`${base}/normal.jpg`, false, rep, aniso),
          loadTex(`${base}/roughness.jpg`, false, rep, aniso),
          def.hasAo ? loadTex(`${base}/ao.jpg`, false, rep, aniso) : Promise.resolve(undefined),
        ]);
        // Clamp foliage cutout edges so transparent border never wraps onto top/bottom!
        if (def.dir.startsWith('cluster_')) {
          map.wrapS = THREE.ClampToEdgeWrapping;
          map.wrapT = THREE.ClampToEdgeWrapping;
          normalMap.wrapS = THREE.ClampToEdgeWrapping;
          normalMap.wrapT = THREE.ClampToEdgeWrapping;
          roughnessMap.wrapS = THREE.ClampToEdgeWrapping;
          roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
        }
        const img = map.image as { width?: number; height?: number } | undefined;
        textures[def.key] = {
          name: def.key,
          map,
          normalMap,
          roughnessMap,
          aoMap,
          width: img?.width ?? 1024,
          height: img?.height ?? 1024,
          anisotropy: map.anisotropy,
          sourceUrl: `${base}/${def.albedoFile}`,
        };
        tick(`Texture ${def.key}`);
      })
    );
  }

  return {
    hdriGolden,
    hdriNight,
    envGolden,
    envNight,
    textures,
    maxAnisotropy: maxAniso,
  };
}
