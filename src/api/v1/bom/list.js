import express from 'express'
import bom from '../../services/bom'

export const list = () => {
    const router = express.Router()
    router.get('/', async (req, res, next) => {
        const userId = parseInt(req.session.user.id)
        if (!isNaN(userId) ) {
            const result = await bom.listBoms(userId)
            res.json(result)
        }
        else {
            res.json({success: false})
        }
    })
    return router
}
