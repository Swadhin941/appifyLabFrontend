import React from 'react';
import ScaleLoader from "react-spinners/ScaleLoader";

const Spinner = () => {
    return (
        <div className='container-fluid p-0 spinnerContainer'>
            <ScaleLoader color="#35c112" height={40} speedMultiplier={2} />
        </div>
    );
};

export default Spinner;