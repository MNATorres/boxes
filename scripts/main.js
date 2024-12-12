import * as THREE from "three";
import { gsap } from "gsap/gsap-core";
import { cajasMock } from "../mock/cajas-mock";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const container = document.getElementById("three-container");

const camera = new THREE.PerspectiveCamera(
  50, // Ángulo de visión
  container.offsetWidth / container.offsetHeight, // Relación de aspecto inicial
  0.1, // Clipping cercano
  1000 // Clipping lejano
);
camera.position.set(0, 0, 350);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0xd3d3d3);
container.appendChild(renderer.domElement);

// Función para crear un cubo con bordes
function createCube(position, color, size) {
  const geometry = new THREE.BoxGeometry(...size);
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
const { cube: cube1, line: line1 } = createCube(
  [-130, 0, 0],
  0x8b4513,
  [100, 100, 100]
);
const { cube: cube2, line: line2 } = createCube(
  [130, 0, 0],
  0x8b4513,
  [100, 100, 100]
);

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
function adjustRenderSize() {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", adjustRenderSize);
adjustRenderSize();

// Control de interacción con el mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
}

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

function onMouseUp() {
  isDragging = false;
  console.log("x", cube1.rotation.x);
  console.log("y", cube1.rotation.y);
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

/// Formulario

function getCustomCubeSize(cubeId) {
  const width = parseFloat(document.getElementById(`width-${cubeId}`).value);
  const height = parseFloat(document.getElementById(`height-${cubeId}`).value);
  const depth = parseFloat(document.getElementById(`depth-${cubeId}`).value);

  return { width, height, depth };
}

// Controlador del formulario
const form1 = document.getElementById("box-form1");
form1.addEventListener("submit", function (event) {
  event.preventDefault();
  updateBoxSize(getCustomCubeSize("box1"), cube1, line1);
});

// Controlador del formulario
const form2 = document.getElementById("box-form2");
form2.addEventListener("submit", function (event) {
  event.preventDefault();
  updateBoxSize(getCustomCubeSize("box2"), cube2, line2);
});

function updateBoxSize(box, cube, line) {
  const width = box.width;
  const height = box.height;
  const depth = box.depth;

  if (isNaN(width) || isNaN(height) || isNaN(depth)) {
    console.log("Los valores ingresados no son válidos");
    return;
  }

  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(width, height, depth);

  line.geometry.dispose();
  line.geometry = new THREE.EdgesGeometry(
    new THREE.BoxGeometry(width, height, depth)
  );
}

///////////////////// select /////////////////////////

const selectCaja1 = document.getElementById("caja1");
const selectCaja2 = document.getElementById("caja2");

function populateSelect(selectCaja) {
  cajasMock.forEach((caja) => {
    const option = document.createElement("option");
    option.value = caja.name;
    option.textContent = caja.name;
    selectCaja.appendChild(option);
  });
}

populateSelect(selectCaja1);
populateSelect(selectCaja2);

function handleSelectChange(event, cube, line) {
  const selectedName = event.target.value;
  const selectedBox = cajasMock.find((box) => box.name === selectedName);
  console.log("selectedBox", selectedBox);

  if (selectedBox) {
    updateBoxSize(selectedBox, cube, line);
  }
}

selectCaja1.addEventListener("change", (event) =>
  handleSelectChange(event, cube1, line1)
);
selectCaja2.addEventListener("change", (event) =>
  handleSelectChange(event, cube2, line2)
);
