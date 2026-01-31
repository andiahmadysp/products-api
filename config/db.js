import mongoose from "mongoose";


export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database connected!');
    } catch (e) {
        console.log('Connection to database failed!: ', e.message);
        process.exit(0);
    }
}

