import jwt from 'jsonwebtoken';

const generateAuthToken = (user) => {
    // Create token with required fields from PDF: _id, isBusiness, isAdmin
    const token = jwt.sign(
        {
            _id: user._id,
            isBusiness: user.isBusiness,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export { generateAuthToken, verifyToken };