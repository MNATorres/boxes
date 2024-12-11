import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd3d3d3);
document.body.appendChild(renderer.domElement);

// Crear la geometría y material para los cubos
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// Crear el primer cubo y sus aristas
const cube1 = new THREE.Mesh(geometry, material1);
const edges1 = new THREE.EdgesGeometry(geometry);
const lineMaterial1 = new THREE.LineBasicMaterial({ color: 0x000000 });
const line1 = new THREE.LineSegments(edges1, lineMaterial1);

// Crear el segundo cubo y sus aristas
const cube2 = new THREE.Mesh(geometry, material2);
const edges2 = new THREE.EdgesGeometry(geometry);
const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x000000 });
const line2 = new THREE.LineSegments(edges2, lineMaterial2);

// Agregar los cubos y sus aristas a la escena
scene.add(cube1);
scene.add(line1);
scene.add(cube2);
scene.add(line2);

// Colocar el segundo cubo en una posición diferente
cube2.position.set(2, 0, 0);
line2.position.copy(cube2.position);

// Configurar la cámara
camera.position.set(0, 0, 5);

// Variables para controlar la rotación
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Función para detectar el movimiento del mouse
function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Rotación del cubo 1 con el movimiento del mouse
  cube1.rotation.y += deltaX * 0.01; // Ajusta la sensibilidad con el valor multiplicado
  cube1.rotation.x += deltaY * 0.01;

  // Rotación del cubo 2 con el movimiento del mouse
  //   cube2.rotation.y += deltaX * 0.01;
  //   cube2.rotation.x += deltaY * 0.01;

  previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Función para detectar cuando se empieza a arrastrar
function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Función para detectar cuando se deja de arrastrar
function onMouseUp() {
  isDragging = false;
}

// Agregar los eventos del mouse
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);

// Función de animación
function animate() {
  // Sincronizar las aristas con la rotación de los cubos
  line1.rotation.copy(cube1.rotation); // Sincronizar las aristas del cubo 1
  line2.rotation.copy(cube2.rotation); // Sincronizar las aristas del cubo 2

  // Renderizar la escena
  renderer.render(scene, camera);
}

// Llamada de animación
function animateScene() {
  animate();
  requestAnimationFrame(animateScene);
}

animateScene();
