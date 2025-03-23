import jwt from 'jsonwebtoken';

export const generateAuthToken = (user) => {
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

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
