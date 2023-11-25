import React, { useContext, useEffect } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../ServerHook/serverUrl';

const useAxiosSecure = () => {
    const { logout } = useContext(SharedData);
    const navigate = useNavigate();
    const axiosSecure = axios.create({
        baseURL: serverUrl
    })
    useEffect(() => {
        axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.authorization = `bearer ${token}`
            }
            return config;
        });

        axiosSecure.interceptors.response.use((response) => response,
            async (error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        logout()
                        navigate('/login');
                    }
                    if (error.response.status === 403) {
                        navigate('/forbidden');
                    }
                }
                return Promise.reject(error)
            }
        )

    }, [logout, navigate, axiosSecure])
    return [axiosSecure];
};

export default useAxiosSecure;