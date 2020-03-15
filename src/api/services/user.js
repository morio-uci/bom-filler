import knex from '../database'
import { hashPassword, compareHashed } from '../auth'

const user = {}
user.createUser = async (username, name, email, password) => {
    if(password.length < 7 // great or equal to 7 character
        || password.toUpperCase() === password.toLowerCase() //  have alphabetic characters
        || password.toLowerCase() === password) // have mixed upper and lower case
    {
        return {success: false,
            reason: "password needs to be 7 or more character of mixed case, number and symbols are optional"}
    }
    try {
        const result = await knex('users')
            .insert({username: username, name: name, ...(email !== null && {email}),
                password: await hashPassword(password)})
            .returning(['id', 'username', 'name', 'email'])
        return {
            success: true,
            user: {
                id: result[0].id,
                username: result[0].username,
                name: result[0].name,
                ...(result[0].email !== null && {email: result[0].email})
            }
        }

    }
    catch (e) {
        if (e.hasOwnProperty('constraint')  && e.constraint === 'users_username_unique') {
            return {success: false, reason: 'username is already taken'}
        }
        return { success: false }
    }
}

user.getUserWithUsernameAndPass = async (username, password) => {
    try {
        const result = await knex('users')
            .where('username', '=', username)
            .select('id', 'username', 'name', 'email', 'password')
        if (result.length === 1 && (await compareHashed(password, result[0].password))) {
            return {
                success: true,
                user: {
                    id: result[0].id,
                    username: result[0].username,
                    name: result[0].name,
                    ...(result[0].email !== null && {email: result[0].email})
                }
            }
        }
        return { success: false }
    }
    catch (e) {
        return { success: false }
    }
}
export default user;