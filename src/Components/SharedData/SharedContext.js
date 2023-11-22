import React, { createContext } from 'react';

export const SharedData= createContext();

const SharedContext = ({children}) => {
    const authInfo= {

    };
    return (
        <div>
            <SharedData.Provider value={authInfo}>
                {children}
            </SharedData.Provider>
        </div>
    );
};

export default SharedContext;