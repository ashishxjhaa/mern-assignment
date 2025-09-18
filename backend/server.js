import express from "express";
const app = express();

import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import cors from "cors";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from "./models/Admin.js";
import { verifyToken } from "./middleware.js";
dotenv.config();


app.use(cors());
app.use(express.json());



app.post("/createadmin", async (req, res) => {
    try{
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const admin = await Admin.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.json({
            message: "Admin Created"
        })
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email })

        if (!admin) {
            return res.status(400).json({
                error: "Admin not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Invalid password"
            });
        }

        const token = jwt.sign({
            adminId: admin._id,
        }, process.env.JWT_SECRET)

        res.json({
            token
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

app.get("/dashboard", verifyToken, (req, res) => {
    res.json({ 
        message: "Welcome to dashboard!"
    });
});



async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        });
    } catch (e) {
        console.log("DB connection error")
    }
}

main()