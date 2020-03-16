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
    entryId: ID!
    string: String
}

type GridRowBoolean {
    entryId: ID!
    boolean: Boolean
}

type GridRowInt {
    entryId: ID!
    int: Int
}

type GridRowFloat {
    entryId: ID!
    float: Float
}

union GridRow = GridRowString | GridRowBoolean | GridRowInt | GridRowFloat

input GridRowStringInput {
    entryId: ID!
    string: String
}

input GridRowBooleanInput {
    entryId: ID!
    boolean: Boolean
}

input GridRowIntInput {
    entryId: ID!
    int: Int
}

input GridRowFloatInput {
    entryId: ID!
    float: Float
}


type GridCreateRow {
    success: Boolean!
    bomId: ID
    entryId: ID
}
 
type Query {
    userAuth: AuthUser!

    bomList: BomNames!
    bomGetGrid(bomId: ID!): Grid!
}

input UpdateRowInput {
    entryId: ID!
    refDes: GridRowStringInput
    qty: GridRowIntInput
}

type UpdateBomRow {
    entryId: ID!
    success: Boolean!
    
}

type Mutation {
    userLogin(credentials: CredentialsInput!): AuthUser!
    userSignUp(signUp: SignUpInput!): CreatedUser!
    userLogout: Boolean!
    
    bomCreate(name: String!): CreatedBom!
    bomDeleteRow(entryId: ID!): Boolean!
    bomCreateRow(bomId: ID!): GridCreateRow!
    bomUpdateRow(updateRowInput: UpdateRowInput!): UpdateBomRow!
}
`