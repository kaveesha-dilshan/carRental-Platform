import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import { connect } from "mongoose";
import connetDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express()

// connect database
await connetDB()

// Middleware
app.use(cors());
app.use(express.json())

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/owner',bookingRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))