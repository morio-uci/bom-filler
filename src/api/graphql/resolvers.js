import {auth} from "../v1/user/auth"

const resolvers =  {
    Query: {
        userAuth: (_,__, {request}) => {
            if (request.session.hasOwnProperty('user') ) {
                 return request.session.user
            }
            else
            {
                return {success: false}
            }
        }
    },
    Mutation: {
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
        }
    }

}
export default resolvers