import express from "express"
import passport from "passport"
import { registerUser, loginUser, logoutUser, handleGitHubCallback, requestAllUsers, requestPasswordReset,renderPas, resetPassword, changeRole, discardOldUsers, uploadDocuments } from "../controllers/users.controller.js"
import UserDTO from "../dao/DTOs/user.dto.js"
import uploadAgent from "../services/multer.js"


const UserRouter = express.Router()

UserRouter.post("/register",
    passport.authenticate("register",
        { failureRedirect: "/api/users/failregister" }), registerUser
)

UserRouter.get("/failregister", async (req, res) => {
    req.logger.error("Failed Strategy")
    res.send({ error: "Failed" })
})

UserRouter.post("/login",
    passport.authenticate("login",
        { failureRedirect: "/faillogin" }), loginUser
)

UserRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" })
})

UserRouter.get("/logout", logoutUser)

UserRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {
    req.logger.error("Redirecting to GitHub for authentication")
})

UserRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGitHubCallback)

UserRouter.get("/profile", async (req, res) => {
    try {
        let user = req.session.user
        let cartId = req.session.cartId;

        if (!user || !user.email) {
            return res.redirect("/login")
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

UserRouter.get("/current", async (req, res) => {
    try {
        let user = req.session.user
        let cartId = req.session.cartId;


        if (!user || user == null || user == undefined) {
            req.logger.error("the user wasnt found")
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
            user: userSafe,
            cartId: cartId
        })
    }
    catch (e) {
        req.logger.error("Error at the rute /current", e)
        res.status(500).json(e)
    }
})

UserRouter.get("/allUsers", requestAllUsers)

UserRouter.post("/request-password", requestPasswordReset)

UserRouter.get("/createPass/:token", renderPas)

UserRouter.post("/createPass/:token", resetPassword)

UserRouter.get("/premium/:uid", changeRole)

UserRouter.post("/:uid/documents", uploadAgent.array("documents"), uploadDocuments)

UserRouter.post("/discardOldUsers", discardOldUsers)

export default UserRouter
