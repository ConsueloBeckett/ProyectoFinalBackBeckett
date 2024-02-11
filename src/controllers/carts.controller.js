import CartService from '../services/CartService.js'
const cartService = new CartService()

export async function obteinCart(req, res, next) {
    try {
        let carts = await cartService.readCarts();

        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "CART_NOT_FOUND",
                    message: "No carts found"                })
            )
        }

        res.send({ result: "success", payload: carts })
    }
    catch (error) {
        req.logger.error("Cannot get carts with mongoose: ", error);
    }}

export async function createCart(req, res, next) {
    let { name, description, products } = req.body;

    if (!name || !description || !products) {
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_CREATED,
                    message: "The cart could not be created"                })
            )
        }
    }
    let result = await cartService.addCart({
        name,
        description,
        products
    })
    res.send({ result: "success", payload: result })
}

export async function updateCart(req, res, next) {
    let { cid } = req.params;
    let cartToReplace = req.body;
    if (!cartToReplace.name || !cartToReplace.description || !cartToReplace.products) {
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_UPDATED,
                    message: "The cart could not be updated"                })
            )
        }
    }
    let result = await cartService.updateCart(cid, cartToReplace);
    res.send({ result: "success", payload: result })
}

export async function deleteCart(req, res, next) {
    let { cid } = req.params;
    try {
        let result = await cartService.deleteCart(cid);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_DELETED,
                    message: "The cart could not be deleted"                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart' });    }
}


export async function obtainProductsCart(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await cartService.IsProductCart(cartId, productId);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_FOUND_IN_CART",
                    message: "The product was not found in the cart"                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Error getting product' });    }}


export async function addProductCart(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const user = req.user;

    const product = await productService.getProductById(productId);
    if (!product) {
        return res.status(404).send("Product not found");    }

    if (product.owner === user.email) {
        return res.status(403).send("This product belongs to you, you cannot add it to your cart.");    }

    try {
        const result = await cartService.addProductCart(cartId, productId);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_CREATED_IN_CART",
                    message: "Could not add product to cart"                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Error adding product' });    }}


export async function updateQuantity(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await cartService.updateQuantity(cartId, productId, newQuantity);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_UPDATED_IN_CART",
                    message: "Could not update product in cart"                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error updating product' });    }}

export async function deleteProductCart(req, res, next) {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    try {
        const result = await cartService.deleteProductCart(cartId, productId);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_DELETED_IN_CART",
                    message: "Could not remove product from cart"                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
         console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
}

export async function purchaseCart(req, res, next) {
    let cartId = req.params.cid;
    try {
        const result = await cartService.purchaseCart(cartId);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PURCHASE_ERROR",
                    message: "Error en la compra"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error making purchase:', error);
         res.status(500).json({ error: 'Purchase failed' });
    }}