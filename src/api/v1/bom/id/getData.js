import express from 'express'
import bom from '../../../services/bom'

export const getData = () => {
    const router = express.Router()
    router.get('/:bomId', (req, res, next) => {
        const bomId = parseInt(req.params.bomId)
        if (!isNaN(bomId)) {
            bom.getAllTableData(bomId).then((result) => {
                if (result.success) {
                    if (req.session.user.id !== result.userId) {
                        // don't have permission to view these bomIds
                        res.status(401).end
                    }
                    else {
                        // happy path
                        res.json(result)
                    }
                } else {
                    // couldn't find bomId
                    res.status(404).end()
                }
            })
        } else {
            // bomId was not a number
            res.status(400).end()
        }
    })
    return router
}
