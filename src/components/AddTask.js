import './TaskManager.css';
import {use, useState} from 'react';
import {useNavigate} from 'react-router-dom';


const AddTask = () => {
    const [title,setTitle]=useState('');
    const [description,setDescription]= useState("");
    const navigate = useNavigate(); 

    const userId = localStorage.getItem('userId');
    
    const addingtask = async(e)=>{
        e.preventDefault();
        try{
            const res = await fetch('http://localhost:5000/tasks',{
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({title,description,userId})
            });
            if(res.ok){
                alert('Task Added Successfully');
                navigate('/dashboard');
            }else{
                const data = await res.json();
                alert(data.message);
            }
        }catch(err){
            console.log(err);
            alert('Something went Wrong');
        }
    };

    return (
        <div className="add-task">
            <h2>Add Task</h2>
            <form onSubmit={addingtask}>
                <label>Title:</label><input type='text' value = {title} onChange={(e)=>setTitle(e.target.value)} required/><br></br>
                <label>Description:</label><textarea value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea><br></br>
                <button type='submit'>Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;