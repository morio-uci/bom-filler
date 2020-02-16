import express from 'express'
import bom from '../../../../../services/bom'

export const updateQty = () => {
    const router = express.Router()
    router.patch('/:bomId/:entryId/qty', (req, res, next) => {
        const entryId = parseInt(req.params.entryId)
        if (!isNaN(entryId)) {
            bom.updateQty(entryId, parseInt(req.body.qty)).then((result) => {
                res.json({success: result.success})
                next();
            })
        }
        else {
            // bomId was not a number
            res.status(400).end()
        }
    })
    return router
}
