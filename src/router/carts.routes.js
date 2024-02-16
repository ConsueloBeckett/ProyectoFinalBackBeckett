import express from "express"
import { addProductCart, obtainCart, deleteCart, deleteProductCart, obtainCarts, obtainProductsCart, updateCart, updateQuantityProduct, purchaseCart, buildCart } 
        from "../controllers/carts.controller.js"

const CartRouter = express.Router()

CartRouter.get("/", obtainCarts)
CartRouter.get(":cid", obtainCart)
CartRouter.post("/",  buildCart)
CartRouter.put("/:cid", updateCart)
CartRouter.delete("/:cid", deleteCart)

CartRouter.get("/:cid/products/:pid", obtainProductsCart)
CartRouter.post("/:cid/products/:pid", addProductCart)
CartRouter.put("/:cid/products/:pid", updateQuantityProduct)
CartRouter.delete("/:cid/products/:pid", deleteProductCart)
CartRouter.post("/:cid/purchase", purchaseCart)

export default CartRouter