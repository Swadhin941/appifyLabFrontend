import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import PostModal from '../Modal/PostModal/PostModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAxiosSecure from '../CustomHook/useAxiosSecure/useAxiosSecure';
import { ReactionBarSelector } from '@charkour/react-reactions';
import DeleteConfirm from '../Modal/DeleteConfirm/DeleteConfirm';
import { serverUrl } from '../CustomHook/ServerHook/serverUrl';
import { useNavigate } from 'react-router-dom';
import EditPost from '../Modal/EditPost/EditPost';
import DetailsModal from '../Modal/DetailsModal/DetailsModal';

const Home = () => {
    const { user, logout } = useContext(SharedData);
    const [allPost, setAllPost] = useState([]);
    const [postLoading, setPostLoading] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [axiosSecure] = useAxiosSecure();
    const [emojiSelected, setEmojiSelected] = useState(null);
    const [testEmoji, setTestEmoji] = useState(0);
    const [smallWindow, setSmallWindow] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteSelectedPost, setDeleteSelectedPost] = useState(null);
    const [editSelectedPost, setEditSelectedPost]= useState(null);
    const [postId, setPostId]= useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axiosSecure.get(`/allPost?user=${user?.email}`)
            .then(res => res.data)
            .then(data => {
                setAllPost(data);
            })
            .catch(error => {
                toast.error(error.message);
            })
    }, [refetch])

    useEffect(() => {
        if (allPost.length !== 0) {
            let tempPosts = [...allPost];
            tempPosts.sort((a, b) => b.timeMili > a.timeMili);
            setAllPost(tempPosts);
        }
    }, [postLoading])

    const handleEmojiSelect = (emojiName, data) => {
        let emojiValue = null;
        if (emojiName === 'satisfaction') {
            emojiValue = "👍"
            setEmojiSelected("👍")
        }
        if (emojiName === 'love') {
            emojiValue = "❤️"
            setEmojiSelected("❤️");
        }
        if (emojiName === 'angry') {
            emojiValue = "👿"
            setEmojiSelected("👿");
        }
        if (emojiName === 'sad') {
            emojiValue = "😥"
            setEmojiSelected("😥")
        }
        if (emojiName === 'happy') {
            emojiValue = "😂"
            setEmojiSelected("😂")
        }
        if (emojiName === 'surprise') {
            emojiValue = "😮"
            setEmojiSelected("😮")
        }
        axiosSecure.patch(`/postReaction?user=${user?.email}`, { _id: data._id, personReaction: emojiValue })
            .then(res => res.data)
            .then(reactionUpdate => {
                if (reactionUpdate.modifiedCount >= 1) {
                    setRefetch(!refetch);
                    setTestEmoji(null);
                }
            })
    }

    const handleRemoveReaction = (e) => {
        axiosSecure.patch(`/removePostReaction?user=${user?.email}`, { _id: e._id })
            .then(res => res.data)
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setRefetch(!refetch);
                }
            })
    }
 
    useEffect(() => {
        if (confirmDelete) {
            fetch(`${serverUrl}/postDelete?user=${user?.email}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem("token")}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ post_id: deleteSelectedPost })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login');
                    }
                    if (res.status === 403) {
                        navigate('/forbidden')
                    }
                    return res.json()
                })
                .then(data => {
                    if (data.deletedCount >= 1) {
                        toast.success("Deleted Successfully");
                        setConfirmDelete(false);
                        setDeleteSelectedPost(null);
                        setRefetch(!refetch);
                    }
                })
        }
    }, [confirmDelete])

    return (
        <div className='container-fluid' onMouseEnter={() => setTestEmoji(null)} onMouseLeave={() => setTestEmoji(null)} onClick={() => { if (smallWindow !== null) { setSmallWindow(null) } }}>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    {
                        postLoading ? <div>Posting...</div> : <div className='d-flex justify-content-center'>
                            <div className="card w-75">
                                <div className="card-body">
                                    <form >
                                        <div className='d-flex'>
                                            <div className='me-2'>
                                                <img src={user?.photoURL} alt="" height={40} width={40} className='rounded-circle' />
                                            </div>
                                            <div className='w-100' data-bs-target="#PostModal" data-bs-toggle="modal">
                                                <input type="text" className='form-control ' placeholder='What is in your mind?' />
                                            </div>
                                        </div>
                                    </form>
                                    <PostModal allPost={allPost} setAllPost={setAllPost} postLoading={postLoading} setPostLoading={setPostLoading}></PostModal>
                                </div>
                            </div>
                        </div>
                    }


                </div>
                {
                    allPost.length !== 0 && allPost.map((item, index) => <div className='col-12 col-md-12 col-lg-12' key={index}>
                        <div className="card">
                            <div className={`card-header ${user?.email === item.email && "d-flex justify-content-between"}`}>
                                <h5>{item?.name}</h5>
                                {
                                    user?.email === item.email && <div>
                                        <div style={{ position: "relative" }}>
                                            <div onClick={() => { if (smallWindow !== null) { setSmallWindow(null) } else { setSmallWindow(`${index + 1}`) } }}>
                                                <i className='bi  bi-three-dots-vertical'></i>
                                            </div>
                                            {
                                                parseInt(smallWindow) === index + 1 && <div className='p-2 border rounded' style={{ position: "absolute", height: "auto", backgroundColor: "black", width: "auto" }}>
                                                    <button className='btn btn-primary w-100 my-2'onClick={()=>setEditSelectedPost(item)} data-bs-target="#EditPost" data-bs-toggle="modal">Edit</button>
                                                    <button className='btn btn-primary w-100' data-bs-target="#DeleteConfirm" data-bs-toggle="modal" onClick={() => setDeleteSelectedPost(item._id)}>Delete</button>
                                                </div>
                                            }
                                            <DeleteConfirm confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete}></DeleteConfirm>
                                            <EditPost editSelectedPost={editSelectedPost} setEditSelectedPost={setEditSelectedPost} refetch={refetch} setRefetch={setRefetch}></EditPost>
                                        </div>
                                    </div>
                                }

                            </div>
                            <div className="card-body">
                                {
                                    item?.postCaption && <p>{item?.postCaption}</p>
                                }
                                <div className='d-flex justify-content-start' style={{ flexWrap: "nowrap" }}>
                                    {
                                        item.images.length !== 0 && item.images.map((imageItem, imageIndex) => <div className='' key={imageIndex}>
                                            <div style={{ maxHeight: "80px", maxWidth: "80px" }}>
                                                <img src={imageItem} alt="" className='img-fluid' />
                                            </div>
                                        </div>)
                                    }
                                </div>

                            </div>
                            {
                                index + 1 === parseInt(testEmoji) && <ReactionBarSelector onSelect={(e) => handleEmojiSelect(e, item)} />
                            }
                            <div className="card-footer">
                                <div className='d-flex justify-content-evenly'>
                                    {
                                        item?.personReaction ? <div style={{ cursor: "pointer" }} onClick={() => handleRemoveReaction(item)} >
                                            {item?.personReaction}
                                        </div> : <div style={{ cursor: "pointer" }} onClick={() => setTestEmoji(`${index + 1}`)} >
                                            Like <i className='bi bi-hand-thumbs-up'></i>
                                        </div>
                                    }
                                    <div onClick={()=>setPostId(item._id)} data-bs-target="#DetailsModal" data-bs-toggle="modal" style={{cursor:"pointer"}}>
                                        comment <i className='bi bi-chat'></i>
                                    </div>
                                    <DetailsModal refetch={refetch} setRefetch={setRefetch} postId={postId} setPostId={setPostId}></DetailsModal>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default Home;