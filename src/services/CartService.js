import CartRepository from "../repositories/carts.repository.js"


class CartService {
    constructor() {
        this.cartRepository = new CartRepository()
    }

    readCarts = async () => {
        try {
            const carts = await this.cartRepository.readCarts()
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

    getCartById = async (cartId) => {
        try {
            const cart = await this.cartRepository.getCartById(cartId)

            if (!cart) {
                return null
            }
            return cart
        } catch (e) {
            console.error('Error to find the cart by ID:', e)
            return null
        }}

  
    addProductCart = async (idCart, idProd) => {
        try {
            const newProduct = await this.cartRepository.addProductCart(idCart, idProd)
            if (!newProduct) {
                return null
            }
            return newProduct
        } catch (e) {
            console.error('Error to save product at the cart:', e)
            return null;
        }}

    IsProductCart = async (idCart, idProd) => {
        try {
            const IsProductCart = await this.cartRepository.IsProductCart(idCart, idProd)
            if (!IsProductCart) {
                return null
            }
            return IsProductCart
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

    updateQuantity = async (idCart, idProd, quantity) => {
        try {
            const updateQuantity = await this.cartRepository.updateQuantity(idCart, idProd, quantity)
            if (!updateQuantity) {
                return null
            }
            return updateQuantity
        } catch (e) {
            console.error('Error:', e)
            return null
        }}

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

    purchaseCart = async (idCart) => {
        try {
            const purchase = await this.cartRepository.purchaseCart(idCart)
            if (!purchase) {
                return null
            }
        } catch (e) {
            console.error('Error:', e)
            return null
        }}

}
export default CartService