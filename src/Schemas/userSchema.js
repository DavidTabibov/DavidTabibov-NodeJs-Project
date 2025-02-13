import mongoose from 'mongoose';

// ✅ סכמת הכתובת (Address) - ללא מזהה _id
const addressSchema = new mongoose.Schema({
    state: {
        type: String,
        maxLength: 256,
        trim: true
    },
    country: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
        lowercase: true
    },
    street: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
        lowercase: true
    },
    houseNumber: {
        type: Number,
        required: true,
        min: 1
    },
    zip: {
        type: Number,
        default: 0
    }
},
);

// ✅ סכמת התמונה (Image) - ללא מזהה _id
const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        trim: true,
        lowercase: true,
        match: RegExp(/(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[^\s]{2,})/)
    },
    alt: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
        lowercase: true
    }
});

// ✅ סכמת השם (Name) - ללא מזהה _id
const nameSchema = new mongoose.Schema({
    first: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
        lowercase: true
    },
    middle: {
        type: String,
        required: false,
        minLength: 0,
        maxLength: 256,
        trim: true,
        lowercase: true
    },
    last: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
        lowercase: true
    }
});

// ✅ סכמת המשתמש (User)
const userSchema = new mongoose.Schema({
    name: nameSchema,
    phone: {
        type: String,
        required: true,
        match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    },
    password: {
        type: String,
        required: true
    },
    image: imageSchema,
    address: addressSchema,
    isBusiness: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// ✅ הסרת מזהים פנימיים (`_id`) באופן אוטומטי
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.name?._id;
        delete ret.image?._id;
        delete ret.address?._id;
        return ret;
    }
});

// ✅ בדיקה אם המודל כבר נטען כדי למנוע טעויות בעת טעינה מחדש
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

export default User;
