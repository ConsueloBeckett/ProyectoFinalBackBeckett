import express from "express"
import { addProductCart, obteinCart, deleteCart, deleteProductCart, obteinCarts, obtainProductsCart, updateCart, updateQuantityProduct, purchaseCart, buildCart } 
        from "../controllers/carts.controller.js"

const cartRouter = express.Router()

cartRouter.get("/", obteinCarts)
cartRouter.get(":cid", obteinCart)
cartRouter.post("/",  buildCart)
cartRouter.put("/:cid", updateCart)
cartRouter.delete("/:cid", deleteCart)

cartRouter.get("/:cid/products/:pid", obtainProductsCart)
cartRouter.post("/:cid/products/:pid", addProductCart)
cartRouter.put("/:cid/products/:pid", updateQuantityProduct)
cartRouter.delete("/:cid/products/:pid", deleteProductCart)
cartRouter.post("/:cid/purchase", purchaseCart)

export default cartRouter