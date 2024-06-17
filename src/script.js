import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap"

/**
 * Debug UI
 */

const gui = new GUI({
  width: 150,
  title: "Debug UI",
  closeFolders: true
});
gui.close();
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// const count = 50;

// const positionsArray = new Float32Array(count*3*3);

// for(let i = 0; i<count*3*3; i++) {
//     positionsArray[i] = Math.random() - 0.5;
// }

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute('position', positionsAttribute);

// Object
debugObject.color = "#3a6ea6";
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const debugFolder = gui.addFolder('Cube Debug');

debugFolder
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("elevation");
debugFolder.add(mesh, "visible");
debugFolder.add(material, "wireframe");

debugFolder
  .addColor(debugObject, "color")
  .onChange(() => {
    material.color.set(debugObject.color)
  });

debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}

debugFolder.add(debugObject, 'spin')

debugObject.subdivision = 2;

debugFolder.add(debugObject, 'subdivision')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
      1, 1, 1,
      debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
    )
  })

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
