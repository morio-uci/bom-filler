import chai, {expect} from 'chai'
import chaiInteger from 'chai-integer'
chai.use(chaiInteger)
import knex from '../../src/api/database'
import bom from '../../src/api/services/bom'

describe("bom services", () => {
    const bomId = 1
    const userId = 1
    describe("addRow", () => {
        describe("successfully", () => {
            beforeEach( async () => {
                await knex('bom_entries').truncate()
            })

            afterEach( async () => {
                await knex('bom_entries').truncate()
            })

            it("adds a row", async () => {
                let addRowResult = await bom.addRow(1)
                expect(addRowResult.success).to.be.true
                expect(addRowResult.bomId).to.equal(1)
                expect(addRowResult.entryId).to.equal(1)
            })
        })

        it("fails when adding an invalid bom id", async () => {
            let addRowResult = await bom.addRow(999)
            expect(addRowResult.success).to.be.false
        })
    })

    describe("deleteRow", () => {
        let entryId;
        beforeEach( async () => {
            await knex('bom_entries').truncate()
            const addRowResult = await bom.addRow(bomId)
            entryId = addRowResult.entryId

        })

        afterEach( async () => {
            await knex('bom_entries').truncate()
        })

        it("deletes a row", async () => {
            const deleteResult = await bom.deleteRow(entryId)
            const countResult = await knex('bom_entries').count('* AS count')
            expect(deleteResult, "deleteRow return  not true").to.be.true
            /* count returns a string, so + cast the value as a number */
            expect(+countResult[0].count, "row count wasn't zero").to.equal(0)
        })

        it("fails deleting an nonexistent bom_entries id", async () => {
            const deleteResult = await bom.deleteRow(999)
            const countResult = await knex('bom_entries').count('* AS count')
            expect(deleteResult, "deleteRow return wasn't false").to.be.false
            /* count returns a string, so + cast the value as a number */
            expect(+countResult[0].count, "row count wasn't 1").to.equal(1)
        })
    })


    describe("getAllTableData", () => {
        beforeEach( async () => {
            await knex.seed.run({specific: 'bom_entries-test-data.js'})
        })

        afterEach( async () => {
            await knex.raw('TRUNCATE TABLE bom_entries CASCADE')
            await knex.raw('TRUNCATE TABLE parts CASCADE')
            await knex.raw('TRUNCATE TABLE manufacturers CASCADE')
            await knex.raw('TRUNCATE TABLE footprints CASCADE')
            await knex.raw('TRUNCATE TABLE descriptions CASCADE')
        })

        it('successfully gets all the data', async () => {
            const results = await bom.getAllTableData(1)
            expect(results.success, 'success was not true').to.be.true
            expect(results.grid[0][0].entryId, "first entry wasn't 1").to.be.equal(1)
            expect(results.grid[1][1].int, "second entry qty wasn't 2").to.be.equal(2)
            expect(results.grid, "data didn't have 3 rows").to.have.lengthOf(3)
        })

        it('is true when when retrieving a non existent bomId, means an empty bom', async () => {
            const results = await bom.getAllTableData(999)
            expect(results.success, 'success was not true').to.be.true
        })
    })

    describe("createBom", ()=> {
        beforeEach(async ()=>{
            await knex('boms').where({name: 'My New Bom'}).orWhere({name: 'Should not be a bom'}).del()
        })

        afterEach(async ()=>{
            await knex('boms').where({name: 'My New Bom'}).orWhere({name: 'Should not be a bom'}).del()
        })

        it('creates a bom', async () => {
            const results = await bom.createBom(userId, "My New Bom")
            expect(results.success, "success was not true").to.be.true
            expect(results.bom.id, "not an int").to.be.an.integer()
            expect(results.bom.name).to.be.equal("My New Bom")
        })

        it("it doesn't create a bom with an invalid user", async () => {
            const results = await bom.createBom(9999, "Should not be a bom")
            expect(results.success).to.be.false
        })
    })
    describe("listBoms", ()=> {
        beforeEach(async ()=>{
            await knex('boms').where({name: 'My New Bom'}).orWhere({name: 'Should not be a bom'}).del()
        })

        it('list a bom for user', async () => {
            const results = await bom.listBoms(userId)
            expect(results.success, "success was not true").to.be.true
            expect(results.bomNames, 'data did not match').to.have.ordered.deep.members([{id: 1, name: 'Demo Bom'}])
        })

        it("it returns an empty list for a non-existing user", async () => {
            const results = await bom.listBoms(9999)
            expect(results.success).to.be.true
            expect(results.bomNames).to.be.empty
        })
    })
})