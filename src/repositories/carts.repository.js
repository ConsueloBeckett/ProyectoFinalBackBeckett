import CartDTO from "../dao/DTOs/cart.dto.js";

class CartRepository extends CartDTO {
    constructor() {
        super();
    }

    readCarts = async () => {
        let result;
        try {
            result = await this.get();
            return result;
        } catch (e) {
            console.error('Error to find the carts:', e);
            return null;
        }
    }

    getCartById = async (cartId) => {
        let result;
        try {
            result = await this.getCart(cartId);
            return result;
        } catch (e) {
            console.error('Error to find the cart by ID:', e);
            return null;
        }
    }

    addCart = async (cart) => {
        let cartToInsert = new CartDTO(cart);
        let result;
        try {
            result = await this.addCart(cartToInsert);
            return result;
        } catch (e) {
            console.error('Error to save the cart:', e);
            return null;
        }
    }

    addProductCart = async (idCart, idProd) => {
        let result;
        try {
            result = await this.dao.addProductCart(idCart, idProd);
            return result;
        } catch (e) {
            console.error("Product can't be added to cart", e);
            return null;
        }
    }

    existProductInCart = async (idCart, idProd) => {
        let result;
        try {
            result = await this.dao.existProductInCart(idCart, idProd);
            return result;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    }

    obtainProductsCart = async (idCart) => {
        let result;
        try {
            result = await this.dao.obtainProductsCart(idCart);
            return result;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    }

    updateQuantity = async (idCart, idProd, quantity) => {
        let result;
        try {
            result = await this.dao.updateQuantity(idCart, idProd, quantity);
            return result;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    }

    deleteProductCart = async (idCart, idProd) => {
        let result;
        try {
            result = await this.dao.deleteProductCart(idCart, idProd);
            return result;
        } catch (e) {
            console.error('Error:', e);
            return null;
        }
    }

    existCart = async (id) => {
        let result;
        try {
            result = await this.dao.existCart(id);
            return result;
        } catch (e) {
            console.error('Error checking if cart exists:', e);
            return null;
        }
    }

    obteinCart = async (limit) => {
        let result;
        try {
            let cartsOld = await this.readCarts();
            if (!limit) return cartsOld;
            if (cartsOld.length === 0) return null; // Return a consistent type when no data is available
            if (cartsOld && limit) return cartsOld.slice(0, limit);
        } catch (error) {
            console.error('Error obtaining carts:', error);
            return null;
        }
    }

    purchaseCart = async (idCart) => {
        let result;
        try {
            result = await this.dao.purchaseCart(idCart);
            return result;
        } catch (error) {
            console.error('Error purchasing cart:', error);
            return null;
        }
    }
}

export default CartRepository;
