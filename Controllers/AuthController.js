import express from 'express';
import { UserRepository} from '../Repositories/UserRepository.js';
import { AuthService } from '../Services/AuthService.js';
import { loginuserDto } from '../dtos/loginuserDto.js';
import { toUserResponseDto } from '../dtos/userResponseDto.js';
import jwt from "jsonwebtoken";

const router = express.Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

router.post('/login', async (req, res) => {
    try {
        const loginDto = loginuserDto(req.body);
        const { token, user } = await authService.login(loginDto);
        const userDto = toUserResponseDto(user);

        res.status(200).json({
            token,
            user: userDto
        });
        const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
        const payload = jwt.verify(token, JWT_SECRET);
        console.log('JWT payload:', payload);
    } catch (err) {
        console.error(err);

        res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
            details: err.details || undefined,
        });
    }
});

export default router;
