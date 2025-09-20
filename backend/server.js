import express from "express";
const app = express();

import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import cors from "cors";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from "./models/Admin.js";
import { verifyToken } from "./middleware.js";
import Agent from "./models/Agent.js";
import List from "./models/List.js";
import upload from "./uploads.js";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";
import validateRow from "./validate.js";
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
            token,
            fullName: admin.fullName
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

app.get("/allagents", verifyToken, async (req, res) => {
    try {
        const agents = await Agent.find({ 
            createdBy: req.user.id 
        });

        res.json(agents);
    } catch (e) {
        res.status(500).json({ 
            error: "Internal Server Error" 
        });
    }
});

app.post("/createagent", verifyToken, async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const agent = await Agent.create({
            name,
            email,
            mobileNumber,
            password: hashedPassword,
            createdBy: req.user.id
        });

        res.json({ 
            message: "Agent Created!"
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

app.put("/agent/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobileNumber, password } = req.body;

        const updateData = { name, email, mobileNumber };

        // Only update password if provided
        if (password) {
            updateData.password = password;
        }

        const updatedAgent = await Agent.findOneAndUpdate(
            { _id: id, createdBy: req.user.id },
            updateData,
            { new: true }
        );

        if (!updatedAgent) {
            return res.status(404).json({ 
                error: "Agent not found" 
            });
        }

        res.json({
            message: "Agent updated!",
        });
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/agent/:id", verifyToken, async (req, res) => {
    try {
        const deletedAgent = await Agent.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!deletedAgent) {
            return res.status(404).json({ 
                error: "Agent not found" 
            });
        }

        res.json({ message: "Agent deleted!" });
    } catch (e) {
        res.status(500).json({ 
            error: "Internal Server Error" 
        });
    }
});

app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded"
            })
        }
        const ext = path.extname(req.file.originalname).toLowerCase();
        let parsedData = [];

        if (ext === ".csv") {
            parsedData = await new Promise((resolve, reject) => {
                const results = [];
                fs.createReadStream(req.file.path)
                .pipe(csv())
                .on("data", (row) => results.push(row))
                .on("end", () => resolve(results))
                .on("error", reject);
            })
        } else {
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            parsedData = xlsx.utils.sheet_to_json(sheet);
        }

        const errors = [];
        const validData = [];

        parsedData.forEach((row, index) => {
            const error = validateRow(row);
            if (error) {
                errors.push({ row: index + 1, error });
            } else {
                validData.push({
                    firstName: row.FirstName,
                    phoneNumber: row.Phone,
                    notes: row.Notes
                });
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const agents = await Agent.find();
        if (agents.length < 1) {
            return res.status(400).json({ error: "No agents available" });
        }

        const distributed = [];
        validData.forEach((item, index) => {
            const agent = agents[index % agents.length];
            distributed.push({ ...item, createdBy: agent._id });
        });

        await List.insertMany(distributed);

        res.json({
            success: true,
            message: "List distributed successfully",
            count: distributed.length,
            data: distributed
        })
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})

app.get("/distributed-list/:agentId", verifyToken, async (req, res) => {
    try {
        const lists = await List.find({ createdBy: req.params.agentId });
        res.json(lists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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