import React, { forwardRef } from 'react'
// import useAuth from '../../../useAuth'

const departmentCards = forwardRef(({data, belongsTo, goToUpdate, deleteItems, restoreItems, restore = false}, ref) => {
    // const { role } = useAuth()

    return (
    // <div className='flex '>
        <div className='border mb-3 mx-1'>
            { belongsTo == 'department' &&
                <div className="upper-content border-b ">
                    <p className='text-xl text-neutral-500 text-center pt-2 pb-1'>{data.divisi?.name || 'Tidak Ada Divisi'}</p>
                    <hr className='w-1/2 mx-auto' />
                    <div className='my-1'>
                        <p className='text-lg text-center font-bold'>{data.name}</p>
                        <p className='text-xl font-bold text-center'>{data.divisi?.kode}</p>
                    </div>
                </div>
            }
            { belongsTo == 'divisi' &&
                <div key={data.id} className="upper-content border-b" >
                    <div className='my-1'>
                        <p className='text-lg text-center font-bold'>{data.kode}</p>
                        <p className='text-xl font-bold text-center'>{data.name}</p>
                    </div>
                </div>
            }
            <div className='flex'>
                { !restore ?
                <>
                    <button
                        onClick={() => goToUpdate(data.id)}
                        className="update_button font-bold py-2"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => deleteItems(data.id, data.name)}
                        className="delete_button !bg-red-700 font-bold"
                    >
                        Delete
                    </button>
                </>
                : 
                    <button
                        className="restore_button py-2 !bg-green-700 font-bold"
                        onClick={() => restoreItems(data.id, data.name)}
                    >
                        Restore
                    </button>
                }
            </div>
        </div>
    // </div>
    )
})

export default departmentCards