import React, { useContext, useState } from 'react';
import ImageUp from '../../CustomHook/ImageUp/ImageUp';
import useAxiosSecure from '../../CustomHook/useAxiosSecure/useAxiosSecure';
import { SharedData } from '../../SharedData/SharedContext';
import toast from 'react-hot-toast';

const EditPost = ({ editSelectedPost, setEditSelectedPost, refetch, setRefetch }) => {
    const { user } = useContext(SharedData);
    const [allImages, setAllImages] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const handleImgChange = (e) => {
        console.log(e.target.files)
        setAllImages(e.target.files);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editCaption = e.target.post.value;
        let photosURL = [];
        const tempPhotos = [...allImages];
        for (let i = 0; i < tempPhotos.length; i += 1) {
            const data = await ImageUp(tempPhotos[i]);
            photosURL.push(data.url);
        }
        const images = [...editSelectedPost?.images, ...photosURL];
        const postCaption = editCaption;
        const response = await axiosSecure.patch(`/updatePost?user=${user?.email}`,{images, postCaption, postId: editSelectedPost?._id});
        const data = await response.data;
        if(data.modifiedCount>=1){
            toast.success("Update Successfully")
            setEditSelectedPost(null);
            e.target.reset();
            setAllImages([]);
            setRefetch(!refetch);
        }
    }
    return (
        <div className='modal fade' data-bs-backdrop="static" data-bs-keyboard="false" id='EditPost'>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button className='btn btn-close' data-bs-dismiss="modal" onClick={() => setEditSelectedPost(null)}></button>
                    </div>
                    <div className="modal-body">
                        <form className='form' onSubmit={handleSubmit}>
                            <textarea name="post" id="" cols="45" className='form-control' rows="3" style={{ resize: "none" }}></textarea>
                            <div className='mt-2'>
                                <span onClick={() => document.querySelector('.editUploadImage').click()} className='btn btn-primary'>{allImages.length !== 0 ? `${allImages.length} photos` : "Add Photo"}</span>
                                <input type="file" multiple name='editUploadImage' className='editUploadImage' hidden onChange={handleImgChange} />
                            </div>
                            <div className='mt-2'>
                                <button type='submit' className='btn btn-secondary w-100' data-bs-dismiss="modal">Update post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPost;