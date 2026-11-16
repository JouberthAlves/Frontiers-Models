import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export interface LightingRig {
  sunLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  sunDir: THREE.Vector3;
  updateShadowTarget: (focusPos: THREE.Vector3) => void;
  setQuality: (quality: 'high' | 'low') => void;
}

function createSunGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(256, 256, 4, 256, 256, 250);
  grad.addColorStop(0.0, 'rgba(255, 245, 215, 0.95)');
  grad.addColorStop(0.12, 'rgba(255, 200, 120, 0.55)');
  grad.addColorStop(0.35, 'rgba(255, 155, 70, 0.16)');
  grad.addColorStop(1.0, 'rgba(255, 120, 40, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export async function setupGoldenHourLighting(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  sunDirectionTuple: [number, number, number]
): Promise<LightingRig> {
  const sunDir = new THREE.Vector3(...sunDirectionTuple).normalize();

  // Load local CC0 Poly Haven PureSky HDRI
  const loader = new RGBELoader();
  const hdrTex = await loader.loadAsync('./assets/hdri/qwantani_sunset_puresky_2k.hdr');
  hdrTex.mapping = THREE.EquirectangularReflectionMapping;

  // Align HDRI sun azimuth (u=0.5999 => phi_hdri=+0.6277 rad) with track sunDirection!
  const phiHdri = (0.5999 - 0.5) * Math.PI * 2;
  const phiTarget = Math.atan2(sunDir.z, sunDir.x);
  const rotY = phiHdri - phiTarget;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(hdrTex);
  pmrem.dispose();

  scene.background = hdrTex;
  scene.environment = envRT.texture;
  scene.backgroundRotation = new THREE.Euler(0, rotY, 0);
  scene.environmentRotation = new THREE.Euler(0, rotY, 0);
  // Keep ambient IBL balanced so directional shadows stay crisp and sky preserves deep blue->gold gradient!
  scene.environmentIntensity = 0.65;
  scene.backgroundIntensity = 0.44;

  // Subtle hemisphere bounce (cool coastal sky zenith vs warm sandstone/earth bounce)
  const hemiLight = new THREE.HemisphereLight(0x5b86ba, 0x3a2a1e, 0.26);
  scene.add(hemiLight);

  // Main directional sun matched to golden hour angle and warm amber tint
  const sunLight = new THREE.DirectionalLight(0xffb468, 3.4);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  const shadowExtent = 75;
  sunLight.shadow.camera.left = -shadowExtent;
  sunLight.shadow.camera.right = shadowExtent;
  sunLight.shadow.camera.top = shadowExtent;
  sunLight.shadow.camera.bottom = -shadowExtent;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 420;
  sunLight.shadow.bias = -0.00035;
  sunLight.shadow.normalBias = 0.035;
  scene.add(sunLight);
  scene.add(sunLight.target);

  // Subtle distant sun disc / halo sprite aligned to sunDir (no blown flare!)
  const sunSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createSunGlowTexture(),
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
  );
  sunSprite.scale.set(420, 420, 1);
  scene.add(sunSprite);

  // Distance-only warm coastal atmospheric haze (starts > 175 m, never foggy near camera!)
  scene.fog = new THREE.Fog(0xd49b6c, 190, 3400);

  const shadowOrigin = new THREE.Vector3();
  const sunRight = new THREE.Vector3().crossVectors(sunDir, new THREE.Vector3(0, 1, 0)).normalize();
  const sunUp = new THREE.Vector3().crossVectors(sunRight, sunDir).normalize();

  const updateShadowTarget = (focusPos: THREE.Vector3) => {
    // Texel-snap shadow frustum in light space so shadows NEVER shimmer while driving!
    const currentExtent = sunLight.shadow.camera.right;
    const mapRes = sunLight.shadow.mapSize.x;
    const texelWorldSize = (currentExtent * 2) / mapRes;

    const uCoord = Math.round(focusPos.dot(sunRight) / texelWorldSize) * texelWorldSize;
    const vCoord = Math.round(focusPos.dot(sunUp) / texelWorldSize) * texelWorldSize;
    const wCoord = focusPos.dot(sunDir);

    shadowOrigin
      .set(0, 0, 0)
      .addScaledVector(sunRight, uCoord)
      .addScaledVector(sunUp, vCoord)
      .addScaledVector(sunDir, wCoord);

    sunLight.target.position.copy(shadowOrigin);
    sunLight.target.updateMatrixWorld();
    sunLight.position.copy(shadowOrigin).addScaledVector(sunDir, 190);
    sunSprite.position.copy(focusPos).addScaledVector(sunDir, 9000);
  };

  const setQuality = (quality: 'high' | 'low') => {
    if (quality === 'low') {
      sunLight.shadow.mapSize.set(1024, 1024);
      const ext = 55;
      sunLight.shadow.camera.left = -ext;
      sunLight.shadow.camera.right = ext;
      sunLight.shadow.camera.top = ext;
      sunLight.shadow.camera.bottom = -ext;
      sunLight.shadow.camera.updateProjectionMatrix();
      if (sunLight.shadow.map) {
        sunLight.shadow.map.dispose();
        sunLight.shadow.map = null;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
    } else {
      sunLight.shadow.mapSize.set(2048, 2048);
      const ext = 75;
      sunLight.shadow.camera.left = -ext;
      sunLight.shadow.camera.right = ext;
      sunLight.shadow.camera.top = ext;
      sunLight.shadow.camera.bottom = -ext;
      sunLight.shadow.camera.updateProjectionMatrix();
      if (sunLight.shadow.map) {
        sunLight.shadow.map.dispose();
        sunLight.shadow.map = null;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }
  };

  return { sunLight, hemiLight, sunDir, updateShadowTarget, setQuality };
}
