import express from 'express';
import { UserService } from '../Services/UserService.js';
import { UserRepository } from '../Repositories/UserRepository.js';
import { parseCreateUserDto } from '../dtos/createUserDto.js';
import { parseUpdateUserDto } from '../dtos/updateUserDto.js';
import { toUserResponseDto } from '../dtos/userResponseDto.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
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

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        return res.status(200).json(toUserResponseDto(user));
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
            details: err.details || undefined,
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

router.patch('/patch', authMiddleware, async (req, res) => {
    try {
        const updateUserDto = parseUpdateUserDto(req.body);

        const updatedUser = await userService.updateUser(
            req.user.id,
            updateUserDto
        );

        res.status(200).json(toUserResponseDto(updatedUser));
    } catch (err) {
        console.error(err);

        if (err.code === 'P2002') {
            return res.status(409).json({
                message: 'Email already in use',
                details: ['A user with this email already exists']
            });
        }

        res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
            details: err.details
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal server error'
        });
    }
});





export default router;
