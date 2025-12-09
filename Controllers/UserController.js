import express from 'express';
import { UserService } from '../Services/UserService.js';
import { UserRepositoryPostgres } from '../Repositories/UserRepository.js';
import { parseCreateUserDto } from '../dtos/createUserDto.js';
import { toUserResponseDto } from '../dtos/userResponseDto.js';

const router = express.Router();
const userRepository = new UserRepositoryPostgres();
const userService = new UserService(userRepository);

router.post('/users', async (req, res) => {
    try {
        const createUserDto = parseCreateUserDto(req.body);
        const createdUser = await userService.createUser(createUserDto);
        const responseDto = toUserResponseDto(createdUser);
        res.status(201).json(responseDto);
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
            details: err.details || undefined,
        });
    }
});

export default router;
