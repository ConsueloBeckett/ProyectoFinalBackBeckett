import passport from "passport";
import local from 'passport-local';
import UserService from "../services/UserService.js";
import { hashPass, validPass } from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

const userService = new UserService();


const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {

        try {
            const { name, surname, email, role } = req.body;
            let user = await userService.findEmail({ email: username });
    
            if (user) {
                return done(null, false, { message: "User already exists" });
            }
            const hashedPassword = await hashPass(password);
            const newUser = { name, surname, email, password: hashedPassword, role };
            let result = await userService.addUser(newUser);
            return done(null, result);
        } catch (error) {
    
            return done("Error getting the user", error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user);
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.obteinUserById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userService.findEmail({ email: username });
           logger.log("User found:", user);

            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            const isValid = await validPass(user, password);
            logger.log("Password validation result:", isValid); 

            if (!isValid) {
                return done(null, false, { message: "Wrong password" });
            }
            user.last_connection = new Date();
            await userService.updateUser(user._id, user);
            logger.log("Login successful. Authenticated user");
            return done(null, user);
        } catch (error) {
            console.error("Error in login strategy:", error);
            return done(error);
        }
    }))


    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.0eb72f4d05f0f861",
        clientSecret: "6e856786aa6760bfaae9e7f38cf446d9af0132e8",
        callbackURL: "http://localhost:8080/api/users/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            let name = profile.displayName;

            if (email && email.length > 0) {
                let user = await userService.findEmail({ email: email });               

                if (!user) {

                    let newUser = {
                        name: name,
                        email: email,
                        password: "",
                        role: "admin"
                    }
                    let result = await userService.addUser(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }

            } else {
                return done(null, false, { message: "User not found in GitHub" });
            }
        } catch (error) {
            return done(error);
        }
    }))

};

export default initializePassport;
