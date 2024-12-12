import * as THREE from "three";

const scene = new THREE.Scene();
const container = document.getElementById("three-container");

// Configuración de la cámara con perspectiva
const camera = new THREE.PerspectiveCamera(
  50, // Ángulo de visión
  container.offsetWidth / container.offsetHeight, // Relación de aspecto inicial
  0.1, // Clipping cercano
  1000 // Clipping lejano
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0xd3d3d3);
container.appendChild(renderer.domElement);

// Crear la geometría y material para los cubos
const geometry = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cubo
const material1 = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Crear los cubos y sus aristas
const cube1 = new THREE.Mesh(geometry, material1);
const edges1 = new THREE.EdgesGeometry(geometry);
const lineMaterial1 = new THREE.LineBasicMaterial({ color: 0x000000 });
const line1 = new THREE.LineSegments(edges1, lineMaterial1);

const cube2 = new THREE.Mesh(geometry, material2);
const edges2 = new THREE.EdgesGeometry(geometry);
const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x000000 });
const line2 = new THREE.LineSegments(edges2, lineMaterial2);

// Agregar los cubos y sus aristas a la escena
scene.add(cube1);
scene.add(line1);
scene.add(cube2);
scene.add(line2);

// Colocar los cubos en diferentes posiciones
cube1.position.set(-0.8, 0, 0);
cube2.position.set(0.8, 0, 0);
line1.position.copy(cube1.position);
line2.position.copy(cube2.position);

// Configurar la posición de la cámara
camera.position.set(0, 0, 5);

// Función de animación
function animate() {
  // Sincronizar las aristas con la rotación de los cubos
  line1.rotation.copy(cube1.rotation);
  line2.rotation.copy(cube2.rotation);

  // Renderizar la escena
  renderer.render(scene, camera);
}

// Llamada a la función de animación
function animateScene() {
  animate();
  requestAnimationFrame(animateScene);
}

animateScene();

function updateSize() {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  renderer.setSize(width, height);

  // Ajustar la cámara para que tenga el aspect ratio correcto
  camera.aspect = width / height;
  camera.updateProjectionMatrix(); // Actualizamos la cámara
}

// Llamamos a updateSize cuando se redimensione la ventana
window.addEventListener("resize", updateSize);

// Llamar a updateSize inicialmente para ajustar el tamaño correcto
updateSize();

// Funciones para controlar el movimiento del mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Rotación del cubo 1 y 2 con el movimiento del mouse
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
}

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);
