import ticketModel from "../model/ticket.model.js";

export default class Tickets {
    // Get all tickets
    get = (params) => {
        return ticketModel.find(params);
    }

    // Get a ticket by filters
    getBy = (params) => {
        return ticketModel.findOne(params);
    }

    // Create a new ticket
    save = (doc) => {
        return ticketModel.create(doc);
    }

    // Update a ticket by ID
    update = (id, doc) => {
        return ticketModel.findByIdAndUpdate(id, { $set: doc });
    }

    // Delete a ticket by ID
    delete = (id) => {
        return ticketModel.findByIdAndDelete(id);
    }

    // Get all tickets with specific fields (_id, subject, status, assigned_user)
    getTicketsWithSpecificFields = async () => {
        try {
            let tickets = await ticketModel.find().select('_id subject status assigned_user');
            return tickets;
        } catch (error) {
            console.error('Error getting tickets:', error);
            throw error;
        }
    }

    // Get a ticket by ID
    getTicketById = async (id) => {
        try {
            const ticket = await ticketModel.findById(id).lean();
            if (!ticket) {
                return 'Ticket not found';
            }
            return ticket;
        } catch (error) {
            console.error('Error getting ticket:', error);
            throw error;
        }
    }

    // Find a ticket by subject
    findTicketBySubject = async (subject) => {
        try {
            const ticket = await ticketModel.findOne({ subject });
            return ticket;
        } catch (error) {
            console.error('Error searching for ticket by subject:', error);
            throw error;
        }
    }

    // Add a new ticket
    addTicket = async (ticketData) => {
        try {
            let ticketCreate = await ticketModel.create(ticketData);
            return ticketCreate;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    // Update the status of a ticket by ID
    updateTicketStatus = async (id, newStatus) => {
        try {
            const updatedTicket = await ticketModel.findByIdAndUpdate(
                id,
                { $set: { status: newStatus } },
                { new: true }
            );

            if (updatedTicket) {
                return updatedTicket;
            } else {
                console.error('Ticket not found');
            }
        } catch (error) {
            console.error('Ticket not found:', error);
            throw error;
        }
    }
}
