import bcrypt from "bcrypt";
export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}
export async function verifyPassword(data) {
    return bcrypt.compare(data.password, data.hash);
}
