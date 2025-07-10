import React from 'react';

const LoadingSpinner = () => {
    return (
        // <div>
        //     <img className="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/448500/loading.svg" alt="Loading icon"></img>
        // </div>
        <div className='min-h-screen  items-center flex justify-center'>
            <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
                <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXV5OGp5NHY2cnFnZGthY210ajdiMDR4bG9oaGZhdWt0dGl3eGFsdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2dmiD02aM9zX3Gw2oS/giphy.gif" className="rounded-full h-28 w-28" />
            </div>
        </div>
    );
};

export default LoadingSpinner;