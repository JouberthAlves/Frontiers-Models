import * as THREE from 'three';

export interface PBRTextureSet {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

export interface WorldTextureBank {
  asphalt: PBRTextureSet;
  sand: PBRTextureSet;
  grassRock: PBRTextureSet;
  forestFloor: PBRTextureSet;
  cliffRock: PBRTextureSet;
  roofTiles: PBRTextureSet;
  plasterBlue: PBRTextureSet;
  plasterClay: PBRTextureSet;
  plasterWhite: PBRTextureSet;
  plasterBeige: PBRTextureSet;
  stoneWall: PBRTextureSet;
  cobblestone: PBRTextureSet;
  woodPlanks: PBRTextureSet;
  bark: PBRTextureSet;
  metalPlate: PBRTextureSet;
  roadOverlayMap: THREE.CanvasTexture;
}

function createRoadMarkingsTexture(): THREE.CanvasTexture {
  // 2048x2048 overlay texture aligned across road width U=[0..1], V=12m repeat!
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 2048;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 2048, 2048);

  // Darkened rubber tire tracks in both lanes
  const drawTireTrack = (cx: number) => {
    const grad = ctx.createLinearGradient(cx - 140, 0, cx + 140, 0);
    grad.addColorStop(0, 'rgba(15, 16, 18, 0.0)');
    grad.addColorStop(0.35, 'rgba(15, 16, 18, 0.28)');
    grad.addColorStop(0.5, 'rgba(12, 13, 15, 0.34)');
    grad.addColorStop(0.65, 'rgba(15, 16, 18, 0.28)');
    grad.addColorStop(1, 'rgba(15, 16, 18, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - 140, 0, 280, 2048);
  };
  drawTireTrack(460);
  drawTireTrack(760);
  drawTireTrack(1288);
  drawTireTrack(1588);

  // Worn dusty edges along shoulders
  const leftEdge = ctx.createLinearGradient(0, 0, 170, 0);
  leftEdge.addColorStop(0, 'rgba(130, 115, 92, 0.45)');
  leftEdge.addColorStop(1, 'rgba(130, 115, 92, 0.0)');
  ctx.fillStyle = leftEdge;
  ctx.fillRect(0, 0, 170, 2048);

  const rightEdge = ctx.createLinearGradient(1878, 0, 2048, 0);
  rightEdge.addColorStop(0, 'rgba(130, 115, 92, 0.0)');
  rightEdge.addColorStop(1, 'rgba(130, 115, 92, 0.45)');
  ctx.fillStyle = rightEdge;
  ctx.fillRect(1878, 0, 170, 2048);

  // Solid crisp weathered white edge lines
  ctx.fillStyle = 'rgba(232, 228, 218, 0.86)';
  ctx.fillRect(96, 0, 30, 2048);
  ctx.fillRect(1922, 0, 30, 2048);

  // Dashed warm-white/amber center line (two dashes per 12m tile)
  ctx.fillStyle = 'rgba(240, 224, 186, 0.88)';
  ctx.fillRect(1008, 120, 32, 740);
  ctx.fillRect(1008, 1144, 32, 740);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
}

export async function loadWorldTextureBank(renderer: THREE.WebGLRenderer): Promise<WorldTextureBank> {
  const loader = new THREE.TextureLoader();
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const loadTex = async (url: string, isColor: boolean, repeatX = 1, repeatY = 1) => {
    const t = await loader.loadAsync(url);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
    t.anisotropy = maxAniso;
    t.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    return t;
  };

  const loadSet = async (folder: string, repeatX = 1, repeatY = 1): Promise<PBRTextureSet> => {
    const [map, normalMap, roughnessMap] = await Promise.all([
      loadTex(`./assets/textures/${folder}/diff.jpg`, true, repeatX, repeatY),
      loadTex(`./assets/textures/${folder}/nor.jpg`, false, repeatX, repeatY),
      loadTex(`./assets/textures/${folder}/rough.jpg`, false, repeatX, repeatY),
    ]);
    return { map, normalMap, roughnessMap };
  };

  const [
    asphalt,
    sand,
    grassRock,
    forestFloor,
    cliffRock,
    roofTiles,
    plasterBlue,
    plasterClay,
    plasterWhite,
    plasterBeige,
    stoneWall,
    cobblestone,
    woodPlanks,
    bark,
    metalPlate,
  ] = await Promise.all([
    loadSet('asphalt_02', 3, 1),
    loadSet('coast_sand_01', 1, 1),
    loadSet('aerial_grass_rock', 1, 1),
    loadSet('forrest_ground_01', 1, 1),
    loadSet('cliff_side', 1, 1),
    loadSet('clay_roof_tiles_02', 2, 2),
    loadSet('blue_plaster_wall', 2, 2),
    loadSet('clay_plaster', 2, 2),
    loadSet('white_stucco', 2, 2),
    loadSet('beige_wall_001', 2, 2),
    loadSet('rustic_stone_wall', 2, 2),
    loadSet('cobblestone_02', 2, 2),
    loadSet('oak_wood_planks', 2, 2),
    loadSet('bark_brown_01', 1, 2),
    loadSet('metal_plate', 1, 1),
  ]);

  return {
    asphalt,
    sand,
    grassRock,
    forestFloor,
    cliffRock,
    roofTiles,
    plasterBlue,
    plasterClay,
    plasterWhite,
    plasterBeige,
    stoneWall,
    cobblestone,
    woodPlanks,
    bark,
    metalPlate,
    roadOverlayMap: createRoadMarkingsTexture(),
  };
}

export function createRoadMaterial(bank: WorldTextureBank): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    map: bank.asphalt.map,
    normalMap: bank.asphalt.normalMap,
    normalScale: new THREE.Vector2(1.15, 1.15),
    roughnessMap: bank.asphalt.roughnessMap,
    roughness: 0.92,
    metalness: 0.04,
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRoadOverlay = { value: bank.roadOverlayMap };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec2 vRoadRawUv;
        varying vec3 vRoadWorldPos;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vRoadRawUv = uv;
        vRoadWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D uRoadOverlay;
        varying vec2 vRoadRawUv;
        varying vec3 vRoadWorldPos;
        float roadHash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float roadNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(roadHash(i), roadHash(i + vec2(1.0, 0.0)), u.x),
            mix(roadHash(i + vec2(0.0, 1.0)), roadHash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        // Macro weather variation to disguise asphalt tiling
        float macro = roadNoise(vRoadWorldPos.xz * 0.045) * 0.22 + roadNoise(vRoadWorldPos.xz * 0.17) * 0.10;
        diffuseColor.rgb *= (0.82 + macro);
        // Apply painted lane markings + worn shoulder + rubber groove overlay
        vec2 ovUv = vec2(clamp(vRoadRawUv.x, 0.0, 1.0), vRoadRawUv.y);
        vec4 ov = texture2D(uRoadOverlay, ovUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, ov.rgb, ov.a);
        // Outside asphalt shoulder skirt tint (earth/gravel transition)
        if (vRoadRawUv.x < 0.0 || vRoadRawUv.x > 1.0) {
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.32, 0.28, 0.22), 0.72);
        }`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        float rMacro = roadNoise(vRoadWorldPos.xz * 0.06);
        roughnessFactor = clamp(roughnessFactor * (0.85 + rMacro * 0.25), 0.45, 0.98);`
      );
  };
  mat.customProgramCacheKey = () => 'road-asphalt-v1';
  return mat;
}

