import bcrypt from 'bcrypt'
const saltRounds = 10

export const hashPassword = clearPassword => bcrypt.hash(clearPassword, saltRounds)
export const compareHashed = (clear, hashed) => bcrypt.compare(clear, hashed)
