import React, { useContext, useEffect, useState } from 'react';
import { serverUrl } from '../../CustomHook/ServerHook/serverUrl';
import { SharedData } from '../../SharedData/SharedContext';
import useAxiosSecure from '../../CustomHook/useAxiosSecure/useAxiosSecure';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { ReactionBarSelector } from '@charkour/react-reactions';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';
import { useNavigate } from 'react-router-dom';

const DetailsModal = ({ postId, setPostId, refetch, setRefetch }) => {
    const { user, logout } = useContext(SharedData);
    const [axiosSecure] = useAxiosSecure();
    const [postData, setPostData] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showCommentEmoji, setShowCommentEmoji] = useState(null);
    const [commentReply, setCommentReply] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null)
    const [replyEmojiShow, setReplyEmojiShow] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (postId) {
            axiosSecure.post(`/getPostDetails?user=${user?.email}`, { postId })
                .then(res => res.data)
                .then(postInfo => {
                    setPostData(postInfo)
                })
        }
    }, [postId, refetch])

    const handleEmojiSelect = (emojiName) => {
        let emojiValue = null;
        if (emojiName === 'satisfaction') {
            emojiValue = "👍"
        }
        if (emojiName === 'love') {
            emojiValue = "❤️"
        }
        if (emojiName === 'angry') {
            emojiValue = "👿"
        }
        if (emojiName === 'sad') {
            emojiValue = "😥"
        }
        if (emojiName === 'happy') {
            emojiValue = "😂"
        }
        if (emojiName === 'surprise') {
            emojiValue = "😮"
        }
        axiosSecure.patch(`/postReaction?user=${user?.email}`, { _id: postData._id, personReaction: emojiValue })
            .then(res => res.data)
            .then(reactionUpdate => {
                if (reactionUpdate.modifiedCount >= 1) {
                    setRefetch(!refetch);
                    setShowEmoji(false);
                }
            })
    }

    const handleRemoveReaction = (id) => {
        axiosSecure.patch(`/removePostReaction?user=${user?.email}`, { _id: id })
            .then(res => res.data)
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setRefetch(!refetch);
                }
            })

    }

    const handlePostComment = (e) => {
        e.preventDefault();
        const commentValue = e.target.comment.value;
        const postId = postData._id;
        const postEmail = postData.email;
        const commenterEmail = user?.email;
        const commenterName = user?.displayName;
        const replies = [];
        const reactions = [];
        axiosSecure.post(`/commentPost?user=${user?.email}`, { commentValue, postId, postEmail, commenterEmail, replies, reactions, commenterName })
            .then(res => res.data)
            .then(data => {
                if (data.acknowledged) {
                    setRefetch(!refetch);
                }
            })
    }

    const handleShowCommentEmoji = (emojiName, commentData, commentReactions) => {
        let emojiValue = null;
        if (emojiName === 'satisfaction') {
            emojiValue = "👍"
        }
        if (emojiName === 'love') {
            emojiValue = "❤️"
        }
        if (emojiName === 'angry') {
            emojiValue = "👿"
        }
        if (emojiName === 'sad') {
            emojiValue = "😥"
        }
        if (emojiName === 'happy') {
            emojiValue = "😂"
        }
        if (emojiName === 'surprise') {
            emojiValue = "😮"
        }
        axiosSecure.put(`/setCommentEmoji?user=${user?.email}`, { commentId: commentData, reaction: emojiValue, commentReactions })
            .then(res => res.data)
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setRefetch(!refetch);
                }
            })
        setShowCommentEmoji(null);
    }

    const handleRemoveCommentReaction = (commentId, commentReactions) => {
        axiosSecure.put(`/removeCommentReaction?user=${user?.email}`, { commentId, commentReactions })
            .then(res => res.data)
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setRefetch(!refetch);
                }
            })

    }

    const handleReplySubmit = (e) => {
        e.preventDefault()
        const replyValue = e.target.replyBox.value;
        const replyEmail = user?.email;
        const time = Date.now();
        const reactions = []
        axiosSecure.put(`/setReply?user=${user?.email}`, { replyValue, replyEmail, replyName: user?.displayName, time, reactions, commentId: selectedCommentId })
            .then(res => res.data)
            .then(data => {
                if (data.acknowledged) {
                    setRefetch(!refetch);
                }
            })
    }

    const handleSetReplyEmoji = (emojiName, replyReactions) => {
        let emojiValue = null;
        if (emojiName === 'satisfaction') {
            emojiValue = "👍"
        }
        if (emojiName === 'love') {
            emojiValue = "❤️"
        }
        if (emojiName === 'angry') {
            emojiValue = "👿"
        }
        if (emojiName === 'sad') {
            emojiValue = "😥"
        }
        if (emojiName === 'happy') {
            emojiValue = "😂"
        }
        if (emojiName === 'surprise') {
            emojiValue = "😮"
        }
        axiosSecure.put(`/setReplyEmoji?user=${user?.email}`, { commentId: replyEmojiShow?.commentId, replyId: replyEmojiShow?.replyId, reaction: emojiValue, replyReactions: [...replyReactions] })
            .then(res => res.data)
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setReplyEmojiShow(null)
                    setRefetch(!refetch);
                }
            })
    }

    const handleRemoveReplyEmoji = (commentId, replyId) => {
        axiosSecure.put(`/removeReplyEmoji?user=${user?.email}`, { commentId, replyId })
            .then(res => res.data)
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setRefetch(!refetch);
                }
            })

    }

    useEffect(() => {

        if (selectedToDelete?.post_id && selectedToDelete?.commentId) {
            fetch(`${serverUrl}/deleteComment?user=${user?.email}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ postId, commentId: selectedToDelete?.commentId })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login')
                    }
                    if (res.status === 403) {
                        navigate('/forbidden')
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.deletedCount >= 1) {
                        setSelectedToDelete(null);
                        setConfirmDelete(false);
                        setRefetch(!refetch)
                    }
                })
        }
        if (selectedToDelete?.commentId && selectedToDelete?.replyId) {
            axiosSecure.put(`/deleteReply?user=${user?.email}`,{commentId: selectedToDelete?.commentId, replyId: selectedToDelete?.replyId})
            .then(res=>res.data)
            .then(data=>{
                if(data.modifiedCount>=1){
                    setSelectedToDelete(null);
                    setRefetch(!refetch);
                }
            })
        }

    }, [selectedToDelete])

    return (
        <div className='modal fade' id='DetailsModal' data-bs-keyboard="false" data-bs-backdrop='static'>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" onMouseEnter={() => { setShowEmoji(false); setShowCommentEmoji(null); setCommentReply(null); setReplyEmojiShow(null) }} onMouseLeave={() => { setShowEmoji(false); setShowCommentEmoji(null); setCommentReply(null); setReplyEmojiShow(null) }}>
                    <div className="modal-header">
                        <button className='btn btn-close' data-bs-dismiss="modal" onClick={() => setPostId(null)}></button>
                    </div>
                    <div className="modal-body">
                        <h6 className='mb-0 fw-bold'>{postData?.name}</h6>
                        <p className='text-muted my-0'>{postData?.time} {postData?.date}</p>
                        <p className='mt-2'>{postData?.postCaption}</p>
                        {
                            postData?.images.length !== 0 && <div className='d-flex' style={{ flexWrap: "wrap" }}>
                                {
                                    postData?.images.map((imgItem, imgIndex) => <div key={imgIndex} style={{ maxHeight: "100px", maxWidth: "100px" }}>
                                        <PhotoProvider>
                                            <PhotoView src={imgItem}>
                                                <img src={imgItem} style={{ height: "100%", width: "auto" }} alt="" />
                                            </PhotoView>
                                        </PhotoProvider>

                                    </div>)
                                }
                            </div>
                        }

                        {
                            postData?.reactions.length !== 0 && <div className='mt-2 text-primary'>{postData?.reactions.length} reacted on this post</div>
                        }
                        {
                            showEmoji && <ReactionBarSelector onSelect={(e) => handleEmojiSelect(e)}></ReactionBarSelector>
                        }
                        <div className='mt-2'>
                            <hr className='w-100' />
                            <div className='d-flex justify-content-evenly'>
                                {
                                    postData?.personReaction ? <div style={{ cursor: "pointer" }} onClick={() => handleRemoveReaction(postData?._id)}>
                                        {postData?.personReaction}
                                    </div> : <div style={{ cursor: "pointer" }} onClick={() => setShowEmoji(true)}>
                                        Like <i className='bi bi-hand-thumbs-up'></i>
                                    </div>
                                }

                                <div style={{ cursor: "pointer" }}>
                                    comment <i className='bi bi-chat'></i>
                                </div>
                            </div>
                            <hr className='w-100' />
                        </div>
                        <div className='mt-2'>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-12">
                                    <form className='form' onSubmit={handlePostComment}>
                                        <div className="input-group">
                                            <textarea name="comment" id="" rows="1" className='form-control' style={{ resize: "none" }} placeholder='Comment here' required></textarea>
                                            <button type='submit' className='input-group-text btn btn-primary'>Comment</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className='mt-2 mb-0'>
                            <p className='mt-0 text-muted'>{postData?.allComments?.length} comments available</p>
                        </div>
                        <hr className='w-100 mt-0' />
                        <div className='row mt-0'>
                            {
                                postData?.allComments?.map((cmtItem, cmtIndex) => <div className='col-12 col-md-12 col-lg-12' key={cmtIndex}>
                                    <div className='ps-4 pt-2 pe-3' style={{ backgroundColor: "#9bebff", height: "auto", width: "auto", borderRadius: "50px" }}>
                                        <p className='my-0 fw-bold'><small>{cmtItem?.commenterName}</small></p>
                                        <p className='my-0'>{cmtItem?.commentValue}</p>
                                        {
                                            parseInt(showCommentEmoji) === cmtIndex + 1 && <ReactionBarSelector onSelect={(e) => handleShowCommentEmoji(e, cmtItem._id, cmtItem.reactions)}></ReactionBarSelector>
                                        }
                                        <div className='mt-2 d-flex justify-content-evenly'>
                                            <div>
                                                <div style={{ cursor: "pointer" }}>
                                                    {cmtItem.reactions.length}
                                                    {
                                                        cmtItem?.personReaction && <div className='d-inline ms-2' onClick={() => handleRemoveCommentReaction(cmtItem._id, cmtItem.reactions)}>{cmtItem?.personReaction} </div>

                                                    }
                                                    {
                                                        !cmtItem?.personReaction && <><i className='bi bi-hand-thumbs-up ms-2' onClick={() => setShowCommentEmoji(`${cmtIndex + 1}`)}></i> Like</>
                                                    }

                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ cursor: "pointer" }} onClick={() => setCommentReply(`${cmtIndex + 1}`)}>
                                                    {cmtItem.replies.length}
                                                    <i className='bi bi-chat ms-2'></i>Replies
                                                </div>
                                            </div>
                                            {
                                                (user?.email === postData?.email || cmtItem?.commenterEmail) && <div >
                                                    <p className='text-primary text-decoration-underline' onClick={() => setSelectedToDelete({ post_id: postData._id, commentId: cmtItem._id })}>Delete</p>
                                                </div>
                                            }
                                            {
                                                user?.email === cmtItem?.commenterEmail && <div>
                                                    <p className='text-primary text-decoration-underline'>Update</p>
                                                </div>
                                            }
                                        </div>
                                        {
                                            parseInt(commentReply) === cmtIndex + 1 && <div className="row">
                                                <div className="col-12 col-md-12 col-lg-12">
                                                    <form className='form' onSubmit={handleReplySubmit}>
                                                        <div className='input-group'>
                                                            <textarea name="replyBox" id="replyBox" rows="1" className='form-control' style={{ resize: "none" }} required></textarea>
                                                            <button className='btn btn-primary input-group-text' onClick={() => setSelectedCommentId(cmtItem._id)}>Reply</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className='mt-2 ms-3'>
                                        <div className="row">
                                            {
                                                cmtItem?.replies.length !== 0 && cmtItem?.replies.map((repliesItem, repliesIndex) => <div className='col-12 col-md-12 col-lg-12' key={repliesIndex} >
                                                    <div className='ps-4 pt-2 pe-3' style={{ backgroundColor: "#9bebff", height: "auto", width: "auto", borderRadius: "50px" }}>
                                                        <p className='my-0'>{repliesItem?.replyName}</p>
                                                        <p>{repliesItem?.replyMessage}</p>
                                                        {
                                                            (replyEmojiShow?.commentId === cmtItem._id && replyEmojiShow?.replyId === repliesItem?._id) && <ReactionBarSelector onSelect={(e) => handleSetReplyEmoji(e, repliesItem?.reactions)} />
                                                        }
                                                        <div className='d-flex justify-content-evenly' >
                                                            <div className='ms-5 d-flex' style={{ cursor: "pointer" }}>
                                                                {repliesItem?.reactions?.length}
                                                                {
                                                                    repliesItem?.personReaction ? <div onClick={() => handleRemoveReplyEmoji(cmtItem._id, repliesItem._id)}>
                                                                        {repliesItem?.personReaction}
                                                                    </div> : <div onClick={() => setReplyEmojiShow({ commentId: cmtItem._id, replyId: repliesItem._id })}>
                                                                        <i className='bi bi-hand-thumbs-up ms-2'></i>Like
                                                                    </div>
                                                                }
                                                            </div>
                                                            {
                                                                (user?.email === postData?.email || repliesItem?.replyEmail === user?.email) && <div>
                                                                    <p className='text-primary text-decoration-underline' onClick={() => setSelectedToDelete({ commentId: cmtItem._id, replyId: repliesItem._id })}>Delete</p>
                                                                </div>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>)
                                            }
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;