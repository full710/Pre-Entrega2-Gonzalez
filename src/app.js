
import { engine } from 'express-handlebars'
import { Server } from "socket.io"
import express from "express"

import cartRouter from "./routes/cart.router.js"
import productRouter from "./routes/product.router.js"
import viewsRouter from "./routes/views.router.js"

const app = express()
const PUERTO = 8080


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("./src/public"))


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter)

app.engine('handlebars', engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.get("/", (req, res) => {
  res.send("Servidor de e-commerce en funcionamiento.")
});

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`)
})

import ProductManager from './managers/product-manager.js'
const manager = new ProductManager("./src/data/productos.json")
const io = new Server(httpServer)

io.on("connection", async (socket) =>{
  console.log("Cliente conectado");
  socket.emit("productos", await manager.getProducts())

  socket.on("agregarProducto", async (product) =>{
    await manager.addProduct(product)
    io.sockets.emit("productos", await manager.getProducts())
  })

  socket.on("eliminarProducto", async (id) =>{
    await manager.deleteProduct(id)
    io.sockets.emit("productos", await manager.getProducts())
  })
})