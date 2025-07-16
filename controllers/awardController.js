const Award = require('../models/Award');

const getAwards = async (req, res) => {
  try {
    const awards = await Award.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching awards', error: error.message });
  }
};

const createAward = async (req, res) => {
  try {
    const award = new Award({ ...req.body, userId: req.user._id });
    await award.save();
    res.status(201).json(award);
  } catch (error) {
    res.status(400).json({ message: 'Error creating award', error: error.message });
  }
};

const updateAward = async (req, res) => {
  try {
    const award = await Award.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!award) {
      return res.status(404).json({ message: 'Award not found or you do not have permission to update it' });
    }
    res.json(award);
  } catch (error) {
    res.status(400).json({ message: 'Error updating award', error: error.message });
  }
};

const deleteAward = async (req, res) => {
  try {
    const award = await Award.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!award) {
      return res.status(404).json({ message: 'Award not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting award', error: error.message });
  }
};

module.exports = {
  getAwards,
  createAward,
  updateAward,
  deleteAward
};