import React from 'react';

function Square({value,onClick}) {
    return (
        <button onClick={onClick} className='w-[100px] h-[100px] bg-cyan-800 border-2 border-cyan-800 shadow-lg shadow-black rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-cyan-700   '>
            <div className='text-orange-500 text-7xl'>
                {value}
                </div>
        </button>
   )
}

export default Square;