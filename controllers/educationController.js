const Education = require('../models/Education');

const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching educations', error: error.message });
  }
};

const createEducation = async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({ message: 'Error creating education', error: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.json(education);
  } catch (error) {
    res.status(400).json({ message: 'Error updating education', error: error.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education', error: error.message });
  }
};

module.exports = {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation
};