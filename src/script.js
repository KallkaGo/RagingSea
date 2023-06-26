/*
 * @Author: ZH
 * @Date: 2023-01-29 15:05:11
 * @LastEditTime: 2023-01-29 19:43:49
 * @LastEditors: ZH
 * @Description: 
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {
    
}
// Colors
debugObject.depthColor = "#186691"
debugObject.surfaceColor = "#9bd8ff"


gui.addColor(debugObject, 'depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837',1,2)
scene.fog = fog

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial(
    {
        vertexShader,
        fragmentShader,
        uniforms: {
            uBigWavesElevation: {
                value:0.2
            },
            uBigWavesFrequency: {
                value:new THREE.Vector2(4,1.5)
            },
            uTime: {
                value:0
            },
            uBigWavesSpeed: {
                value:1.2
            },
            uSmallWavesElevation: {
                value:0.15
            },
            uSmallWavesFrequency: {
                value:3
            },
            uSmallWavesSpeed: {
                value:0.2
            },
            uSmallIterations: {
                value:4
            },
            uDepthColor: {
                value:new THREE.Color(debugObject.depthColor)
            },
            uSurfaceColor: {
                value:new THREE.Color(debugObject.surfaceColor)
            },
            uColorOffset: {
                value:0.08
            },
            uColorMutiplier: {
                value:5
            },
            fogColor: { value: fog.color },
            fogNear: { value: fog.near },
            fogFar:{value:fog.far}
        },
        fog:false,
        side:THREE.DoubleSide,
    }
)

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('大波浪起伏')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('X-频率')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('Z-频率')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0.1).max(10).step(0.01).name('海浪速度')
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('颜色偏移')
gui.add(waterMaterial.uniforms.uColorMutiplier,'value').min(0).max(10).step(0.01).name('颜色强度')
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('小波浪起伏')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('小波浪频率')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('小波浪速度')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('迭代次数')
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
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
renderer.setClearColor('#262837',1)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // update time
    waterMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()