import React, { useState, useEffect } from 'react'
import useAuth from '../../useAuth';
import { useNavigate } from 'react-router-dom';
import SelectPaginate from '../kit/selectPaginate';
import Swal from 'sweetalert2';
import api from '../../api/api'
import { useParams } from 'react-router-dom';
import { DecryptID } from '../../helper/encryptHelper';
import Navbar from '../kit/customNavbar';
import Transition from '../kit/Transition';

const updateDivisi = ({ formOpen, setFormOpen }) => {
    const {id} = useParams()
    const [isOpen, setIsOpen] = useState(false)
    const [opens, setOpens] = useState(false)
    // const [loading, setLoading] = useState(false)
    const { name, email, role } = useAuth()
    const [contentVisible, setContentVisible] = useState(false)
    const [decryptedId, setDecryptedId] = useState('')
    const navigate = useNavigate()
    
    const [items, setItems] = useState({
        name : '',
        kode : null,
    });


    useEffect(() => {
        const decryptedIds = DecryptID(id)
        setDecryptedId(decryptedIds)

        if (!decryptedIds) {
            // navigate(0)
            console.log('error')
        }
    }, [id])

    useEffect(() => {
        if (decryptedId) {
            fetchItems()
        }
    }, [decryptedId])

    const fetchItems = async() => {
        try {
            // setLoading(true)
            const response = await api.get(`/divisi/${decryptedId}`)
            const data = response.data.data
            setItems({
                name : data.name,
                kode : data.kode
            })  
        } catch (error) {
            console.log(error)
        } finally {
            // setLoading(false)
            setTimeout(() => setContentVisible(true), 50)
        }
    }

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (formOpen) {
            setTimeout(() => {
                setOpens(true);
            }, 100);
        }

    }, [formOpen]);

    const [disabled, setDisabled] = useState(false);

    const handleSubmitChanges = async (e) => {
        e.preventDefault();
        try {
            if (disabled) {
                return
            }
            setDisabled(true)
            if (items.kode.length !== 3) {
                Swal.fire({
                    title: `Terlalu Pendek`,
                    icon: 'error',
                });
                return;
            }
            const response = await api.put(`/divisi/${decryptedId}`, {
                name : items.name,
                kode : items.kode.toUpperCase(),
            })
            const data = response.data.data
            navigate(-1)
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Tidak Dapat Mengubah Status MR',
                text:'Ada Kesalahan Dalam Sistem'
            })
        } finally {
            setDisabled(false)
        }
    }

    return (
        <>
            {/* <div className={`fixed inset-0 bg-black backdrop-filter-blur backdrop-blur-sm transition-opacity duration-200 z-1000
            ${opens ? 'opacity-80  backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
                onClick={() => [setOpens(false), setTimeout(() => setFormOpen(false), 350)]}
            /> */}
            {/* <div className={`!fixed bg-slate-200 hidden-scrollbar absolute z-1000 justify-self-center min-h-100 transition-opacity ease-in-out duration-200 w-full max-w-xl ${opens ? 'opacity-100 overflow-y-scroll max-h-full' : 'opacity-0'} overflow-hidden`}> */}
            {/* <Transition contentVisible={contentVisible}> */}
                <Navbar title={'Divisi'}/>
                <div className='flex justify-content-center align-items-center h-screen'>
                    <div className={`bg-slate-200 hidden-scrollbar absolute z-1000 justify-self-center min-h-100 transition-opacity ease-in-out duration-200 w-full max-w-xl overflow-hidden`}>
                        <div className="flex pl-8 pt-2">
                            <h2 className="capitalize font-bold font-inter text-3xl mt-5">Update Data Divisi</h2>
                        </div>
                        <div className="bottom-nav flex flex-col font-inter mt-1">
                            <form onSubmit={handleSubmitChanges} className='p-10 pt-5'>
                                    <div className="mt-3">
                                        <label>Nama Divisi</label>
                                        <div className='bg-white p-2 border-solid border-gray-900 border'>
                                        <input 
                                            type="text" 
                                            name="Nama" 
                                            value={items.name || ''} 
                                            onChange={e => setItems({ ...items, name: e.target.value })}
                                            maxLength={40}
                                            placeholder='Nama Kategori'
                                            required
                                            className="w-full p-2 placeholder:font-regular"
                                        />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <label>Kode Divisi</label>
                                        <div className='bg-white p-2 border-solid border-gray-900 border'>
                                        <input 
                                            type="text" 
                                            name="Kode" 
                                            value={items.kode || ''} 
                                            onChange={e => {
                                                const value = e.target.value.replace(/[^a-zA-Z]/g, '');
                                                setItems({ ...items, kode: value });
                                            }}  
                                            maxLength={3}
                                            placeholder='Kode divisi'
                                            required
                                            className="w-full p-2 placeholder:font-regular"
                                        />
                                        </div>
                                    </div>
                                    <div className="flex mt-4 gap-5">
                                        <button type='button' 
                                                onClick={() => navigate('/divisi')}
                                                className="!bg-gray-500 text-white p-2">
                                            Cancel
                                        </button>
                                        <button disabled={disabled} type="submit" className="bg-cyan-400 text-white p-2">Save</button>
                                    </div>
                            </form>
                        
                        </div>
                    </div>
                </div>

            {/* </Transition> */}
        </>
    )
}


export default updateDivisi;