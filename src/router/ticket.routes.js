import { ticketRouter } from "express";
import express from "express"
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService } from "../index.js";
import Tickets from "../dao/mongo/tickets.dao.js"

const ticketRouter = express.Router()

const ticketDao = new Tickets()

//Obtener Tickets
ticketRouter.get("/", async (req, res) => {
    try {
        req.logger.info('List of tickets is obtained');        
        let result = await ticketDao.get()
        res.status(200).send({ status: "success", payload: result });
    }
    catch (error) {
req.logger.info('Error getting list of tickets');       
res.status(500).send({ status: "error", message: "Internal server error" });    }
})
//Crear Tickets
ticketRouter.post("/", async (req, res) => {
    try {
        let { amount, purchaser } = req.body
        let tick = new TicketDTO({ amount, purchaser })
        let result = await ticketService.createTicket(tick)
        if (result) {
            req.logger.info('Ticket is created successfully');
            res.status(200).send({ status: "success", payload: result });
        } else {
            req.logger.error("Error creating ticket");
             res.status(500).send({ status: "error", message: "Error creating ticket" });
        }
    }
    catch (error) {
        res.status(500).send({ status: "error", message: "Internal server error" });    }
})

export default ticketRouter