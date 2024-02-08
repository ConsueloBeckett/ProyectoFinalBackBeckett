import CartService from '../services/CartService.js'
const cartService = new CartService()

export async function obteinCart(req, res) {
    try {
        let carts = await cartService.readCarts()
        res.send({ result: "success", payload: carts })
    }
    catch (e) {
        console.error("Cant get carts: ", e)
    }}

export async function getCart(req, res) {
    const cartId = req.params.cid

    try {
        const cart = await cartService.getCartById(cartId)
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }
        res.json(cart)
    } catch (e) {
        console.error('Error to obtain cart:', e);
        res.status(500).json({ error: 'Error to obtain cart' })
    }}

export async function createCart(req, res) {
    let { name, description, products } = req.body;

    if (!name || !description || !products) {
        return res.send({ status: "error", error: "Incomplete values" })
    }
    let result = await cartService.addCart({
        name,
        description,
        products
    })
    res.send({ result: "success", payload: result })
}

export async function updateCart(req, res) {
    let { cid } = req.params
    let cartToReplace = req.body
    if (!cartToReplace.name || !cartToReplace.description || !cartToReplace.products) {
        return res.send({ status: "error", error: "Incomplete values" })
    }
    let result = await cartService.updateCart(cid, cartToReplace)
    res.send({ result: "success", payload: result })
}

export async function deleteCart(req, res) {
    let { cid } = req.params
    let result = await cartService.deleteCart(cid)
    res.send({ result: "success", payload: result })
}


export async function obtainProductsCart(req, res) {
    const cartId = req.params.cid
    const productId = req.params.pid

    try {
        const result = await cartService.isProductCart(cartId, productId)
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to obtain product:', e)
        res.status(500).json({ error: 'Error to obtain product' })
    }}


export async function addProductCart(req, res) {
    const cartId = req.params.cid
    const productId = req.params.pid

    try {
        const result = await cartService.addProductCart(cartId, productId)
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to add product:', e)
        res.status(500).json({ error: 'Error to add product' })
    }}

export async function updateQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await cartService.updateQuantity(cartId, productId, newQuantity);
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to update product:', e)
        res.status(500).json({ error: 'Error to update product:' })
    }}

export async function deleteProductCart(req, res) {
    let cartId = req.params.cid
    let productId = req.params.pid
    try {
        const result = await cartService.deleteProductCart(cartId, productId)
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to eliminate the product:', e)
        res.status(500).json({ error: 'Error to eliminate the product' })
    }}

export async function purchaseCart(req, res) {
    let cartId = req.params.cid;
    try {
        const result = await cartService.purchaseCart(cartId)
        res.send({ result: "success", payload: result })
    } catch (e) {
        console.error('Error to purchase:', e)
        res.status(500).json({ error: 'Error to purchase' })
    }}