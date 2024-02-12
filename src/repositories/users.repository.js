import userModel from "../dao/model/user.model.js"
import cartModel from "../dao/model/cart.model.js"

class UserRepository extends userModel {
    constructor() {
        super()
    }

    findUser = async (email) => {
        try {
            const user = await userModel.findOne({ email }, { email: 1, password: 1, role: 1, name: 1, surname: 1 })
            if (!user) {
                return "User not found"
            }
            return user;
        } catch (e) {
            console.log("Error finding user: ", e)
            return e
        }}

    addUser = async (user) => {
        try {
            const newUser = await userModel.create(user)
            const newCart = await cartModel.create({ userId: newUser._id, products: [] });
            newUser.cart = newCart._id;
            await newUser.save();
            return newUser;
        } catch (e) {
            console.log("Error to addd user: ")
            return e
        }}

        obtainUsers = async () => {
            try {
                const users = await userModel.find();
                return users;
            } catch (error) {
                req.logger.error("Error to obtain the user: ");
                return error;
            }
        }

  obtainUsersById = async () => {
    try {
        const users = await userModel.findById(id)
        return users
    } catch (e) {
        req.logger.error("Error obtaining users hy id: ", e)
        return e
    }}

obtainUserByEmail = async (param) => {
    try {
        const email = await userModel.findOne({ email: email });
        return email
    } catch (e) {
        req.logger.error("Error obtaining user by email: ", e)
        return e
    }
}

updateUser = async (id, user) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, user);
        return updatedUser;
    } catch (error) {
        req.logger.error("Error to upddate the user: ");
        return error;
    }
}

deleteUser = async (id) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        return deletedUser;
    } catch (error) {
        req.logger.error("Error al eliminar usuario: ");
        return error;
    }
}

validateUser = async (email, password) => {
    try {
        const user = await userModel.findOne({ email: email, password: password });
        return user;
    }
    catch (error) {
        req.logger.error("Error al validar usuario: ");
        return error;
    }
}



findEmail = async (param) => {
    try {
        const email = await userModel.findOne(param);
        return email;
    } catch (error) {
        req.logger.error("Error finding email: ", error);
        return error;
    }
}

}

export default UserRepository;