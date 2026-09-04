import * as THREE from 'three'
import mapSrc from './textures/Rock064_4K-JPG_Color.jpg'
import dispSrc from './textures/Rock064_4K-JPG_Displacement.jpg'
import normalSrc from './textures/Rock064_4K-JPG_NormalGL.jpg'
import aoSrc from './textures/Rock064_4K-JPG_AmbientOcclusion.jpg'
import roughSrc from './textures/Rock064_4K-JPG_Roughness.jpg'

function createLoadingManager() {
  const loadingManager = new THREE.LoadingManager()

  loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`)
  }

  loadingManager.onLoad = () => {
    console.log('Loading complete!')
  }

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loading in progress:` + Math.ceil((100 * itemsLoaded) / itemsTotal) + `%`)
  }

  loadingManager.onError = (url) => {
    console.log(`There was an error loading ${url}`)
  }

  return loadingManager
}

export function createCityMaterial() {
  const textureLoader = new THREE.TextureLoader(createLoadingManager())

  const map = textureLoader.load(mapSrc)
  map.repeat.set(2, 2)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.offset.set(-0.5, -0.5)
  map.magFilter = THREE.NearestFilter

  const disp = textureLoader.load(dispSrc)
  const normal = textureLoader.load(normalSrc)
  normal.colorSpace = THREE.NoColorSpace
  const ao = textureLoader.load(aoSrc)
  const rough = textureLoader.load(roughSrc)

  return new THREE.MeshStandardMaterial({
    map,
    normalMap: normal,
    normalScale: new THREE.Vector2(4, 4),
    displacementMap: disp,
    displacementScale: 0,
    aoMap: ao,
    aoMapIntensity: 1,
    roughnessMap: rough,
    roughness: 0.75,
  })
}
