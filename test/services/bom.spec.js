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
                expect(addRowResult.entry).to.equal(1)
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
            entryId = addRowResult.entry

        })

        afterEach( async () => {
            await knex('bom_entries').truncate()
        })

        it("deletes a row", async () => {
            const deleteResult = await bom.deleteRow(entryId)
            const countResult = await knex('bom_entries').count('* AS count')
            expect(deleteResult.success, "deleteRow success false").to.be.true
            /* count returns a string, so + cast the value as a number */
            expect(+countResult[0].count, "row count wasn't zero").to.equal(0)
        })

        it("fails deleting an nonexistent bom_entries id", async () => {
            const deleteResult = await bom.deleteRow(999)
            const countResult = await knex('bom_entries').count('* AS count')
            expect(deleteResult.success, "deleteRow success wasn't false").to.be.false
            /* count returns a string, so + cast the value as a number */
            expect(+countResult[0].count, "row count wasn't 1").to.equal(1)
        })
    })

    describe("updateRefDes", () => {
        let entryId
        const testRefDes = 'C1,C2,C3'
        beforeEach( async () => {
            await knex('bom_entries').truncate()
            const addRowResult = await bom.addRow(bomId)
            entryId = addRowResult.entry
        })

        afterEach( async () => {
            await knex('bom_entries').truncate()
        })

        it("successfully updates", async () => {
            const refDesResult = await bom.updateRefDes(entryId, testRefDes)
            expect(refDesResult.success, "update didn't return success true").to.be.true
            const getAllTableDataResult = await bom.getAllTableData(bomId)
            expect(getAllTableDataResult.grid[0][0].entry, "first row wasn't doesn't have the right entry id")
                .to.equal(entryId)
            expect(getAllTableDataResult.grid[0][0].value, "ref des didn't update to the correct value")
                .to.equal(testRefDes)
        })

        it("fails when updating non existent entry id", async () => {
            const refDesResult = await bom.updateRefDes(999, testRefDes)
            expect(refDesResult.success, "update didn't return success false").to.be.false
        })
    })

    describe("updateQty", () => {
        let entryId
        const testQty = 3

        beforeEach( async () => {
            await knex('bom_entries').truncate()
            const addRowResult = await bom.addRow(bomId)
            entryId = addRowResult.entry
        })

        afterEach( async () => {
            await knex('bom_entries').truncate()
        })

        it("successfully updates", async () => {
            const qtyResult = await bom.updateQty(entryId, testQty)
            expect(qtyResult.success, "update didn't return success true").to.be.true
            const getAllTableDataResult = await bom.getAllTableData(bomId)
            expect(getAllTableDataResult.grid[0][1].entry, "first row wasn't doesn't have the right entry id")
                .to.equal(entryId)
            expect(getAllTableDataResult.grid[0][1].value, "qty didn't update to the correct value")
                .to.equal(testQty)
        })

        it("fails when updating non existent entry id", async () => {
            const result = await bom.updateQty(999, testQty)
            expect(result.success, "update didn't return success false").to.be.false
        })

        it("fails when updating a non-integer value", async () => {
            await bom.updateQty(entryId, testQty)
            const qtyResult = await bom.updateQty(entryId, "non-interger value")
            expect(qtyResult.success, "update didn't return success false").to.be.false
            const getAllTableDataResult = await bom.getAllTableData(bomId)
            expect(getAllTableDataResult.grid[0][1].entry, "first row wasn't doesn't have the right entry id")
                .to.equal(entryId)
            expect(getAllTableDataResult.grid[0][1].value, "qty didn't remain as the original value")
                .to.equal(testQty)
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
            expect(results.success, 'success was false').to.be.true
            expect(results.grid[0][0].entry, "first entry wasn't 1").to.be.equal(1)
            expect(results.grid[1][1].value, "second entry qty wasn't 2").to.be.equal(2)
            expect(results.grid, "data didn't have 3 rows").to.have.lengthOf(3)
        })

        it('fails when when retrieving a non existent bomId', async () => {
            const results = await bom.getAllTableData(999)
            expect(results.success, 'success was true').to.be.false
        })
    })

    describe("createBom", ()=> {
        let createdBomId = null
        afterEach(async ()=>{
            if (createdBomId) {
                await knex('boms').where('id', '=', createdBomId).del()
            }
        })

        it('creates a bom', async () => {
            const results = await bom.createBom(userId, "My New Bom")
            if(results.success) {
                createdBomId = results.id
            }
            expect(results.success, "success was not true").to.be.true
            expect(results.id).to.be.an.integer()
            expect(results.name).to.be.equal("My New Bom")
        })

        it("it doesn't create a bom with an invalid user", async () => {
            const results = await bom.createBom(9999, "My New Bom")
            if(results.success) {
                createdBomId = results.id
            }
            expect(results.success).to.be.false
        })
    })
    describe("listBoms", ()=> {

        it('list a bom for user', async () => {
            const results = await bom.listBoms(userId)
            expect(results.success, "success was not true").to.be.true
            expect(results.data, 'data did not match').to.have.ordered.deep.members([{id: 1, name: 'Demo Bom'}])
        })

        it("it returns an empty list for a non-existing user", async () => {
            const results = await bom.listBoms(9999)
            expect(results.success).to.be.true
            expect(results.data).to.be.empty
        })
    })
})