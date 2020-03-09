import { expect } from 'chai'
import knex from '../../src/api/database'
import user from '../../src/api/services/user'
import { compareHashed } from '../../src/api/auth'

describe('user services', () => {
    describe('createUser', () => {
        let createdUserId
        afterEach(async () => {
            if(createdUserId > 0) {
                await knex('users').where('id','=', createdUserId).del()
            }
        })

        it('creates a user', async () => {
            const result = await user.createUser(
                'testuser',
                'User McTester',
                'user@mctester.com',
                'mctesterA123!')
            createdUserId = result.id
            expect(result.success, "success wasn't true").to.be.true
            expect(result.name, "returned name isn't the same").to.be.equal('User McTester')
            expect(result.username, "returned username isn't the same").to.be.equal('testuser')
            expect(result.email, "returned email isn't the same").to.be.equal('user@mctester.com')
            const dbRecord = (await knex('users').where('id', '=', result.id)
                .select('email', 'password'))[0]
            expect(await compareHashed('mctesterA123!', dbRecord.password) , "password in db isn't the same")
                .to.be.true
        })

        it('errors if another username is already added', async () => {
            const result = await user.createUser(
                'Demo',
                '2nd Demo',
                '2@demo.com',
                'biffdemo123!')
            // if the create succeeds by mistake, get rid of it after the test
            if (result.success) {
                createdUserId = result.id
            }
            expect(result.success, "success was not false").to.be.false
        })
    })

    describe("getUserWithUsernameAndPass", () => {
        it("finds demo user", async () => {
            const result = await user.getUserWithUsernameAndPass("Demo", "demo123!")
            expect(result.success, "success was not true").to.be.true
            expect(result.username, "username was not the same").to.be.equal('Demo')
            expect(result.email, "email was not the same").to.be.equal(process.env.TEST_USER_EMAIL || 'demo@demo.null')
        })

        it("doesn't find a user with a incorrect password", async () => {
            const result = await user.getUserWithUsernameAndPass("Demo", "badpassword123!")
            expect(result.success, "success was not false").to.be.false
        })

        it("doesn't find a none existent user", async () => {
            const result = await user.getUserWithUsernameAndPass("notAUser", "passwordForNoOne123!")
            expect(result.success, "success was not false").to.be.false
        })
    })

})
