import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/initialApp1DB`);
        console.log("connection successful");
    } catch (error) {
        console.log("Error caught from db/index.js while connecting to db");
        throw error;
    }
}
export default connectDB;