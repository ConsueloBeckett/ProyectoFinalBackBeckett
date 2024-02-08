import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.set('strictQuery', false) 

const connectMongo = async () => {
    try {
       mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to DB")
    } catch (error) {
        console.log("Error connecting to DB: ", error)
        process.exit()
    }}

export default connectMongo

