export function loginuserDto(body) {
    const errors = [];

    const email = body?.email;
    const password = body?.password;

    if (!email || typeof email !== 'string') {
        errors.push('Email is required and must be a string');
    }

    if (!password || typeof password !== 'string') {
        errors.push('Password is required and must be a string');
    }

    if (errors.length > 0) {
        const err = new Error('Validation error');
        err.status = 400;
        err.details = errors;
        throw err;
    }

    return { email, password };
}