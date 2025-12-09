const bcrypt = require('bcrypt');

class UserService {
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
        const createdUser = await this.userRepository.create(userToCreate);
        return createdUser;
    }
}

module.exports = { UserService };