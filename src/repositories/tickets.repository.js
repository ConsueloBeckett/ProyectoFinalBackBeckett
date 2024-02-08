import TicketDTO from "../dao/DTOs/ticket.dto.js";

export default class TicketRepository {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }

    getTickets = async () => {
        try {
            const tickets = await this.ticketModel.find();
            return tickets;
        } catch (error) {
            console.error("Error obtaining tickets: ", error);
            return error;
        }
    }

    createTicket = async (ticket) => {
        try {
            const ticketToInsert = new TicketDTO(ticket);
            const newTicket = await this.ticketModel.create(ticketToInsert);
            return newTicket;
        } catch (error) {
            console.error("Error adding ticket: ", error);
            return error;
        }
    }
}
