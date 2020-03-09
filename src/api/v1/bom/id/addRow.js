import express from 'express'
import bom from '../../../services/bom'

export const addRow = () => {
    const router = express.Router()
    router.post('/:bomId', (req, res, next) => {

        const bomId = parseInt(req.params.bomId)
        if (!isNaN(bomId)) {
            bom.addRow(bomId).then((result) => {
                res.json(result)
            })
        }
        else {
            // bomId was not a number
            res.status(400).end()
        }
    })
    return router
}
