import express from "express"
import passport from "passport"
import { registerUser, loginUser, logoutUser, handleGitHubCallback, requestAllUsers, requestPasswordReset,renderPas, resetPassword, changeRole, discardOldUsers, uploadDocuments } from "../controllers/users.controller.js"
import UserDTO from "../dao/DTOs/user.dto.js"
import uploadAgent from "../services/multer.js"


const userRouter = express.Router()

userRouter.post("/register",
    passport.authenticate("register",
        { failureRedirect: "api/users/failregister" }), registerUser
)

userRouter.get("/failregister", async (req, res) => {
    req.logger.error("Failed Strategy")
    res.send({ error: "Failed" })
})

userRouter.post("/login",
    passport.authenticate("login",
        { failureRedirect: "/fail login" }), loginUser
)

userRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" })
})

userRouter.get("/logout", logoutUser)

userRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {
    req.logger.error("Redirecting to GitHub for authentication")
})

userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGitHubCallback)

userRouter.get("/profile", async (req, res) => {
    try {
        let user = req.session.user

        if (!user || !user.email) {
            res.redirect("/login")
        }
        const userData = {
            email: user.email,
            role: user.role,
            id: user._id,
        }
        let isAdmin = false;
        let isAuthorized = false;

        if (user.role === "admin") {
            isAdmin = true;
            isAuthorized = true;
        } else if (user.role === "premium") {
            isAdmin = false;
            isAuthorized = true;
        }

       return res.render("profile", {
            title: "User profile",
            user: userData,
            isAdmin: isAdmin,
            isAuthorized: isAuthorized,
            cartId: cartId
        })
    }
    catch (e) {
        req.logger.error("Error at the rute /profile:", e)
        return res.status(500).json(e)
    }
})

userRouter.get("/current", async (req, res) => {
    try {
        let user = req.session.user

        if (!user || user == null || user == undefined) {
            req.logger.error("No se encontró el usuario")
            return res.redirect("/login")
        }
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            age: user.age,
            password: user.password,
            cart: user.cart,
            role: user.role
        }

        const userSafe = new UserDTO(userData).toSafeObject()

         return res.render("current", {
            title: "Profile user",
            user: userSafe
        })
    }
    catch (e) {
        req.logger.error("Error at the rute /current", e)
        res.status(500).json(e)
    }
})

userRouter.get("/allUsers", requestAllUsers)

userRouter.post("/request-password", requestPasswordReset)

userRouter.get("/createPass/:token", renderPas)

userRouter.post("/createPass/:token", resetPassword)

userRouter.get("/premium/:uid", changeRole)

userRouter.post("/:uid/documents", uploadAgent.array("documents"), uploadDocuments)

userRouter.post("/discardOldUsers", discardOldUsers)

export default userRouter