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

type CreatedBom {
    success: Boolean!
    bom: BomName    
}

type BomName {
    id: ID!
    name: String!
}

type BomNames {
    success: Boolean!
    bomNames: [BomName]
}

type Grid {
    success: Boolean!
    grid: [[GridRow]]
}

type GridRowString {
    entry: ID!
    string: String
}

type GridRowBoolean {
    entry: ID!
    boolean: Boolean
}

type GridRowInt {
    entry: ID!
    int: Int
}

type GridRowFloat {
    entry: ID!
    float: Float
}

union GridRow = GridRowString | GridRowBoolean | GridRowInt | GridRowFloat

 
type Query {
    userAuth: AuthUser!

    bomList: BomNames!
    bomGetGrid(bomId: ID!): Grid!
}

type Mutation {
    userLogin(credentials: CredentialsInput!): AuthUser!
    userSignUp(signUp: SignUpInput!): CreatedUser!
    userLogout: Boolean!
    
    bomCreate(name: String!): CreatedBom!
}
`