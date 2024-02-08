import UserRepository from "../repositories/users.repository.js"

class UserService {
    constructor() {
        this.userRepository = new UserRepository()
    }

    addUser = async (user) => {
        try {
            const newUser = await this.userRepository.addUser(user)
            if (!newUser) {
                return "User not added"
            }
            return newUser;
        } catch (e) {
            console.error("Error to add user: ", e)
            return e;
        }}

    obtainUsers = async () => {
        try {
            const users = await this.userRepository.obtainUsers()
            if (!users) {
                return "there is not users";
            }
            return users;
        } catch (e) {
            console.error("Error to obtain users: ", e)
            return e
        }}

    obtainUserById = async (id) => {
        try {
            const user = await this.userRepository.obtainUserById(id)
            if (!user) {
                return "User not found"
            }
            return user;
        } catch (e) {
            console.error("Error to obtain user by id: ", e)
            return e;
        }}

    obtainUserByEmail = async (email) => {
        try {
            const user = await this.userRepository.obtainUserByEmail(email)
            if (!user) {
                return "User not found"
            }
            return user
        } catch (e) {
            console.error("Error to obtain user by email: ", e)
        }}

    updateUser = async (id, user) => {
        try {
            const updatedUser = await this.userRepository.updateUser(id, user)
            if (!updatedUser) {
                return "Usuer not updated"
            }
            return updatedUser
        } catch (e) {
            console.error("Error to update user: ", e)
            return e;
        }}

    deleteUser = async (id) => {
        try {
            const deletedUser = await this.userRepository.deleteUser(id)
            if (!deletedUser) {
                return "User was not deleted"
            }
            return deletedUser
        } catch (e) {
            console.error("Users wasnt deleted: ", e)
            return e
        }}

    validateUser = async (email, password) => {
        try {
            const user = await this.userRepository.validateUser(email, password)
            if (!user) {
                return "User not validated"
            }
            return user;
        }
        catch (e) {
            console.error("Error, User not validated: ", e)
            return e
        }}

    findUser = async (email) => {
        try {
            const user = await this.userRepository.findUser(email)
            if (!user) {
                return "User not found"
            }
            return user;
        } catch (e) {
            console.error("Error User not found: ", e)
            return e
        }}

    findEmail = async (param) => {
        try {
            const email = await this.userRepository.findEmail(param)
            if (!email) {
                return null
            }

            return email
        } catch (e) {
            console.error("Error finding email: ", e)
            return e
        }}

}

export default UserService