// import './style.css'
// import * as THREE from 'three'
// // import { ArcBallControls } from 'three/examples/jsm/controls/ArcBallControls'
// // import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
// // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// // import { MapControls } from 'three/examples/jsm/controls/MapControls'
// // import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
    
//   const scene = new THREE.Scene();
//   const sizes = { width: innerWidth, height: innerHeight, }
//   const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  
//   const renderer = new THREE.WebGLRenderer({
//       antialias: window.devicePixelRatio < 2,
//   });
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//   document.body.appendChild(renderer.domElement);

//   const geometry = new THREE.BoxGeometry();
//   const material = new THREE.MeshNormalMaterial();
//   const mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh);

//   const size = 30

//   // // CREA GRATTACIELI
//   for (let i = 0; i < size; i++) {
//     for (let j = 0; j < size; j++) {
//         const height = Math.random() * 40 + 1 

//         const geometry = new THREE.BoxGeometry(1, height, 1)
//         const mesh = new THREE.Mesh(geometry, material)
//         mesh.position.set( -size + i * 10, height / 2, -size + j * 4 )
//         scene.add(mesh) 
//     }        
//   }


// // SPOSTA , RUOTA, SCALA   
//       // mesh.position.x = 2
//       // mesh.position.set(1, 0, -2)

//       // const pos2 = new THREE.Vector3(2, 2, 0)

//       // mesh.position.copy(pos2);

//       // mesh.position.x += 1
//       // mesh.position.y += 0.5

//       // Aggiungi un vettore a una posizione 

//       // mesh.position.add(new THREE.Vector3(1, 0.5, 0))

//       // const mesh2 = mesh.clone()
//       // const mesh3 = mesh.clone()

//       // // scene.add(mesh2, mesh3)
//       // mesh2.position.x = -2
//       // mesh3.position.x = 2

//       // // mesh2.scale.set(1.2, 1.2, 1.2)
//       // mesh2.scale.multiplyScalar(1.2)
//       // mesh.scale.y = 2
//       // mesh3.scale.set(0.5, 0.75, 3)

//       // const axesHelper = new THREE.AxesHelper(2)

//       // mesh.add(axesHelper.clone())
//       // mesh2.add(axesHelper.clone())
//       // mesh3.add(axesHelper.clone())

//       // mesh2.rotation.y = THREE.MathUtils.degToRad(45)
//       // mesh2.rotation.z = THREE.MathUtils.degToRad(-15)

//       // mesh2.rotation.reorder = 'ZXY'
      
//       // // mesh.quaternion.copy(new THREE.Quaternion().random())

//       // camera.position.y = 1
      
      
//       // const group = new THREE.Group()
//       // group.add(mesh2, mesh3)
//       // scene.add(group)
      
//       // group.position.set(0, 1, -1)
//       // group.scale.multiplyScalar(0.5)
      
//       // const v = new THREE.Vector3()
//       // mesh2.getWorldPosition(v)
      
//       // camera.lookAt(v)

      
//       // const vel = 0.5
      
//       //  let time = Date.now()
      


// camera.position.set(8,8,8)
// camera.lookAt(0, 0, 0)

// const vel = new THREE.Vector3(0, 0, 0)


// // CONTROLLI CAMERA
//   // const controls = new ArcBallControls(camera, renderer.domElement, scene)

//   // const controls = new FlyControls(camera, renderer.domElement)

//   //   controls.rollSpeed = 0.5
//   //   controls.movementSpeed = 2
//   //   controls.autoForward = true

//   const controls = new FirstPersonControls(camera, renderer.domElement)
//     controls.lookSpeed = 0.1
//     controls.lookVertical = true
//     controls.movementSpeed = 10
//     controls.constraintVertical = true
//     controls.verticalMin = Math.PI * 0.5
//     controls.verticalMax = Math.PI * -0.5

//     controls.heightSpeed = true

