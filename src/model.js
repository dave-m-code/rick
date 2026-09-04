import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { findEmptyPosition } from './custom-controls.js'

/**
 * @param {THREE.Scene} scene
 */
export function createCharacter(scene) {
  
  const model = new THREE.Group()
  scene.add(model)

  return model
}


/**
 * @param {THREE.Object3D} model
 * @param {string} url
 * @param {{
 *   buildings: THREE.Object3D[],
 *   area: { minX: number, maxX: number, minZ: number, maxZ: number },
 *   camera: THREE.PerspectiveCamera,
 *   controls: { target: THREE.Vector3, update: () => void },
 *   bullet?: THREE.Object3D,
 * }} options
 */
export function loadCharacterModel(model, url, { buildings, area, camera, controls, bullet }) {
  const gltfLoader = new GLTFLoader()

  gltfLoader.load(url, (gltf) => {
    console.log('Modello caricato:', gltf)

    model.add(gltf.scene)
    model.scale.setScalar(2)
    model.position.set(0, 0, 2)
    model.rotation.set(0, Math.PI, 0)

    const emptyPosition = findEmptyPosition(model, buildings, area)
    if (emptyPosition) model.position.copy(emptyPosition)

    if (bullet) bullet.position.copy(model.position)

    const modelBounds = new THREE.Box3().setFromObject(model)
    const modelCenter = modelBounds.getCenter(new THREE.Vector3())
    // camera.lookAt(modelCenter)
    controls.target.copy(modelCenter)
    controls.update()
  }, undefined, (error) => {
    console.error('Errore nel caricamento del modello:', error)
  })
}
