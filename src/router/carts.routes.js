import express from "express"
import CartDTO from "../dao/DTOs/cart.dto.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService, cartService, userService } from "../index.js";
import Carts from "../dao/mongo/carts.dao.js";

const cartRouter = express.Router()

const cartDao = new Carts()

//Get Cart
cartRouter.get("/", async (req, res) => {
     try
     {
         req.logger.info('cart list');
         let result = await cartDao.get()
         res.status(200).send({ status: "success", payload: result });
     }
     catch(error)
     {
         req.logger.info('Error,Cannot access cart list');
         res.status(500).send({ status: "error", message: "Server error" });
     }
})
//Create Cart
// Create Cart
cartRouter.post("/", async (req, res) => {
    try {
        const { products } = req.body;
        const email = req.body.email;

        // Verifica si el usuario es premium y está intentando agregar su propio producto al carrito
        const roleUser = userService.getRolUser(products.owner);

        if (roleUser === 'premium' && email === products.owner) {
            req.logger.error('A premium user CANNOT add a product that belongs to them to their cart');
            return res.status(400).send({ status: "error", message: "A premium user CANNOT add a product that belongs to them to their cart" });
        }

        // Crea una instancia de CartDTO solo con la información de productos
        const cart = new CartDTO({ products });

        // Utiliza cartService para agregar el carrito
        const result = await cartService.addCart(cart);

        if (result) {
            req.logger.info('Cart is created successfully');
            return res.status(201).send({ status: "success", payload: result });
        } else {
            req.logger.error("Error creating cart");
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
    } catch (error) {
        req.logger.error("Error creating cart: " + error.message);
        return res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

//Create purchase with cart and ticket
cartRouter.post("/:cid/purchase", async (req, res) => {
     try {
         let cart_id = req.params.cid;
         const products = req.body.products;
         const mail = req.body.mail;
         let cart = cartService.validateCart(id_cart)
         if (!cart) {
             req.logger.error("The cart with the given ID was not found");
             return { error: "The cart with the given ID was not found" };
         }
         let validateStock = cartService.validateStock({products})

         if (validateStock) {
             let totalAmount = await cartService.getAmount({products})
             const ticketFormat = new TicketDTO({amount:totalAmount, purchaser:mail});
             const result = await ticketService.createTicket(ticketFormat);
         } else {
             req.logger.error("There is not enough stock to make the purchase");
         }
     } catch (error) {
         req.logger.error("Error processing purchase:" + error.message);
         return res.status(500).json({ error: "Internal error processing the purchase" });
     }
})

export default cartRouter