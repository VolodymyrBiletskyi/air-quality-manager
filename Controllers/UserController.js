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

        if (err.code === 'P2002') {
            return res.status(409).json({
                message: 'User already exists',
                details: [`A user with this ${err.meta?.target?.[0] || 'field'} already exists`]
            });
        }

        res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
            details: err.details || undefined,
        });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        const responseDto = users.map(user => toUserResponseDto(user));
        res.status(200).json(responseDto);
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal server error'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        const responseDto = toUserResponseDto(user);
        res.status(200).json(responseDto);
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal server error'
        });
    }
});

export default router;
