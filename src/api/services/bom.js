import knex from '../database'
const bom = {}

// CREATE
bom.addRow = async (bomId) => {
    try {
        const data = await knex('bom_entries').insert({bom_id: bomId}).returning(['id', 'bom_id'])
        return {success: true, bomId: data[0].bom_id, entry: data[0].id}
    }
    catch(err) {
        return {success: false}
    }
}
// READ
bom.getAllTableData = async (bomId) => {
    const retrieveData = async () =>
        await knex('bom_entries AS be')
            .leftJoin('parts AS p', 'p.id', 'be.part_id')
            .leftJoin('manufacturers AS m', 'm.id', 'p.manufacturer_id')
            .leftJoin('descriptions AS d', 'd.id', 'be.description_id')
            .leftJoin('footprints AS f', 'f.id', 'p.footprint_id')
            .where('be.bom_id', bomId)
            .select(
                'be.id AS entry_id',
                'be.ref_des AS ref_des',
                'be.qty AS qty',
                'p.mpn AS mpn',
                'm.name AS manufacturer',
                'd.description AS description',
                'f.name AS footprint',
                'p.pins AS pins')
    const data = await retrieveData()
    const formattedData =
        {
            grid: data.map(row => [
                {entry: row.entry_id, value: row.ref_des},
                {entry: row.entry_id, value: row.qty},
                {entry: row.entry_id, value: row.mpn},
                {entry: row.entry_id, value: row.manufacturer},
                {entry: row.entry_id, value: row.description},
                {entry: row.entry_id, value: row.footprint},
                {entry: row.entry_id, value: row.pins},
            ])
        }
    return {success: data.length > 0, data: formattedData}

}
// UPDATE
bom.updateRefDes = async (entryId, refDes) => {
    try {
        await knex('bom_entries').where('id', entryId).update({ref_des: refDes})
        return {success: true}
    }
    catch(err) {
        return {success: false}
    }
}

bom.updateQty = async (entryId, qty) => {
    try {
        await knex('bom_entries').where('id', entryId).update({qty: qty})
        return {success: true}
    }
    catch(err) {
        return {success: false}
    }
}
/**
 * Not yet implemented
 */
bom.updateMpn = (entryId, Mpn) => {

}

bom.updateManufacture = (entryId, manufacture) => {

}

bom.updateDescription = (entryId, description) => {

}

bom.updateFootprint = (entryId, footprint) => {

}

bom.updatePins = (entryId, pins) => {

}


// DELETE
bom.deleteRow = async (entryId) => {
    try {
        await knex('bom_entries').where('id', entryId).del()
        return {success: true}
    }
    catch(err) {
        return {success: false}
    }
}



// Migration and seed until I learn more
bom.init = () => {
    knex.schema.hasTable('footprints').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('footprints', function(t) {
                t.increments('id').primary()
                t.string('name', 100)
            })
        }
    })
    knex.schema.hasTable('descriptions').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('descriptions', function(t) {
                t.increments('id').primary()
                t.text('description').notNullable()
                t.string('source', 100)
                t.specificType('octopart_uid', 'CHAR(16) DEFAULT NULL')
            })
        }
    })
    knex.schema.hasTable('manufacturers').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('manufacturers', function(t) {
                t.increments('id').primary()
                t.string('name').notNullable()
                t.text('url')
                t.specificType('octopart_uid', 'CHAR(16) DEFAULT NULL')
            })
        }
    })
    knex.schema.hasTable('parts').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('parts', function(t) {
                t.increments('id').primary()
                t.string('mpn').notNullable()
                t.integer('manufacturer_id').unsigned().references('id')
                    .inTable('manufacturers')
                t.integer('footprint_id').unsigned().references('id')
                    .inTable('footprints')
                t.integer('pins')
                t.specificType('octopart_uid', 'CHAR(16) DEFAULT NULL')
            })
        }
    })
    knex.schema.hasTable('boms').then(function(exists) {
        if (!exists) {
            return knex.transaction(function(trx) {
                const first_bom = {name: 'Demo BOM', user_id: 1};
                return trx
                    .schema.createTable('boms', function(t) {
                        t.increments('id').primary()
                        t.string('name').notNullable()
                        t.integer('user_id').unsigned().references('id')
                            .inTable('users')
                    })
                    .then( function() {
                        return trx('boms').insert(first_bom)
                    })
            })
            .then(function() {
                console.log('Table "boms" created');
            })
            .catch(function(error) {
                console.error(error);
            })
        }
    })
    knex.schema.hasTable('bom_entries').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('bom_entries', function(t) {
                t.increments('id').primary()
                t.integer('bom_id').unsigned().references('id').inTable('boms')
                t.text('ref_des').notNullable().defaultTo('')
                t.integer('qty')
                t.integer('part_id').unsigned().references('id').inTable('parts')
                t.integer('description_id').unsigned().references('id')
                    .inTable('descriptions')
            })
        }
    })

}
export default bom

