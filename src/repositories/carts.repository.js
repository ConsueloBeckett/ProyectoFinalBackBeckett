import cartModel from "../dao/model/cart.model.js"
import productModel from "../dao/model/product.model.js"
import ticketModel from "../dao/model/ticket.model.js"
import { v4 as uuidv4 } from 'uuid';

class CartRepository extends cartModel {
    constructor() {
        super()
    }

    scanCarts = async () => {
        try {
            const carts = await cartModel.find({})
            return carts
        } catch (e) {
            console.error('Error to find the carts:', e)
            return null;
        }}

        addCart = async (cart) => {
            try {
                const newCart = new cartModel(cart);
                await newCart.save();
                return newCart;  
    
            } catch (e) {
                console.error('Error to save the cart:', e);
                return null;
            }}


    obtainCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId).populate('products.productId');
            if (!cart) {
                return null;
            }
            return cart;
        } catch (e) {
            console.error('Error to find the cart by ID:', e);
            return null;
        }}


    addProductCart = async (idCart, idProd, quantity) => {
        try {
            const filter = { _id: idCart }

            const update = {
                $setOnInsert: { _id: idCart },
                $push: { products: [{ productId: idProd, quantity }] },
            }

            const options = { upsert: true, new: true }

            const cart = await cartModel.findOneAndUpdate(filter, update, options)
            if (!cart) {
                return "Cart not found"
            }
            return "Product added to cart"

        } catch (e) {
            console.error("Product cant be added to cart", e)
            return null
        }}


    existProductInCart = async (idCart, idProd) => {
        try {
            const cart = await cartModel.findById(idCart)
            if (!cart) {
                return "Cart not found"
            }
            const getProductsInCart = cart.products

            const IsProduct =getProductsInCart.find((product) => product.productId.toString() === idProd.toString());
            if (IsProduct) {
                return IsProduct
            } else {
                return null
            }
        } catch (e) {
            console.error('Error:', e)
            return null;
        }}


    obtainProductsCart = async (idCart) => {
        try {
            const cart = await cartModel.findById(idCart)
            if (!cart) {
                return "Cart not found"
            }
            return cart.products;
        } catch (e) {
            console.error('Error:', e)
            return null
        }}


    updateQuantityProduct = async (idCart, idProd, quantity) => {
        try {
            const cart = await cartModel.findById(idCart)
            if (!cart) {
                return "Cart not found";
            }
            const product = await productModel.findById(idProd)
            if (!product) {
                return "Product not found"
            }

            const IsProduct = Array.isArray(cart.products) && cart.products.find((product) => product.productId.toString() === idProd)
            if (IsProduct) {
                const filter = { _id: idCart, "products.productId": idProd }
                const update = { $set: { "products.$.quantity": quantity } }
                const options = { new: true };
                const result = await cartModel.findOneAndUpdate(filter, update, options)
                return result
            } else {
                return null
            }
        } catch (e) {
            console.error('Error:', e)
            return null;
        }}


    deleteProductCart = async (idCart, idProd) => {
        try {
            const cart = await cartModel.findById(idCart)
            if (!cart) {
                return "Cart not found";
            }
            const product = await productModel.findById(idProd)
            if (!product) {
                return "Product not found"
            }

            const productIndex = cart.products.findIndex((product) => product.productId.toString() === idProd)
            if (productIndex === -1) {
                return null;
            }
            cart.products.splice(productIndex, 1)
            await cart.save()
            return "Product deleted from cart"
        } catch (e) {
            console.error('Error:', e)
            return null
        }}

    existCart = async (id) => {
        try {
            const cart = await cartModel.findById(id)
            if (!cart) {
                return null;
            }
            return cart;
        } catch (e) {
            console.error('Error checking if cart exists:', e);
            return null;
        }}

    obtainCarts = async (limit) => {
        let cartsOld = await this.readProducts()
        if (!limit) return cartsOld
        if (cartsOld.length === 0) return "Error obtaining carts:"
        if (cartsOld && limit) return cartsOld.slice(0, limit)
        }

    purchaseCart = async (idCart, deliveryData) => {
        try {
            const cart = await cartModel.findById(idCart);

            if (!cart) {
                return "Cart not found";
            }
            const productsNotAvailable = [];
            const productsAvailable = [];
            let amount = 0;

            for (const cartProduct of cart.products) {
                const productToBuy = await productModel.findById(cartProduct.productId);
                if (!productToBuy || productToBuy.stock < cartProduct.quantity) {
                    productsNotAvailable.push(cartProduct);
                } else {
                    productsAvailable.push({
                        productId: productToBuy._id,
                        quantity: cartProduct.quantity,
                        name: productToBuy.name
                    });
                    productToBuy.stock -= cartProduct.quantity;
                    await productToBuy.save();
                    amount += productToBuy.price * cartProduct.quantity;
                }
            };

            const ticket = new ticketModel({
                code: uuidv4(),
                amount: amount,
                purchaser: cart.name,
                products: productsAvailable,
                products: productsAvailable,
                deliveryAddress: deliveryData.deliveryAddress,
                contactPhone: deliveryData.contactPhone
            });
            await ticket.save();
            cart.products = productsNotAvailable;
            await cart.save()

            return { ticket: ticket, cart: cart };
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

export default CartRepository;
