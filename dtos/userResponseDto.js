export function toUserResponseDto(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
    };
}