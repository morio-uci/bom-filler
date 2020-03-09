import express from "express"
import user from "../../services/user"

export const signUp = () => {
    const router = express.Router()
    router.post('/signup', async (req, res, next) => {
        try {
            if (typeof req.body.username === 'string'
                && typeof req.body.password === 'string'
                && typeof req.body.name === 'string'
                && typeof req.body.email === 'string'
            ) {
                const result = await user.createUser(req.body.username, req.body.name, req.body.email, req.body.password)
                req.session.user = result.success ? result : null
                res.json(result)

            } else {
                res.json({success: false})
            }
        }
        catch (e) {
            next(e)
        }

    })
    return router
}
