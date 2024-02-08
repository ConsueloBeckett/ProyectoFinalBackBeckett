import UserDTO from "../dao/DTOs/user.dto.js";

class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    getUsers = async () => {
        try {
            const users = await this.userModel.find();
            return users;
        } catch (error) {
            console.error("Error obtaining users: ", error);
            return error;
        }
    }

    createUser = async (user) => {
        try {
            const userToInsert = new UserDTO(user);
            const newUser = await this.userModel.create(userToInsert);
            return newUser;
        } catch (error) {
            console.error("Error adding user: ", error);
            return error;
        }
    }

    getRolUser = async (email) => {
        try {
            const user = await this.userModel.findOne({ email }, { email: 1, password: 1, role: 1, name: 1, surname: 1 });
            if (!user) {
                return "User not found";
            }
            return user;
        } catch (error) {
            console.error("Error finding user: ", error);
            return error;
        }
    }

    updUserRol = async ({ uid, rol }) => {
        try {
            console.log(uid);
            console.log(rol);
            const result = await this.userModel.updateUserRoleById({ uid, rol });
            return result;
        } catch (error) {
            console.error("Error updating user role: ", error);
            return error;
        }
    }

    findEmail = async (param) => {
        try {
            const email = await this.userModel.findOne(param);
            return email;
        } catch (error) {
            console.error("Error finding email: ", error);
            return error;
        }
    }

    obtainUserByEmail = async (email) => {
        try {
            const user = await this.userModel.findOne({ email });
            return user;
        } catch (error) {
            console.error("Error obtaining user by email: ", error);
            return error;
        }
    }
}

export default UserRepository;
