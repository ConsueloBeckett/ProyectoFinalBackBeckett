const authorizedRoles = (allowedRoles) => {
    return (req, res, next) => {
        const currentUser = req.user
        if (!currentUser || !allowedRoles.includes(currentUser.role)) {
            return res.status(403).send("Access not authorized")
        }
        next()
    }}

export default authorizedRoles