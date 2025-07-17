const Pricing = require('../models/Pricing');

const getPricings = async (req, res) => {
  try {
    const pricings = await Pricing.find().sort({ order: 1, createdAt: -1 });
    res.json(pricings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricings', error: error.message });
  }
};

const createPricing = async (req, res) => {
  try {
    const pricing = new Pricing(req.body);
    await pricing.save();
    res.status(201).json(pricing);
  } catch (error) {
    res.status(400).json({ message: 'Error creating pricing', error: error.message });
  }
};

const updatePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing not found' });
    }
    res.json(pricing);
  } catch (error) {
    res.status(400).json({ message: 'Error updating pricing', error: error.message });
  }
};

const deletePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing not found' });
    }
    res.json({ message: 'Pricing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pricing', error: error.message });
  }
};

module.exports = {
  getPricings,
  createPricing,
  updatePricing,
  deletePricing
};