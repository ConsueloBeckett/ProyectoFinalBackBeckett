import ProductDTO from "../dao/DTOs/product.dto.js";
import mongoose from "mongoose";
import productModel from "../dao/model/product.model.js";

export default class ProductRepository extends productModel {
    constructor() {
        super();
    }

    getProducts = async () => {
        try {
            const products = await productModel.find({});
            return products;
        } catch (e) {
            console.error('Error finding products:', e);
            return null;
        }
    }

    createProduct = async (product) => {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();
            return newProduct;
        } catch (e) {
            console.error('Error saving products:', e);
            throw e;
        }
    }

    obtainProductById = async (productId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return null;
            }
            const product = await productModel.findById(productId);
            if (!product) {
                return null;
            }
            return product;
        } catch (e) {
            console.error('Error finding product by ID:', e);
            return null;
        }
    }

    // Add other methods with similar refactoring

    existProduct = async (id) => {
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
