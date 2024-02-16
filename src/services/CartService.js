import CartRepository from "../repositories/carts.repository.js"


class CartService {
    constructor() {
        this.cartRepository = new CartRepository()
    }

    scanCarts = async () => {
        try {
            const carts = await this.cartRepository.scanCarts()
            return carts
        } catch (e) {
            console.error('Error to search the carts:', e)
            return null
        }
    }

    addCart = async (cart) => {
        try {
            const newCart = await this.cartRepository.addCart(cart)
            return newCart
        } catch (e) {
            console.error('Error to save the cart:', e)
            return null
        }}

    obtainCartById = async (cartId) => {
        try {
            const cart = await this.cartRepository.obtainCartById(cartId)

            if (!cart) {
                return null
            }
            return cart
        } catch (e) {
            console.error('Error to find the cart by ID:', e)
            return null
        }}

  
    addProductCart = async (idCart, idProd, quantity) => {
        try {
            const newProduct = await this.cartRepository.addProductCart(idCart, idProd, quantity)
            if (!newProduct) {
                return null
            }
            return newProduct
        } catch (e) {
            console.error('Error to save product at the cart:', e)
            return null;
        }}

    existProductInCart = async (idCart, idProd) => {
        try {
            const existProductCart = await this.cartRepository.existProductCart(idCart, idProd)
            if (!existProductCart) {
                return null
            }
            return existProductCart
        } catch (error) {
            console.error('Error:', error)
            return null
        }}

    obtainProductsCart = async (idCart) => {
        try {
            const products = await this.cartRepository.obtainProductsCart(idCart)
            if (!products) {
                return null
            }
            return products
        } catch (e) {
            console.error('Error:', e)
            return null
        }
    }

    updateQuantityProduct = async (idCart, idProd, quantity) => {
        try {
            const prevProduct = await this.cartRepository.existProductInCart(idCart, idProd);
            let prevQuantity = prevProduct.quantity;
            let newQuantity = prevQuantity + quantity;
            const updateQuantity = await this.cartRepository.updateQuantityProductOfProduct(idCart, idProd, newQuantity);
            if (!updateQuantity) {
                return null;
            }
            return updateQuantity;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
        }

    deleteProductCart = async (idCart, idProd) => {
        try {
            const deleteProduct = await this.cartRepository.deleteProductCart(idCart, idProd)
            if (!deleteProduct) {
                return null;
            }
            return deleteProduct;
        } catch (e) {
            console.error('Error:', e)
            return null
        }}

    purchaseCart = async (idCart, deliveryData) => {
        try {
            const purchase = await this.cartRepository.purchaseCart(idCart, deliveryData)
            if (!purchase) {
                return null
            }
        } catch (e) {
            console.error('Error:', e)
            return null
        }}

}
export default CartService