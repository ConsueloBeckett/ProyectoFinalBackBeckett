import UserService from "../services/UserService.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import { hashPass, validPass } from "../utils.js";
import mailer from "../services/nodemailer.js";
import jwt from "jsonwebtoken";
import initiateResetToken from "../services/token.js";

const { sendMail } = mailer;
const userService = new UserService();

export async function registerUser(req, res, next) {
    try {
        req.logger.info("Registering user...");
        const { name, surname, email, password, role } = req.body;
        if (!name || !surname || !email || !password || !role) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: USER_NOT_CREATED,
                    message: "The user could not be created"
                })
            )
        }
        res.redirect("/login");
    } catch (error) { res.status(500).send("Error registering user: " + error.message); }

}

export async function loginUser(req, res) {
    try {
        let user = req.user
        req.session.email = user.email
        req.session.role = user.role
        req.session.name = user.name
        req.session.surname = user.surname
        req.session.age = user.age;
        req.session.user = user;
        req.session.last_connection = user.last_connection;
        if (user.role === "admin") {

            res.redirect("/api/users/profile")
        } else {

            res.redirect("/api/products")
        }
        req.logger.info("Session established:", req.session.user);

    } catch (error) {
        res.status(500).json("Invalid username or password")
    }
}

export async function logoutUser(req, res) {
    try {
        console.log("Enter logoutUser")
        let user = req.session.user
        user.last_connection = new Date();
        await userService.updateUser(user._id, user);
        console.log("User logged out:", user.name + " last connection: " + user.last_connection);
        req.session.destroy()
        res.redirect("/login")
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function handleGitHubCallback(req, res) {
    try {
        req.session.user = req.user;
        req.session.email = req.user.email;
        req.session.role = req.user.role;

        res.redirect("/api/users/profile");
    } catch (error) {
        res.status(500).json("Error during GitHub authentication");
    }
}

export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json("The user does not exist");
        }
        const resetToken = initiateResetToken({ userId: user.id, email: user.email });
        const resetUrl = `http://localhost:8080/api/users/createPass/${resetToken}`;
        const emailOptions = {
            from: "mconsuelobeckett@gmail.com",
            to: email,
            subject: "Reset Password",
            html: `<p>To change your password, click on the following link: <a href="${resetUrl}">${resetUrl}</a></p>
<p>Reset token: ${resetToken}</p>`
        }

        await sendMail(emailOptions);
        return res.render("confirmedMail", {
            title: "Reset Mail",
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

export async function renderPas(req, res) {
    const token = req.params.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    res.render("createPass", {
        title: "Reset Password",
        email: email,
        token: token
    });
}

export async function resetPassword(req, res) {
    const { password, confirmedPassword } = req.body;
    const token = req.params.token;
    if (password !== confirmedPassword) {
        return res.status(400).json("Passwords do not match");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await userService.getUserByEmail(email);
        const id = user.id;

        if (!user) {
            return res.status(404).json("The user does not exist");
        }

        if (await validPass(password, user.password)) {
            return res.status(400).json("The password cannot be the same as the previous one");
        }
        const hashedPassword = await hashPass(password);
        const updatedUser = { password: hashedPassword };
        await userService.updateUser(id, updatedUser);

        return res.render("confirmedReset", {
            title: "Reset Password"
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function changeRole(req, res) {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json("User ID is required");
        }
        const user = await userService.getUserById(uid);
        if (!user) {
            return res.status(404).json("The user does not exist");
        }

        let updatedUser;
        const documents = user.documents;
        const documentAmount = documents.length;
        const role = user.role;
        if (role === "user" && quantityDocuments >= 3) {
            updatedUser = { role: "premium" };
            req.session.user.role = "premium";
            console.log("The user updated in session is ", req.session.user.role);
        }
        else {
            updatedUser = { role: "user" };
            req.session.user.role = "user";
            console.log("The user updated in session is ", req.session.user.role);

        }
        await userService.updateUser(uid, updatedUser);
        return res.redirect("/api/users/profile");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function uploadDocuments(req, res) {
    if (!req.files) {
        return res.status(400).send({ status: "error", message: "No file uploaded" });
    }
    console.log("The files are ", req.files);
    let user = req.session.user;
    console.log("The user is ", user);
    user.documents = req.files;
    await userService.updateUser(user._id, user);
    res.send({ status: "success", message: "Files uploaded successfully" });
}

export async function requestAllUsers(req, res) {
    if (req.session.user == undefined || req.session.user.role !== "admin") {
        return res.status(403).json("You do not have permissions to perform this action");
    }
    try {
        let users = await userService.getUsers();
        if (!users) {
            return res.status(404).json("No users found");
        }
        users = users.map(user => new UserDTO(user));
        return res.render("users", {
            title: "User List",
            users: users
        })
    }
    catch (error) {
        req.logger.error("Error in path /allUsers:", error);
        return res.status(500).json(error);
    }
}

export async function deleteOldUsers(req, res) {
    try {
        const users = await userService.getUsers();
        console.log("Enter deleteOldUsers");
        if (!users) {
            return res.status(404).json("No users found");
        }
        const currentDate = new Date();
        const oldUsers = users.filter(user => {
            const lastConnection = user.last_connection;
            const diff = currentDate - lastConnection;
            const days = diff / (1000 * 60 * 60 * 24);
            return days > 2;
        });
        if (oldUsers.length === 0) {
            return res.status(404).json("No old users");
        }
        oldUsers.forEach(async user => {
            let id = user._id;
            let email = user.email;
            await userService.deleteUser(id);
            const emailOptions = {
                from: "email@admin",
                to: email,
                subject: "Account deleted",
                html: `<p>Dear user, your account has been deleted due to inactivity</p>`
            };
            await sendMail(emailOptions);
            console.log("The user with email ", email, " has been deleted");
        });
        const ids = oldUsers.map(user => user._id);
        await userService.deleteUser(ids);

        return res.status(200).json("Users successfully deleted");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}






