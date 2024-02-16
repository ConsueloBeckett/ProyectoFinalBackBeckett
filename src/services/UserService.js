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
            req.logger.error("Error to add to the userService: ", error);
            return error;
        }
    }

    obtainUsers = async () => {
        try {
            const users = await this.userRepository.obtainUsers();
            if (!users) {
                return "there are not any users";
            }
            return users;
        } catch (error) {
            req.logger.error("Error to obtain users: ", error);
            return error;
        }
    }

    obtainUserById = async (id) => {
        try {
            const user = await this.userRepository.obtainUserById(id);
            if (!user) {
                return "User not found";
            }
            return user;
        } catch (error) {
            req.logger.error("Error to obtain by id: ", error);
            return error;
        }
    }

    obtainUserByEmail = async (email) => {
        try {
            const user = await this.userRepository.obtainUserByEmail(email);
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

    discardUser = async (id) => {
        try {
            const discardedUser = await this.userRepository.discardUser(id);
            if (!discardedUser) {
                return "User not deleted";
            }
            return discardedUser;
        } catch (error) {
            req.logger.error("Error to deleted the user: ", error);
            return error;
        }
    }

    approveUser = async (email, password) => {
        try {
            const user = await this.userRepository.approveUser(email, password);
            if (!user) {
                return "User not found";
            }
            return user;
        }
        catch (error) {
            req.logger.error("Error to aprove the user: ", error);
            return error;
        }
    }

    assetUser = async (email) => {
        try {
            const user = await this.userRepository.assetUser(email);
            if (!user) {
                return "User not found";
            }
            return user;
        } catch (error) {
            req.logger.error("Error to find the user: ", error);
            return error;
        }
    }

    assetEmail = async (param) => {
        try {
            const email = await this.userRepository.assetEmail(param);
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

export default UserService;