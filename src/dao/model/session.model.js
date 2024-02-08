import mongoose from "mongoose";

const sessionCollection = "sessions";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',  
        required: true,
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',  
        required: true,
    },
});

const sessionModel = mongoose.model(sessionCollection, sessionSchema);

export default sessionModel;
