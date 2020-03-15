import express from "express"
import user from "../../services/user"

export const login = () => {
    const router = express.Router()
    router.post('/login', async (req, res, next) => {
        try {
            if (typeof req.body.username === 'string' && typeof req.body.password === 'string') {
                const result = await user.getUserWithUsernameAndPass(req.body.username, req.body.password)
                req.session.user = result.success ? result : null
                res.json(result)
            }
            else {
                res.json({success: false})
            }
        }
        catch (e) {
            next(e)
        }
    })
    return router
}
