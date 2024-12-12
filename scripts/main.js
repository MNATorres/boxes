import * as THREE from "three";
import { gsap } from "gsap/gsap-core";

// Configuración de la escena y renderizador
const scene = new THREE.Scene();
const container = document.getElementById("three-container");

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(
  50, // Ángulo de visión
  container.offsetWidth / container.offsetHeight, // Relación de aspecto inicial
  0.1, // Clipping cercano
  1000 // Clipping lejano
);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0xd3d3d3);
container.appendChild(renderer.domElement);

// Función para crear un cubo con bordes
function createCube(position, color) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.LineSegments(edges, lineMaterial);

  cube.position.set(...position);
  line.position.copy(cube.position);

  scene.add(cube);
  scene.add(line);

  return { cube, line };
}

// Crear los cubos
const { cube: cube1, line: line1 } = createCube([-1, 0, 0], 0x8b4513);
const { cube: cube2, line: line2 } = createCube([1, 0, 0], 0x0000ff);

// Animación de la escena
function animate() {
  line1.rotation.copy(cube1.rotation);
  line2.rotation.copy(cube2.rotation);
  renderer.render(scene, camera);
}

function animateScene() {
  animate();
  requestAnimationFrame(animateScene);
}
animateScene();

// Actualización del tamaño del renderizador y cámara al cambiar el tamaño de la ventana
function updateSize() {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", updateSize);
updateSize();

// Control de interacción con el mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  cube1.rotation.y += deltaX * 0.01;
  cube1.rotation.x += deltaY * 0.01;

  cube2.rotation.y += deltaX * 0.01;
  cube2.rotation.x += deltaY * 0.01;

  previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
  isDragging = false;
  console.log("x", cube1.rotation.x);
  console.log("y", cube1.rotation.y);
  console.log("Rotación en grados:");
  console.log("grados x:", THREE.MathUtils.radToDeg(cube1.rotation.x));
  console.log("grados y:", THREE.MathUtils.radToDeg(cube1.rotation.y));
}

container.addEventListener("mousedown", onMouseDown);
container.addEventListener("mousemove", onMouseMove);
container.addEventListener("mouseup", onMouseUp);

function resetRotation() {
  gsap.to(cube1.rotation, { x: 0, y: 0, z: 0, duration: 1 });
  gsap.to(cube2.rotation, { x: 0, y: 0, z: 0, duration: 1 });
}

function showTopFace() {
  gsap.to(cube1.rotation, { x: 0.8, y: -3.16, z: 0, duration: 1 });
  gsap.to(cube2.rotation, { x: 0.8, y: -3.16, z: 0, duration: 1 });
}

function showBottomFace() {
  gsap.to(cube1.rotation, { x: -1.04, y: 0.01, z: 0, duration: 1 });
  gsap.to(cube2.rotation, { x: -1.04, y: 0.01, z: 0, duration: 1 });
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetRotation);

const showTop = document.getElementById("display-top");
showTop.addEventListener("click", showTopFace);

const showBotton = document.getElementById("display-bottom");
showBotton.addEventListener("click", showBottomFace);
