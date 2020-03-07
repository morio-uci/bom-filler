import express from 'express'
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


app.use(BOM_ROOT, bomGetData())
app.use(BOM_ROOT, bomAddRow())
app.use(BOM_ROOT, bomUpdateRefDes())
app.use(BOM_ROOT, bomUpdateQty())
app.use(BOM_ROOT, bomDelRow())

app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))
