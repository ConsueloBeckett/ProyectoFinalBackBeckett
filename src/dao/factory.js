import mongoose from "mongoose";
import config from '../config/config.js'
export class Carts {}
export class Products {}
export class Users{}
export class Tickets{}
switch (config.persistence) {
    case "MONGO":
        const connection = mongoose.connect(config.mongo_url)
        const { default: CartsDao } = await import('./mongo/carts.dao.js')
        const { default: ProductDao } = await import('./mongo/products.dao.js')
        const { default: UsersDao } = await import('./mongo/users.dao.js')
        const { default: TicketDao } = await import('./mongo/ticket.dao.js')
        Carts = CartsDao
        Products = ProductDao
        Users = UsersDao
        Tickets = TicketDao
        break;
    case "MEMORY":
        const { default: CartsMemory } = await import("./memory/carts.memory.js")
        const { default: ProductsMemory } = await import("./memory/products.memory.js")
        const { default: UsersMemory } = await import("./memory/users.memory.js")
        const { default: TicketsMemory } = await import("./memory/tickets.memory.js")
        Carts = CartsMemory
        Products = ProductsMemory
        Users = UsersMemory
        Tickets = TicketsMemory
        break
    default: 

}