import ProductRepository from "../repositories/products.repository.js";

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository()
    }

    obtainProducts = async (limit, page, sort, query) => {
        try {
            const products = await this.productRepository.obtainProducts(limit, page, sort, query)
            return products;
        } catch (e) {
            console.error('Error to search products:', e)
            return null;
        }}

    addProduct = async (product) => {
        try {
            const newProduct = await this.productRepository.addProduct(product)
            return newProduct
        } catch (e) {
            console.error('Error to save products:', e)
            return null;
        }}

    obtainProductById = async (productId) => {
        try {
            const product = await this.productRepository.obtainProductById(productId)
            if (!product) {
                return null
            }
            return product
        } catch (e) {
            console.error('Error to search product by ID:', e)
            return null
        }}

    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await this.productRepository.updateProduct(id, product)
            return updatedProduct
        } catch (e) {
            console.error('Error to update product:', e)
            return null;
        }}

    deleteProduct = async (productId) => {
        try {
            const deletedProduct = await this.productRepository.deleteProduct(productId)
            return deletedProduct
        } catch (e) {
            console.error('Error to delete product:', e)
            return null
        }}

}

export default ProductService



