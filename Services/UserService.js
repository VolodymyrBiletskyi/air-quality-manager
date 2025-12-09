import bcrypt from 'bcrypt';

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            const err = new Error('User already exists');
            err.status = 409;
            err.details = ['A user with this email already exists'];
            throw err;
        }

        const passwordHash = await bcrypt.hash(userData.password, 10);
        const userToCreate = {
            username: userData.username,
            email: userData.email,
            passwordHash: passwordHash
        };
        return await this.userRepository.createUser(userToCreate);
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        return user;
    }
}
