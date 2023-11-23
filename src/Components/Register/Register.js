import React, { useContext, useEffect, useState } from 'react';
import "./Register.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SharedData } from '../SharedData/SharedContext';
import { serverUrl } from '../CustomHook/ServerHook/serverUrl';
import useToken from '../CustomHook/useToken/useToken';
import ClockLoader from "react-spinners/ClockLoader";

const Register = () => {
    const { createAccount, updateProfileName, user, verifyEmail } = useContext(SharedData);
    const [showPassword, setShowPassword] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [token] = useToken(user?.email);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token])
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const fullName = form.fullName.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        if (/(?=.*[\s])/.test(fullName)) {
            toast.error("Full name should be without space");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords are not same");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be 6 character or more");
            return;
        }
        setRegisterLoading(true);
        createAccount(email, password)
            .then(users => {
                setRegisterLoading(false);
                updateProfileName(fullName)
                    .then(() => {
                        fetch(`${serverUrl}/user`, {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify({ fullName, email, emailStatus: false, profilePicture: users?.user?.photoURL, coverPhoto: null })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.acknowledged) {
                                    verifyEmail()
                                    .then(()=>{
                                        toast.success("Verification email has been sent");
                                    })
                                }
                            })
                            .catch(error=>{
                                toast.error(error.message);
                            })
                    })
            })
            .catch(error=>{
                const err= error.message.split('/')[1].split(')')[0];
                toast.error(err);
                setRegisterLoading(false);
            })

    }
    return (
        <div className='container-fluid registerContainer'>
            <div className="card">
                <div className="card-body">
                    <h2 className='text-center'>Signup</h2>
                    <form className='form' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="fullName">Full Name:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-person'></i></span>
                                <input type="text" name='fullName' className='form-control' placeholder='Enter your full name' />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <label htmlFor="email">Email:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-envelope'></i></span>
                                <input type="email" name='email' className='form-control' placeholder='Enter your email' />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <label htmlFor="password">Password:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-key'></i></span>
                                <input type={showPassword ? "text" : "password"} name='password' className='form-control' placeholder='Enter your password' />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <div className='input-group'>
                                <span className='input-group-text'><i className='bi bi-key'></i></span>
                                <input type={showPassword ? "text" : "password"} name='confirmPassword' className='form-control' placeholder='Confirm your password' />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='input-group'>
                                <input type="checkbox" className='form-check-input' name='showPassword' id='showPassword' onClick={() => setShowPassword(!showPassword)} />
                                <label htmlFor="showPassword" className='form-label ms-2'>Show Password</label>
                            </div>
                        </div>
                        <div className='mt-2'>
                            <button type='submit' className='btn btn-secondary w-100 d-flex justify-content-center'>{registerLoading ? <ClockLoader color="white" size={24} /> : 'Register'}</button>
                        </div>
                    </form>
                    <p className='text-center mt-2'>Already have a account? <Link to={'/login'}>Click here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;