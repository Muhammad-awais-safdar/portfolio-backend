const User = require('../models/User');

// Middleware to handle subdomain routing
const handleSubdomain = async (req, res, next) => {
  try {
    const host = req.get('host');
    const subdomain = extractSubdomain(host);
    
    // If no subdomain or www, continue to main app
    if (!subdomain || subdomain === 'www') {
      req.isMainApp = true;
      return next();
    }

    // API subdomain handling
    if (subdomain === 'api') {
      req.isApiRequest = true;
      return next();
    }

    // Admin subdomain handling
    if (subdomain === 'admin') {
      req.isAdminRequest = true;
      return next();
    }

    // Portfolio subdomain handling
    const user = await User.findOne({ 
      subdomain: subdomain,
      isActive: true 
    }).select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({ 
        message: 'Portfolio not found',
        error: 'SUBDOMAIN_NOT_FOUND' 
      });
    }

    // Check subscription status
    if (user.subscription !== 'free' && 
        user.subscriptionExpires && 
        user.subscriptionExpires < new Date()) {
      
      // Update user subscription to free
      user.subscription = 'free';
      await user.save();
    }

    // Attach user to request
    req.portfolioUser = user;
    req.isPortfolioRequest = true;
    
    next();
  } catch (error) {
    console.error('Subdomain middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Extract subdomain from host
const extractSubdomain = (host) => {
  if (!host) return null;
  
  // Remove port if present
  const cleanHost = host.split(':')[0];
  
  // Split by dots
  const parts = cleanHost.split('.');
  
  // If localhost or IP, no subdomain
  if (parts.length < 2 || 
      cleanHost === 'localhost' || 
      /^\d+\.\d+\.\d+\.\d+$/.test(cleanHost)) {
    return null;
  }
  
  // For domains like subdomain.example.com, return subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};

// Get portfolio data for subdomain
const getPortfolioData = async (userId) => {
  try {
    const About = require('../models/About');
    const Skill = require('../models/Skill');
    const Experience = require('../models/Experience');
    const Education = require('../models/Education');
    const Portfolio = require('../models/Portfolio');
    const Testimonial = require('../models/Testimonial');
    const Service = require('../models/Service');
    const FunFact = require('../models/FunFact');
    const Brand = require('../models/Brand');
    const Pricing = require('../models/Pricing');
    const Award = require('../models/Award');
    const IntroFeature = require('../models/IntroFeature');

    const [
      about,
      skills,
      experience,
      education,
      portfolio,
      testimonials,
      services,
      funFacts,
      brands,
      pricing,
      awards,
      introFeatures
    ] = await Promise.all([
      About.findOne({ userId }),
      Skill.find({ userId }).sort({ order: 1 }),
      Experience.find({ userId }).sort({ order: 1 }),
      Education.find({ userId }).sort({ order: 1 }),
      Portfolio.find({ userId, isActive: true }).sort({ featured: -1, order: 1 }),
      Testimonial.find({ userId }).sort({ order: 1 }),
      Service.find({ userId }).sort({ order: 1 }),
      FunFact.find({ userId }).sort({ order: 1 }),
      Brand.find({ userId }).sort({ order: 1 }),
      Pricing.find({ userId }).sort({ order: 1 }),
      Award.find({ userId }).sort({ order: 1 }),
      IntroFeature.find({ userId }).sort({ order: 1 })
    ]);

    return {
      about,
      skills,
      experience,
      education,
      portfolio,
      testimonials,
      services,
      funFacts,
      brands,
      pricing,
      awards,
      introFeatures
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
};

module.exports = {
  handleSubdomain,
  extractSubdomain,
  getPortfolioData
};