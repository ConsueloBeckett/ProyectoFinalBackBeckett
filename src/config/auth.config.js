const authorizedRole = (role) => {
    return (req, res, next) => {
        const currentUser = req.user
        if (!currentUser || currentUser.role !== role) {
            return res.status(403).send("Access not authorized")
        }
        next()
    }}

export default authorizedRole