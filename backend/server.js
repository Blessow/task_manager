import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
mongoose.connect(process.env.DATABASE).then(()=>{
    console.log('Mogodb connected Successfully')
}).catch((err)=>{ console.log(err)});

const userSchema = new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    password:{ type: String, required: true }
});

const User = mongoose.model('User',userSchema);

app.post('/register',async (req,res)=>{
    try{
        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({ message: 'Username and Password are required' });
        }
        const existUser = await User.findOne({username});
        if(existUser){
            return res.status(400).json({ message: 'Username already exists' });
        }
        const newUser = await User.create({username,password});
        res.status(201).json({message: `Account Created Successfully,Welcome ${username}`});
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

app.post('/login',async (req,res)=>{
    try{
        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({ message: 'Username and Password are required' });
        }
        const user = await User.findOne({username,password});
        if(!user){
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        res.status(200).json({ message: `Login Successful,Welcome back ${username}`,userId: user._id,username: user.username });
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

const taskschema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref: 'User'},
    title:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String,enum:['pending','completed'],default:'pending'},
    createdAt:{ type: Date,default: Date.now }
});

const Task = mongoose.model('Task',taskschema);

app.get('/tasks',async(req,res)=>{
    try{
        const {userId} = req.query;
        const tasks = await Task.find({userId});
        res.status(200).json(tasks);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

app.post('/tasks',async(req,res)=>{
    try{
        const {title,description,userId} = req.body;
        if(!title || !description || !userId){
            return res.status(400).json({ message: 'Title,Description and UserId are required' });
        }
        const newTask = await Task.create({ title,description,userId });
        res.status(201).json(newTask); 
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

app.put('/tasks/:id',async(req,res)=>{
    try{
        const {userId} = req.body;
        const {id} = req.params;
        const updatedTask = await Task.findOneAndUpdate({ _id: id, userId: userId }, req.body, { new: true, runValidators: true });
        if(!updatedTask){
            res.status(404).json({ message: 'Task not found' });
        }else{
            res.status(200).json(updatedTask);
        }
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

app.delete('/tasks/:id',async(req,res)=>{
    try{
        const {userId} = req.body;
        const {id} = req.params;
        const DeletedTask = await Task.findOneAndDelete({ _id: id, userId: userId });
        if(!DeletedTask){
            res.status(404).json({ message: 'Task not found' });
        }
        else{
            res.status(200).json({ message: 'Task deleted successfully' });
        }
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});