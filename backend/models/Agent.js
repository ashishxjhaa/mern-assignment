import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: { 
        type: String,
        required: true,
        match: /^\+[1-9]\d{1,14}$/
    },
    password: {
        type: String, 
        required: true,
        minlength: 6
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
});

export default mongoose.model("Agent", agentSchema);
