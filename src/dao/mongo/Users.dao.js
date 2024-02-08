import userModel from "../model/user.model.js";


export default class Users {

    // Get all users
    get = (params) => {
        return userModel.find(params);
    }

    // Get a user by filters
    getBy = (params) => {
        return userModel.findOne(params);
    }

    // Create a new user
    save = (doc) => {
        return userModel.create(doc);
    }

    // Update a user by ID
    update = (id, doc) => {
        return userModel.findByIdAndUpdate(id, { $set: doc });
    }

    // Delete a user by ID
    delete = (id) => {
        return userModel.findByIdAndDelete(id);
    }

    // Get all users with specific fields (_id, first_name, email, rol)
    getUsersWithSpecificFields = async () => {
        try {
            let users = await userModel.find().select('_id first_name email rol');
            return users;
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }

    // Get a user by ID
    getUserById = async (id) => {
        try {
            const user = await userModel.findById(id).lean();
            if (!user) {
                return 'User not found';
            }
            return user;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    // Find a user by email
    findEmail = async (param) => {
        try {
            const user = await userModel.findOne(param);
            return user;
        } catch (error) {
            console.error('Error searching for email:', error);
            throw error;
        }
    }

    // Add a new user
    addUser = async (userData) => {
        try {
            let userCreate = await userModel.create(userData);
            return userCreate;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Get the role of a user by email
    getUserRoleByEmail = async (email) => {
        try {
            const user = await userModel.findOne({ email });

            if (user && user.rol === 'premium') {
                return 'premium';
            } else {
                return "user with another role";
            }
        } catch (error) {
            console.error('Error getting user role:', error);
            throw error;
        }
    };

    // Get the ID cart of a user by email
    getIdCartByEmailUser = async (email) => {
        try {
            const user = await userModel.findOne({ email });

            if (user && user.id_cart) {
                return user.id_cart;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting user role:', error);
            throw error;
        }
    };

    // Update the password of a user by email
    updatePassword = async (email, newPassword) => {
        try {
            const updatedUser = await userModel.findOneAndUpdate(
                { email: email },
                { $set: { password: newPassword } },
                { new: true }
            );

            if (updatedUser) {
                return updatedUser;
            } else {
                console.error('User not found');
            } 
        } catch (error) {
                console.error('User not found:', error);
                throw error;
            }
        }
    }