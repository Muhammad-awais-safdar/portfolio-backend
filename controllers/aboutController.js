const About = require('../models/About');

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: 'About information not found' });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching about information', error: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { 
      new: true, 
      upsert: true,
      runValidators: true 
    });
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: 'Error updating about information', error: error.message });
  }
};

module.exports = {
  getAbout,
  updateAbout
};