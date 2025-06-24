//___ IMPORTS ___
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT;



//___ DATABASE CONNECTION ___



//___ MIDDLEWARES ___
app.use(express.json());
app.use(morgan('dev'))
app.use(cors('http://localhost:5173'))




//___ API ROUTES ___





//___ SERVER CONNECTION ___
app.listen(PORT, () => console.log(`Server is connected at http://localhost:${PORT}`))