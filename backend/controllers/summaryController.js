const DailySummary = require('../models/DailySummary');

exports.getSummary = async (req, res) => {
  try {
    const summary = await DailySummary.find().sort({ date: -1 });
    console.log('Summary data:', summary);
    
    if (summary.length === 0) {
      console.log('No summary data found in the database');
    }
    
    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ message: err.message });
  }
};