declare module 'n8ao' {
  import * as THREE from 'three';
  import { Pass } from 'three/addons/postprocessing/Pass.js';

  export class N8AOPass extends Pass {
    constructor(
      scene: THREE.Scene,
      camera: THREE.Camera,
      width?: number,
      height?: number
    );
    configuration: {
      aoSamples: number;
      denoiseSamples: number;
      denoiseRadius: number;
      aoRadius: number;
      distanceFalloff: number;
      intensity: number;
      halfRes: boolean;
      depthAwareUpsampling: boolean;
      color: THREE.Color;
      gammaCorrection: boolean;
      renderMode: number;
    };
    setQualityMode(mode: 'Performance' | 'Low' | 'Medium' | 'High' | 'Ultra'): void;
    dispose(): void;
  }
}
