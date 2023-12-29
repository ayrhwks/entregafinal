document.addEventListener("DOMContentLoaded", function () {
    // Obtener los datos de los pantalones del servidor
    fetch('http://localhost:3000/pantalones')
        .then(response => response.json())
        .then(data => {
            // Asignar los datos al array pantalonesDisponibles
            const pantalonesDisponibles = data.pantalones;

            // Continuar con el resto de tu código que utiliza pantalonesDisponibles
            const modeloContainer = document.getElementById("modeloContainer");

            modeloContainer.innerHTML = ""; // Limpiar contenido previo

            pantalonesDisponibles.forEach((pantalon, index) => {
                const modeloLabel = document.createElement("label");
                modeloLabel.className = "modelo-label";
                modeloLabel.onclick = () => seleccionarModelo(pantalon.modelo, index);
                modeloLabel.innerHTML = `
                    <input type="radio" name="modelo" value="${pantalon.modelo}">
                    <img src="./imagenes/${pantalon.modelo.replace(/\s+/g, '')}.png" alt="${pantalon.modelo}">
                    ${pantalon.modelo}
                `;

                modeloContainer.appendChild(modeloLabel);
            });

            const comprarBtn = document.getElementById("comprarBtn");
            if (comprarBtn) {
                comprarBtn.style.margin = "20px auto"; // Establecer margen y centrar el botón
            }
        })
        .catch(error => console.error('Error fetching pantalones:', error));
});
