import { cajasMock } from "../mock/cajas-mock";

function populateTable() {
  const tableBody = document.querySelector("#cajasTable tbody");

  cajasMock.forEach((caja) => {
    const row = document.createElement("tr");

    // Creando las celdas por cada propiedad de cada caja
    row.innerHTML = `
        <td>${caja.name}</td>
        <td>${caja.height}</td>
        <td>${caja.width}</td>
        <td>${caja.depth}</td>
        <td>${caja.color}</td>
        <td>${caja.material}</td>
        <td>${caja.description}</td>
      `;

    // Agregamos la fila al cuerpo de la tabla
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", populateTable);
