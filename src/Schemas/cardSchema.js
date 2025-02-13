import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256
    },
    subtitle: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
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
    web: {
        type: String,
        match: /^https?:\/\/.+/
    },
    image: {
        url: {
            type: String,
            trim: true,
            lowercase: true,
            default: "/public/images/default-card-image.jpg",
            match: RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)
        },
        alt: {
            type: String,
            maxLength: 256,
            trim: true,
            lowercase: true,
            default: "Business Growth Graph",
            validate: {
                validator: function (v) {
                    // Allow empty strings or strings >= 2 chars
                    return !v || v.length >= 2;
                },
                message: 'Alt text must be at least 2 characters if provided'
            }
        }
    },
    address: {
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
    bizNumber: {
        type: Number,
        required: true,
        min: 1_000_000,
        max: 9_999_999
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Card = mongoose.model('Card', cardSchema);
export default Card;