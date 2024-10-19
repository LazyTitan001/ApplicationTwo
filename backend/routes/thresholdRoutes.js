const express = require('express');
const router = express.Router();
const Threshold = require('../models/Threshold');

// Get all thresholds
router.get('/', async (req, res) => {
  try {
    const thresholds = await Threshold.find();
    res.json(thresholds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update thresholds
router.post('/', async (req, res) => {
  try {
    const { thresholds } = req.body;
    
    // Clear existing thresholds
    await Threshold.deleteMany({});
    
    // Insert new thresholds
    const savedThresholds = await Threshold.insertMany(thresholds);
    
    res.status(201).json(savedThresholds);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update single threshold
router.patch('/:id', async (req, res) => {
  try {
    const threshold = await Threshold.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(threshold);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete threshold
router.delete('/:id', async (req, res) => {
  try {
    await Threshold.findByIdAndDelete(req.params.id);
    res.json({ message: 'Threshold deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;