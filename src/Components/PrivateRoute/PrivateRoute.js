import React, { useContext } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import Spinner from '../Spinner/Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(SharedData);
    const location= useLocation();
    if(loading){
        return <Spinner></Spinner>
    }
    if(user && user?.uid){
        return children;
    }
    return <Navigate to={'/login'} state={{from: location}} replace></Navigate>
};

export default PrivateRoute;