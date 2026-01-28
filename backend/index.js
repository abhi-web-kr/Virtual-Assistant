import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRouter from './routes/user.routes.js';


const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: "https://virtual-assistant-frontend-5pj8.onrender.com",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// app.get("/", (req, res) => {
//     res.send("server is running...")
// });


app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
})
