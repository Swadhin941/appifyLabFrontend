import React, { useEffect, useState } from 'react';
import { serverUrl } from '../ServerHook/serverUrl';

const useToken = (email) => {
    const [token, setToken] = useState(false);
    useEffect(() => {
        if (email) {
            fetch(`${serverUrl}/jwt`, {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify({email})
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.token){
                    localStorage.setItem('token', data.token);
                    setToken(true);
                }
            })
        }
    }, [email])
    return [token];

};

export default useToken;