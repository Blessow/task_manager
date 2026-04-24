import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authroutes.js';
import taskRoutes from './routes/taskroutes.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

mongoose.connect(process.env.DATABASE).then(()=>{
    console.log('Mogodb connected Successfully')
}).catch((err)=>{ console.log(err)});

app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});