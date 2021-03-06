import knex from '../database'
const bom = {}

// CREATE
bom.addRow = async (bomId) => {
    try {
        const data = await knex('bom_entries').insert({bom_id: bomId}).returning(['id', 'bom_id'])
        return {success: true, bomId: data[0].bom_id, entryId: data[0].id}
    }
    catch (err) {
        return {success: false}
    }
}

bom.createBom = async (userId, name) => {
    try {
        const data =  await knex('boms').insert({user_id: userId, name: name}).returning(['id', 'name'])
        if (data.length === 1) {
            // Add the first empty row in the bom entries
            await bom.addRow(data[0].id)
            return {success: true, bom: { id: data[0].id, name: data[0].name }}
        }
        else {
            return {success: false}
        }
    }
    catch (e) {
        return {success: false}
    }
}
// READ
bom.getAllTableData = async (bomId) => {
    try {
        const retrieveData = async () =>
            await knex('bom_entries AS be')
                .leftJoin('parts AS p', 'p.id', 'be.part_id')
                .leftJoin('manufacturers AS m', 'm.id', 'p.manufacturer_id')
                .leftJoin('descriptions AS d', 'd.id', 'be.description_id')
                .leftJoin('footprints AS f', 'f.id', 'p.footprint_id')
                .join('boms AS b', 'b.id', 'be.bom_id')
                .where('be.bom_id', bomId)
                .orderBy('be.id', 'asc')
                .select(
                    'be.id AS entry_id',
                    'be.ref_des AS ref_des',
                    'be.qty AS qty',
                    'p.mpn AS mpn',
                    'm.name AS manufacturer',
                    'd.description AS description',
                    'f.name AS footprint',
                    'p.pins AS pins',
                    'b.user_id AS user_id'
                )
        const data = await retrieveData()
        const formattedData =
            data.map(row => [
                    {entryId: row.entry_id, string: row.ref_des, __typename: 'GridRowString'},
                    {entryId: row.entry_id, int: row.qty,  __typename: 'GridRowInt'},
                    {entryId: row.entry_id, string: row.mpn,  __typename: 'GridRowString'},
                    {entryId: row.entry_id, string: row.manufacturer,  __typename: 'GridRowString'},
                    {entryId: row.entry_id, string: row.description,  __typename: 'GridRowString'},
                    {entryId: row.entry_id, string: row.footprint, __typename: 'GridRowString'},
                    {entryId: row.entry_id, int: row.pins,  __typename: 'GridRowInt'},
                ])
        if (data.length > 0) {
            return {success: true, grid: formattedData}
        }
        else if (data.length === 0)
            return {success: true, grid: []}
        else {
            return {success: false, grid: []}
        }
    }
    catch (e) {
        return {success: false, grid: []}
    }

}

bom.listBoms = async userId => {
    try {
        const data = await knex('boms')
            .where('user_id', '=', userId, 10)
            .orderBy('updated_on', 'desc')
            .select('id', 'name')
        return {success: true, bomNames: data}
    }
    catch (e) {
        return {success: false}
    }
}
// UPDATE

bom.updateRow = async updateRowInput => {
    let success = true
    const entryId = parseInt(updateRowInput.entryId, 10)
    const simpleUpdates = {}

    if(updateRowInput.hasOwnProperty('qty')) {
        simpleUpdates.qty = updateRowInput.qty.int
    }

    if(updateRowInput.hasOwnProperty('refDes')) {
        simpleUpdates.ref_des = updateRowInput.refDes.string
    }

    try {
        const result = await knex('bom_entries').where('id', '=', entryId).update(simpleUpdates)
    }
    catch(err) {
        success = false
    }
    // try the other updates when I'm ready but for now, return
    return {entryId, success}
}
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
        return result === 1
    }
    catch(err) {
        return false
    }
}

export default bom

