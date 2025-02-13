import * as Joi from 'joi';

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
    houseNumber: Joi.string().required().messages({
        'any.required': 'House number is required',
        'string.empty': 'House number cannot be empty'
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

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.object({
            first: Joi.string().min(2).required().messages({
                'string.min': 'First name must be at least 2 characters',
                'string.empty': 'First name cannot be empty',
                'any.required': 'First name is required'
            }),
            middle: Joi.string().allow(''),
            last: Joi.string().min(2).required().messages({
                'string.min': 'Last name must be at least 2 characters',
                'string.empty': 'Last name cannot be empty',
                'any.required': 'Last name is required'
            })
        }).required(),
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
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-])[A-Za-z\d!@#$%^&*-]{6,}$/)
            .required()
            .messages({
                'string.pattern.base': 'Password must contain: at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character (!@#$%^&*-)',
                'any.required': 'Password is required',
                'string.empty': 'Password cannot be empty'
            }),
        image: imageSchema,
        address: addressSchema,
        isBusiness: Joi.boolean().default(false),
        isAdmin: Joi.boolean().default(false)
    });

    return schema.validate(user, { abortEarly: false });
};

const validateLogin = (credentials) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty'
        })
    });

    return schema.validate(credentials);
};

const validateUserUpdate = (user) => {
    const schema = Joi.object({
        name: Joi.object({
            first: Joi.string().min(2).required().messages({
                'string.min': 'First name must be at least 2 characters',
                'string.empty': 'First name cannot be empty',
                'any.required': 'First name is required'
            }),
            middle: Joi.string().allow(''),
            last: Joi.string().min(2).required().messages({
                'string.min': 'Last name must be at least 2 characters',
                'string.empty': 'Last name cannot be empty',
                'any.required': 'Last name is required'
            })
        }).required(),
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
        image: imageSchema,
        address: addressSchema
    });

    return schema.validate(user, { abortEarly: false });
};

export { validateUser, validateLogin, validateUserUpdate };