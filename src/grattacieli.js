import * as THREE from 'three'

const BUILDING_SIZE = 10
const GAP_X = 4
const GAP_Z = 8
const STEP_X = BUILDING_SIZE + GAP_X
const STEP_Z = BUILDING_SIZE + GAP_Z

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Material} material
 * @param {number} [size] lato della griglia di edifici: il totale prima della rimozione è `size * size`. Determina anche la superficie del ground (vedi `createGround`, va chiamata con lo stesso valore).
 * @param {number} [removalRate] percentuale (0-1) di edifici da rimuovere a caso dalla griglia, per lasciare degli spazi vuoti nella città. La quantità rimossa è deterministica (`size * size * removalRate`), solo quali edifici restano è casuale.
 */
export function createCity(scene, material, size = 10, removalRate = 0.35) {
  const buildings = []

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const height = Math.random() * 6 + 4
      const geometry = new THREE.BoxGeometry(BUILDING_SIZE, height, BUILDING_SIZE)
      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(-size + i * STEP_X, height / 2, -size + j * STEP_Z)
      scene.add(mesh)
      buildings.push(mesh)
    }
  }

  const buildingsToRemove = Math.round(buildings.length * removalRate)

  for (let i = 0; i < buildingsToRemove; i++) {
    const randomIndex = Math.floor(Math.random() * buildings.length)
    const [building] = buildings.splice(randomIndex, 1)

    scene.remove(building)
    building.geometry.dispose()
  }

  return buildings
}

/**
 * @param {THREE.Scene} scene
 * @param {number} size lato della griglia di edifici — va passato lo stesso valore usato in `createCity`, così la superficie del ground segue automaticamente il numero di edifici.
 */
export function createGround(scene, size) {
  const width = (size - 1) * STEP_X + BUILDING_SIZE
  const depth = (size - 1) * STEP_Z + BUILDING_SIZE
  const centerX = -size + (size - 1) * (STEP_X / 2)
  const centerZ = -size + (size - 1) * (STEP_Z / 2)

  const geometry = new THREE.PlaneGeometry(width, depth)
  const material = new THREE.MeshStandardMaterial({ color: 0x808080 })
  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  plane.position.set(centerX, -0.01, centerZ)
  scene.add(plane)

  return { centerX, centerZ, width, depth }
}

