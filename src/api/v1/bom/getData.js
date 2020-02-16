import express from 'express'
import bom from '../../services/bom'

export const getData = () => {
    const router = express.Router()
    router.get('/:bomId', (req, res, next) => {
        const bomId = parseInt(req.params.bomId)
        if (!isNaN(bomId)) {
            bom.getAllTableData(bomId).then((result) => {
                if(result.success)
                {
                    res.json(result.data)
                    next()
                }
                else
                {
                    // couldn't find bomId
                    res.status(404).end()
                }
            })
        }
        else {
            // bomId was not a number
            res.status(400).end()
        }
    })
    return router
}
