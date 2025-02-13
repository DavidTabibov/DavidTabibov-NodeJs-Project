import { genSalt, hash, compare } from 'bcryptjs';
import User, { findOne } from '../Schemas/userSchema';
import { generateAuthToken } from '../Services/tokenService';
import { isBlocked as _isBlocked, getBlockTimeRemaining, addFailedAttempt, getRemainingAttempts, resetAttempts } from '../Services/loginAttemptsService';
import { validateUser, validateLogin } from '../validators/userValidators';


// Handle user registration
const registerUser = async (req, res) => {
    try {
        // Validate request body
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }
        // Check if user already exists
        let existingUser = await findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email already exists'
            });
        }

        // Create new user object
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            image: req.body.image,
            address: req.body.address,
            isBusiness: req.body.isBusiness || false,
            isAdmin: false // Default value, can only be set manually in DB
        });

        // Hash password
        const salt = await genSalt(10);
        user.password = await hash(user.password, salt);

        // Save user
        await user.save();

        // Generate token using the tokenService
        const token = generateAuthToken(user);

        // Return response
        res.status(201).json({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isBusiness: user.isBusiness
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Handle user login
const loginUser = async (req, res) => {
    try {
        // Validate request body
        const { error } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        const { email, password } = req.body;

        // Check if user is blocked
        if (_isBlocked(email)) {
            const hoursRemaining = getBlockTimeRemaining(email);
            return res.status(403).json({
                error: `Account is temporarily blocked. Try again in ${hoursRemaining} hours.`
            });
        }

        // Find user by email
        const user = await findOne({ email });
        if (!user) {
            addFailedAttempt(email);
            const remainingAttempts = getRemainingAttempts(email);
            return res.status(401).json({
                error: `Invalid email or password. ${remainingAttempts} attempts remaining.`
            });
        }

        // Verify password
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            const isBlocked = addFailedAttempt(email);
            if (isBlocked) {
                return res.status(403).json({
                    error: 'Account has been blocked for 24 hours due to multiple failed login attempts.'
                });
            }
            const remainingAttempts = getRemainingAttempts(email);
            return res.status(401).json({
                error: `Invalid email or password. ${remainingAttempts} attempts remaining.`
            });
        }

        // Reset failed attempts on successful login
        resetAttempts(email);

        // Generate token using the tokenService
        const token = generateAuthToken(user);

        // Return response
        res.json({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isBusiness: user.isBusiness,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

export default {
    registerUser,
    loginUser
};