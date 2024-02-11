import express from "express"
import { addProductCart, createCart, deleteCart, deleteProductCart, obteinCart, obtainProductsCart, updateCart, updateQuantity, purchaseCart } 
        from "../controllers/carts.controller.js"

const cartRouter = express.Router()

cartRouter.get("/", obteinCart)
cartRouter.get(":cid", obteinCart)
cartRouter.post("/", createCart)
cartRouter.put("/:cid", updateCart)
cartRouter.delete("/:cid", deleteCart)

cartRouter.get("/:cid/products/:pid", obtainProductsCart)
cartRouter.post("/:cid/products/:pid", addProductCart)
cartRouter.put("/:cid/products/:pid", updateQuantity)
cartRouter.delete("/:cid/products/:pid", deleteProductCart)
cartRouter.post("/:cid/purchase", purchaseCart)

export default cartRouter