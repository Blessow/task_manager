import './TaskManager.css';
import {useState,useEffect} from "react";
import {useNavigate} from 'react-router-dom';

const Dashboard = () => { 
    const [tasks,setTasks]=useState([]);
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    console.log("TOKEN IN DASHBOARD:", token);

    useEffect(()=>{
        if(!token){
            navigate('/');
        }
    },[]);
    useEffect(()=>{
        const fetchTasks = async()=>{
            try{
                setError("");
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/tasks`,{
                    headers: {"Authorization": `Bearer ${token}`}
                });
                const data = await res.json();
                if(!res.ok){
                    setError(data.message);
                    return;
                }
                setTasks(data.data);
            }catch(err){
                setError("Failed to fetch Tasks");
            }finally{
                setLoading(false);
            }
        };
        fetchTasks();
    },[]);
    const deleteTask =async (id)=>{
        try{
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`,{
                method: "DELETE",
                headers: {'Content-Type':'application/json',
                            "Authorization": `Bearer ${token}`},
            });
            const data = await res.json();
            if(!res.ok){
                setError(data.message);
                return;
            }

            setTasks(tasks.filter(task=>task._id!==id)); 
        }catch(err){
            setError("Failed to delete Task");
        }
    }

    const completedTask = async(id)=>{
        try{
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`,{
                method: "PUT",
                headers: {'Content-Type':'application/json',
                            "Authorization": `Bearer ${token}`},
                body: JSON.stringify({status:"completed"})
            });
            const data = await res.json();
            if(!res.ok){
                setError(data.message);
                return;
            }
            setTasks(tasks.map(task=>task._id===id?{...task,status:"completed"}:task));
        }catch(err){
            setError("Failed to update Task");
        }
    };

    const logout = () =>{
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ?(
                 <p>Loading Tasks...</p> ):
            tasks.length===0? 
            <p>No Tasks Available.Add your Tasks</p> : 
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
            <button onClick={()=>navigate('/add_task')}>Add Task</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;