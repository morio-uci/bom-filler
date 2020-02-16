const express = require('express')
import user from './services/user'
import bom from  './services/bom'
import {getData as bomGetData} from './v1/bom/getData'
import {addRow as bomAddRow} from './v1/bom/id/addRow'
import {updateRefDes as bomUpdateRefDes} from './v1/bom/id/entryId/ref_des/updateRefDes'
import {updateQty as bomUpdateQty} from './v1/bom/id/entryId/qty/updateQty'
import {delRow as bomDelRow} from './v1/bom/id/entryId/delRow'

const APP_ROOT = '/api/v1'
const BOM_ROOT = `${APP_ROOT}/bom`
const app = express()
app.use(express.json())
const port = 4000
// This will be moved into migration and seed database files once I learn those
user.init()
bom.init()

app.use(BOM_ROOT, bomGetData())
app.use(BOM_ROOT, bomAddRow())
app.use(BOM_ROOT, bomUpdateRefDes())
app.use(BOM_ROOT, bomUpdateQty())
app.use(BOM_ROOT, bomDelRow())

app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))
