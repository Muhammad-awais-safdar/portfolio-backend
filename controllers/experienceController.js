const Experience = require('../models/Experience');

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiences', error: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const experience = new Experience({ ...req.body, userId: req.user._id });
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ message: 'Error creating experience', error: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found or you do not have permission to update it' });
    }
    res.json(experience);
  } catch (error) {
    res.status(400).json({ message: 'Error updating experience', error: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience', error: error.message });
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
};