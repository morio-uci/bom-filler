exports.up = async knex => {
    await knex.schema.dropTableIfExists('users')
    await knex.schema.createTable('users', t => {
        t.increments()
        t.string('username').notNullable().unique()
        t.string('name').notNullable()
        ;['created_on', 'last_login'].forEach(column => {
            t.timestamp(column).defaultTo(knex.fn.now()).notNullable()
        })
    })

    await knex.schema.dropTableIfExists('footprints')
    await knex.schema.createTable('footprints', t => {
        t.increments()
        t.string('name', 100).notNullable().unique()
    })

    await knex.schema.dropTableIfExists('descriptions')
    await knex.schema.createTable('descriptions', t => {
        t.increments()
        t.text('description').notNullable()
        t.string('source', 100)
        t.specificType('octopart_uid', 'CHAR(16)')
    })

    await knex.schema.dropTableIfExists('manufacturers')
    await  knex.schema.createTable('manufacturers', t => {
        t.increments()
        t.string('name').notNullable()
        t.text('url')
        t.specificType('octopart_uid', 'CHAR(16)')
    })

    await knex.schema.dropTableIfExists('parts')
    await knex.schema.createTable('parts', t => {
        t.increments()
        t.string('mpn').notNullable().unique()
        t.integer('manufacturer_id').unsigned().references('id')
            .inTable('manufacturers')
        t.integer('footprint_id').references('id').inTable('footprints')
        t.integer('pins')
        t.specificType('octopart_uid', 'CHAR(16)')
    })

    await knex.schema.dropTableIfExists('boms')
    await knex.schema.createTable('boms', t => {
        t.increments()
        t.string('name').notNullable()
        t.integer('user_id').unsigned().references('id')
            .inTable('users').onDelete('CASCADE')
    })

    await knex.schema.dropTableIfExists('bom_entries')
    await knex.schema.createTable('bom_entries', t => {
        t.increments()
        t.integer('bom_id').unsigned().references('id')
            .inTable('boms').onDelete('CASCADE')
        t.text('ref_des').notNullable().defaultTo('')
        t.integer('qty')
        t.integer('part_id').unsigned().references('id').inTable('parts')
        t.integer('description_id').unsigned().references('id')
            .inTable('descriptions')
    })
}

exports.down = async knex => {
    await knex.schema.dropTableIfExists('bom_entries')
    await knex.schema.dropTableIfExists('boms')
    await knex.schema.dropTableIfExists('parts')
    await knex.schema.dropTableIfExists('manufacturers')
    await knex.schema.dropTableIfExists('descriptions')
    await knex.schema.dropTableIfExists('footprints')
    await knex.schema.dropTableIfExists('users')
}
