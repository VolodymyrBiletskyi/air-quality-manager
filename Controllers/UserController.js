const express = require('express');
const { UserService } = require('../Services/UserService');
const { UserRepositoryPostgres } = require('../Repositories/UserRepository');
const { parseCreateUserDto } = require('../dtos/createUserDto');
const { toUserResponseDto } = require('../dtos/userResponseDto');
const dbClient = require('../dbClient');
const router = express.Router();
const userRepository = new UserRepositoryPostgres(dbClient);
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
module.exports = router;