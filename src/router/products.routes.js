import express from "express"
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService, userService } from "../index.js";
import Products from "../dao/mongo/products.dao.js"
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import {transport} from "../utils.js"

const productsRouter = express.Router()

const productDao = new Products()

//Access the products
productsRouter.get("/", async (req, res) => {
     try
     {
         req.logger.info('Products are loaded');
         let result = await productDao.get()
         res.status(200).send({ status: "success", payload: result });
     }
     catch (error)
     {
         res.status(500).send({ status: "error", message: "Internal server error" });
     }
})
productsRouter.get("/:id", async (req, res) => {
     try{
         const prodId = req.params.id;
         const userEmail = req.query.email
         const productDetails = await productDao.getProductById(prodId);
         res.render("viewDetails", { product: productDetails, email: userEmail });
     } catch (error) {
         console.error('Error getting product:', error);
         res.status(500).json({ error: 'Error getting product' });
     }
});
//Create product
productsRouter.post("/", async (req, res) => {
     let { description, image, price, stock, category, availability, owner } = req.body
     if (owner === undefined || owner == '') {
         owner = 'admin@admin.cl'
     }
     const product = { description, image, price, stock, category, availability, owner }
     if (!description || !price) {
         try {
             // Some code that might throw an error
             throw CustomError.createError({
                 name: 'Product Creation Error',
                 cause: generateProductErrorInfo(product),
                 message: 'Error trying to create the Product',
                 code: EErrors.REQUIRED_DATA,
             });
             req.logger.info('Product is created successfully');
         } catch (error) {
             req.logger.error("Error comparing passwords: " + error.message);
             res.status(500).send({ status: "error", message: "Internal server error" });
         }
     }
     let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })
     let userPremium = await userService.getRolUser(owner)
     if (userPremium == 'premium') {
         let result = await productService.createProduct(prod)
         res.status(200).send({ status: "success", payload: result });
         req.logger.info('Product created with premium user');
     } else {
         req.logger.error("The owner must contain premium users");
         res.status(500).send({ status: "error", message: "Internal server error" });
     }
})
//Delete Product, if the product belongs to a premium user, send them an email indicating that the product was deleted
productsRouter.delete('/:idProd', async (req, res) => {
     try
     {
         const productId = req.params.ProdId;
         let ownerProd = await productDao.getProductOwnerById(productId)
         let userRol = await userService.getRolUser(ownerProd.owner)
         if(userRole == 'premium')
         {
             await transport.sendMail({
                 from: 'mconsuelobeckett@gmail.com',
                 to: ownerProd.owner,
                 subject: 'Product with Owner Premium is removed',
                 html:`Product with id ${productId} is deleted correctly`,
             });
             res.status(200).json({ message: 'Product successfully removed.' });
         }else{
             productDao.deleteProduct(productId)
             res.status(200).json({ message: 'Product successfully removed.' });
         }
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Error deleting users.' });
     }
   });

export default productsRouter