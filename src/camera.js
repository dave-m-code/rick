import * as THREE from 'three'

/**
 * @param {{ width: number, height: number }} sizes
 */

export function createCamera(sizes) {
  const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 1000)
  camera.position.set(0, -0.5, -10)

  return camera
}
