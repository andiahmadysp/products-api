import 'dotenv/config';
import express from 'express';
import productRoutes from "./src/routes/products.js";
import {connectDB} from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT;

// connect to database
connectDB();

// allow client to send json
app.use(express.json());

// allow cors
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(cookieParser())


// register routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);


app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});