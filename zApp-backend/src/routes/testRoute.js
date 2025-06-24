import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const testData = await mongoose.connection.db
      .collection('StationData')
      .find({})
      .limit(5)
      .toArray();

    console.log("Result:", testData);
    res.json(testData);
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

export default router;
