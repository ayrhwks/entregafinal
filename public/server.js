
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/pantalones', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'public', 'pantalones.json');
        const rawdata = fs.readFileSync(filePath);
        const pantalones = JSON.parse(rawdata);

        // Simular retardo asincrónico (puedes ajustar el tiempo según tus necesidades)
        setTimeout(() => {
            res.json(pantalones);
        }, 1000);
    } catch (error) {
        console.error('Error reading pantalones.json:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


function seleccionarModelo(modelo, index) {
    const radioButtons = document.getElementsByName('modelo');
    radioButtons[index].checked = true;
}

function agregarAlCarrito(pantalonElegido) {
    carrito.push(pantalonElegido);
    actualizarCantidadCarrito();
}

function actualizarCantidadCarrito() {
    const cantidadCarritoSpan = document.getElementById("cantidadCarrito");
    if (cantidadCarritoSpan) {
        cantidadCarritoSpan.textContent = carrito.length;
    }

    // Almacena el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function realizarCompra() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const modeloSeleccionado = document.querySelector('input[name="modelo"]:checked');
    const talleSeleccionado = document.querySelector('input[name="talle"]:checked');

    if (!nombre || !apellido || !modeloSeleccionado || !talleSeleccionado) {
        mostrarError("Por favor, complete todos los campos.");
        return;
    }

    const pantalonElegido = pantalonesDisponibles.find(p => p.modelo === modeloSeleccionado.value && p.talle === talleSeleccionado.value);

    if (pantalonElegido && pantalonElegido.stock > 0) {
        pantalonElegido.stock--;
        agregarAlCarrito({
            nombre,
            apellido,
            modelo: modeloSeleccionado.value,
            talle: talleSeleccionado.value,
            precio: pantalonElegido.precio,
        });
        mostrarCompraExitosa(nombre, apellido, modeloSeleccionado.value, talleSeleccionado.value, pantalonElegido.precio, pantalonElegido.stock);
    } else {
        mostrarError(`Lo siento, el ${modeloSeleccionado.value} de talle ${talleSeleccionado.value} no está disponible.`);
    }
}
function mostrarCompraExitosa(nombre, apellido, modelo, talle, precio, stock) {
    const resultadoCompra = document.createElement("div");
    resultadoCompra.innerHTML = `<p>¡Compra exitosa!</p>
                                <p>${nombre} ${apellido}, has comprado un ${modelo} de talle ${talle} por $${precio.toFixed(2)}.</p>
                                <p>Stock restante: ${stock}</p>`;
    resultadoCompra.classList.add("success");
    document.getElementById("resultadosCompra").innerHTML = ""; // Limpiar contenido previo
    document.getElementById("resultadosCompra").appendChild(resultadoCompra);

    // Actualizar el contenido del carrito
    mostrarCarrito();
}

function mostrarError(mensaje) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<p>${mensaje}</p>`;
    errorDiv.classList.add("error");
    document.getElementById("resultadosCompra").innerHTML = ""; // Limpiar contenido previo
    document.getElementById("resultadosCompra").appendChild(errorDiv);
}

function mostrarCarrito() {
    const carritoContenido = document.getElementById("carritoContenido");
    carritoContenido.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        const mensajeCarritoVacio = document.createElement("p");
        mensajeCarritoVacio.textContent = "El carrito está vacío.";
        carritoContenido.appendChild(mensajeCarritoVacio);
    } else {
        carrito.forEach((item, index) => {
            const productoCarrito = document.createElement("div");
            productoCarrito.innerHTML = `
                <p>${item.modelo} - Talle ${item.talle}</p>
                <p>Precio: $${item.precio.toFixed(2)}</p>
                <hr>
            `;
            carritoContenido.appendChild(productoCarrito);
        });

        const totalCarrito = document.createElement("p");
        const precioTotal = carrito.reduce((total, item) => total + item.precio, 0);
        totalCarrito.textContent = `Total: $${precioTotal.toFixed(2)}`;
        carritoContenido.appendChild(totalCarrito);
    }

    // Mostrar el carrito
    carritoContenido.classList.add("mostrar");
}

function ocultarCarrito() {
    const carritoContenido = document.getElementById("carritoContenido");
    carritoContenido.classList.remove("mostrar");
}