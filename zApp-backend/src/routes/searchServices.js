import express from "express";
import { ZStation } from "../models/zStationSchema.js";

const router = express.Router();

router.get("/locations/services", async (req, res) => {
  try {

    const { service, search } = req.query; 
    const filter = {}; 

    if (service && service.length > 0) {
      const servicesArray = Array.isArray(service) ? service : [service];
      filter.services = { "$in": servicesArray };
    }

    if (search) {
      filter.$or = [
        { services: { $regex: search, $options: "i" } },
      ];
    }

    const projection = {
      id: 1,
      name: 1,
      "location.latitude": 1,
      "location.longitude": 1,
      is_open_now: 1,
      fuels: 1,
      services: 1,
    };

    const stations = await ZStation.find(filter, projection);
    console.log("MongoDB Filter sent:", JSON.stringify(filter));
    
    res.json(stations);
  } catch (error) {
    console.error("❌ Failed to fetch stations:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;