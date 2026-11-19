import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * Merges static THREE.Mesh children inside `rootGroup` grouped by `(material, castShadow, receiveShadow)`
 * into single batched BufferGeometries, slashing thousands of static draw calls down to ~15-25 calls
 * while preserving exact world transforms, UVs, normals, materials (including live Night emissive updates!),
 * lights, and any excluded dynamic subtrees!
 */
export function mergeStaticGroupByMaterial(
  rootGroup: THREE.Group,
  excludeSet: Set<THREE.Object3D> = new Set()
): { beforeMeshes: number; afterMeshes: number } {
  rootGroup.updateMatrixWorld(true);
  const invRoot = new THREE.Matrix4().copy(rootGroup.matrixWorld).invert();
  const relMat = new THREE.Matrix4();

  const isExcluded = (obj: THREE.Object3D): boolean => {
    let cur: THREE.Object3D | null = obj;
    while (cur && cur !== rootGroup) {
      if (excludeSet.has(cur)) return true;
      cur = cur.parent;
    }
    return false;
  };

  interface Bucket {
    mat: THREE.Material;
    castShadow: boolean;
    receiveShadow: boolean;
    geoms: THREE.BufferGeometry[];
  }

  const buckets = new Map<string, Bucket>();
  const matIds = new Map<THREE.Material, number>();
  let nextMatId = 1;
  const toRemove: THREE.Mesh[] = [];
  const keepLights: Array<{ light: THREE.Light; worldPos: THREE.Vector3 }> = [];

  rootGroup.traverse((obj) => {
    if (obj === rootGroup || isExcluded(obj)) return;
    if (obj instanceof THREE.Light && obj.parent !== rootGroup) {
      const wp = new THREE.Vector3();
      obj.getWorldPosition(wp);
      keepLights.push({ light: obj, worldPos: wp });
    }
    if (obj instanceof THREE.Mesh && !(obj instanceof THREE.InstancedMesh)) {
      if (Array.isArray(obj.material)) return;
      const mat = obj.material;
      let mid = matIds.get(mat);
      if (!mid) {
        mid = nextMatId++;
        matIds.set(mat, mid);
      }
      const key = `${mid}_${obj.castShadow ? 1 : 0}_${obj.receiveShadow ? 1 : 0}`;
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { mat, castShadow: obj.castShadow, receiveShadow: obj.receiveShadow, geoms: [] };
        buckets.set(key, bucket);
      }

      const cloned = obj.geometry.index ? obj.geometry.toNonIndexed() : obj.geometry.clone();
      relMat.multiplyMatrices(invRoot, obj.matrixWorld);
      cloned.applyMatrix4(relMat);
      if (!cloned.attributes.normal) cloned.computeVertexNormals();
      if (!cloned.attributes.uv) {
        const cnt = cloned.attributes.position.count;
        cloned.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(cnt * 2), 2));
      }
      // Keep only standard PBR attributes so mergeGeometries never mismatches
      for (const attrName of Object.keys(cloned.attributes)) {
        if (attrName !== 'position' && attrName !== 'normal' && attrName !== 'uv') {
          cloned.deleteAttribute(attrName);
        }
      }
      bucket.geoms.push(cloned);
      toRemove.push(obj);
    }
  });

  // Reparent any nested PointLights directly onto rootGroup at their exact local positions before pruning meshes
  for (const { light, worldPos } of keepLights) {
    const localPos = worldPos.clone().applyMatrix4(invRoot);
    light.parent?.remove(light);
    light.position.copy(localPos);
    rootGroup.add(light);
  }

  for (const m of toRemove) {
    m.parent?.remove(m);
  }

  // Prune empty non-excluded sub-groups to keep scene graph traversal lightning fast
  const pruneEmpty = (node: THREE.Object3D) => {
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      if (excludeSet.has(child)) continue;
      pruneEmpty(child);
      if (child.type === 'Group' && child.children.length === 0) {
        node.remove(child);
      }
    }
  };
  pruneEmpty(rootGroup);

  let afterMeshes = 0;
  for (const [, bucket] of buckets) {
    if (bucket.geoms.length === 0) continue;
    const merged = BufferGeometryUtils.mergeGeometries(bucket.geoms, false);
    for (const g of bucket.geoms) g.dispose();
    if (!merged) continue;
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, bucket.mat);
    mesh.name = `${rootGroup.name}_batch_${afterMeshes}`;
    mesh.castShadow = bucket.castShadow;
    mesh.receiveShadow = bucket.receiveShadow;
    rootGroup.add(mesh);
    afterMeshes++;
  }

  return { beforeMeshes: toRemove.length, afterMeshes };
}
