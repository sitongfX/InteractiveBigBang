import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
* to avoid hardware breaking down any moment which could cause damage to the universe
* the below hardware related part is commented out for now;
*/
// //when the user clicks anywhere on the page
// document.addEventListener('click', async () => {
//     // Prompt user to select any serial port.
//     var port = await navigator.serial.requestPort();
//     // be sure to set the baudRate to match the ESP32 code
//     await port.open({ baudRate: 250000 });
  
//     let decoder = new TextDecoderStream();
//     inputDone = port.readable.pipeTo(decoder.writable);
//     inputStream = decoder.readable;
  
//     reader = inputStream.getReader();
//     readLoop();
  
// });


// async function readLoop() {
//     counterVal = 0;
//     while (true) {
//       const { value, done } = await reader.read();
//       if (done) {
//         // Allow the serial port to be closed later.
//         console.log("closing connection")
//         reader.releaseLock();
//         break;
//       }
//       if (value) {
  
//         try {
//             let jsonData = JSON.parse(value);
            // console.log(jsonData);

            // Debug
            const gui = new dat.GUI()

            // Canvas
            const canvas = document.querySelector('canvas.webgl')

            // Scene
            const scene = new THREE.Scene()

            // controller
            const parameters = {}
            // parameters.count = jsonData.P
            // parameters.size = jsonData.B
            parameters.count = 7000
            parameters.size = 0.01
            parameters.radius = 4
            // parameters.branches = jsonData.X
            // parameters.randomness = jsonData.Y 
            parameters.branches = 10
            parameters.spin = 2.5
            parameters.randomness = 1
            parameters.randomnessPower = 3
            parameters.insideColor = '#ff6030'
            parameters.outsideColor = '#1b3984'

            let geometry = null
            let material = null
            let points = null


            const generateDebris = () =>
            {
                if(points !== null)
                {
                    geometry.dispose()
                    material.dispose()
                    scene.remove(points)
                }

                geometry = new THREE.BufferGeometry()

                const positions = new Float32Array(parameters.count * 3)
                const colors = new Float32Array(parameters.count * 3)

                const colorInside = new THREE.Color(parameters.insideColor)
                const colorOutside = new THREE.Color(parameters.outsideColor)

                for(let i = 0; i < parameters.count; i++)
                {
                    const i3 = i * 3

                    const radius = Math.random() * parameters.radius

                    const spinAngle = radius * parameters.spin
                    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
                
                    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
                    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
                    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

                    positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
                    positions[i3 + 1] = randomY
                    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

                    const mixedColor = colorInside.clone()
                    mixedColor.lerp(colorOutside, radius / parameters.radius)

                    colors[i3    ] = mixedColor.r
                    colors[i3 + 1] = mixedColor.g
                    colors[i3 + 2] = mixedColor.b
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
                

                material = new THREE.PointsMaterial({
                    size: parameters.size,
                    sizeAttenuation: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    vertexColors: true
                })

                points = new THREE.Points(geometry, material)
                scene.add(points)

            }


            gui.add(parameters, 'count').min(100).max(10000).step(100).onFinishChange(generateDebris)
            gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateDebris)
            gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateDebris)
            gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateDebris)
            gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateDebris)
            gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateDebris)
            gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateDebris)
            gui.addColor(parameters, 'insideColor').onFinishChange(generateDebris)
            gui.addColor(parameters, 'outsideColor').onFinishChange(generateDebris)

            generateDebris()



            /**
             * Sizes
             */
            const sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            }

            window.addEventListener('resize', () =>
            {
                // Update sizes
                sizes.width = window.innerWidth
                sizes.height = window.innerHeight

                // Update camera
                camera.aspect = sizes.width / sizes.height
                camera.updateProjectionMatrix()

                // Update renderer
                renderer.setSize(sizes.width, sizes.height)
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            })

      
            // Base camera
            const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
            camera.position.x = 3
            camera.position.y = 3
            camera.position.z = 3
            scene.add(camera)

            // Controls
            const controls = new OrbitControls(camera, canvas)
            controls.enableDamping = true

            /**
             * Renderer
             */
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas
            })
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

            /**
             * Animate
             */
            const clock = new THREE.Clock()

            const tick = () =>
            {
                const elapsedTime = clock.getElapsedTime()

                // Update controls
                controls.update()

                // Render
                renderer.render(scene, camera)

                // Call tick again on the next frame
                window.requestAnimationFrame(tick)
            }

            tick()

// }
// catch (e) {
//   continue;
// }


// }
// }
// };