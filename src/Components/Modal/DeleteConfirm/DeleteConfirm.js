import React from 'react';

const DeleteConfirm = ({confirmDelete, setConfirmDelete}) => {
    return (
        <div className='modal fade' data-bs-backdrop='static' data-bs-keyboard="false" id='DeleteConfirm'>
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <p className='text-center'>Are your want to delete it?</p>
                        <div className='d-flex justify-content-between'>
                            <button className='btn btn-sm btn-success' data-bs-dismiss="modal" onClick={()=>setConfirmDelete(!confirmDelete)}>Confirm</button>
                            <button className='btn btn-sm btn-danger' data-bs-dismiss="modal"onClick={()=>setConfirmDelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;