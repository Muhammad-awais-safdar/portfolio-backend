const Testimonial = require('../models/Testimonial');

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial({ ...req.body, userId: req.user._id });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: 'Error creating testimonial', error: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found or you do not have permission to update it' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: 'Error updating testimonial', error: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};