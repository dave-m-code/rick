import './style.css'
import * as THREE from 'three'
import { createScene } from './scene.js'
import { createCamera } from './camera.js'
import { createRenderer, handleResize } from './renderer.js'
import { createCityMaterial } from './textures.js'
import { createCity, createGround } from './grattacieli.js'
import { createCameraControls, createModelControls, createMouseOrbit, createFirstPersonControls } from './custom-controls.js'
import { createCharacter, loadCharacterModel } from './model.js'
import { createEnemy } from './enemy.js'
import { createBullet } from './bullet.js'

const sizes = { width: window.innerWidth, height: window.innerHeight }

const scene = createScene()
const camera = createCamera(sizes)
const renderer = createRenderer(sizes)

const cityMaterial = createCityMaterial()
const citySize = 10
const buildings = createCity(scene, cityMaterial, citySize)
const ground = createGround(scene, citySize)
const area = {
  minX: ground.centerX - ground.width / 2,
  maxX: ground.centerX + ground.width / 2,
  minZ: ground.centerZ - ground.depth / 2,
  maxZ: ground.centerZ + ground.depth / 2,
}

const model = createCharacter(scene)
camera.lookAt(model.position)

const enemiesQuantity = 10
const enemies = createEnemy(scene, buildings, area, enemiesQuantity)
const bullet = createBullet(scene)
const bulletSpeed = 30
const bulletDirection = new THREE.Vector3(0, 0, 1)
let bulletFiring = false

/**
 * `bullet` è un Object3D e quindi eredita già `addEventListener`/`dispatchEvent`
 * da THREE.EventDispatcher: il click sinistro dispaccia un evento 'fire' che
 * riparte dalla posizione del personaggio e avvia il movimento del bullet
 * nella direzione in cui il personaggio è rivolto in quel momento (stessa
 * convenzione trigonometrica di `updateModelRotation`: `model.rotation.y`
 * corrisponde alla direzione `(sin θ, 0, cos θ)`).
 */
// @ts-ignore evento custom, non presente in Object3DEventMap
bullet.addEventListener('fire', () => {
  bullet.position.set(model.position.x, 2, model.position.z)
  bulletDirection.set(Math.sin(model.rotation.y), 0, Math.cos(model.rotation.y))
  bulletFiring = true
})

window.addEventListener('mousedown', (event) => {
  if (event.button !== 0) return
  // @ts-ignore evento custom, non presente in Object3DEventMap
  bullet.dispatchEvent({ type: 'fire' })
})
const enemyHalfSizes = new Map()

for (const enemy of enemies) {
    // Calcola il box di ingombro del nemico
    enemy.geometry.computeBoundingBox()
    const size = new THREE.Vector3()
    enemy.geometry.boundingBox?.getSize(size)

    // Vettore con metà dimensioni (X, Y, Z), una entry per nemico
    enemyHalfSizes.set(enemy, size.multiplyScalar(0.5))
}

const bulletRadius = bullet.geometry.parameters.radius

const enemyInverseMatrix = new THREE.Matrix4()
const bulletLocalPosition = new THREE.Vector3()
const hitEnemies = new Set()

/**
 * Per ogni nemico, proietta la posizione del bullet nel suo spazio locale
 * tramite l'inversa della matrice mondo (Matrix4), poi confronta con la
 * semi-estensione locale del box (+ raggio del bullet). A differenza di un
 * controllo in spazio mondiale con Box3, regge anche se un nemico viene
 * ruotato o scalato.
 */
function checkEnemyBulletCollision() {
  bullet.updateMatrixWorld()

  for (const enemy of enemies) {
    enemy.updateMatrixWorld()

    enemyInverseMatrix.copy(enemy.matrixWorld).invert()
    bulletLocalPosition.setFromMatrixPosition(bullet.matrixWorld).applyMatrix4(enemyInverseMatrix)

    const enemyHalfSize = enemyHalfSizes.get(enemy)
    const isColliding =
      Math.abs(bulletLocalPosition.x) < enemyHalfSize.x + bulletRadius &&
      Math.abs(bulletLocalPosition.y) < enemyHalfSize.y + bulletRadius &&
      Math.abs(bulletLocalPosition.z) < enemyHalfSize.z + bulletRadius

    if (isColliding && !hitEnemies.has(enemy)) {
      console.log('SHOOT!')

    }

    if (isColliding){
       hitEnemies.add(enemy)
        enemy.material.color.set('green')
    }
    else hitEnemies.delete(enemy)

  }
}

window.addEventListener('load', () => {
  // Execute code requiring full mediac/style rendering
  checkEnemyBulletCollision()

  

});

const controls = createCameraControls(camera, renderer.domElement)
controls.target.copy(model.position)
controls.update()

const updateModelControls = createModelControls(model, camera, buildings)
const updateMouseOrbit = createMouseOrbit(camera, controls)
const firstPersonControls = createFirstPersonControls(camera, renderer.domElement)

let freeFlyMode = false

window.addEventListener('keydown', (event) => {
  if (event.code !== 'KeyF') return

  freeFlyMode = !freeFlyMode
  controls.enabled = !freeFlyMode
  firstPersonControls.enabled = freeFlyMode
})

loadCharacterModel(model, `${import.meta.env.BASE_URL}models/gltf/rick_sanchez/scene.gltf`, {
  buildings,
  camera,
  controls,
  bullet,
  area,
})

const clock = new THREE.Clock()
const modelBounds = new THREE.Box3()

function updateModelRotation() {
  const directionX = camera.position.x - controls.target.x
  const directionZ = camera.position.z - controls.target.z
  model.rotation.y = Math.atan2(directionX, directionZ) + Math.PI
}

function animate() {
  const deltaTime = clock.getDelta()

  if (bulletFiring) bullet.position.addScaledVector(bulletDirection, bulletSpeed * deltaTime)

  checkEnemyBulletCollision()

  if (freeFlyMode) {
    firstPersonControls.update(deltaTime)
  } else {
    const previousModelPosition = model.position.clone()
    updateModelControls(deltaTime)
    const modelMovement = model.position.clone().sub(previousModelPosition)
    camera.position.add(modelMovement)
    // Ricalcola il centro reale del personaggio (non solo la posizione del
    // pivot) ad ogni frame: il mesh del GLTF non è centrato sul pivot del
    // Group, quindi ruotando il personaggio il suo baricentro visivo si
    // sposta nello spazio mondo — se il target si limitasse a traslare
    // insieme al pivot, dopo una rotazione risulterebbe decentrato.
    modelBounds.setFromObject(model)
    modelBounds.getCenter(controls.target)
    updateMouseOrbit(deltaTime)
    controls.update()
    updateModelRotation()
  }

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

window.addEventListener('resize', () => firstPersonControls.handleResize())
handleResize(camera, renderer, sizes)
requestAnimationFrame(animate)
renderer.render(scene, camera)
