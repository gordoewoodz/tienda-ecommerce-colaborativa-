const formulario = document.getElementById("formulario-pedido");
const listaPedidos = document.getElementById("lista-pedidos");
const mensaje = document.getElementById("mensaje");

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

function guardarPedidos() {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.className = esError ? "mensaje-error" : "mensaje-exito";
}

function actualizarEstado(id, nuevoEstado) {
    const pedido = pedidos.find((item) => item.id === id);

    if (!pedido) {
        mostrarMensaje("No fue posible encontrar el pedido.", true);
        return;
    }

    pedido.estado = nuevoEstado;
    guardarPedidos();
    mostrarMensaje("El estado del pedido fue actualizado.");
}

function eliminarPedido(id) {
    pedidos = pedidos.filter((pedido) => pedido.id !== id);
    guardarPedidos();
    renderizarPedidos();
    mostrarMensaje("El pedido fue eliminado.");
}

function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

function renderizarPedidos() {
    listaPedidos.replaceChildren();

    pedidos.forEach((pedido) => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(pedido.cliente));
        fila.appendChild(crearCelda(pedido.producto));
        fila.appendChild(crearCelda(pedido.cantidad));

        const celdaEstado = document.createElement("td");
        const selectorEstado = document.createElement("select");

        const estados = [
            "Pendiente",
            "En preparación",
            "Enviado",
            "Entregado"
        ];

        estados.forEach((estado) => {
            const opcion = document.createElement("option");
            opcion.value = estado;
            opcion.textContent = estado;
            opcion.selected = pedido.estado === estado;
            selectorEstado.appendChild(opcion);
        });

        selectorEstado.addEventListener("change", () => {
            actualizarEstado(pedido.id, selectorEstado.value);
        });

        celdaEstado.appendChild(selectorEstado);
        fila.appendChild(celdaEstado);

        const celdaAccion = document.createElement("td");
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            eliminarPedido(pedido.id);
        });

        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);

        listaPedidos.appendChild(fila);
    });
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const cliente = document.getElementById("cliente").value.trim();
    const producto = document.getElementById("producto").value.trim();
    const cantidad = Number(
        document.getElementById("cantidad").value
    );

    if (!cliente || !producto || !Number.isInteger(cantidad) || cantidad < 1) {
        mostrarMensaje(
            "Completa los datos e ingresa una cantidad mayor que cero.",
            true
        );
        return;
    }

    const nuevoPedido = {
        id: window.crypto?.randomUUID?.() || Date.now().toString(),
        cliente,
        producto,
        cantidad,
        estado: "Pendiente"
    };

    pedidos.push(nuevoPedido);
    guardarPedidos();
    renderizarPedidos();
    formulario.reset();

    mostrarMensaje("El pedido fue registrado correctamente.");
});

renderizarPedidos();
