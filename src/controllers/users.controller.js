//import UserService from "../services/UserService";
//const UserService = new UserService()

export async function registerUser(req, res) {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        if (!first_name || !last_name || !email || !password || !role) {
            console.error("Missing data")
            res.status(400).send("Missing data")
        }
        res.redirect("/login")
    } catch (e) 
    { res.status(500).send("Error to register to user: " + e.message)
}}

export async function loginUser(req, res) {
    try {
        let user = req.user
        if (user.role === "admin") {
            req.session.email = user.email
            req.session.role = user.role
            req.session.first_name = user.first_name
            req.session.last_name = user.last_name
            req.session.age = user.age;
            req.session.user = user;
            res.redirect("/api/users/profile")
        } else {
            req.session.email = user.email
            req.session.role = user.role
            req.session.first_name = user.first_name
            req.session.last_ame = user.last_name
            req.session.age = user.age;
            req.session.user = user;
            res.redirect("/api/products")
        }
        console.error("Session established:", req.session.user)

    } catch (e) {
        res.status(500).json("User or password incorrecrt")
    }
}

export async function logoutUser(req, res) {
    try {
        req.session.destroy()
        res.redirect("/login")
    } catch (e) {
        res.status(500).json(e)
    }
}

export async function handleGitHubCallback(req, res) {
    try {
        req.session.user = req.user;
        req.session.email = req.user.email;
        req.session.role = req.user.role;

        res.redirect("/api/users/profile");
    } catch (error) {
        res.status(500).json("Error during GitHub authentication")
    }
}