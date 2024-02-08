import cartModel from "../model/cart.model.js";
import mongoose from 'mongoose';

export default class CartService {

     get = (params) => {
         return cartModel.find(params);
     }

     getBy = (params) => {
         return cartModel.findOne(params);
     }

     save = async (cart) => {
         try {
             return await cartModel.create(cart);
         } catch (error) {
             console.error('Error saving cart:', error);
             throw new Error('Error saving cart');
         }
     }

     update = async (cartId, updatedData) => {
         try {
             const cartObjectId = new mongoose.Types.ObjectId(cartId);
             return await cartModel.findByIdAndUpdate(cartObjectId, { $set: updatedData });
         } catch (error) {
             console.error('Error updating cart:', error);
             throw new Error('Error updating cart');
         }
     }

     delete = async (cartId) => {
         try {
             const cartObjectId = new mongoose.Types.ObjectId(cartId);
             return await cartModel.findByIdAndDelete(cartObjectId);
         } catch (error) {
             console.error('Error deleting cart:', error);
             throw new Error('Error deleting cart');
         }
     }

     addToCart = async (cartId, productId, quantity) => {
         try {
             const cartObjectId = new mongoose.Types.ObjectId(cartId);
             let cart = await cartModel.findById(cartObjectId);

             const existingProduct = cart.products.find(product => product.productId.equals(productId));

             if (existingProduct) {
                 // update the cart
                 existingProduct.quantity += quantity;
             } else {
                 // add it to cart
                 cart.products.push({
                     productId: productId,
                     quantity: quantity,
                 });
             }

             // Save changes to cart
             await cart.save();

             console.log("Product added to cart successfully");
             returncart;
         } catch (error) {
             console.error('Error adding product to cart:', error);
             throw new Error('Error adding product to cart');
         }
     }

     getCartWithProducts = async (cartId) => {
         try {
             const cartObjectId = new mongoose.Types.ObjectId(cartId);
             const cart = await cartModel.findById(cartObjectId).populate('products.productId').lean();
             if (!cart) {
                 return 'Cart not found';
             }

             returncart;
         } catch (error) {
             console.error('Error getting products from cart:', error);
             throw new Error('Error getting products from cart');
         }
     }
}