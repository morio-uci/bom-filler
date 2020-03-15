export default `
input CredentialsInput {
    username: String!
    password: String!
}

input SignUpInput {
    credentials: CredentialsInput!
    name: String!
    email: String
}

type User {
    id: ID!
    username: String!
    name: String!
    email: String
}

type AuthUser {
    success: Boolean!
    user: User
}

type CreatedUser {
    success: Boolean!
    reason: String
    user: User
}

type Query {
    userAuth: AuthUser!
}

type Mutation {
    userLogin(credentials: CredentialsInput!): AuthUser!
    userSignUp(signUp: SignUpInput!): CreatedUser!
    userLogout: Boolean!
}
`