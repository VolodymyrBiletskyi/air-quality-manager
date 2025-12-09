export function parseCreateUserDto(body) {
    const error = [];
    if (!body.username || typeof body.username !== 'string') {
        error.push('Invalid or missing username');
    }

    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
        error.push('Invalid or missing email');
    }

    if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
        error.push('Password must be at least 6 characters long');
    }

    if (error.length > 0) {
        const err = new Error('Validation error');
        err.status = 400;
        err.details = error;
        throw err;
    }

    return {
        username: body.username.trim(),
        email: body.email.trim().toLowerCase(),
        password: body.password
    };
}