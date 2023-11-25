import React, { useContext } from 'react';
import { SharedData } from '../SharedData/SharedContext';

const ErrorElement = () => {
    const { logout } = useContext(SharedData);
    return (
        <div>
            <p>Please <span className='text-decoration-underline text-primary' onClick={()=>{logout()}}>logout</span></p>
        </div>
    );
};

export default ErrorElement;