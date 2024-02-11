import cartModel from "../dao/model/cart.model.js"
import productModel from "../dao/model/product.model.js"
import ticketModel from "../dao/model/ticket.model.js"
import { v4 as uuidv4 } from 'uuid';

class CartRepository extends cartModel {
    constructor() {
        super()
    }

    readCarts = async () => {
        try {
            const carts = await cartModel.find({})
            return carts
        } catch (e) {
            console.error('Error to find the carts:', e)
            return null;
        }}

    getCartById = async (cartId) => {
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


    addCart = async (cart) => {
        try {
            const newCart = new cartModel(cart);
            await newCart.save();
            return newCart;

        } catch (e) {
            console.error('Error to save the cart:', e);
            return null;
        }}



    addProductCart = async (idCart, idProd) => {
        try {
            const filter = { _id: idCart }

            const update = {
                $setOnInsert: { _id: idCart },
                $push: { products: [{ productId: idProd, quantity: 1 }] },
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
            const product = await productModel.findById(idProd)
            if (!product) {
                return "Product not found"
            }

            const IsProduct = Array.isArray(cart.products) && cart.products.some((product) => product.productId === idProd)
            if (IsProduct) {
                return product
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


    updateQuantity = async (idCart, idProd, quantity) => {
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

    obteinCart = async (limit) => {
        let cartsOld = await this.readProducts()
        if (!limit) return cartsOld
        if (cartsOld.length === 0) return "Error obtaining carts:"
        if (cartsOld && limit) return cartsOld.slice(0, limit)
        }

    purchaseCart = async (idCart) => {
        try {
            const cart = await cartModel.findById(idCart);
            const products = cart.products;
            const productsNotAvailable = [];
            const productsAvailable = [];
            let amount = 0;

            for (const product of products) {
                const productToBuy = await productModel.findById(product.productId);

                if (!productToBuy || productToBuy.stock < product.quantity) {
                    productsNotAvailable.push(productToBuy);
                    console.error("Not enough stock for product: ", productToBuy);
                } else {
                    productsAvailable.push(productToBuy.name);
                    productToBuy.stock = productToBuy.stock - product.quantity;
                    amount = amount + productToBuy.price * product.quantity;
                    await productToBuy.save();
                }
            }

            if (!cart) {
                return null;
            }

            const ticket = new ticketModel({
                code: uuidv4(),
                amount: amount,
                purchaser: cart.name,
                products: productsAvailable,
            });
            await ticket.save();
            cart.products = productsNotAvailable;

            return { ticket: ticket, cart: cart };
        } catch (error) {
            console.error('Error purchasing cart:', error);
            return null;
        }
    }
}

export default CartRepository;
