import express from 'express'
import bom from '../../../../services/bom'

export const delRow = () => {
    const router = express.Router()
    router.delete('/:bomId/:entryId', (req, res, next) => {
        const entryId = parseInt(req.params.entryId)
        if (!isNaN(entryId)) {
            bom.deleteRow(entryId).then((result) => {
                res.json({success: result.success})
                next();
            })
        }
        else {
            // entry was not a number
            res.status(400).end()
        }
    })
    return router
}
