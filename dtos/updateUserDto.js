import Joi from 'joi';

const updateUserSchema = Joi.object({
    username: Joi.string().min(3).max(255).optional(),
    email: Joi.string().email().optional()
}).min(1);

export function parseUpdateUserDto(data) {
    const { error, value } = updateUserSchema.validate(data, { abortEarly: false });

    if (error) {
        const err = new Error('Validation failed');
        err.status = 400;
        err.details = error.details.map(d => d.message);
        throw err;
    }

    return value;
}
