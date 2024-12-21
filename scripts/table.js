function populateComparisonTable(selectedBox) {
  // Obtener filas de la tabla
  const titlesRow = document.querySelector("#cajasTitlesRow");
  const detailsRow = document.querySelector("#cajasDetailsRow");

  // Limpiar filas existentes
  titlesRow.innerHTML = `<th>Características</th>`;
  detailsRow.innerHTML = "";

  if (selectedBox) {
    // Agregar el título de la caja seleccionada
    const titleCell = document.createElement("th");
    titleCell.textContent = selectedBox.name;
    titlesRow.appendChild(titleCell);

    // Agregar las características de la caja seleccionada
    const characteristics = ["height", "width", "depth", "color", "material", "description"];
    characteristics.forEach((key) => {
      const detailRow = document.createElement("tr");
      detailRow.innerHTML = `
        <th>${key.charAt(0).toUpperCase() + key.slice(1)}:</th>
        <td>${selectedBox[key]}</td>
      `;
      detailsRow.appendChild(detailRow);
    });
  }
}

// Inicializar la tabla con la primera caja por defecto
populateComparisonTable(cajasMock[0]);

// Ejemplo: Cambiar la tabla al seleccionar otra caja
document.querySelector("#selectBox").addEventListener("change", (event) => {
  const selectedName = event.target.value;
  const selectedBox = cajasMock.find((box) => box.name === selectedName);
  populateComparisonTable(selectedBox);
});