import ProductRepository from "../repositories/products.repository.js";

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository()
    }

    obtainProducts = async (limit) => {
        try {
            const products = await this.productRepository.obtainProducts(limit)
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

    obtainProductByLimit = async (limit) => {
        try {
            const products = await this.productRepository.obtainProductByLimit(limit)
            return products;
        } catch (e) {
            console.error('Error to obtain product by limit:', e)
            return null;
        }}

    obtainProductByPage = async (page) => {
        try {
            const products = await this.productRepository.obtainProductByPage(page)
            return products
        } catch (e) {
            console.error('Error to obtain product by page:', e)
        }}

    obtainProductByQuery = async (query) => {
        try {
            const products = await this.productRepository.obtainProductByQuery(query)
            return products
        } catch (e) {
            console.error('Error to search product by query:', e)
            return null
        }}

    obtainProductMain = async (page, limit, category, availability, sortOrder) => {
        try {
            const products = await this.productRepository.obtainProductMain(page, limit, category, availability, sortOrder)
            return products
        } catch (e) {
            console.error('Error to search product by main:', e)
            return null
        }}
}

export default ProductService



