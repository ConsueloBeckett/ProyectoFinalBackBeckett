import express from "express"
import { obtainProducts, createProduct, deleteProduct, obtainProductById, updateProduct, obtainProductMain } 
        from "../controllers/products.controller.js"

const productsRouter = express.Router()

productsRouter.get("/manageProducts", obtainProductMain)
productsRouter.get("/", obtainProducts)
productsRouter.get("/:pid", obtainProductById)
productsRouter.post("/", createProduct)
productsRouter.put("/update/:pid", updateProduct)
productsRouter.delete("/delete/:pid", deleteProduct)


export default productsRouter