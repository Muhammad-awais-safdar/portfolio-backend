const FunFact = require('../models/FunFact');

const getFunFacts = async (req, res) => {
  try {
    const funFacts = await FunFact.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(funFacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fun facts', error: error.message });
  }
};

const createFunFact = async (req, res) => {
  try {
    const funFact = new FunFact({ ...req.body, userId: req.user._id });
    await funFact.save();
    res.status(201).json(funFact);
  } catch (error) {
    res.status(400).json({ message: 'Error creating fun fact', error: error.message });
  }
};

const updateFunFact = async (req, res) => {
  try {
    const funFact = await FunFact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!funFact) {
      return res.status(404).json({ message: 'Fun fact not found or you do not have permission to update it' });
    }
    res.json(funFact);
  } catch (error) {
    res.status(400).json({ message: 'Error updating fun fact', error: error.message });
  }
};

const deleteFunFact = async (req, res) => {
  try {
    const funFact = await FunFact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!funFact) {
      return res.status(404).json({ message: 'Fun fact not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Fun fact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fun fact', error: error.message });
  }
};

module.exports = {
  getFunFacts,
  createFunFact,
  updateFunFact,
  deleteFunFact
};