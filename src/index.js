import { Carts, Products, Tickets, Users } from "../src/dao/factory.js";

import CartRepository from "../src/repositories/carts.repository.js";
import ProductRepository from "../src/repositories/products.repository.js";
import UserRepository from "../src/repositories/users.repository.js";
import TicketRepository from "./repositories/tickets.repository.js";

export const cartService = new CartRepository(new Carts())
export const productService = new ProductRepository(new Products())
export const userService = new UserRepository(new Users())
export const ticketService = new TicketRepository(new Tickets())