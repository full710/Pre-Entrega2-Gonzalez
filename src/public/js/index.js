const socket = io()

socket.on("productos", (data) =>{
    renderProductos(data) 
})

const renderProductos = (productos) => {
    const contenerdorProductos = document.getElementById("contenedorProductos")
    contenerdorProductos.innerHTML = ""
    productos.forEach( item => { 
        const card = document.createElement("div")
        card.classList.add("card")
        
        
        card.innerHTML = `
                        
                            <img src="${item.img}" class="card-img-top" alt="${item.title}">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text">${item.description}</p>
                                <p class="card-text"><strong>${item.price}</strong></p>
                                <p class="card-text"><strong>${item.code}</strong></p>
                                <p class="card-text"><strong>${item.stock}</strong></p>
                                <button class="btn btn-danger">Eliminar</button>
                            </div>
                        
                        `;
        contenerdorProductos.appendChild(card)
        card.querySelector("button").addEventListener("click", () =>{
            eliminarProducto(item.id)
        })
    });


}
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id)
}
document.getElementById("btnAgregarProducto").addEventListener("click", () =>{
    agregarProducto()
})

const agregarProducto = () => {
    const product = {
        title : document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
    }

    socket.emit("agregarProducto", product)
}