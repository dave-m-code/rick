import * as THREE from 'three'
import { findEmptyPosition } from './custom-controls.js'

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Object3D[]} buildings
 * @param {{ minX: number, maxX: number, minZ: number, maxZ: number }} area
 * @param {number} [quantity]
 */
export function createEnemy(scene, buildings, area, quantity = 10) {

    const enemies = []
    // Parte dai building e via via include anche i nemici già piazzati,
    // così findEmptyPosition evita sia gli edifici sia gli altri nemici.
    const obstacles = [...buildings]

    for (let i = 0; i < quantity; i++) {

        const enemyModel = new THREE.BoxGeometry(10, 10, 10)
        const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
        const enemyMesh = new THREE.Mesh(enemyModel, enemyMaterial)

        enemyMesh.position.set(0, 5, 0) // Posizione iniziale, sovrascritta sotto se si trova un punto libero

        const emptyPosition = findEmptyPosition(enemyMesh, obstacles, area)
        if (emptyPosition) enemyMesh.position.copy(emptyPosition)

      scene.add(enemyMesh)
      enemies.push(enemyMesh)
      obstacles.push(enemyMesh)

    }

    return enemies
}