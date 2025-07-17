const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
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
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/skills", skillRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/funfacts", funFactRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/intro-features", introFeatureRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
    res.send("Portfolio Backend API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
