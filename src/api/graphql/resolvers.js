const auth = (...args) => {
    const {request: {session}, response} = args[2]
    const fn = args.pop()
    if (session.hasOwnProperty('user')) {
        return fn(...args)
    }
    else {
        response.status(401).end()
    }

}



const resolvers =  {
    Query: {
        /** User Queries - Authorization resolvers **/
        userAuth: (_,__, {request}) => {
            if (request.session.hasOwnProperty('user') ) {
                 return request.session.user
            }
            else
            {
                return {success: false}
            }
        },

        /** Bom Queries resolvers **/
        bomList: (...args) => auth(...args, async (_, __, {request:{ session : {user: {user: {id}}}}, services: {bom}}) => {
            return await bom.listBoms(parseInt(id, 10))
        }),

        bomGetGrid: (...args) => auth(...args, async (_, {bomId}, {services: {bom}}) => {
            return await bom.getAllTableData(bomId);
        }),
    },
    Mutation: {
        /** User Mutations - Authorization resolvers **/
        userLogin: async (_,{credentials: {username, password}}, {request: {session}, services: {user}}) =>{
            const authUser = await user.getUserWithUsernameAndPass(username, password);

            if (authUser.success) {
                return session.user = authUser
            }
            delete session.user
            return {success: false}
        },
        userLogout: (_, __, {request: {session} }) => {
            if (session.hasOwnProperty('user')) {
                delete session.user
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
                return session.user = createdUser
            }
            delete session.user
            return createdUser
        },

        /** Bom Mutations resolvers **/
        bomCreate: (...args) => auth( ...args, async (_,{name},{request:{ session : {user: {user: {id}}}}, services: {bom}}) => {
            return await bom.createBom(parseInt(id, 10), name)
        })
    }

}
export default resolvers