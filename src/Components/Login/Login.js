import React, { useContext, useEffect, useState } from 'react';
import "./Login.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';
import toast from 'react-hot-toast';
import { serverUrl } from '../CustomHook/ServerHook/serverUrl';
import useToken from '../CustomHook/useToken/useToken';
import ClockLoader from 'react-spinners/ClockLoader';

const Login = () => {
    const { login, googleLogin, user } = useContext(SharedData);
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading]= useState(false);
    const [token]= useToken(user?.email)
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    useEffect(()=>{
        if(token){
            navigate(from, {replace: true});
        }
    },[token])
    const handleGoogle = () => {
        googleLogin()
        .then(users=>{
            fetch(`${serverUrl}/user`,{
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify({fullName: users?.user?.displayName, email: users?.user?.email, emailStatus: true, profilePicture: users?.user?.photoURL, coverPicture: null })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.acknowledged){
                    toast.success(`Welcome ${users?.user?.displayName}`)
                }
            })
        })
        .catch(error=>{
            const err= error.message.split('/')[1].split(')')[0];
            toast.error(err);
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoginLoading(true)
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        login(email, password)
        .then((users)=>{
            setLoginLoading(false);
            toast.success(`Welcome ${users?.user?.displayName}`)
        })
        .catch(error=>{
            const err= error.message.split('/')[1].split(')')[0];
            toast.error(err);
            setLoginLoading(false);
        })

    }
    return (
        <div className='container-fluid loginContainer'>
            <div className='card'>
                <div className="card-body">
                    <h2 className='text-center'>Login</h2>
                    <form className='form mt-2' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className='form-label'>Email:</label>
                            <div className='input-group'>
                                <input type="email" name='email' className='form-control' required />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <label htmlFor="password" className='form-label'>Password:</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} className='form-control' name='password' style={{ borderRight: "0px" }} required />
                                <span className='input-group-text' onClick={() => setShowPassword(!showPassword)} style={{ backgroundColor: "white" }}><i className={showPassword ? "bi bi-eye" : 'bi bi-eye-slash'}></i></span>
                            </div>
                        </div>
                        <div className='mt-2 d-flex justify-content-end'>
                            <Link to={'/forgetPassword'}>Forget Password?</Link>
                        </div>
                        <div className='mt-2'>
                            <button className='btn btn-secondary d-flex justify-content-center w-100'>{loginLoading ? <ClockLoader color='white' size={24} />: "Login"}</button>
                        </div>
                        <div className='mt-2'>
                            <p>Does not have any account? <Link to={'/register'}>Click here</Link></p>
                        </div>
                        <div className='mt-2 d-flex justify-content-evenly'>
                            <hr className='w-100' />
                            <h5>OR</h5>
                            <hr className='w-100' />
                        </div>
                        <div className='mt-2'>
                            <button onClick={handleGoogle} className='btn border-dark border-1 w-100 d-flex justify-content-evenly'><div style={{ height: "20px", width: "20px" }}><img src="https://i.ibb.co/Y8TSkVN/google-icon.png" alt="" className='img-fluid' /></div>Continue with Google</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;