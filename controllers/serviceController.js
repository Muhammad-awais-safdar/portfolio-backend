const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = new Service({ ...req.body, userId: req.user._id });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found or you do not have permission to update it' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!service) {
      return res.status(404).json({ message: 'Service not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};