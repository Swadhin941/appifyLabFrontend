import React, { createContext, useEffect, useState } from 'react';
import app from '../Firebase/Firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

export const SharedData = createContext();
const auth = getAuth(app);

const SharedContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const handleGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    const createAccount= (email, password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login= (email, password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout= ()=>{
        setLoading(true);
        return signOut(auth);
    }

    const updateProfileName= (name)=>{
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name
        })
    };

    const uploadPicture=(picture)=>{
        setLoading(true);
        return updateProfile(auth.currentUser,{
            photoURL: picture
        })
    };

    useEffect(() => {
        const check = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
            setLoading(false);
        })
        return () => check();
    })

    const authInfo = {
        handleGoogle,
        user, setUser, loading, setLoading, createAccount, login, logout, uploadPicture, updateProfileName
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