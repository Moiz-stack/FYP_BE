const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, latestDegree } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            latestDegree: role === 'instructor' ? latestDegree : undefined
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials',
                userType: null,
                profile: 'incomplete'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials',
                userType: null,
                profile: 'incomplete'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Check profile completion
        let profileStatus = 'complete';
        if (user.role === 'instructor') {
            // For instructors, check if they have uploaded their degree
            if (!user.latestDegree) {
                profileStatus = 'incomplete';
            }
        }

        res.json({
            message: 'Login successful',
            userType: user.role,
            profile: profileStatus,
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message,
            userType: null,
            profile: 'incomplete'
        });
    }
}; 