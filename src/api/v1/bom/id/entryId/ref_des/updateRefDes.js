import express from 'express'
import bom from '../../../../../services/bom'

export const updateRefDes = () => {
    const router = express.Router()
    router.patch('/:bomId/:entryId/ref-des', (req, res, next) => {
        const entryId = parseInt(req.params.entryId)
        if (!isNaN(entryId)) {
            bom.updateRefDes(entryId, req.body.refDes).then((result) => {
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
