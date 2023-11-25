import React from 'react';

const ImageUp = async (file) => {
    const formData = new FormData()
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=fe7af610ba7833472f8ea07e3b7a68c4`, { method: "POST", body: formData })
    const res = await response.json();
    return res.data;
};

export default ImageUp;