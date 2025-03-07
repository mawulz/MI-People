import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../api/api';
import PropTypes from 'prop-types';

// import useAuth from '../../../useAuth'

const itemCards = forwardRef(({ data, goToDetail, goToUpdate, deleteItems, restoreItems, isUser, restore = false }, ref) => {
    const navigate = useNavigate()

    return (
    // <div className='flex '>
        <div ref={ref} className='border mb-3 mx-5'>
            <div className="upper-content border-b ">
                <p className='text-xl text-neutral-500 text-center '>{data.unit_device}</p>
                <hr className='w-full mx-auto' />
                <div className='my-1 mx-3 grid gap-y-1'>
                    <div className='flex justify-between'>Kode Asset: <p className='!m-0 text-center font-bold'>{data.asset_kode}</p></div>
                    <div className='flex justify-between'>Kode Unit: <p className='!m-0 font-bold text-center'>{data.category ? data.category.name : data.category_name} {data.asset_kode.slice(5,8)}</p></div>
                    <div className='flex justify-between'>User: <p className='!m-0 font-bold text-center'>{data.user ? data.user.name : data.username ? data.username : 'no one'}</p></div>
                    <div className='flex justify-between'>Tgl.: <p className='!m-0 font-bold text-center'>{data.date_barang_masuk}</p></div>
                    <div className='flex justify-between'>Status: <p className='!m-0 font-bold text-center'>{data.status}</p></div>
                </div>
            </div>
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
});

itemCards.propTypes = {
    data: PropTypes.object.isRequired,
    // setData: PropTypes.func.isRequired,
};

export default itemCards;