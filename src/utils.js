import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"

export const hashPass = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validPass = (user, password) => {
    try {
        return bcrypt.compareSync(password, user.password)
    } catch (e) {
       
        return false;
    }
}

export const contrastPassword = (newPassword, oldPassword) => {
    try {
        return bcrypt.compareSync(newPassword, oldPassword);
    } catch (error) {
        return false;
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname