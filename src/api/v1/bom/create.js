import express from 'express'
import bom from '../../services/bom'

export const create = () => {
    const router = express.Router()
    router.post('/', async (req, res, next) => {
        const userId = parseInt(req.session.user.id)
        if (!isNaN(userId) && typeof req.body.name === 'string' && req.body.name.trim().length > 0) {
            const result = await bom.createBom(userId, req.body.name)
            res.json(result)
        }
        else {
            res.json({success: false})
        }
    })
    return router
}
