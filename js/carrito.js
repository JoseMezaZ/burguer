//variables globales
let btnProducts = document.querySelectorAll(".btn-product")
let contadorCarrito = document.querySelector(".contar-pro")
let cont = 0;
let listadoCarrito = document.querySelector(".list-cart tbody")

document.addEventListener("DOMContentLoaded", ()=>{
    cargarProLocalStorage();
})

btnProducts.forEach((btn, i)=>{
    btn.addEventListener("click", ()=>{
    
    //contador de los productos del carrito
    cont++;
    contadorCarrito.textContent = cont;
    //agregar producto al carrito
    infoProducto(i);
    });

});


//agregar producto al carrito
function agregarProducto(producto){
    let fila = document.createElement("tr")
    fila.innerHTML = `
        <td> ${cont} </td>
        <td> <img src="${producto.imagen}" width="50px"></td>
        <td> ${producto.nombre}</td>
        <td> $ ${producto.precio}</td>
        <td> <span onclick="borrarProducto(${cont})" class="btn btn-danger"> X </span> </td>
    `;

    listadoCarrito.appendChild(fila);
}


//funcion para agregar la informacion del producto al carrito
function infoProducto(pos){
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let infoPro = {
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        cantidad: 1
    }
    agregarProducto(infoPro)
    guardarProLocalStorage(infoPro)
}


// funcion para eliminar un producto del carrito
function borrarProducto(pos) {
    let producto = event.target;
    producto.parentElement.parentElement.remove()   

    //disminuir el contador de productos del carrito
    if (cont > 0) {
        cont --;
        contadorCarrito.textContent = cont; 
    }

    eliminarProLocalStorage(pos)

    //Actualizar contador al eliminar producto
    let num = listadoCarrito.querySelectorAll('tr');
    
    num.forEach((num, i) => {
        num.querySelector('td:first-child').textContent = i + 1;
    });
}


//Funcion para guardar productos en localStorage

function guardarProLocalStorage(producto){
    let todoProducto = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if(productosPrevios != null){
        todoProducto = Object.values(productosPrevios);
    }

    todoProducto.push(producto)
    localStorage.setItem("pro-carrito", JSON.stringify(todoProducto));

}

//eliminar productos del localStorage

function eliminarProLocalStorage(pos){
    let todoProducto = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if(productosPrevios != null){
        todoProducto = Object.values(productosPrevios);
    }

    todoProducto.splice((pos-1), 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todoProducto));
}

//cargar productos del localStorage}

function cargarProLocalStorage(){
    let todoProducto = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if(productosPrevios != null){
        todoProducto = Object.values(productosPrevios);
    }

    todoProducto.forEach((producto)=>{

        cont ++;
        let fila = document.createElement("tr")
        fila.innerHTML = `
            <td> ${cont} </td>
            <td> <img src="${producto.imagen}" width="50px"></td>
            <td> ${producto.nombre}</td>
            <td> ${producto.precio}</td>
            <td> <span onclick="borrarProducto(${cont})" class="btn btn-danger"> X </span> </td>
        `;
    
        listadoCarrito.appendChild(fila);
        contadorCarrito.textContent = cont;
    })

}

contadorCarrito.parentElement.addEventListener("click", ()=>{
    listadoCarrito.parentElement.classList.toggle("ocultar")
})

