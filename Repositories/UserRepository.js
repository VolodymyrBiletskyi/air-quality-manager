class UserRepositoryPostgres {
    constructor(db) {
        this.db = db;
    }
    async createUser(userData) {
        const { username, passwordHash, email } = userData;
        const result = await this.db.query(
            'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, passwordHash, email]
        );
        const row = result.rows[0];
        return {
            id: row.id,
            username: row.username,
            email: row.email,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

module.exports = { UserRepositoryPostgres };