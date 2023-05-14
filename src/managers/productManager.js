const fs = require("fs");
const Product = require("../schemas/Product")
class ProductManager {
    #products
    #path
    constructor(path) {
        this.#products = []
        this.#path = path
        if (!fs.existsSync(this.#path, "utf-8")) {
            fs.writeFileSync(this.#path, "[]");
        } 
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"))
        if (title == undefined || description == undefined || price == undefined || thumbnail == undefined || code == undefined || stock == undefined) return console.log("Todos los campos son obligatorios")
        if (this.#products.find(p => p.code === code)) return console.log("Ya existe un producto con este codigo")
        let latestId = this.#products.findIndex(this.#products.length - 1).id
        console.log(latestId)
        const newProduct = new Product(latestId, title, description, price, thumbnail, code, stock)
        this.#products.push(newProduct)
        fs.writeFileSync(this.#path, JSON.stringify(this.#products))

        return console.log("Producto Añadido")
    }
    getProducts(limit) {
        this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"))
        if(limit){
            return this.#products.slice(0, limit)
        }else{
            return this.#products
        }
    }
    getProductById(pid) {
        this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"))
        if (this.#products.find(p => p.id === pid)) {
            const productFound = this.#products.find(p => p.id === pid)
            return productFound
        }
        return {message: "No existe un producto con ese id"}
    }
    deleteProduct(pid) {
        this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"))
        if (this.#products.find(p => p.id === pid)) {
            this.#products.splice(this.#products.indexOf(this.#products.find(p => p.id === pid)), 1)
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))
            return console.log("Producto Eliminado")
        } else {
            return console.log("No se encontró un producto con el id indicado")
        }
    }
    updateProduct(pid, k, v) {
        this.#products = JSON.parse(fs.readFileSync(this.#path, "utf-8"))
        if (k == "id") {
            return console.log("No puedes modificarle el id a un producto")
        } else if (this.#products.find(p => p.id === pid)) {
            const productFound = this.#products.find(p => p.id === pid)
            productFound[k] = v
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))
            return console.log("Producto actualizado", productFound)
        } else {
            return console.log("No se encontró un producto con el id indicado")
        }
    }
}

module.exports = ProductManager