//     controls.heigthMin = 0
//     controls.heigthMax = 10

//     controls.heigthCoef = 10


//   // 
//   // 
//   // const controls = new OrbitControls(camera, renderer.domElement)
//   // const controls = new MapControls(camera, renderer.domElement)
//     // controls.autoRotate = true
//     // controls.autoRotateSpeed = 2
//     // controls.enableDamping = true
//     // controls.dampingFactor = 0.1  // inertia
//     // controls.enableRotate = false 
//     // controls.rotateSpeed = 0.5
//     // controls.minPolarAngle = Math.PI * 0.25 // rotazione verticale
//     // controls.maxPolarAngle = Math.PI * 0.75 // rotazione verticale
//     // controls.maxAzimuthAngle = -Math.PI * 0.5 // rotazione orizzontale
//     // controls.minAzimuthAngle = Math.PI * 0.5 // rotazione orizzontale

//     // controls.target.set(0, 3, 0)

//     // controls.screenSpacePanning = false



//   // const controls = new PointerLockControls(camera, document.body) 

//   //   window.addEventListener('click', () => {
//   //     if (!controls.isLocked) {
//   //       controls.lock()
//   //     }
//   //   })

//   //   window.addEventListener('keydown', (event) => {
//   //     switch (event.code) {
//   //       case 'KeyA':
//   //         vel.x = -1      
//   //         break;

//   //       case 'KeyD':
//   //         vel.x = 1      
//   //         break;
        
//   //       case 'KeyW':
//   //         vel.z = 1      
//   //         break;
        
//   //       case 'KeyS':
//   //         vel.z = -1      
//   //         break;
//   //     }
//   //   })

//   //   window.addEventListener('keyup', (event) => {
//   //     switch (event.code) {
//   //       case 'KeyA':
//   //       case 'KeyD':
//   //         vel.x = 0      
//   //         break;
        
//   //       case 'KeyW':
//   //       case 'KeyS':
//   //         vel.z = 0      
//   //         break;
//   //     }
//   //   })

//   // 

// // OROLOGIO
// const clock = new THREE.Clock()  

// // ANIMAZIONE PRINCIPALE  - FRAME LOOP
// function animate() {  
//     // const currentTime = Date.now()
//     // const deltaTime = (currentTime - time) / 1000
  
//   //   Tempo in secondi, non in millisecondi
//       const deltaTime = clock.getDelta()
//   //     const time = clock.getElapsedTime()
  
//   //     time = currentTime
  
//   // Effetto pendolo 
  
//   //     mesh.position.y = Math.sin(time * 0.5)
  
//   //     console.log(deltaTime)
//       mesh.rotation.x += vel * deltaTime
//       mesh.rotation.y += vel * deltaTime

//   // FA SPOSTARE PointerLockControls 
//   // if(controls.isLocked) { 
//   //   controls.moveForward(vel.z * deltaTime)
//   //   controls.moveRight(vel.x * deltaTime)
//   // }
  
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
    
//   controls.update( deltaTime); // Deltatime serve per FlyControls + FirstPersonControls
  
// }

// requestAnimationFrame(animate);

// // Animazione POP 
//   // function pop(){
//   //    gsap.to(mesh.scale, { duratiion: 2, x: 1, y: 1, z: 1 })
//   //    gsap.to(mesh.rotation, { duratiion: 1, x: 3.14, y: 3.14, z: 3.14 })
  
  
//   // window.addEventListener('click', pop)
// // }

// // Window Resize 
//   window.addEventListener('resize', onResize )
  
//   function onResize() {
//       sizes.width = window.innerWidth
//       sizes.height = window.innerHeight
  
//       camera.aspect = sizes.width / sizes.height
//       camera.updateProjectionMatrix()
//       renderer.setSize(sizes.width, sizes.height)

//       controls.handleResize()
//   }
  
  
// animate();
// // pop();
  
  
