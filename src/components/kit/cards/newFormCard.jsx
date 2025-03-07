import React, { useState, useEffect, useRef } from 'react'
import useAuth from '../../../useAuth';
import { useNavigate } from 'react-router-dom';
import SelectPaginate from '../selectPaginate';
import Swal from 'sweetalert2';
import api from '../../../api/api';
import { useParams } from 'react-router-dom';
import { DecryptID } from '../../../helper/encryptHelper';

const newFormCard = ({ formOpen, setFormOpen, belongsTo }) => {
    const {id} = useParams()
    const [isOpen, setIsOpen] = useState(false)
    const [opens, setOpens] = useState(false)
    const inputRef = useRef(null)
    const { name, email, role } = useAuth()
    const [decryptedId, setDecryptedId] = useState('')
    const navigate = useNavigate()

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


    const [items, setItems] = useState({
        name : '',
        divisi : null,
        kode: '',
    });
    

    const [disabled, setDisabled] = useState(false);


    const handleDepartmentSubmit = async (e) => {
        e.preventDefault();
        try {
            if (disabled) {
                return
            }
            setDisabled(true)
            const response = await api.post(`/department`, {
                name : items.name,
                divisi_id : items.divisi?.value
            })
            const data = response.data.data
            console.log(data);
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Department added successfully!',
            });
            setOpens(false);
            navigate(0);
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Tidak Dapat Membuat Department',
                text:'Ada Kesalahan Dalam Sistem'
            })
        } finally {
            setDisabled(false)
        }
    }

    const handleDivisiSubmit = async(e) =>{
        e.preventDefault();
        try {
            if (disabled) {
                return
            }
            setDisabled(true)
            if (items.kode.length !== 3) {
                Swal.fire({
                  title: `Kode Divisi Terlalu Pendek`,
                  icon: 'error',
                });
                return; 
              }

            const response = await api.post(`/divisi`, {
                name : items.name,
                kode: items.kode.toUpperCase(),
            })
        navigate('/divisi/list-divisi')
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Tidak Dapat Membuat Divisi',
                text:'Ada Kesalahan Dalam Sistem'
            })
        } finally {
            setDisabled(false)
        }
      }

    return (
        <>
            <div className={`fixed inset-0 bg-black backdrop-filter-blur backdrop-blur-sm transition-opacity duration-200 z-1000
            ${opens ? 'opacity-80  backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
                onClick={() => [setOpens(false), setTimeout(() => setFormOpen(false), 350)]}
            />
            <div className={`!fixed bg-slate-200 hidden-scrollbar absolute z-1000 justify-self-center min-h-100 transition-opacity ease-in-out duration-200 w-full max-w-xl ${opens ? 'opacity-100 overflow-y-scroll max-h-full' : 'opacity-0'} overflow-hidden`}>
                <div className="flex pl-8 pt-2">
                    <h2 className="capitalize font-bold font-inter text-3xl mt-5">New Data {belongsTo}</h2>
                </div>
                <div className="bottom-nav flex flex-col font-inter mt-1">
                { belongsTo == 'department' &&
                    <form onSubmit={handleDepartmentSubmit} className='p-10 pt-5'>
                            <label>Divisi</label>
                            <SelectPaginate
                                source={'divisi'}
                                selectName={'Divisi'}
                                itemLabel={['name']}
                                handleSelectChange={divisi => setItems({...items, divisi})}
                                className='!border border-gray-900'
                                />
                            <div className="mt-3">
                                <label>Nama Department</label>
                                <div className='bg-white p-2 border-solid border-gray-900 border'>
                                <input 
                                    type="text" 
                                    name="Nama" 
                                    // value={items.name} 
                                    onChange={e => setItems({ ...items, name: e.target.value })}
                                    className="w-full p-2 placeholder:font-regular"
                                    maxLength={40}
                                    placeholder='Nama Kategori'
                                    required
                                />
                                </div>
                            </div>
                            <div className="flex mt-4 gap-5">
                                <button type='button' 
                                        onClick={() => [setOpens(false), setTimeout(() => setFormOpen(false), 350)]}
                                        className="!bg-gray-500 text-white p-2">
                                    Cancel
                                </button>
                                <button disabled={disabled} type="submit" className="bg-cyan-400 text-white p-2">Create Department</button>
                            </div>
                    </form>
                }
                { belongsTo == 'divisi' &&
                    <form onSubmit={handleDivisiSubmit} className='p-10 pt-5'>
                            <div className="mt-3">
                                <label>Nama Divisi</label>
                                <div className='bg-white p-2 border-solid border-gray-900 border'>
                                <input 
                                    type="text" 
                                    name="Nama" 
                                    value={items.name} 
                                    onChange={e => setItems({ ...items, name: e.target.value })}
                                    className="w-full p-2 placeholder:font-regular"
                                    maxLength={40}
                                    placeholder='Nama Divisi'
                                    required
                                />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label>Kode Divisi</label>
                                <div className='bg-white p-2 border-solid border-gray-900 border'>
                                <input 
                                    type="text" 
                                    name="Kode" 
                                    value={items.kode} 
                                    onChange={e => setItems({ ...items, kode: e.target.value.replace(/[^a-zA-Z]/g, '') })}
                                    className="w-full p-2 placeholder:font-regular"
                                    maxLength={3}
                                    placeholder='Kode Divisi'
                                    required
                                />
                                </div>
                                <p className='text-xs text-red-500 mt-1 ms-1'>Kode Hanya Boleh 3 Karakter dan Tidak Boleh Nomor</p>
                            </div>
                            <div className="flex mt-4 gap-5">
                                <button type='button' 
                                        onClick={() => [setOpens(false), setTimeout(() => setFormOpen(false), 350)]}
                                        className="!bg-gray-500 text-white p-2">
                                    Cancel
                                </button>
                                <button disabled={disabled} type="submit" className="bg-cyan-400 text-white p-2">Create Divisi</button>
                            </div>
                    </form>
                }
                </div>
            </div>
        </>
    )
}


export default newFormCard