
exports.seed = async knex => {
    await knex('footprints').del()
    await knex('footprints').insert([
        {id: 1, name: '0402'},
        {id: 2, name: '0805'},
        {id: 3, name: 'TSSOP'}
    ])
    await knex('manufacturers').del()
    await knex('manufacturers').insert([
        {id: 1, name: 'Panasonic',          url: 'http://panasonic.com', octopart_uid: 'h32d2k1l9kdl987y'},
        {id: 2, name: 'Vishay',             url: 'http://vishay.com',    octopart_uid: "a32d2k1l9kdl087y"},
        {id: 3, name: 'Texas Instruments',  url: 'http://ti.com',        octopart_uid: "m12d2k1lakdl0872"}
    ])

    await knex('parts').del()
    await knex('parts').insert([
        {id: 1, mpn: '330V16C', manufacturer_id: 1, footprint_id: 1, pins: 2,  octopart_uid: 's32d2k1l9kdl917y'},
        {id: 2, mpn: '110K25W', manufacturer_id: 2, footprint_id: 2, pins: 2,  octopart_uid: 'r3sd2k1l9kdl917l'},
        {id: 3, mpn: '74HC123', manufacturer_id: 3, footprint_id: 3, pins: 16, octopart_uid: 'f3sd1k1l9kdm91sb'}
    ])

    await knex('descriptions').del()
    await knex('descriptions').insert([
        {id: 1, description: '330uF 16V Capacitor 0402', source: 'DigiKey',           octopart_uid: 'f1ad2k1l9kdl91ml'},
        {id: 2, description: '110kOhm 1/4W resistor 0805 ', source: 'Mouser',         octopart_uid: 'z23d2k1l1kdl91bc'},
        {id: 3, description: 'NAND Gate array TSSOP-16', source: 'Texas Instruments', octopart_uid: 'o1ad1a1l9kdl9551'},
    ])

    await knex('bom_entries').del()
    await knex('bom_entries').insert([
        {id: 1, bom_id: 1, ref_des: 'C1,C2,C3', qty: 3, part_id: 1, description_id: 1 },
        {id: 2, bom_id: 1, ref_des: 'R1,R2', qty: 2, part_id: 2, description_id: 2 },
        {id: 3, bom_id: 1, ref_des: 'U1', qty: 1, part_id: 3, description_id: 3 }
    ])
}
