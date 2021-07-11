import * as THREE from 'three';

type AnyMaterial = THREE.Material & { [key: string]: THREE.Texture };

function disposeMaterial(material: AnyMaterial) {
  if (material.map) material.map.dispose();
  if (material.lightMap) material.lightMap.dispose();
  if (material.bumpMap) material.bumpMap.dispose();
  if (material.normalMap) material.normalMap.dispose();
  if (material.specularMap) material.specularMap.dispose();
  if (material.envMap) material.envMap.dispose();
  if (material.alphaMap) material.alphaMap.dispose();
  if (material.aoMap) material.aoMap.dispose();
  if (material.displacementMap) material.displacementMap.dispose();
  if (material.emissiveMap) material.emissiveMap.dispose();
  if (material.gradientMap) material.gradientMap.dispose();
  if (material.metalnessMap) material.metalnessMap.dispose();
  if (material.roughnessMap) material.roughnessMap.dispose();
  material.dispose(); // disposes any programs associated with the material
}

export function disposeNode(node: THREE.Object3D): void {
  try {
    node.traverse(disposeNode);

    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }

      if (node.material) {
        if (node.material instanceof Array) {
          node.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(node.material);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
