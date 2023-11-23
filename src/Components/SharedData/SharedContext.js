import React, { createContext, useEffect, useState } from 'react';
import app from '../Firebase/Firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { serverUrl } from '../CustomHook/ServerHook/serverUrl';

export const SharedData = createContext();
const auth = getAuth(app);

const SharedContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    const createAccount = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('token');
        return signOut(auth);
    }

    const updateProfileName = (name) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name
        })
    };

    const resetEmail = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    }

    const verifyEmail = () => {
        setLoading(true);
        return sendEmailVerification(auth.currentUser);
    }

    const uploadPicture = (picture) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            photoURL: picture
        })
    };

    useEffect(() => {
        if (user?.email) {
            fetch(`${serverUrl}/emailStatus?user=${user?.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.emailStatus) {
                        setUser(user);
                    }
                    else {
                        logout()
                        setUser(null);
                    }
                })
        }
    }, [user])

    useEffect(() => {
        const check = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser === null || currentUser.emailVerified) {
                setUser(currentUser);
            }
            setLoading(false);
        })
        return () => check();
    })

    const authInfo = {
        googleLogin,
        user, setUser, loading, setLoading, createAccount, login, logout, uploadPicture, updateProfileName, resetEmail, verifyEmail
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