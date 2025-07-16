const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, subdomain } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { subdomain }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.subdomain === subdomain) {
        return res.status(400).json({ message: 'Subdomain already exists' });
      }
    }

    // Validate subdomain format
    if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
      return res.status(400).json({ 
        message: 'Subdomain can only contain letters, numbers, and hyphens' 
      });
    }

    // Reserved subdomains
    const reservedSubdomains = ['www', 'api', 'admin', 'dashboard', 'support', 'help', 'blog', 'docs'];
    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      return res.status(400).json({ message: 'This subdomain is reserved' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      subdomain: subdomain.toLowerCase(),
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        subdomain: user.subdomain,
        subscription: user.subscription,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        subdomain: user.subdomain,
        subscription: user.subscription,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        subdomain: user.subdomain,
        subscription: user.subscription,
        subscriptionExpires: user.subscriptionExpires,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, profilePicture } = req.body;
    const userId = req.user.userId;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, email, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        subdomain: user.subdomain,
        subscription: user.subscription,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check subdomain availability
exports.checkSubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;

    // Validate subdomain format
    if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
      return res.status(400).json({ 
        available: false,
        message: 'Subdomain can only contain letters, numbers, and hyphens' 
      });
    }

    // Reserved subdomains
    const reservedSubdomains = ['www', 'api', 'admin', 'dashboard', 'support', 'help', 'blog', 'docs'];
    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      return res.status(400).json({ 
        available: false,
        message: 'This subdomain is reserved' 
      });
    }

    // Check if subdomain exists
    const existingUser = await User.findOne({ 
      subdomain: subdomain.toLowerCase() 
    });

    res.json({
      available: !existingUser,
      message: existingUser ? 'Subdomain is already taken' : 'Subdomain is available'
    });
  } catch (error) {
    console.error('Check subdomain error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by subdomain (for portfolio rendering)
exports.getUserBySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;

    const user = await User.findOne({ 
      subdomain: subdomain.toLowerCase(),
      isActive: true 
    }).select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        subdomain: user.subdomain,
        subscription: user.subscription,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user by subdomain error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};