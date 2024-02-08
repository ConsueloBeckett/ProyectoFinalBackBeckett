import ProductService from '../services/ProductService.js'
const productService = new ProductService()

export async function obtainProducts(req, res) {
    try {
        if (!req.session.email) {
            return res.redirect("/login")

        }
        let limit = parseInt(req.query.limit) || 20
        let allProducts = await productService.obtainProducts(limit)
        allProducts = allProducts.map(product => product.toJSON())
        
        const userData = {
            name: req.session.name,
            surname: req.session.surname,
            email: req.session.email,
            role: req.session.role
        }

        res.render("home", {
            title: "",
            products: allProducts,
            user: userData

        })
    } catch (e) {
        console.error('Error to obtain the products:', e);
        res.status(500).json({ error: 'Error to obtain the products' })
    }}

export async function obtainProductById(req, res) {
    try {
        const prodId = req.params.pid
        const prod = await productService.obtainProductById(prodId)

        if (!prod) {
            return res.status(404).json({ error: 'Product not found' })
        }
        const productDetail = prod.toObject()
        res.render("prod", {
            title: "Product detail",
            product: productDetail
        })
    } catch (e) {
        console.error('Error to obtain the product:', e)
        res.status(500).json({ error: 'Error to obtain the product' })
    }}

export async function createProduct(req, res) {
    try {
        let { name, description, price, category, stock, thumbnail} = req.body;
        console.error("El body es:", req.body)

        if (!name || !description || !price || !category || !stock || !thumbnail) {
            return res.send({ status: "error", error: "Incomplete values" })
        }
        let result = await productService.addProduct({
            name,
            description,
            price,
            category,
            stock,
            thumbnail,
           
        })
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error to create product:', error);
        res.status(400).json({ error: 'Error to create product' })
    }}

export async function updateProduct(req, res) {
    try {
        let { pid } = req.params
        let productToReplace = req.body
        if (!productToReplace.name || !productToReplace.description || !productToReplace.price || !productToReplace.category || !productToReplace.stock || !productToReplace.thumbnail ) {
            return res.send({ status: "error", error: "Incomplete values" })
        }
        let result = await productService.updateProduct(pid, productToReplace)
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to update product:', e)
        res.status(400).json({ error: 'Error to update product' })
    }}

export async function deleteProduct(req, res) {
    try {
        let { pid } = req.params
        let result = await productService.deleteProduct(pid)
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to eliminate product:', e)
        res.status(500).json({ error: 'Error to eliminate product' })
    }}

export async function obtainProductByLimit(req, res) {
    try {
        let limit = parseInt(req.params.limit)
        if (isNaN(limit) || limit <= 0) {
            limit = 10
        } res.send(await productService.obtainProductByLimit(limit))
    } catch (e) {
        console.error('Error to obtain products by limit:', e)
        res.status(500).json({ error: 'Error to obtain products by limit' })
    }}

export async function obtainProductByPage(req, res) {
    try {
        let page = parseInt(req.params.page)
        if (isNaN(page) || page <= 0) {
            page = 1
        }
        const productsPerPage = 1
        res.send(await productService.obtainProductByPage(page, productsPerPage))
    } catch (e) {
        console.error('Error to obtain products by page:', e)
        res.status(500).json({ error: 'Error to obtain products by page' })
    }}

export async function obtainProductByQuery(req, res) {
    try {
        let query = req.params.query
        res.send(await productService.obtainProductByQuery(query))
    } catch (e) {
        console.error('Error to obtain products by query:', e)
        res.status(500).json({ error: 'Error to obtain products by query' })
    }}

export async function obtainProductMain(req, res) {
    try {
        let page = parseInt(req.params.page)
        let limit = parseInt(req.params.limit)
        let category = req.params.category
        let availability = req.params.availability
        let sortOrder = req.params.sortOrder
        if (isNaN(page) || page <= 0) {
            page = 1
        }
        if (isNaN(limit) || limit <= 0) {
            limit = 10
        }
        if (!category) {
            category = ''
        }
        if (!availability) {
            availability = ''
        }
        if (!sortOrder) {
            sortOrder = ''
        }
        res.send(await productService.obtainProductMain(page, limit, category, availability, sortOrder))
    } catch (e) {
        console.error('Error to obtain products by query:', e);
        res.status(500).json({ error: 'Error to obtain products by query' })
    }}

