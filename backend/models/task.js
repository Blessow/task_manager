import mongoose from 'mongoose';

const taskschema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref: 'User'},
    title:{ type: String, required: true },
    description:{ type: String, required: true },
    status:{ type: String,enum:['pending','completed'],default:'pending'},
    createdAt:{ type: Date,default: Date.now }
});

export default mongoose.model('Task',taskschema);