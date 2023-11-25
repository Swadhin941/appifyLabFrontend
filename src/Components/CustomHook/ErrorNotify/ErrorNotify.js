import React from 'react';
import toast from 'react-hot-toast';

const ErrorNotify = (code) => {
    if (code === '401') {
        toast.error("Un-authorize Access");
        return;
    }
    if (code === '403') {
        toast.error("Forbidden Access");
        return;
    }
};

export default ErrorNotify;