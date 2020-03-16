const auth = (...args) => {
    const {request: {session}, response} = args[2]
    const fn = args.pop()
    if (session.hasOwnProperty('auth')) {
        return fn(...args)
    }
    else {
        response.status(401).end()
    }

}



const resolvers = {
    Query: {
        /** User Queries - Authorization resolvers **/
        userAuth: (_, __, {request}) => {
            if (request.session.hasOwnProperty('auth')) {
                return request.session.auth
            } else {
                return {success: false}
            }
        },

        /** Bom Queries resolvers **/
        bomList: (...args) => auth(...args, async (_, __, {request: {session: {auth: {user: {id}}}}, services: {bom}}) => {
            return bom.listBoms(parseInt(id, 10))
        }),

        bomGetGrid: (...args) => auth(...args, async (_, {bomId}, {services: {bom}}) => {
            return bom.getAllTableData(bomId);
        }),
    },
    Mutation: {
        /** User Mutations - Authorization resolvers **/
        userLogin: async (_, {credentials: {username, password}}, {request: {session}, services: {user}}) => {
            const authUser = await user.getUserWithUsernameAndPass(username, password);

            if (authUser.success) {
                return session.auth = authUser
            }
            delete session.auth
            return {success: false}
        },
        userLogout: (_, __, {request: {session}}) => {
            if (session.hasOwnProperty('auth')) {
                delete session.auth
                return true;
            }
            return false;

        },
        userSignUp: async (_,
                           {signUp: {credentials: {username, password}, name, email}},
                           {request: {session}, services: {user}}
        ) => {
            const createdUser = await user.createUser(username, name, email, password)
            if (createdUser.success) {
                return session.auth = createdUser
            }
            delete session.auth
            return createdUser
        },

        /** Bom Mutations resolvers **/
        bomCreate: (...args) => auth(...args, async (_, {name}, {request: {session: {auth: {user: {id}}}}, services: {bom}}) => {
            return bom.createBom(parseInt(id, 10), name)
        }),

        bomDeleteRow: (...args) => auth(...args, async (_, {entryId}, {services: {bom}}) => {
            return bom.deleteRow(parseInt(entryId, 10))
        }),

        bomCreateRow: (...args) => auth(...args, async (_, {bomId}, {services: {bom}}) => {
            return bom.addRow(parseInt(bomId, 10))
        }),

        bomUpdateRow: (...args) => auth(...args, async (_, {updateRowInput}, {services: {bom}}) => {
            return bom.updateRow(updateRowInput)
        })

    }
}
export default resolvers