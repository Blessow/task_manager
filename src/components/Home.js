import './TaskManager.css';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const [username,setusername] = useState('');
    const [password,setpassword] = useState('');
    const [isLogin,setisLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const url = isLogin? 'http://localhost:5000/login':'http://localhost:5000/register';
        try{
            const res = await fetch(url,{
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,password})
            });
            const info = await res.json();
            if(res.ok){
                if(isLogin){
                    localStorage.setItem('userId',info.userId);
                    alert(info.message);
                    navigate("/dashboard");
                }
                else{
                    alert(info.message);
                    setisLogin(true);
                }
            }
            else{
                alert(info.message);
            }
        }catch(err){
            alert('Something went Wrong');
        }
    } 
    return (
        <div className="home">
            <h2>{isLogin? 'Task Manager Login': 'Task Manager Register'}</h2>
            <form onSubmit={handleSubmit}>
                <label>UserName</label><input type="text" placeholder="Enter Username" value={username} onChange={(e) => setusername(e.target.value)}/><br></br>
                <label>Password</label><input type="password" placeholder="Enter Password" value={password} onChange = {(e)=>setpassword(e.target.value)} /><br></br>
                <button type="submit">{isLogin? 'Login':'Register'}</button>
                <h5>{isLogin?"Don't have an account? " :"Already have an account? "}
                    <span onClick={()=>setisLogin(!isLogin)} style={{color:'blue',textDecoration:'underline',cursor:'pointer'}}>
                    {isLogin? 'Register':'Login'}
                    </span>
                </h5>
            </form> 
        </div>
    );
};

export default Home;