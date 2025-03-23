import pkg from 'bcryptjs';
const { genSalt, hash, compare } = pkg;
import User from '../Schemas/userSchema.js';
import { generateAuthToken } from '../Services/tokenService.js';
import { isBlocked, getBlockTimeRemaining, addFailedAttempt, getRemainingAttempts, resetAttempts } from '../Services/loginAttemptsService.js';
import { validateUser, validateLogin } from '../Utils/validators/userValidators.js';

// Handle user registration
export const registerUser = async (req, res) => {
    try {
        console.log("Received registration request with body:", req.body);

        // Validate request body
        const { error } = validateUser(req.body);
        if (error) {
            console.log("Validation error:", error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }
        console.log("Validation passed.");

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("User already exists:", req.body.email);
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        console.log("User does not exist. Creating new user.");

        // Create new user object
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            image: req.body.image,
            address: req.body.address,
            isBusiness: req.body.isBusiness || false,
            isAdmin: false // Only manually set in DB
        });

        // Hash password
        console.time("bcryptTime");
        const salt = await genSalt(5); // הורדנו מ-10 ל-5 לבדיקה
        console.log("Salt generated.");
        user.password = await hash(user.password, salt);
        console.timeEnd("bcryptTime");
        console.log("Password hashed.");

        // Save user
        console.time("saveTime");
        await user.save();
        console.timeEnd("saveTime");
        console.log("User saved.");

        // Generate token
        console.time("tokenTime");
        const token = generateAuthToken(user);
        console.timeEnd("tokenTime");
        console.log("Token generated.");

        res.status(201).json({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isBusiness: user.isBusiness
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// Handle user login
export const loginUser = async (req, res) => {
    try {
        console.log("Received login request with body:", req.body);

        // Validate request body
        const { error } = validateLogin(req.body);
        if (error) {
            console.log("Validation error:", error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = req.body;
        console.log("Checking if user is blocked for email:", email);

        // Check if user is blocked
        if (isBlocked(email)) {
            const hoursRemaining = getBlockTimeRemaining(email);
            console.log("User is blocked for", hoursRemaining, "hours.");
            return res.status(403).json({ error: `Account is temporarily blocked. Try again in ${hoursRemaining} hours.` });
        }

        console.log("Finding user by email...");
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found.");
            addFailedAttempt(email);
            const remainingAttempts = getRemainingAttempts(email);
            return res.status(401).json({ error: `Invalid email or password. ${remainingAttempts} attempts remaining.` });
        }

        console.log("User found. Verifying password...");
        // Verify password
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            console.log("Password invalid.");
            const blocked = addFailedAttempt(email);
            if (blocked) {
                console.log("User is now blocked due to too many failed attempts.");
                return res.status(403).json({ error: 'Account has been blocked for 24 hours due to multiple failed login attempts.' });
            }
            const remainingAttempts = getRemainingAttempts(email);
            return res.status(401).json({ error: `Invalid email or password. ${remainingAttempts} attempts remaining.` });
        }

        console.log("Password valid. Resetting attempts...");
        // Reset failed attempts on successful login
        resetAttempts(email);

        console.log("Generating token...");
        // Generate token
        const token = generateAuthToken(user);
        console.log("Token generated. Login successful.");

        res.json({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isBusiness: user.isBusiness,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
