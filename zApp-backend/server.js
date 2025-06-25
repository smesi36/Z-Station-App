//___ IMPORTS ___

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/databaseConnection.js";

//This is for displaying station locations on the map
import stationLocationsRoutes from "./src/routes/stationLocations.js";
import testRoute from "./src/routes/testRoute.js";



//___ INITIALIZE EXPRESS ___
const app = express();
const PORT = process.env.PORT;

//__ DATABASE CONNECTION ___
connectDB();


//___ MIDDLEWARES ___
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173" }));

//___ API ROUTES ___
//___ TEST ___
app.use("/api", testRoute);

// This is for displaying station locations on the map (Erekle)
app.use("/api/stations", stationLocationsRoutes);

//___ SONNY'S ENDPOINTS ___








//___ RACHEL'S ENDPOINTS ___







//___ SERVER CONNECTION ___
app.listen(PORT, () =>
  console.log(`Server is connected at http://localhost:${PORT}`)
);

