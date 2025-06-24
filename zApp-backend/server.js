//___ IMPORTS ___
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import dotenv from 'dotenv';

//This is for displaying station locations on the map
import stationLocationsRoutes from "./src/routes/stationLocations.js";

dotenv.config();
const app = express()
const PORT = process.env.PORT || 4000;
const MongoDB = process.env.MONGO_URI
mongoose.Promise = global.Promise;


//___ DATABASE CONNECTION ___
const connectDB = async () => {
    try {
        await mongoose.connect(MongoDB);
        console.log("MongoDB Connected");

        process.on('exit', async () => {
            if (mongoose.connection.readyState === 1) {
                await closeDB();
                console.log("MongoDB Connection Closed");
            }
        });

    } catch (err) {
        console.error("Connection Error:", err.message);
        process.exit(1);
    }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

//___ MIDDLEWARES ___
app.use(express.json());
app.use(morgan('dev'))
app.use(cors('http://localhost:5173'))




//___ API ROUTES ___
//___ TEST ___
app.get('/test', (req, res) => {
  res.status(200).json({ message: "API is working!" });
});


// This is for displaying station locations on the map (Erekle)
app.use("/api/stations", stationLocationsRoutes);


//___ SERVER CONNECTION ___
app.listen(PORT, () => console.log(`Server is connected at http://localhost:${PORT}`))

export { connectDB, closeDB}