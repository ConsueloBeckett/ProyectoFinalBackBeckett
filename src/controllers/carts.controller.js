import CartService from '../services/CartService.js'
import ProductService from '../services/ProductService.js';
import mailer from '../services/nodemailer.js'
import CustomError from '../services/errors/customError.js';

const cartService = new CartService()
const productService = new ProductService()
const { sendMail } = mailer

export async function obteinCarts(req, res, next) {
    try {
        let carts = await cartService.scanCarts();

        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "CART_NOT_FOUND",
                    message: "No carts found"
                })
            )
        }

        res.send({ result: "success", payload: carts })
    }
    catch (error) {
        res.status(500).json({ error: 'Error to obtain carts' });
    }
}

export async function obteinCart(req, res, next) {
    const cartId = req.params.cid
    const user = req.user

    try {
        const cart = await cartService.obteinCartById(cartId)
        const products = await cartService.existProductCart(cartId)
        if (!cart) {
            return res.direct("/api/users/login")
        }
        const formattedProducts = await Promise.all(products.map(async (product) => {
            const productData = await productService.getProductById(product.productId);
            return {
                id: product.productId,
                quantity: product.quantity,
                name: productData.name,
                thumbnail: productData.thumbnail,
                price: productData.price,
                total: productData.price * product.quantity
            };
        }));

        res.render("carts", {
            title: "Cart",
            cartId: cartId,
            cart: cart,
            products: formattedProducts,
            user: user
        });

    } catch (e) {
        res.status(500).json({ error: 'Error to obtain the cart' })
    }

}

export async function buildCart(req, res, next) {
    let { name, description, products } = req.body;

    if (!name || !description || !products) {
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_CREATED,
                    message: "El carrito no se ha podido crear"
                })
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
                    message: "The cart could not be updated"
                })
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
                    message: "The cart could not be deleted"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart' });
    }
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
                    message: "The product was not found in the cart"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error getting product' });
    }
}






export async function addProductCart(req, res, next) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity
        const user = req.user;
        const product = await productService.getProductById(productId);

        if (!product) {
            res.status(404).send("Product not found");
            return
        }

        if (product.owner.toString() === user._id.toString()) {
            res.send("This product belongs to you, you cannot add it to your cart.");
            return
        }
        const IsProductCart = await cartService.IsProductCart(cartId, productId)
        let result
        if (IsProductCart) {
            result = await cartService.updateQuantityProduct(cartId, productId)
        }
        else {
            result = cartService.addProductCart(cartId, productId, quantity)
        }
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_CREATED_IN_CART",
                    message: "Could not add product to cart"
                })

            )

        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'error to add the products' })
    }
}












export async function updateQuantityProduct(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await cartService.updateQuantityProduct(cartId, productId, newQuantity);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_UPDATED_IN_CART",
                    message: "Could not update product in cart"
                })
            )
    }
        res.send({ result: "success", payload: result })
} catch (error) {
    res.status(500).json({ error: 'Error updating product' });
}
}










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
                    message: "Could not remove product from cart"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
}

export async function purchaseCart(req, res, next) {
    let cartId = req.session.cartId;
    let contactPhone = req.body.contactPhone;
    let deliveryAddress = req.body.deliveryAddress;
    let deliveryData = { contactPhone, deliveryAddress };
    try {
        const result = await cartService.purchaseCart(cartId, deliveryData);
        const ticket = result.ticket
        let productsBuyed = ticket.products.map(product => product.name);
        const cart = result.cart;
        let productsNotAvailable;
if(cart.product.length === 0){
    productsNotAvailable = "All the products available"
}else{
    productsNotAvailable = cart.product.map(product => product.name)
} const user = req.user
const email = user.email

        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PURCHASE_ERROR",
                    message: "Error en la compra"
                })
            )
    }
    const emailOptions = {
        from: "E-commerce",
        to: email,
        subject: "Purchase made",
        html: `<h1>Successful purchase</h1>
        <p>Dear ${user.name}, we inform you that on date ${ticket.purchase_datetime} the purchase was issued: ${ticket.code} </p>
        <p>Products: ${productsBuyed}</p>
        <p>Amount: ${ticket.amount}</p>
       
        <p>Delivery Address: ${ticket.deliveryAddress}</p>
        <p>Contact phone: ${ticket.contactPhone}</p>
        <p>Products not included: ${productsNotAvailable}</p>
        <p>Thank you for your purchase</p>
        `
    }
    await sendMail(emailOptions);
    return res.render("confirmedPurchase", {
        title: "Purchase made",
        ticket: ticket.code,
        productsBuyed: productsBuyed,
        productsNotAvailable: productsNotAvailable,
        amount: ticket.amount,
        deliveryAddress: ticket.deliveryAddress,
        contactPhone: ticket.contactPhone,
        user: user
    });

    } catch (error) {
        res.status(500).json({ error: 'Purchase failed' });
    }
}