export function createTerrainMaterial(bank: WorldTextureBank): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    map: bank.grassRock.map,
    normalMap: bank.grassRock.normalMap,
    roughnessMap: bank.grassRock.roughnessMap,
    roughness: 0.92,
    metalness: 0.02,
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uSandMap = { value: bank.sand.map };
    shader.uniforms.uSandNor = { value: bank.sand.normalMap };
    shader.uniforms.uRockMap = { value: bank.cliffRock.map };
    shader.uniforms.uRockNor = { value: bank.cliffRock.normalMap };
    shader.uniforms.uForestMap = { value: bank.forestFloor.map };
    shader.uniforms.uForestNor = { value: bank.forestFloor.normalMap };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute vec4 aSplat;
        varying vec4 vSplat;
        varying vec3 vTerrainWorld;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vSplat = aSplat;
        vTerrainWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D uSandMap;
        uniform sampler2D uSandNor;
        uniform sampler2D uRockMap;
        uniform sampler2D uRockNor;
        uniform sampler2D uForestMap;
        uniform sampler2D uForestNor;
        varying vec4 vSplat;
        varying vec3 vTerrainWorld;
        float tHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float tNoise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(tHash(i), tHash(i+vec2(1,0)), u.x), mix(tHash(i+vec2(0,1)), tHash(i+vec2(1,1)), u.x), u.y);
        }`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        vec2 uvA = vTerrainWorld.xz * 0.075;
        vec2 uvB = vTerrainWorld.xz * 0.018;
        vec3 grassCol = mix(diffuseColor.rgb, texture2D(map, uvB * 2.1).rgb, 0.35);
        vec3 sandCol = mix(texture2D(uSandMap, uvA * 1.4).rgb, texture2D(uSandMap, uvB * 2.5).rgb, 0.35);
        vec3 rockCol = mix(texture2D(uRockMap, vTerrainWorld.xy * 0.06 + vTerrainWorld.zy * 0.06).rgb, texture2D(uRockMap, uvA).rgb, 0.4);
        vec3 forestCol = texture2D(uForestMap, uvA * 1.2).rgb;

        float macroPatch = tNoise(vTerrainWorld.xz * 0.028);
        vec3 col = grassCol * (0.78 + 0.38 * macroPatch);
        col = mix(col, forestCol, clamp(vSplat.a, 0.0, 1.0));
        col = mix(col, sandCol, clamp(vSplat.r, 0.0, 1.0));
        // Darken wet sand along water edge (vSplat.g)
        col = mix(col, col * vec3(0.46, 0.44, 0.40), clamp(vSplat.g * vSplat.r, 0.0, 0.85));
        col = mix(col, rockCol, clamp(vSplat.b, 0.0, 1.0));
        diffuseColor.rgb = col;`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        // Wet sand near shoreline gets slick/glossy (roughness 0.25)!
        roughnessFactor = mix(roughnessFactor, 0.22, clamp(vSplat.g * vSplat.r, 0.0, 1.0));`
      );
  };
  mat.customProgramCacheKey = () => 'terrain-splat-v1';
  return mat;
}
