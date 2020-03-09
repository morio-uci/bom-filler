import express from "express"

export const auth = () => {
    const router = express.Router()
    router.get('/auth', async (req, res,) => {
        if(req.session.user) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
    })
    return router
}
