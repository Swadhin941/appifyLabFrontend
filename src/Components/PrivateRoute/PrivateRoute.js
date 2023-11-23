import React, { useContext } from 'react';
import { SharedData } from '../SharedData/SharedContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(SharedData);
    if(loading){
        
    }
};

export default PrivateRoute;