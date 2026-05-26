async function cargarBaseDeDatos(dia) {
  const contenedor = document.getElementById("contenedor");

  try {
    // Inicializa sql.js
    const SQL = await initSqlJs({
      locateFile: file =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });
    // Carga el archivo .db desde el repo
    const response = await fetch("./prices.db");
    if (!response.ok) {
      throw new Error("No se pudo cargar el archivo prices.db");
    }
    const buffer = await response.arrayBuffer();
    // Abre la base de datos SQLite
    const db = new SQL.Database(new Uint8Array(buffer));

    // Ejecuta query
    const resultado = db.exec(`SELECT * FROM Day${dia}`);

    if (!resultado.length) {
      contenedor.innerHTML = "<p>No hay datos.</p>";
      return;
    }

    const tabla = crearTabla(resultado[0]);

    contenedor.innerHTML = "";
    contenedor.appendChild(tabla);

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function crearTabla(data) {
  const table = document.createElement("table");
  table.border = "1";
  table.cellPadding = "6";
  table.style.borderCollapse = "collapse";

  // HEADER
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  data.columns.forEach(columna => {
    const th = document.createElement("th");
    th.textContent = columna;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // BODY
  const tbody = document.createElement("tbody");

  data.values.forEach(fila => {
    const tr = document.createElement("tr");

    fila.forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  return table;
}

function getDay() {
  return new Date().getDate();
}

const dia=getDay();
cargarBaseDeDatos(dia);
