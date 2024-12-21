import * as THREE from "three";
import { gsap } from "gsap/gsap-core";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { cajasMock } from "../mock/cajas-mock";

const scene = new THREE.Scene();
const container = document.getElementById("three-container");

const camera = new THREE.PerspectiveCamera(
  50, // Ángulo de visión
  container.offsetWidth / container.offsetHeight // Relación de aspecto inicial
);
camera.position.set(0, 0, 130);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0xf4f4f4);
container.appendChild(renderer.domElement);

function createCube(position, size) {
  const geometry = new THREE.BoxGeometry(...size);
  const textureLoader = new THREE.TextureLoader();
  const boxTexture = textureLoader.load("./../assets/carton.jpg");
  const material = new THREE.MeshBasicMaterial({ map: boxTexture });

  // Material para la parte superior de la caja
  const topBottomTexture = textureLoader.load("./../assets/arriba-caja.jpg");
  const topBottomMaterial = new THREE.MeshBasicMaterial({
    map: topBottomTexture,
  });

  const materials = [
    material,
    material,
    topBottomMaterial, // parte superio
    topBottomMaterial, // parte inferior
    material,
    material,
  ];

  const cube = new THREE.Mesh(geometry, materials);

  // Crear líneas de aristas
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.LineSegments(edges, lineMaterial);

  // Añadir líneas al cubo
  line.position.copy(cube.position); // Sincronizar posición
  scene.add(line);

  cube.position.set(...position);
  line.position.set(...position);
  scene.add(cube);

  return { cube, line };
}

// Crear los cubos
const { cube: cube1, line: line1 } = createCube(
  [-70, 0, 0],
  [cajasMock[0].width, cajasMock[0].height, cajasMock[0].depth]
);
const { cube: cube2, line: line2 } = createCube(
  [70, 0, 0],
  [cajasMock[0].width, cajasMock[0].height, cajasMock[0].depth]
);

// Inicializar visibilidad de las líneas (ocultas por defecto)
line1.visible = false;
line2.visible = false;

// Función para controlar la visibilidad de las líneas
function toggleLines() {
  const dimensionsEnabled =
    document.getElementById("active-dimensions").checked;

  line1.visible = dimensionsEnabled;
  line2.visible = dimensionsEnabled;
}

// Detectar cambios en el checkbox de dimensiones
document
  .getElementById("active-dimensions")
  .addEventListener("change", toggleLines);

function rotationInit() {
  cube1.rotation.set(0.3, 0, 0);
  cube2.rotation.set(0.3, 0, 0);
}

rotationInit();

// Inicializar OrbitControls fuera de la función de zoom
let controls = null;

function resetCameraPosition() {
  gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: 130,
    duration: 1,
    ease: "power2.out",
  });

  gsap.to(camera.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1,
    ease: "power2.out",
  });
}

function toggleZoom() {
  const zoomEnabled = document.getElementById("active-zoom").checked;

  if (zoomEnabled && !controls) {
    // Activar OrbitControls si no está ya activado
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
  } else if (!zoomEnabled && controls) {
    resetCameraPosition();
    controls.dispose();
    controls = null;
    rotationInit();
  }
}

// Detectar cambios en el checkbox para activar o desactivar el zoom
document.getElementById("active-zoom").addEventListener("change", toggleZoom);

function animate() {
  if (controls) {
    controls.update();
  }
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
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);

function resetPosition() {
  resetCameraPosition();
  gsap.to(cube1.rotation, { x: 0.3, y: 0, z: 0, duration: 1 });
  gsap.to(cube2.rotation, { x: 0.3, y: 0, z: 0, duration: 1 });
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
resetButton.addEventListener("click", resetPosition);

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

// Actualizar las tarjetas con el primer elemento del mock al cargar la página
const defaultBox = cajasMock[0];

updateCard(defaultBox, "box1-image", "box1-details", "box1-title");
updateCard(defaultBox, "box2-image", "box2-details", "box2-title");

// Opcional: establecer el valor inicial del select
selectCaja1.value = defaultBox.name;
selectCaja2.value = defaultBox.name;

function updateCard(selectedBox, imageId, detailsId, titleId) {
  const cardImage = document.getElementById(imageId);
  const cardDetails = document.getElementById(detailsId);
  const cardTitle = document.getElementById(titleId);

  if (selectedBox) {
    // Actualizar imagen
    cardImage.src = selectedBox.url || "https://via.placeholder.com/150";
    cardImage.alt = `Imagen de ${selectedBox.name}`;
  

    // Actualizar detalles
    cardDetails.innerHTML = `
  <table class="details-table">
    <thead>
      <tr>
        <th colspan="2">Detalles</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alto:</td>
        <td>${selectedBox.height} cm</td>
      </tr>
      <tr>
        <td>Ancho:</td>
        <td>${selectedBox.width} cm</td>
      </tr>
      <tr>
        <td>Profundidad:</td>
        <td>${selectedBox.depth} cm</td>
      </tr>
    </tbody>
  </table>
`;

    cardTitle.textContent = selectedBox.name;
  }
}

function handleInfoCard(event, imageId, detailsId, titleId) {
  const selectedName = event.target.value;
  const selectedBox = cajasMock.find((box) => box.name === selectedName);

  if (selectedBox) {
    updateCard(selectedBox, imageId, detailsId, titleId);
  }
}

function handleSelectChange(event, cube, line) {
  const selectedName = event.target.value;
  const selectedBox = cajasMock.find((box) => box.name === selectedName);
  console.log("selectedBox", selectedBox);

  if (selectedBox) {
    updateBoxSize(selectedBox, cube, line);
  }
}

selectCaja1.addEventListener("change", (event) => {
  handleSelectChange(event, cube1, line1);
  handleInfoCard(event, "box1-image", "box1-details", "box1-title");
});

selectCaja2.addEventListener("change", (event) => {
  handleSelectChange(event, cube2, line2);
  handleInfoCard(event, "box2-image", "box2-details", "box2-title");
});


