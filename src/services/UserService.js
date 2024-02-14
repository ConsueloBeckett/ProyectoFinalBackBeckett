import UserRepository from "../repositories/users.repository.js"

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    addUser = async (user) => {
        try {
            const newUser = await this.userRepository.addUser(user);
            if (!newUser) {
                return "User not added";
            }
            return newUser;
        } catch (error) {
            console.log("Error to add to the userService: ", error);
            return error;
        }
    }

    obteinUsers = async () => {
        try {
            const users = await this.userRepository.obteinUsers();
            if (!users) {
                return "there are not any users";
            }
            return users;
        } catch (error) {
            req.logger.error("Error to obtain users: ", error);
            return error;
        }
    }

    obteinUserById = async (id) => {
        try {
            const user = await this.userRepository.obteinUserById(id);
            if (!user) {
                return "User not found";
            }
            return user;
        } catch (error) {
            req.logger.error("Error to obtain by id: ", error);
            return error;
        }
    }

    obteinUserByEmail = async (email) => {
        try {
            const user = await this.userRepository.obteinUserByEmail(email);
            if (!user) {
                return "User not found";
            }
            return user;
        } catch (error) {
            req.logger.error("Error to obtain by id email: ", error);
        }
    }

    updateUser = async (id, user) => {
        try {
            const updatedUser = await this.userRepository.updateUser(id, user);
            if (!updatedUser) {
                return "User not updated";
            }
            return updatedUser;
        } catch (error) {
            req.logger.error("Error to update the user: ", error);
            return error;
        }
    }

    deleteUser = async (id) => {
        try {
            const deletedUser = await this.userRepository.deleteUser(id);
            if (!deletedUser) {
                return "User not deleted";
            }
            return deletedUser;
        } catch (error) {
            req.logger.error("Error to deleted the user: ", error);
            return error;
        }
    }

    validateUser = async (email, password) => {
        try {
            const user = await this.userRepository.validateUser(email, password);
            if (!user) {
                return "User not found";
            }
            return user;
        }
        catch (error) {
            req.logger.error("Error to validatet the user: ", error);
            return error;
        }
    }

    findUser = async (email) => {
        try {
            const user = await this.userRepository.findUser(email);
            if (!user) {
                return "User not found";
            }
            return user;
        } catch (error) {
            req.logger.error("Error to find the user: ", error);
            return error;
        }
    }

    findEmail = async (param) => {
        try {
            const email = await this.userRepository.findEmail(param);
            if (!email) {
                return null;
            }

            return email
        } catch (error) {
            req.logger.error("Error finding email: ", error);
            return error;
        }
    }

}

export default UserService