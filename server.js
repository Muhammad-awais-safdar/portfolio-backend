const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { handleSubdomain } = require("./middleware/subdomain");
const { auth } = require("./middleware/auth");

dotenv.config();
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all subdomains and main domain
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      /^https?:\/\/.*\.localhost(:\d+)?$/,
      /^https?:\/\/.*\..*$/
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Subdomain handling middleware
app.use(handleSubdomain);

// Import all routes
const authRoutes = require("./routes/authRoutes");
const portfolioViewRoutes = require("./routes/portfolioViewRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const skillRoutes = require("./routes/skillRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const funFactRoutes = require("./routes/funFactRoutes");
const brandRoutes = require("./routes/brandRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const awardRoutes = require("./routes/awardRoutes");
const introFeatureRoutes = require("./routes/introFeatureRoutes");

// Route handling based on subdomain
app.use((req, res, next) => {
  // Portfolio subdomain - serve portfolio data
  if (req.isPortfolioRequest) {
    return portfolioViewRoutes(req, res, next);
  }
  
  // API subdomain or main domain API requests
  if (req.isApiRequest || req.isMainApp) {
    return next();
  }
  
  // Admin subdomain - handle admin requests
  if (req.isAdminRequest) {
    return next();
  }
  
  next();
});

// Authentication routes (available on all domains)
app.use("/api/auth", authRoutes);

// Subscription routes (require authentication)
app.use("/api/subscriptions", auth, subscriptionRoutes);

// Admin routes (require authentication + admin access)
app.use("/api/admin", adminRoutes);

// Protected API routes (require authentication)
app.use("/api/skills", auth, skillRoutes);
app.use("/api/about", auth, aboutRoutes);
app.use("/api/experience", auth, experienceRoutes);
app.use("/api/education", auth, educationRoutes);
app.use("/api/portfolio", auth, portfolioRoutes);
app.use("/api/testimonials", auth, testimonialRoutes);
app.use("/api/services", auth, serviceRoutes);
app.use("/api/funfacts", auth, funFactRoutes);
app.use("/api/brands", auth, brandRoutes);
app.use("/api/pricing", auth, pricingRoutes);
app.use("/api/awards", auth, awardRoutes);
app.use("/api/intro-features", auth, introFeatureRoutes);

// Main app routes
app.get("/", (req, res) => {
  if (req.isPortfolioRequest) {
    res.json({
      message: "Portfolio API",
      user: req.portfolioUser.fullName,
      subdomain: req.portfolioUser.subdomain
    });
  } else {
    res.json({
      message: "Portfolio Platform API",
      version: "2.0.0",
      endpoints: {
        auth: "/api/auth",
        portfolio: "/api/*"
      }
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
