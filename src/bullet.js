import * as THREE from 'three'
import { findEmptyPosition } from './custom-controls.js'

/**
 * @param {THREE.Scene} scene
 */

export function createBullet(scene) {
  const bulletModel = new THREE.SphereGeometry(1, 8, 8)
  const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const bulletMesh = new THREE.Mesh(bulletModel, bulletMaterial)

  bulletMesh.scale.setScalar(0.25)

  scene.add(bulletMesh)

  return bulletMesh
}
