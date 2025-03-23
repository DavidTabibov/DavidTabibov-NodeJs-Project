import User from '../Schemas/userSchema.js';
import { validateUser } from '../Utils/validators/userValidators.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();
        if (!users.length) return res.status(404).json({ message: "No users found" });

        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            image: user.image,
            address: user.address,
            isBusiness: user.isBusiness,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            __v: user.__v
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// Update user (only self or admin)
export const updateUser = async (req, res) => {
    try {
        if (req.params.id !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied - You can only update your own profile' });
        }

        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Change business status
export const changeBusinessStatus = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBusiness: req.body.isBusiness },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// הוספת default export
export default { getAllUsers, getUserById, updateUser, changeBusinessStatus, deleteUser };
