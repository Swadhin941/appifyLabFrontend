import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { SharedData } from '../../SharedData/SharedContext';
import { serverUrl } from '../../CustomHook/ServerHook/serverUrl';
import { useNavigate } from 'react-router-dom';
import ImageUp from '../../CustomHook/ImageUp/ImageUp';
import useAxiosSecure from '../../CustomHook/useAxiosSecure/useAxiosSecure';

const PostModal = ({ allPost, setAllPost, postLoading, setPostLoading }) => {
    const { user, logout } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const [listPhotos, setListPhotos] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPostLoading(true);
        const postCaption = e.target.post.value;
        const email = user?.email;
        const name = user?.displayName;
        let postPhotos = [];
        const tempPhotos = [...listPhotos];
        for (let i = 0; i < tempPhotos.length; i += 1) {
            const data = await ImageUp(tempPhotos[i]);
            postPhotos.push(data.url);
        }
        if (postPhotos.length === tempPhotos.length) {
            try {
                const response = await axiosSecure.post(`/post?user=${user?.email}`, { name, email, postCaption, images: postPhotos, timeMili: Date.now(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), reactions: [] })
                const data = await response.data;
                if (data.acknowledged) {
                    let tempPost = [...allPost];
                    tempPost.push({ name, email, postCaption, images: postPhotos, timeMili: Date.now(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), reactions: [] })
                    setAllPost(tempPost);
                    setPostLoading(false);
                }
            }
            catch(error){
                toast.error(error.message);
            }
            
        }



    }
    const handlePostPhotoChange = (e) => {
        const tempPhotos = e.target.files;
        let errors = 0;

        for (let i = 0; i < tempPhotos.length; i += 1) {
            if (tempPhotos[i].type.split('/')[1] === 'jpg' || tempPhotos[i].type.split('/')[1] === 'png' || tempPhotos[i].type.split('/')[1] === 'jpeg') {
                //Nothing need to do till now
            }
            else {
                errors += 1;
                toast.error("File should be in jpg, png or jpeg format");
                break;
            }
        }

        if (errors !== 0) {
            return;
        }
        if (tempPhotos.length > 4) {
            toast.error("You can upload 4 picture at a time");
            return;
        }
        else {
            setListPhotos(e.target.files);
        }
    }
    return (
        <div className='modal fade' id='PostModal' data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header" style={{ borderBottom: "none" }}>
                        <button className='btn btn-close' data-bs-dismiss="modal" onClick={() => setListPhotos([])}></button>
                    </div>
                    <div className="modal-body border" style={{ border: "0px" }}>
                        <form className='form-control' onSubmit={handleSubmit}>
                            <textarea name="post" id="post" cols="45" rows="3" style={{ resize: "none" }} placeholder='Write a post' className='form-control'></textarea>
                            <div className='mt-2'>
                                <span className='btn btn-primary' onClick={() => document.querySelector('.uploadImage').click()}>{listPhotos.length !== 0 ? listPhotos.length + " Photos" : "Add Photo"}</span>
                                <input type="file" multiple name='uploadImage' hidden className='uploadImage' onChange={handlePostPhotoChange} />
                            </div>
                            <div className='mt-2'>
                                <button className='btn btn-secondary w-100' data-bs-dismiss="modal">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;