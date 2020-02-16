import knex from "../database"
const user = {}

// Migration and seed until I learn more
user.init = () => {
    knex.schema.hasTable('users').then(function(exists) {
        if (!exists) {
            return knex.transaction(function(trx) {
                const first_user = {username: 'Demo', name: 'Demo User'};
                return trx
                    .schema.createTable('users', function(t) {
                        t.increments('id').primary()
                        t.string('username').notNullable()
                        t.string('name').notNullable()
                    })
                    .then( function() {
                        return trx('users').insert(first_user)
                    })
            })
            .then(function() {
                console.log('Table "users" created');
            })
            .catch(function(error) {
                console.error(error);
            })
        }
    })
}
export default user;