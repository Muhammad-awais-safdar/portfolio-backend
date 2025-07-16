const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = new Brand({ ...req.body, userId: req.user._id });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Error creating brand', error: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found or you do not have permission to update it' });
    }
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Error updating brand', error: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting brand', error: error.message });
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
};