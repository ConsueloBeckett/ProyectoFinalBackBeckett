import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { hashPass, validPass } from "../utils.js";
import UserService from "../services/UserService.js";

const LocalStrategy = local.Strategy
const userService = new UserService()

const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        console.log("Loading user:", req.body)

        try {
            const { name, surname, email, role } = req.body
            console.log(`User data: ${name}, ${surname}, ${email}, ${role}`)
            let user = await userService.findEmail({ email: username })
            console.log(`User en passport.use /register: ${user}`)
            if (user) {
                console.log("User already exists");
                return done(null, false, { message: "User already exists" })
            }
            const hashedPassword = await hashPass(password)
            console.log("Hashed password:", hashedPassword)
            const newUser = { name, surname, email, password: hashedPassword, role }
            console.log("New user:", newUser)
            let result = await userService.addUser(newUser)
            return done(null, result)
        } catch (e) {
            console.log("Error Loading user:", e)
            return done("Error getting the user", e)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.getUserById(id)
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    })

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userService.findEmail({ email: username })
            console.log("User found:", user)

            if (!user) {
                return done(null, false, { message: "User not found" })
            }
            const validOk = validPass(user, password)
            console.log("Password validation result:", validOk)

            if (!validOk) {
                return done(null, false, { message: "Wrong password" })
            }
            console.log("Login successful:", user)
            return done(null, user)
        } catch (e) {
            console.error("Error in login strategy:", e)
            return done(e)
        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.0eb72f4d05f0f861",
        clientSecret: "6e856786aa6760bfaae9e7f38cf446d9af0132e8",
        callbackURL: "http://localhost:8080/api/users/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value
            let name = profile.displayName

            if (email && email.length > 0) {
                let user = await userService.findEmail({ email: email })
                console.log(`User en passport.use /github: ${user}`)

                if (!user) {

                    let newUser = {
                        name: name,
                        email: email,
                        password: "",
                        role: "admin"
                    }
                    let newUserJson = JSON.stringify(newUser)

                    let result = await userService.addUser(newUser)
                    return done(null, result)
                } else {
                    return done(null, user)
                }

            } else {
                return done(null, false, { message: "User not found at GitHub" })
            }
        } catch (e) {
            return done(e)
        }
    }))
}

export default initializePassport