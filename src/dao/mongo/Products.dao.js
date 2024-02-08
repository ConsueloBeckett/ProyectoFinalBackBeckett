import ProductModel from "../model/product.model.js";

export default class Products {

     get = async (params) => {
         try {
             const products = await ProductModel.find(params).lean();
             returnproducts;
         } catch (error) {
             console.error('Error getting products:', error);
             return 'Error getting products';
         }
     }

     getBy = async (params) => {
         try {
             const product = await ProductModel.findOne(params).lean();
             if (!product) {
                 return 'Product not found';
             }
             return product;
         } catch (error) {
             console.error('Error getting product:', error);
             return 'Error getting product';
         }
     }

     save = async (doc) => {
         try {
             const createdProduct = await ProductModel.create(doc);
             return createdProduct;
         } catch (error) {
             console.error('Error saving product:', error);
             return 'Error saving product';
         }
     }

     update = async (id, doc) => {
         try {
             const updatedProduct = await ProductModel.findByIdAndUpdate(id, { $set: doc });
             return updatedProduct;
         } catch (error) {
             console.error('Error updating product:', error);
             return 'Error updating product';
         }
     }

     delete = async (id) => {
         try {
             const deletedProduct = await ProductModel.findByIdAndDelete(id);
             return deletedProduct;
         } catch (error) {
             console.error('Error deleting product:', error);
             return 'Error deleting product';
         }
     }
}