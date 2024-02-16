import productModel from "../dao/model/product.model.js";
import mongoose from "mongoose";

class ProductRepository extends productModel {
    constructor() {
        super()
    }

    scanProducts = async () => {
        try {
            const products = await productModel.find({});
            return products;
        } catch (e) {
            console.error('Error finding products:', e);
            return null;
        }
    }

    obtainProducts = async (limit, page, sort, query) => {
        let newQuery = query || {};
        let paginate = { limit, page, sort }

        let products = await productModel.paginate(newQuery, paginate)
        if (!products) {
            return null;
        }
        return products;
    }

    addProduct = async (product) => {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();
            return newProduct;

        } catch (error) {
            console.error('Error in repository saving product:', error);
            return null;
        }
    }

    obtainProductById =  async (productId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return null;
            }
            const product = await productModel.findById(productId);
            if (!product) {
                return null;
            }
            return product;
        } catch (error) {
            console.error('Error to find products by ID:', error);
            return null;
        }}

    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await productModel.findOneAndUpdate({ _id: id }, product, { new: true });
            if (updatedProduct) {
                return { updatedProduct, message: "Producto updated" };
            } else {
                return "Product not found";
            }

        } catch (error) {
            console.error('Error to updated the products:', error);
            return null;
        }}

    deleteProduct = async (productId) => {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(productId);
            return deletedProduct;
        } catch (e) {
            console.error('Error to delete the products', e)
            return null;
        }}


        existProducts = async (id) => {
            try {
                const product = await productModel.findById(id);
                if (!product) {
                    return null;
                }
                return product;
            } catch (e) {
                console.error('Error checking if product exists:', e);
                return null;
            }
 }
}
    

export default ProductRepository