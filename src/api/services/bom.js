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
        const result = await knex('bom_entries').where('id', entryId).update({ref_des: refDes})
        return {success: result === 1}
    }
    catch(err) {
        return {success: false}
    }
}

bom.updateQty = async (entryId, qty) => {
    try {
        const result = await knex('bom_entries').where('id', entryId).update({qty: qty})
        return {success: result === 1}
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
        const result = await knex('bom_entries').where('id', entryId).del()
        return {success: result === 1}
    }
    catch(err) {
        return {success: false}
    }
}

export default bom

