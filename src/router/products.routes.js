import express from "express"
import { obtainProducts, createProduct, deleteProduct, obtainProductById, updateProduct, obtainProductMain } 
        from "../controllers/products.controller.js"

const ProductsRouter = express.Router()

ProductsRouter.get("/obtainProductMain", obtainProductMain)
ProductsRouter.get("/", obtainProducts)
ProductsRouter.get("/:pid", obtainProductById)
ProductsRouter.post("/", createProduct)
ProductsRouter.put("/update/:pid", updateProduct)
ProductsRouter.delete("/delete/:pid", deleteProduct)


export default ProductsRouter