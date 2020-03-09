
export const up = async knex => {
    await knex.schema.alterTable('boms', boms => {
        ;['created_on', 'updated_on'].forEach(column => {
            boms.timestamp(column).defaultTo(knex.fn.now()).notNullable()
        })
    })

    await knex.schema.alterTable('bom_entries', bom_entries => {
        ;['created_on', 'updated_on'].forEach(column => {
            bom_entries.timestamp(column).defaultTo(knex.fn.now()).notNullable()
        })
    })

    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_updated_on_column()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW.updated_on = now();
        RETURN NEW;
        END;
        $$ language 'plpgsql'`
    )
    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_updated_on_and_boms_updated_on_column()
        RETURNS TRIGGER AS $$
        BEGIN
        UPDATE boms SET updated_on = now() WHERE id = NEW.bom_id;
        NEW.updated_on = now();
        RETURN NEW;
        END;
        $$ language 'plpgsql'`
    )
    await knex.raw(`
        CREATE TRIGGER update_boms_modtime 
        BEFORE UPDATE ON boms
        FOR EACH ROW EXECUTE PROCEDURE  
        update_updated_on_column()
    `)
    await knex.raw(`
        CREATE TRIGGER update_bom_entires_modtime 
        BEFORE UPDATE ON bom_entries
        FOR EACH ROW EXECUTE PROCEDURE  
        update_updated_on_and_boms_updated_on_column()    
    `)


}

export const down = async knex => {
    await knex.schema.alterTable('boms', boms => {
        boms.dropColumns(['created_on', 'updated_on'])
    })

    await knex.schema.alterTable('bom_entries', bom_entries => {
        bom_entries.dropColumns(['created_on', 'updated_on'])
    })

    await knex.raw(`DROP TRIGGER IF EXISTS update_boms_modtime ON boms`)
    await knex.raw(`DROP TRIGGER IF EXISTS update_bom_entires_modtime ON bom_entries`)
    await knex.raw(`DROP FUNCTION IF EXISTS update_updated_on_column()`)
    await knex.raw(`DROP FUNCTION IF EXISTS update_updated_on_and_boms_updated_on_column()`)

}
