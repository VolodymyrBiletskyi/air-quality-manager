import bcrypt from 'bcrypt';

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const userToCreate = {
            username: userData.username,
            email: userData.email,
            passwordHash: passwordHash
        };
        const createdUser = await this.userRepository.createUser(userToCreate);
        return createdUser;
    }
}