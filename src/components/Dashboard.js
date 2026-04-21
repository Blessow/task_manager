import './TaskManager.css';
import {useState,useEffect} from "react";
import { data } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

const Dashboard = () => { 
    const [tasks,setTasks]=useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(()=>{
        fetch(`http://localhost:5000/tasks?userId=${userId}`)
        .then(res=>res.json()).then(data=>setTasks(data))
        .catch(err=>console.log(err));
    },[]);

    const deleteTask =async (id)=>{
        await fetch(`http://localhost:5000/tasks/${id}`,{
            method: "DELETE",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({userId})
        });
        setTasks(tasks.filter(task=>task._id!==id)); 
    }

    const completedTask = async(id)=>{
        await fetch(`http://localhost:5000/tasks/${id}`,{
            method: "PUT",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({userId,status:"completed"})
        });
        setTasks(tasks.map(task=>task._id===id?{...task,status:"completed"}:task));
    };

    const logout = () =>{
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            {tasks.length===0? 
            <p>No Tasks Available</p> : 
            tasks.map(task=>(
                <div key ={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status :{task.status}</p>
                    <button onClick={()=>deleteTask(task._id)}>Delete Task</button>
                    <button onClick={()=>completedTask(task._id)}>Mark as Completed</button>
                </div>
            ))
            }
            <button onClick={()=>navigate('/addTask')}>Add Task</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;