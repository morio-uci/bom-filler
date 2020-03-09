import {hashPassword} from '../../src/api/auth'
export const seed = async knex => {
    await knex.raw('TRUNCATE TABLE users CASCADE')
    const user_id = (await knex('users')
        .insert({
            username: 'Demo',
            name: 'Demo User',
            email: process.env.TEST_USER_EMAIL || 'demo@demo.null',
            password: await hashPassword('demo123!')
        })
        .returning('id'))[0]


    await knex.raw('TRUNCATE TABLE boms CASCADE')
    await knex('boms').insert({name: 'Demo Bom', user_id: user_id})
}
