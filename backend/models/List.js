import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    phoneNumber: { 
        type: String,
        required: true,
        match: /^\+[1-9]\d{1,14}$/
    },
    notes: {
        type: String, 
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    }
});

export default mongoose.model("List", listSchema);
