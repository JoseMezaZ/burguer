//variables globales
let tablaCarrito = document.querySelector(".cart-table tbody");
let resumenSubtotal = document.querySelector(".sub-total")
let resumenDescuento = document.querySelector(".promo")
let resumenTotal = document.querySelector(".total")
let destino = document.querySelector(".destino")
let resumenDomicilio = document.querySelector(".valor-domi")
let btnResumen = document.querySelector(".btn-resumen")

//agregar evento al navegador

document.addEventListener("DOMContentLoaded", ()=>{
    cargarProductos();
})

//funcion cargar productos guardados en localStorage

function cargarProductos(){
    let todoProducto = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if(productosPrevios != null){
        todoProducto = Object.values(productosPrevios);
    }
          //limpiar tabla
        tablaCarrito.innerHTML = ""
    //comprobar si hay productos en localStorage
    if(todoProducto != 0){
    todoProducto.forEach((producto, i)=>{
        //Cargar tabla
        let fila = document.createElement("tr")
        fila.innerHTML = `
            <td class="d-flex justify align-items-center"> 
                 <span onclick="borrarProducto(${i})" class="btn btn-danger"> X </span> 
                 <img src="${producto.imagen}" width="70px"> ${producto.nombre}
            </td>
            <td> $<span> ${producto.precio} </span> </td>
            <td> 
                <div class="quantity quantity-wrap">
                    <div class="decrement" onclick="actualizarCantidad(${i},-1)"> <i class="fa-solid fa-minus"></i> </div>
                    <input class="number" type="text" name="quantity" value="${producto.cantidad}" maxlength="2" size="1" readonly>
                    <div class="increment" onclick="actualizarCantidad(${i},1)"> <i class="fa-solid fa-plus"></i> </div>
                </div>
            </td>
            <td> $${(producto.precio * producto.cantidad).toFixed(3)} </td>
        `;
        tablaCarrito.appendChild(fila);
    })
    }else{
        let fila = document.createElement("tr")
        fila.innerHTML = `
            <td colspan="4">
                <p class="text-center fs-3"> No hay productos en el carrito </p>
            </td>
        `
        tablaCarrito.appendChild(fila);
    }

    //ejecutar el resumen de compra
    resumenCompra();
}

//funcion para actualizar cantidades del producto

function actualizarCantidad(pos, cambio){
    let todoProducto = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if(productosPrevios != null){
        todoProducto = Object.values(productosPrevios);
    }

    if (todoProducto[pos]) {
        //actualizar cantidad
        todoProducto[pos].cantidad = (todoProducto[pos].cantidad || 1) + cambio;

        //asegurarse de que la cantidad no sea menor a 1 
        if(todoProducto[pos].cantidad < 1){
            todoProducto[pos].cantidad = 1;
        }

    }

    //actualizar em localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todoProducto));

    //recargar la tabla
    cargarProductos();

}

//funcion para borrar productos del detalle carrito

function borrarProducto(pos){
    let todoProducto = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if(productosPrevios != null){
        todoProducto = Object.values(productosPrevios);
    }

    //eliminar producto
    todoProducto.splice(pos,1);
    //actualizar localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todoProducto));
    //recargar tabla
    cargarProductos();
}

//funcion para el resumen de la compra
function resumenCompra(){
    let todoProducto = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let subtotal = 0; //acumulador del subtotal

    //recorrer cada producto y acumular

    todoProducto.forEach((producto)=>{
        subtotal += producto.precio * producto.cantidad; 
    })

    //calcular el valor del domicilio
    let domicilio = 0;
    switch (destino.value) {
        case "Medellin": default: domicilio; break;
        case "Bello": domicilio = 10.000; break;
        case "Copacabana": case "La Estrella": case "Caldas": domicilio = 20.000; break;
        case "Envigado": case "Itagui": case "Sabaneta": domicilio = 15.000; break;
    }

    //calcular descuento, del 10% si la compra es mayor a 100.000
    let descuento = (subtotal > 100.000) ?subtotal * 0.1 : 0;

    //calcular total de la compra
    let totalPago = (subtotal - descuento) + domicilio; 



    //mostrar los calculos de resumen de compra
    resumenSubtotal.textContent = subtotal.toFixed(3);
    resumenDescuento.textContent = descuento.toFixed(3);
    resumenTotal.textContent = totalPago.toFixed(3);
    resumenDomicilio.textContent = domicilio.toFixed(3);
}
//agregar evento change al destino para calcular valor del domicilio
destino.addEventListener("change", ()=>{
    //actualice el resumen de la compra
    resumenCompra();

})

//Evento al boton para guardar el resumen en LS
btnResumen.addEventListener("click", ()=>{
    //extraer los productos de LS
    let productos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let resumen = {
        //generar copia de los productos
        "productos": productos,
    }

    //llenar la variable resumen con la informacion del resumen de la compra
    resumen.subtotal = resumenSubtotal.textContent;
    resumen.descuento = resumenDescuento.textContent;
    resumen.destino = destino.value;
    resumen.domicilio =  resumenDomicilio.textContent;
    resumen.totalPago = resumenTotal.textContent;

    //guardar resumen en local storage
    localStorage.setItem("pro-resumen", JSON.stringify(resumen));

    //redirigir al usuario a la pagina de pago
    location.href="checkout.html";

    console.log(resumen);

})
