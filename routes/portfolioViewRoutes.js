const express = require('express');
const router = express.Router();
const portfolioViewController = require('../controllers/portfolioViewController');

// All routes are for subdomain-based portfolio viewing
// The subdomain middleware will attach the portfolioUser to req

// Get complete portfolio data
router.get('/', portfolioViewController.getPortfolioData);

// Get specific sections
router.get('/about', portfolioViewController.getAbout);
router.get('/skills', portfolioViewController.getSkills);
router.get('/experience', portfolioViewController.getExperience);
router.get('/education', portfolioViewController.getEducation);
router.get('/portfolio', portfolioViewController.getPortfolioProjects);
router.get('/testimonials', portfolioViewController.getTestimonials);
router.get('/services', portfolioViewController.getServices);
router.get('/funfacts', portfolioViewController.getFunFacts);
router.get('/brands', portfolioViewController.getBrands);
router.get('/pricing', portfolioViewController.getPricing);
router.get('/awards', portfolioViewController.getAwards);
router.get('/intro-features', portfolioViewController.getIntroFeatures);

module.exports = router;