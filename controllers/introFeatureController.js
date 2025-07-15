const IntroFeature = require('../models/IntroFeature');

const getIntroFeatures = async (req, res) => {
  try {
    const introFeatures = await IntroFeature.find().sort({ order: 1, createdAt: -1 });
    res.json(introFeatures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching intro features', error: error.message });
  }
};

const createIntroFeature = async (req, res) => {
  try {
    const introFeature = new IntroFeature(req.body);
    await introFeature.save();
    res.status(201).json(introFeature);
  } catch (error) {
    res.status(400).json({ message: 'Error creating intro feature', error: error.message });
  }
};

const updateIntroFeature = async (req, res) => {
  try {
    const introFeature = await IntroFeature.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!introFeature) {
      return res.status(404).json({ message: 'Intro feature not found' });
    }
    res.json(introFeature);
  } catch (error) {
    res.status(400).json({ message: 'Error updating intro feature', error: error.message });
  }
};

const deleteIntroFeature = async (req, res) => {
  try {
    const introFeature = await IntroFeature.findByIdAndDelete(req.params.id);
    if (!introFeature) {
      return res.status(404).json({ message: 'Intro feature not found' });
    }
    res.json({ message: 'Intro feature deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting intro feature', error: error.message });
  }
};

module.exports = {
  getIntroFeatures,
  createIntroFeature,
  updateIntroFeature,
  deleteIntroFeature
};