import React, { useContext, useEffect, useState } from 'react';
import ClockLoader from 'react-spinners/ClockLoader';
import { SharedData } from '../SharedData/SharedContext';
import useToken from '../CustomHook/useToken/useToken';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgetPassword = () => {
    const { user, resetEmail } = useContext(SharedData);
    const [resetLoading, setResetLoading] = useState(false);
    const [token] = useToken(user?.email);
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token])
    const handleSubmit = (e) => {
        e.preventDefault();
        setResetLoading(true);
        const email = e.target.email.value;
        resetEmail(email)
        .then(()=>{
            toast.success("Reset email send to your email");
            setResetLoading(false);
        })
        .catch(error=>{
            const err= error.message.split('/')[1].split(')')[0];
            toast.error(err);
            setResetLoading(false);
        })

    }
    return (
        <div className='container-fluid loginContainer'>
            <div className="card">
                <div className="card-body">
                    <div className='bg-secondary p-2' style={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}>
                        <h4 className='text-white fw-bold' >Reset your password</h4>
                    </div>
                    <div>
                        <form className='form' onSubmit={handleSubmit}>
                            <div className='mt-2'>
                                <label htmlFor="email">Enter your remembered email:</label>
                                <div className='input-group'>
                                    <input type="email" className='form-control' name='email' id='email' />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <button className='btn btn-success w-100 d-flex justify-content-center' disabled={resetLoading? true : false}>{resetLoading ? <ClockLoader color='white' size={24} /> : "Send reset password link"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;