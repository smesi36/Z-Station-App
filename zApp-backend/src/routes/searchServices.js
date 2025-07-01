import express from "express";
import { ZStation } from "../models/zStationSchema.js";

const router = express.Router();

router.get("/locations/services", async (req, res) => {
  try {
    const { service, search } = req.query;
    let filter = {};

    // If the service query parameter is provided, filter by services
    if (service && service.length > 0) {
      const servicesArray = Array.isArray(service) ? service : [service];
      const servicesRegex = servicesArray.map((s) => new RegExp(s, "i")); 
      filter.services = { $all: servicesRegex }; // This finds stations with ALL of the services
    }

    if (search) {
      const searchWords = search.split(/\s+/).filter((word) => word.length > 0);

      if (searchWords.length > 0) {
        const andConditions = searchWords.map((word) => {
          const wordRegex = new RegExp(word, "i");

          return {
            $or: [
              { services: { $regex: wordRegex } },
              { "location.address": { $regex: wordRegex } },
              { "location.suburb": { $regex: wordRegex } },
              { "location.city": { $regex: wordRegex } },
              { "location.region": { $regex: wordRegex } },
              { name: { $regex: wordRegex } },
            ],
          };
        });

        if (Object.keys(filter).length > 0) {
          filter = {
            $and: [filter, ...andConditions],
          };
        } else {
          // Otherwise, the filter is just the new combined search conditions
          filter = { $and: andConditions };
        }
      }
    }

    const projection = {
      name: 1,
      "location.city": 1,
      "location.latitude": 1,
      "location.longitude": 1,
      is_open_now: 1,
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
