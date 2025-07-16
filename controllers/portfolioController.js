const Portfolio = require('../models/Portfolio');

const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios', error: error.message });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or you do not have permission to view it' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const portfolio = new Portfolio({ ...req.body, userId: req.user._id });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error creating portfolio', error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or you do not have permission to update it' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error updating portfolio', error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio', error: error.message });
  }
};

module.exports = {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
};