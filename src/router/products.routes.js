import express from "express"
import { obtainProducts, createProduct, deleteProduct, obtainProductById, updateProduct } 
        from "../controllers/products.controller.js"

const productsRouter = express.Router()

productsRouter.get("/", obtainProducts)
productsRouter.get("/:pid", obtainProductById)
productsRouter.post("/", createProduct)
productsRouter.put("/:pid", updateProduct)
productsRouter.delete("/:pid", deleteProduct)


export default productsRouter