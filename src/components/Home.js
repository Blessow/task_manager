import './TaskManager.css';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const [username,setusername] = useState('');
    const [password,setpassword] = useState('');
    const [isLogin,setisLogin] = useState(true);
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();

        setError("");
        setLoading(true);

        const url = isLogin? 'http://localhost:5000/api/auth/login':'http://localhost:5000/api/auth/register';
        try{
            const res = await fetch(url,{
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,password})
            });
            const info = await res.json();
            if(!res.ok){
                setError(info.message);
                return;
            }
            if(isLogin){
                localStorage.setItem("token",info.data.token);
                navigate('/dashboard');
            }else{
                setisLogin(true);
                setError("Account Created Successfully, Please Login");
            }
            console.log("TOKEN STORED:", info.data.token);
        }catch(err){
            setError('Something went Wrong');
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <h2>{isLogin? 'Task Manager Login': 'Task Manager Register'}</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>UserName</label>
                    <input type="text" placeholder="Enter Username" value={username} 
                    onChange={
                        (e) => setusername(e.target.value)
                    }/>
                <br></br>
                <label>Password</label>
                    <input type="password" placeholder="Enter Password" value={password} 
                    onChange = {
                        (e)=>setpassword(e.target.value)
                    } />
                <br></br>
                <button type="submit">{isLogin? 'Login':'Register'}</button>
                <h5>{isLogin?"Don't have an account? " :"Already have an account? "}
                    <span onClick={
                        ()=>setisLogin(!isLogin)
                    } 
                    style={{
                        color:'blue',
                        textDecoration:'underline',
                        cursor:'pointer'}}>
                    {isLogin? 'Register':'Login'}
                    </span>
                </h5>
            </form> 
        </div>
    );
};

export default Home;