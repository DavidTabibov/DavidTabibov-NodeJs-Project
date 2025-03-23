import Joi from 'joi';


const addressSchema = Joi.object({
    state: Joi.string().allow(''),
    country: Joi.string().required().messages({
        'any.required': 'Country is required',
        'string.empty': 'Country cannot be empty'
    }),
    city: Joi.string().required().messages({
        'any.required': 'City is required',
        'string.empty': 'City cannot be empty'
    }),
    street: Joi.string().required().messages({
        'any.required': 'Street is required',
        'string.empty': 'Street cannot be empty'
    }),
    houseNumber: Joi.number().min(1).required().messages({
        'number.min': 'House number must be greater than 0',
        'any.required': 'House number is required',
        'number.base': 'House number must be a number'
    }),
    zip: Joi.string().allow('')
});

const imageSchema = Joi.object({
    url: Joi.string().allow('').uri().messages({
        'string.uri': 'Image URL must be a valid URL'
    }),
    alt: Joi.string().allow('').messages({
        'string.base': 'Alt text must be a string'
    })
});

const validateCard = (card) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(256).required().messages({
            'string.min': 'Title must be at least 2 characters long',
            'string.max': 'Title cannot exceed 256 characters',
            'any.required': 'Title is required',
            'string.empty': 'Title cannot be empty'
        }),
        subtitle: Joi.string().min(2).max(256).required().messages({
            'string.min': 'Subtitle must be at least 2 characters long',
            'string.max': 'Subtitle cannot exceed 256 characters',
            'any.required': 'Subtitle is required',
            'string.empty': 'Subtitle cannot be empty'
        }),
        description: Joi.string().min(2).max(1024).required().messages({
            'string.min': 'Description must be at least 2 characters long',
            'string.max': 'Description cannot exceed 1024 characters',
            'any.required': 'Description is required',
            'string.empty': 'Description cannot be empty'
        }),
        phone: Joi.string()
            .pattern(/^0\d{1,2}\-?\d{7}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be a valid Israeli phone number (e.g., 050-1234567)',
                'any.required': 'Phone number is required',
                'string.empty': 'Phone number cannot be empty'
            }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
        web: Joi.string().pattern(/^https?:\/\/.+/).messages({
            'string.pattern.base': 'Web address must be a valid URL starting with http:// or https://',
            'string.empty': 'Web address cannot be empty'
        }),
        image: imageSchema,
        address: addressSchema,
        bizNumber: Joi.string().allow(''),
        user_id: Joi.string().allow('')
    });

    return schema.validate(card, { abortEarly: false });
};

const validateCardUpdate = (card) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(256).required().messages({
            'string.min': 'Title must be at least 2 characters long',
            'string.max': 'Title cannot exceed 256 characters',
            'any.required': 'Title is required',
            'string.empty': 'Title cannot be empty'
        }),
        subtitle: Joi.string().min(2).max(256).required().messages({
            'string.min': 'Subtitle must be at least 2 characters long',
            'string.max': 'Subtitle cannot exceed 256 characters',
            'any.required': 'Subtitle is required',
            'string.empty': 'Subtitle cannot be empty'
        }),
        description: Joi.string().min(2).max(1024).required().messages({
            'string.min': 'Description must be at least 2 characters long',
            'string.max': 'Description cannot exceed 1024 characters',
            'any.required': 'Description is required',
            'string.empty': 'Description cannot be empty'
        }),
        phone: Joi.string().pattern(/^0\d{1,2}\-?\d{7}$/).required().messages({
            'string.pattern.base': 'Phone number must be a valid Israeli phone number (e.g., 050-1234567)',
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
        web: Joi.string().pattern(/^https?:\/\/.+/).messages({
            'string.pattern.base': 'Web address must be a valid URL starting with http:// or https://',
            'string.empty': 'Web address cannot be empty'
        }),
        image: imageSchema,
        address: addressSchema
    });

    return schema.validate(card, { abortEarly: false });
};

const validateBizNumber = (bizNumber) => {
    const schema = Joi.object({
        bizNumber: Joi.number().min(1000000).max(9999999).required().messages({
            'number.min': 'Business number must be at least 1,000,000',
            'number.max': 'Business number cannot exceed 9,999,999',
            'any.required': 'Business number is required',
            'number.base': 'Business number must be a number'
        })
    });
    return schema.validate({ bizNumber });
};

export { validateCard, validateCardUpdate, validateBizNumber };
