import express from "express";
import { ZStation } from "../models/zStationSchema.js"; // Adjust path if needed

const router = express.Router();

router.get("/locations/services", async (req, res) => {
    try {
        const { service, search } = req.query;
        
        // Start with an array to hold all top-level conditions
        const conditions = [];

        // 1. Handle Service Filtering
        if (service) {
            const servicesArray = Array.isArray(service) ? service : [service];
            if (servicesArray.length > 0) {
                const serviceRegex = servicesArray.map(s => new RegExp(s, "i"));
                conditions.push({ services: { $all: serviceRegex } });
            }
        }

        // 2. Handle Search Term Filtering
        if (search) {
            const searchWords = search.split(/\s+/).filter(word => word.length > 0);
            if (searchWords.length > 0) {
                const searchConditions = searchWords.map(word => {
                    const wordRegex = new RegExp(word, "i");
                    return {
                        $or: [
                            { name: wordRegex },
                            { "location.address": wordRegex },
                            { "location.suburb": wordRegex },
                            { "location.city": wordRegex },
                            { "location.region": wordRegex },
                            { services: wordRegex },
                        ],
                    };
                });
                // Add all individual search conditions to the main conditions array
                conditions.push(...searchConditions);
            }
        }

        // 3. Build the Final Filter
        // If there are any conditions, combine them with $and. Otherwise, it's an empty filter {}.
        const filter = conditions.length > 0 ? { $and: conditions } : {};
        
        console.log("MongoDB Filter sent:", JSON.stringify(filter, null, 2));

        // Define the fields you want to get back from the database
        const projection = {
            name: 1,
            location: 1, // Get the whole location object
            is_open_now: 1,
            services: 1,
        };

        const stations = await ZStation.find(filter).select(projection);
        res.json(stations);

    } catch (error) {
        console.error("❌ Failed to fetch stations:", error);
        res.status(500).json({ message: "Server error while fetching stations" });
    }
});

export default router;