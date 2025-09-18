import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: { 
        type: String,
        unique: true,
        required: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    }
});

export default mongoose.model("Admin", adminSchema);
