import express from "express";

import { ZStation } from '../models/zStationSchema.js';

const router = express.Router();

// GET /api/stations - basic public map data
router.get("/locations", async (req, res) => { 
  try {
    const stations = await ZStation.find({}, {
      id: 1,
      name: 1,
      "location.latitude": 1,
      "location.longitude": 1,
      is_open_now: 1, 
      fuels: 1,
    });

    res.json(stations);
  } catch (error) {
    console.error("❌ Failed to fetch stations:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;


