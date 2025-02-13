import { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../Schemas/userSchema';
import { validateUser } from '../';

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();

        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: {
                first: user.name.first,
                middle: user.name.middle,
                last: user.name.last
            },
            phone: user.phone,
            email: user.email,
            image: {
                url: user.image.url,
                alt: user.image.alt
            },
            address: {
                state: user.address.state,
                country: user.address.country,
                city: user.address.city,
                street: user.address.street,
                houseNumber: user.address.houseNumber,
                zip: user.address.zip
            },
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
const getUserById = async (req, res) => {
    try {
        const user = await findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        // Verify user can only update their own profile
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({
                error: 'Access denied - You can only update your own profile'
            });
        }

        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Change business status
const changeBusinessStatus = async (req, res) => {
    try {
        const user = await findByIdAndUpdate(
            req.params.id,
            { isBusiness: req.body.isBusiness },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        res.json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    changeBusinessStatus,
    deleteUser
};