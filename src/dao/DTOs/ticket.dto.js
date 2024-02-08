// ticket.dto
export default class TicketDTO {
    constructor(ticket) {
        this.title = ticket.title || "";
        this.description = ticket.description || "";
        this.price = ticket.price || 0;
        this.items = ticket.items || [];
    }
}
