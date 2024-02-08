import  UserService  from "../services/UserService.js";
import { hashPass, validPass } from "../utils.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dao/DTOs/user.dto.js';

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const exists = await  UserService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await hashPass(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await  UserService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {

    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await UserService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
    const isValidPassword = await validPass(user, password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
}
const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const userDto = UserDTO.getUserTokenFrom({ _id: user._id });
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await validPass(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
    res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}