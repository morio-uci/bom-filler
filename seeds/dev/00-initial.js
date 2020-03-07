export const seed = async knex => {
    await knex('users').del()
    await knex('users').insert({id: 1, username: 'Demo', name: 'Demo User'})

    await knex('boms').del()
    await knex('boms').insert({id: 1, name: 'Demo Bom', user_id: 1})
}
