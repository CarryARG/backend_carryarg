const ProductManager = require("../managers/productManager")
const productManager = new ProductManager("./src/db/products.json")
const productController = {
    index: function (req, res) {
        if(req.query.limit){
            let limit = Number(req.query.limit)
            const products = productManager.getProducts(limit)
            return res.json(products)
        }else{
            const products = productManager.getProducts()
            return res.json(products)
        }
    },
    show: function(req, res) {
        let pid = Number(req.params.pid)
        const product = productManager.getProductById(pid)
        return res.json(product)
    }
}

module.exports = productController