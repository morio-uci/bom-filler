require('dotenv').config()
import express from 'express'
import session from 'express-session'
import graphqlHTTP  from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
// import ConnectSessionKnex from 'connect-session-knex'
import knex from './database'

import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'
import bom from './services/bom'
import user from './services/user'
import {getData as bomGetData} from './v1/bom/id/getData'
import {addRow as bomAddRow} from './v1/bom/id/addRow'
import {updateRefDes as bomUpdateRefDes} from './v1/bom/id/entryId/ref_des/updateRefDes'
import {updateQty as bomUpdateQty} from './v1/bom/id/entryId/qty/updateQty'
import {delRow as bomDelRow} from './v1/bom/id/entryId/delRow'
import {list as bomList} from './v1/bom/list'
import {create as bomCreate} from './v1/bom/create'

import {login as userLogin} from './v1/user/login'
import {signUp as userSignUp} from './v1/user/signUp'
import {auth as userAuth} from './v1/user/auth'
import {logout as userLogout} from "./v1/user/logout"

const APP_ROOT = '/api/v1'
const BOM_ROOT = `${APP_ROOT}/bom`
const USER_ROOT = `${APP_ROOT}/user`
const TWO_WEEKS_IN_MS = 14 * 24 * 60 * 60 * 1000
const port = process.env.API_PORT || 4000

// const KnexSessionStore = ConnectSessionKnex(session)

const app = express()

/**
 Get this error, when using connect-session-knex. Can't tack it down. Spent to much time on it. Going to use the memory
 version
 [api] Example backend API listening on port 4000!
 [api] (node:7107) UnhandledPromiseRejectionWarning: TypeError: self.knex.select(...).from(...).where(...).andWhereRaw(...).then(...).asCallback is not a function
 [api]     at /Users/morio/WebstormProjects/bom-filler/node_modules/connect-session-knex/index.js:264:5


 Still broken after trying the fixed library Jeremy provided
 it's missing the _then function. When down the rabbit hole of providing _then  but that was a waste if time

 */

const env = process.env.NODE_ENV || 'development'

app.use(session({
 //   store: new KnexSessionStore({ knex: knex }),
    secret: process.env.SESSION_SECRET || 'this is not a very secret secret',
    cookie: { maxAge: TWO_WEEKS_IN_MS },
    saveUninitialized: false,
    resave: false
}))
app.use(express.json())
// check authorization on all BOM routes

const schema = makeExecutableSchema({ typeDefs, resolvers });
app.use(
    APP_ROOT+"/graphql",
    graphqlHTTP((request, response) => ({
        schema,
        context: {request, response, services: {bom, user}},
        graphiql: env === 'development'
    }))
);

app.use(BOM_ROOT, express.Router().use((req, res, next) => {
    if(req.session.user) {
        next()
    }
    else {
        // unauthorized
        res.status(401).end()
    }
}))



app.use(BOM_ROOT, bomGetData())
app.use(BOM_ROOT, bomAddRow())
app.use(BOM_ROOT, bomUpdateRefDes())
app.use(BOM_ROOT, bomUpdateQty())
app.use(BOM_ROOT, bomDelRow())
app.use(BOM_ROOT, bomList())
app.use(BOM_ROOT, bomCreate())

app.use(USER_ROOT, userSignUp())
app.use(USER_ROOT, userLogin())
app.use(USER_ROOT, userAuth())
app.use(USER_ROOT, userLogout())
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({success: false})
})
app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))
