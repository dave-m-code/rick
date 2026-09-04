import * as THREE from 'three'

/**
 * @param {{ width: number, height: number }} sizes
 */
export function createRenderer(sizes) {
  const renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  document.body.appendChild(renderer.domElement)

  return renderer
}

/**
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @param {{ width: number, height: number }} sizes
 */
export function handleResize(camera, renderer, sizes) {
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}
