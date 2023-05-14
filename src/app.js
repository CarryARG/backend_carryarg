const express = require("express");
const productController = require("./controllers/productController")

const app = express()
app.listen(3000,() => console.log("Server en puerto 3000"))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/products", productController.index)
app.get("/products/:pid", productController.show)