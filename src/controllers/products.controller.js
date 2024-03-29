import ProductService from '../services/ProductService.js';
import ProductDTO from '../dao/DTOs/product.dto.js';
import UserDTO from '../dao/DTOs/user.dto.js'
import CustomError from '../services/errors/customError.js';
import mailer from "../services/nodemailer.js";

const productService = new ProductService()
const { sendMail } = mailer;


export async function obtainProducts(req, res, next) {
    try {
        if (!req.session.email) {
            return res.redirect("/login")

        }
        let limit = parseInt(req.query.limit) || 100; 
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort || "asc";
        let query = req.query.query || {};
        let allProducts = await productService.getProducts(limit, page, sort, query);

        if (!allProducts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCTS_NOT_FOUND",
                    message: "No products found"
                })
            )
        }

        allProducts = allProducts.docs.map(product => new ProductDTO(product))
        req.logger.info("The user is:", req.session.user)        
        let user = req.session.user
        let isAdmin
        let isAuthorized
        if (!user) {
            return res.redirect("login")
        }
        if (user.role === "admin"){
            isAdmin = true
        }
        if (user.role === "admin" || user.role === "premium "){
            isAuthorized = true
        }
        let {name, email, role } = user
        let cartId = req.session.cartId
        const userData = new UserDTO({ name, email, role })

        res.render("home", {
            title: "Final Proyect",
            products: allProducts,
            user: userData,
            cartId: cartId,
            isAdmin,
            isAuthorized

        })
    } catch (error) {
        req.logger.error('Error getting products:', error);
        res.status(500).json({ error: 'Error getting products' });    
    
    
    }

}








export async function obtainProductById(req, res, next) {
    try {
        let user = req.session.user
        if (!user) {
            return res.redirect("/login")

        }
        const prodId = req.body.prodId || req.params.pid;
        let { name, email, role } = user
        let cartId = req.session.cartId;
        const userData = new UserDTO({ name, email, role })
        const prod = await productService.getProductById(prodId);

        if (!prod) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_FOUND",
                    message: "Product not found"                })
            )
        }
        const productDetail = prod.toObject();
        res.render("prod", {
            title: "Detail Product",
            user,
            product: productDetail,
            userData: userData,
            cartId: cartId
        })
    } catch (error) {
        res.status(500).json({ error: 'Error getting product' });    }
}

export async function createProduct(req, res, next) {
    try {
        let user = req.session.user
        if (user.role === 'premium' || user.role === 'admin') {
            const productData = { ...req.body, owner: req.user._id };
            req.logger.debug("The body is", req.body)

            if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.stock || !productData.thumbnail) {
                return next(
                    CustomError.createError({
                        statusCode: 400, 
                        causeKey: "PRODUCT_NOT_CREATED",
                        message: "The product could not be created"                   
                     })
                )
            }

            let result = await productService.addProduct(productData);
            let { name, description, price, category, stock, thumbnail, owner } = productData
            res.render("confirmedproduct", { title: "Created product", product: result, user: user, name, description, price, category, stock, thumbnail, owner })        }
    } catch (e) {
        req.status(500).json({e: 'Error creating product:'});
    
    }
    
}

export async function updateProduct(req, res, next) {
    try {
        let { pid } = req.params;
        let productToReplace = req.body;
        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        let owner = product.owner;
        let user = req.user;
        let userId = user._id.toString();

        if (owner !== userId && user.role !== "admin") {
            return res.status(403).send("Unauthorized access. This product does not belong to you.");
        }

        if (!productToReplace.name || !productToReplace.description || !productToReplace.price || !productToReplace.category || !productToReplace.stock || !productToReplace.thumbnail) {

            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_UPDATED",
                    message: "The product could not be updated"
                })
            )
        }
        let result = await productService.updateProduct(pid, productToReplace);
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });    
    }
}

export async function deleteProduct(req, res, next) {

    try {
        let { pid } = req.params;
    let user = req.user;

    const product = await productService.getProductById(pid);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    let owner = product.owner;
    let ownerEmail = owner.email;
    let userId = user._id.toString();

    if (owner !== userId && user.role !== "admin") {
        return res.status(403).send("Unauthorized access. This product does not belong to you.");
    }

    let result = await productService.deleteProduct(pid);
    const mailOptions = {
        from: "email@admin.cl",
        to: [ownerEmail, "mconsuelobeckett@gmail.com"],
        subject: "Product removed",
        text: `Product ${product.name} has been deleted`
    }
    sendMail(mailOptions);
    if (!result) {
        return next(
            CustomError.createError({
                statusCode: 404,
                causeKey: "PRODUCT_NOT_DELETED",
                message: "The product could not be deleted"
            })
        )
    }
    res.send({ result: "success", payload: result })
} catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
}
}



export async function obtainProductMain(req, res, next) {
    try {
        let limit = parseInt(req.query.limit) || 100; 
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort || "asc";
        let query = req.query.query || {};
        let allProducts = await productService.getProducts(limit, page, sort, query)

        if (!allProducts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCTS_NOT_FOUND",
                    message: "No products found"                })
            )
        }
        let user = req.user;
        if (!user) {
            return res.redirect("/login")
        }
        let isAdmin;
        let isAuthorized;
        if (user.role === "admin") {
            isAdmin = true;
        }
        if (user.role === "admin" || user.role === "premium") {
            isAuthorized = true;
        }

        allProducts = allProducts.docs.map(product => new ProductDTO(product))
        res.render("manageProducts", {
            title: "Product Management",
            products: allProducts,
            isAdmin,
            isAuthorized,
            user: user
        })
    } catch (error) {
        res.status(500).json({ error: 'Error getting products' });
    }
}

