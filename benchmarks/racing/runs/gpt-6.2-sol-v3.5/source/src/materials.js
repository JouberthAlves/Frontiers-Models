import * as T from 'three';

export const asset = file => `${import.meta.env.BASE_URL}assets/${file}`;

export class TextureBank {
  constructor(renderer, progress = () => {}) {
    this.manager = new T.LoadingManager();
    this.manager.onProgress = (_url, loaded, total) => progress(loaded, total);
    this.loader = new T.TextureLoader(this.manager);
    this.maxAnisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    this.textures = new Map();
  }

  texture(name, channel, color = false) {
    const key = `${name}-${channel}`;
    if (!this.textures.has(key)) {
      const source = asset(key + '.webp');
      const texture = this.loader.load(source);
      texture.name = key;
      texture.userData.file = source;
      if (color) texture.colorSpace = T.SRGBColorSpace;
      texture.wrapS = texture.wrapT = T.RepeatWrapping;
      texture.anisotropy = this.maxAnisotropy;
      this.textures.set(key, texture);
    }
    return this.textures.get(key);
  }

  maps(name, options = {}) {
    const map = this.texture(name, 'a', true);
    const normalMap = this.texture(name, 'n');
    const roughnessMap = this.texture(name, 'r');
    const aoMap = options.ao === false ? null : this.texture(name, 'o');
    return { map, normalMap, roughnessMap, aoMap };
  }

  surface(name, properties = {}, options = {}) {
    return new T.MeshStandardMaterial({
      name, ...this.maps(name, options), roughness: .87, ...properties,
    });
  }
}

export function materialShader(material, key, extension) {
  material.userData.extension = extension;
  material.customProgramCacheKey = () => key;
  return material;
}
