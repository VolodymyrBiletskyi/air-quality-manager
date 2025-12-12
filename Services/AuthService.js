import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async login(loginDto) {
        const { email, password } = loginDto;

        const errors = [];
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

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Invalid email or password');
            err.status = 401;
            throw err;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            const err = new Error('Invalid email or password');
            err.status = 401;
            throw err;
        }

        const secret = process.env.JWT_SECRET || 'dev-secret';
        const expiresIn = process.env.JWT_EXPIRES_IN || '30m';

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            secret,
            { expiresIn }
        );

        return { token, user };
    }
}
