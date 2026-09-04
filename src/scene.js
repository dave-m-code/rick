import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()

  const light = new THREE.DirectionalLight(0xffffff, 2)
  light.position.set(4, 4, 4)
  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)

  return scene
}
