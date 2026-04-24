import Task from '../models/task.js';

export const getTasks =async(req,res)=>{
    try{
        const userId = req.userId;
        const tasks = await Task.find({userId});
        return res.status(200).json({
            success:true,
            message: "Tasks fetched successfully",
            data: tasks}
        );
    }catch(err){
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

export const createTask =async(req,res)=>{
    try{
        const {title,description} = req.body;
        const userId = req.userId;
        if(!title || !description){
            return res.status(400).json({
                success: false, 
                message: 'Title and Description are required' 
            });
        }
        const newTask = await Task.create({ title,description,userId });
        return res.status(201).json({
            success:true,
            message: "Tasks created successfully",
            data: newTask}
        );
    }catch(err){
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

export const updateTask =async(req,res)=>{
    try{
        const userId = req.userId;
        const {id} = req.params;
        const updatedTask = await Task.findOneAndUpdate({ _id: id, userId: userId }, req.body, { new: true, runValidators: true });
        if(!updatedTask){
            return res.status(404).json({ 
                success: false,
                message: 'Task not found' 
            });
        }
        return res.status(200).json({
        success:true,
        message: "Tasks updated successfully",
        data: updatedTask}
        );
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message 
        });
    }
};

export const deleteTask =async(req,res)=>{
    try{
        const userId = req.userId;
        const {id} = req.params;
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: userId });
        if(!deletedTask){
            return res.status(404).json({ 
                success: false,
                message: 'Task not found' 
            });
        }
        return res.status(200).json({ 
            success:true,
            message: 'Task deleted successfully' 
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message 
        });
    }
};