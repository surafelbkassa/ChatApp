import express from 'express';
import router from '../routes/auth.route.js'; 
import dotenv from 'dotenv';
import {connectDB} from '../lib/db.js';
dotenv.config();

const PORT  = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api/auth", router);

app.listen(PORT, () => {
    console.log("Server is running on port:" + PORT);  
    connectDB();
});