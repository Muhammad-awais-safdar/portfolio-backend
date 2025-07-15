const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models
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

// Import JSON data
const aboutData = require('../../client/src/data/about.json');
const skillsData = require('../../client/src/data/skills.json');
const experienceData = require('../../client/src/data/experience.json');
const educationData = require('../../client/src/data/education.json');
const portfolioData = require('../../client/src/data/portfolio.json');
const testimonialsData = require('../../client/src/data/testimonials.json');
const servicesData = require('../../client/src/data/services.json');
const funFactsData = require('../../client/src/data/FunFacts.json');
const brandsData = require('../../client/src/data/brands.json');
const pricingData = require('../../client/src/data/pricingData.json');
const awardsData = require('../../client/src/data/awardsData.json');
const introFeaturesData = require('../../client/src/data/introFeatures.json');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await About.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Portfolio.deleteMany({});
    await Testimonial.deleteMany({});
    await Service.deleteMany({});
    await FunFact.deleteMany({});
    await Brand.deleteMany({});
    await Pricing.deleteMany({});
    await Award.deleteMany({});
    await IntroFeature.deleteMany({});

    console.log('✅ Cleared existing data');

    // Seed About data
    await About.create(aboutData);
    console.log('✅ About data seeded');

    // Seed Skills data
    const skillsWithOrder = skillsData.map((skill, index) => ({
      ...skill,
      order: index
    }));
    await Skill.insertMany(skillsWithOrder);
    console.log('✅ Skills data seeded');

    // Seed Experience data
    const experienceWithOrder = experienceData.map((exp, index) => ({
      ...exp,
      order: index
    }));
    await Experience.insertMany(experienceWithOrder);
    console.log('✅ Experience data seeded');

    // Seed Education data
    const educationWithOrder = educationData.map((edu, index) => ({
      ...edu,
      order: index
    }));
    await Education.insertMany(educationWithOrder);
    console.log('✅ Education data seeded');

    // Seed Portfolio data
    const portfolioWithOrder = portfolioData.map((port, index) => ({
      ...port,
      order: index
    }));
    await Portfolio.insertMany(portfolioWithOrder);
    console.log('✅ Portfolio data seeded');

    // Seed Testimonials data
    const testimonialsWithOrder = testimonialsData.map((test, index) => ({
      ...test,
      order: index
    }));
    await Testimonial.insertMany(testimonialsWithOrder);
    console.log('✅ Testimonials data seeded');

    // Seed Services data
    const servicesWithOrder = servicesData.map((service, index) => ({
      ...service,
      order: index
    }));
    await Service.insertMany(servicesWithOrder);
    console.log('✅ Services data seeded');

    // Seed Fun Facts data
    const funFactsWithOrder = funFactsData.map((fact, index) => ({
      ...fact,
      order: index
    }));
    await FunFact.insertMany(funFactsWithOrder);
    console.log('✅ Fun Facts data seeded');

    // Seed Brands data
    const brandsWithOrder = brandsData.map((brand, index) => ({
      ...brand,
      order: index
    }));
    await Brand.insertMany(brandsWithOrder);
    console.log('✅ Brands data seeded');

    // Seed Pricing data
    const pricingWithOrder = pricingData.map((pricing, index) => ({
      ...pricing,
      order: index
    }));
    await Pricing.insertMany(pricingWithOrder);
    console.log('✅ Pricing data seeded');

    // Seed Awards data
    const awardsWithOrder = awardsData.map((award, index) => ({
      ...award,
      order: index
    }));
    await Award.insertMany(awardsWithOrder);
    console.log('✅ Awards data seeded');

    // Seed Intro Features data
    const introFeaturesWithOrder = introFeaturesData.map((feature, index) => ({
      ...feature,
      order: index
    }));
    await IntroFeature.insertMany(introFeaturesWithOrder);
    console.log('✅ Intro Features data seeded');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();