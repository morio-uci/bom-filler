import express from "express"

export const logout = () => {
    const router = express.Router()
    router.get('/logout', (req, res, next) => {
        if(req.session.user) {
            req.session.user = null
            res.json({success: true})
        } {
            res.json({success: false})
        }
    })
    return router
}
