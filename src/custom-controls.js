import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
/**
 * @param {THREE.Box3} firstBounds
 * @param {THREE.Box3} secondBounds
 */
function intersectsOnGround(firstBounds, secondBounds) {
  return firstBounds.max.x > secondBounds.min.x &&
    firstBounds.min.x < secondBounds.max.x &&
    firstBounds.max.z > secondBounds.min.z &&
    firstBounds.min.z < secondBounds.max.z
}

/**
 * @param {THREE.PerspectiveCamera} camera
 * @param {HTMLElement} domElement
 */
export function createCameraControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement)
  controls.enablePan = true
  controls.minDistance = 2
  controls.maxDistance = 10

  return controls
}

/**
 * Camera libera in prima persona (WASD + mouse per guardarsi intorno),
 * scollegata dal personaggio e dagli edifici: nessuna collisione.
 * Parte disattivata (`enabled = false`); va abilitata da chi la usa quando
 * si passa alla modalità free-fly.
 * @param {THREE.PerspectiveCamera} camera
 * @param {HTMLElement} domElement
 */
export function createFirstPersonControls(camera, domElement) {
  const controls = new FirstPersonControls(camera, domElement)
  controls.movementSpeed = 20
  controls.lookSpeed = 0.1
  controls.lookVertical = true
  controls.constrainVertical = true
  controls.verticalMin = 0.1
  controls.verticalMax = Math.PI - 0.1
  controls.enabled = false

  return controls
}

/**
 * Ruota la camera attorno al target in base a quanto il cursore è spostato
 * dal centro dello schermo, senza bisogno di trascinare né di muovere il
 * mouse: finché il cursore resta verso un lato, la rotazione continua
 * (proporzionale alla distanza dal centro), esattamente come lo sguardo di
 * `FirstPersonControls` (stessa formula: offset in pixel dal centro ×
 * lookSpeed × deltaTime, integrato ogni frame — vedi
 * `FirstPersonControls.update()`/`onMouseMove()` in three.js). Nessun
 * limite sul giro orizzontale. Distanza dal target invariata (quella
 * impostata dallo zoom). Il personaggio si gira di conseguenza tramite
 * `updateModelRotation` (in `main.js`), che lo orienta verso la posizione
 * della camera. Va chiamata (con il deltaTime del frame) dopo aver
 * aggiornato `controls.target` e prima di `controls.update()`.
 * @param {THREE.PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {{ lookSpeed?: number }} [options]
 */
export function createMouseOrbit(camera, controls, { lookSpeed = 0.005 } = {}) {
  const EPS = 0.01
  const offset = new THREE.Vector3().copy(camera.position).sub(controls.target)
  const spherical = new THREE.Spherical().setFromVector3(offset)
  const angles = new THREE.Vector2(spherical.theta, spherical.phi)

  let pointerX = 0
  let pointerY = 0

  /** @param {MouseEvent} event */
  const onMouseMove = (event) => {
    pointerX = event.clientX - window.innerWidth / 2
    pointerY = event.clientY - window.innerHeight / 2
  }

  window.addEventListener('mousemove', onMouseMove)

  /** @param {number} deltaTime */
  return (deltaTime) => {
    angles.x -= pointerX * lookSpeed * deltaTime
    angles.y = THREE.MathUtils.clamp(angles.y + pointerY * lookSpeed * deltaTime, EPS, Math.PI/2 - EPS)

    offset.copy(camera.position).sub(controls.target)
    spherical.setFromVector3(offset)
    spherical.theta = angles.x
    spherical.phi = angles.y
    offset.setFromSpherical(spherical)
    camera.position.copy(controls.target).add(offset)
  }
}

/**
 * @param {THREE.Object3D} model
 * @param {THREE.Object3D[]} buildings
 * @param {{ minX: number, maxX: number, minZ: number, maxZ: number }} area
 */
export function findEmptyPosition(model, buildings, area) {
  const modelBounds = new THREE.Box3().setFromObject(model)
  if (modelBounds.isEmpty()) return null

  const modelCenter = modelBounds.getCenter(new THREE.Vector3())
  const modelSize = modelBounds.getSize(new THREE.Vector3())
  const candidateBounds = new THREE.Box3()
  const buildingBounds = buildings.map((building) => new THREE.Box3().setFromObject(building))
  const candidatePosition = new THREE.Vector3()
  const movement = new THREE.Vector3()

  for (let attempt = 0; attempt < 500; attempt++) {
    candidatePosition.set(
      THREE.MathUtils.randFloat(area.minX, area.maxX),
      model.position.y,
      THREE.MathUtils.randFloat(area.minZ, area.maxZ),
    )
    movement.subVectors(candidatePosition, model.position)
    candidateBounds.setFromCenterAndSize(
      modelCenter.clone().add(movement),
      modelSize,
    )

    if (!buildingBounds.some((bounds) => intersectsOnGround(candidateBounds, bounds))) {
      return candidatePosition
    }
  }

  return null
}

/**
 * @param {THREE.Object3D} model
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.Object3D[]} buildings
 */
export function createModelControls(model, camera, buildings) {
  const pressedKeys = new Set()
  const movement = new THREE.Vector3()
  const cameraDirection = new THREE.Vector3()
  const cameraRight = new THREE.Vector3()
  const modelBounds = new THREE.Box3()
  const nextModelBounds = new THREE.Box3()
  const modelBoundsCenter = new THREE.Vector3()
  const modelBoundsSize = new THREE.Vector3()
  const buildingBounds = buildings.map((building) => new THREE.Box3().setFromObject(building))
  const collisionScale = 0.8
  const speed = 8

  /** @param {KeyboardEvent} event */
  const onKeyDown = (event) => {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
      pressedKeys.add(event.code)
      event.preventDefault()
    }
  }

  /** @param {KeyboardEvent} event */
  const onKeyUp = (event) => {
    pressedKeys.delete(event.code)
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  /** @param {number} deltaTime */
  function update(deltaTime) {
    movement.set(0, 0, 0)

    camera.getWorldDirection(cameraDirection)
    cameraDirection.y = 0
    cameraDirection.normalize()
    cameraRight.set(-cameraDirection.z, 0, cameraDirection.x)

    if (pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp')) movement.add(cameraDirection)
    if (pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')) movement.sub(cameraDirection)
    if (pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft')) movement.sub(cameraRight)
    if (pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) movement.add(cameraRight)

    if (movement.lengthSq() > 0) {
      movement.normalize().multiplyScalar(speed * deltaTime)

      modelBounds.setFromObject(model)
      if (modelBounds.isEmpty()) return

      modelBounds.getCenter(modelBoundsCenter)
      modelBounds.getSize(modelBoundsSize).multiplyScalar(collisionScale)
      modelBounds.setFromCenterAndSize(modelBoundsCenter, modelBoundsSize)
      nextModelBounds.copy(modelBounds).translate(movement)

      const hitsBuilding = buildingBounds.some((bounds) => intersectsOnGround(nextModelBounds, bounds))

      if (!hitsBuilding) model.position.add(movement)
    }
  }

  return update
}



