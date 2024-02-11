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
                    message: "No products found"})
            )
        }

        allProducts = allProducts.docs.map(product => new ProductDTO(product))
        req.logger.info("The user is:", req.session.user)        
        let { name, email, role } = req.session.user
        const userData = new UserDTO({ name, email, role })
        req.logger.info("The userData is:", userData)

        res.render("home", {
            title: "Final Proyect",
            products: allProducts,
            user: userData

        })
    } catch (error) {
        req.logger.error('Error getting products:', error);
        res.status(500).json({ error: 'Error getting products' });    }}


export async function obtainProductById(req, res, next) {
    try {
        const prodId = req.body.prodId || req.params.pid;
        const user = req.user;
        const cartId = user.cart.cart._id;
        console.log("The prodId is:", prodId)
        console.log("The req.body is:", req.body)
        console.log("The req.params is:", req.params)
        console.log("The user is:", user)
        console.log("The cartId is:", cartId)
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
            product: productDetail
        })
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Error getting product' });    }
}

export async function createProduct(req, res, next) {
    try {
        if (req.user.role === 'premium' || req.user.role === 'admin') {
            const productData = { ...req.body, owner: req.user._id };
            req.logger.debug("The body is", req.body)

            if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.stock || !productData.thumbnail) {
                return next(
                    CustomError.createError({
                        statusCode: 400, 
                        causeKey: "PRODUCT_NOT_CREATED",
                        message: "The product could not be created"                    })
                );
            }

            let result = await productService.addProduct(productData);
            res.send({ result: "success", payload: result });
        }
    } catch (error) {
        req.logger.error('Error creating product:', error);
        next(error);
    }
    
}

export async function updateProduct(req, res, next) {
    try {
        let { pid } = req.params;
        console.log("the pid is:", pid)

        let productToReplace = req.body;
        console.log("the productToReplace is:", productToReplace)
        if (!productToReplace.name || !productToReplace.description || !productToReplace.price || !productToReplace.category || !productToReplace.stock || !productToReplace.thumbnail) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_UPDATED",
                    message: "The product could not be updated"                })
            )
        }
        let result = await productService.updateProduct(pid, productToReplace);
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });    }}

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
            from: "email@admin",
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
                    message: "The product could not be deleted"                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error deleting product:', error)
        res.status(500).json({ error: 'Error deleting product' });    }}



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
        let isAdmin;
        let isAuthorized;
        let user = req.user;
        if (!user) {
            return res.redirect("/login")
        }
        if (user.role === "admin") {
            isAdmin = true;
        }
        if (user.role === "admin" || user.role === "premium") {
            isAuthorized = true;
        }

        allProducts = allProducts.docs.map(product => new ProductDTO(product))
        res.render("manageProducts", {
            title: "Manage Products",
            products: allProducts,
            isAdmin,
            isAuthorized
        })
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Error getting products' });    }}

