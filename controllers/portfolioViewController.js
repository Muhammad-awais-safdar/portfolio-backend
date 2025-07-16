const { getPortfolioData } = require('../middleware/subdomain');

// Get complete portfolio data for a user
exports.getPortfolioData = async (req, res) => {
  try {
    const user = req.portfolioUser;
    
    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const portfolioData = await getPortfolioData(user._id);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        subdomain: user.subdomain,
        subscription: user.subscription,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      },
      portfolio: portfolioData
    });
  } catch (error) {
    console.error('Get portfolio data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specific section data
exports.getAbout = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const About = require('../models/About');
    
    const about = await About.findOne({ userId: user._id });
    
    if (!about) {
      return res.status(404).json({ message: 'About information not found' });
    }

    res.json(about);
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get skills
exports.getSkills = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Skill = require('../models/Skill');
    
    const skills = await Skill.find({ userId: user._id }).sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get experience
exports.getExperience = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Experience = require('../models/Experience');
    
    const experience = await Experience.find({ userId: user._id }).sort({ order: 1 });
    res.json(experience);
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get education
exports.getEducation = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Education = require('../models/Education');
    
    const education = await Education.find({ userId: user._id }).sort({ order: 1 });
    res.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get portfolio projects
exports.getPortfolioProjects = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Portfolio = require('../models/Portfolio');
    
    const portfolio = await Portfolio.find({ 
      userId: user._id, 
      isActive: true 
    }).sort({ featured: -1, order: 1 });
    
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Testimonial = require('../models/Testimonial');
    
    const testimonials = await Testimonial.find({ userId: user._id }).sort({ order: 1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get services
exports.getServices = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Service = require('../models/Service');
    
    const services = await Service.find({ userId: user._id }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get fun facts
exports.getFunFacts = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const FunFact = require('../models/FunFact');
    
    const funFacts = await FunFact.find({ userId: user._id }).sort({ order: 1 });
    res.json(funFacts);
  } catch (error) {
    console.error('Get fun facts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get brands
exports.getBrands = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Brand = require('../models/Brand');
    
    const brands = await Brand.find({ userId: user._id }).sort({ order: 1 });
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pricing
exports.getPricing = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Pricing = require('../models/Pricing');
    
    const pricing = await Pricing.find({ userId: user._id }).sort({ order: 1 });
    res.json(pricing);
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get awards
exports.getAwards = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const Award = require('../models/Award');
    
    const awards = await Award.find({ userId: user._id }).sort({ order: 1 });
    res.json(awards);
  } catch (error) {
    console.error('Get awards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get intro features
exports.getIntroFeatures = async (req, res) => {
  try {
    const user = req.portfolioUser;
    const IntroFeature = require('../models/IntroFeature');
    
    const introFeatures = await IntroFeature.find({ userId: user._id }).sort({ order: 1 });
    res.json(introFeatures);
  } catch (error) {
    console.error('Get intro features error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};