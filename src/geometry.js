import * as THREE from 'three'

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Texture} map
 * @param {THREE.Texture} normal
 * @param {THREE.Texture} disp
 * @param {THREE.Texture} ao
 * @param {THREE.Texture} rough
 * @param {number} [width]
 * @param {number} [height]
 * @param {number} [depth]
 */
export function createGeometry(scene, map, normal, disp, ao, rough, width = 1, height = 1, depth = 1) {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  geometry.attributes.uv2 = geometry.attributes.uv

  const material = new THREE.MeshStandardMaterial({
    map,
    normalMap: normal,
    normalScale: new THREE.Vector2(4, 4),
    displacementMap: disp,
    displacementScale: 0,
    aoMap: ao,
    aoMapIntensity: 1,
    roughnessMap: rough,
    roughness: 0.75
  })

  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)
  
  const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5, 10, 10)
  const planeMaterial = new THREE.MeshStandardMaterial({ map })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.x = 2
  scene.add(plane)
  return mesh

}