import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SelectPaginate from '../../kit/selectPaginate';
import Swal from 'sweetalert2';

const newFormItemCard = ({ formOpen, setFormOpen, belongsTo }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [opens, setOpens] = useState(false)

    const statuses = ([
        { value: 'in use', label: 'In Use' },
        { value: 'out', label: 'Out' },
        { value: 'in service', label: 'Servis' },
        { value: 'rusak', label: 'Rusak' }
    ]);
     
    const [newItem, setNewItem] = useState({
        category: null,
        user: null,
        brand: '',
        typeMonitor: '',
        status: null,
        unitDevice: '',
        dateBarangMasuk: '',
        spekOrigin: '',
        spekAkhir: '',    
        note: '',
        image : null,
    });
    
    const [disabled, setDisabled] = useState(false)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const goHome = () =>{
        navigate('/barang/list-barang')
    }

    useEffect(() => {
        console.log(newItem)
        if(formOpen){
            setTimeout(() => {
                setOpens(true)
            }, 100)
        }
    }, [newItem, formOpen])

    const handleFileImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.size > 5242880) {
            setNewItem((prevItems) => ({...prevItems, image : null}))
            fileInputRef.current.value = ''
            Swal.fire({
                icon: 'error',
                title: 'File Melebihi Batas Ukuran 5 MB'
            })
        } else {
            setNewItem({...newItem, image : file})
        }
    }

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        try {    
        if (disabled) {
            return;
        }
        setDisabled(true)
        
        const formdata = new FormData()

        formdata.append('user_id', newItem.user?.value)
        formdata.append('category_id', newItem.category?.value)
        formdata.append('status', newItem.status?.value)
        formdata.append('brand', newItem.brand)
        formdata.append('type_monitor', newItem.typeMonitor)
        formdata.append('unit_device', newItem.unitDevice)
        formdata.append('date_barang_masuk', newItem.dateBarangMasuk)
        formdata.append('spek_origin', newItem.spekOrigin)
        formdata.append('spek_akhir', newItem.spekAkhir)
        formdata.append('note', newItem.note)
        if (newItem.image) {
            formdata.append('image', newItem.image)
        }
        await api.post('/barang', formdata, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        });
        navigate(-1)
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Tidak Dapat Membuat Barang',
                text:'Ada Kesalahan Dalam Sistem'
            })
        } finally {
            setDisabled(false)
        }
    };

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
                    <form onSubmit={handleItemSubmit} className='p-10 pt-5'>
                        <div className='grid grid-cols-2 gap-2'>
                        <div className="mb-5">
                            <label>User:</label>
                            <SelectPaginate
                            source={'user'}
                            selectName={'User'}
                            itemLabel={['name']}
                            handleSelectChange={user => setNewItem({...newItem, user})}
                            />
                        </div>
                        <div className="mb-5">
                            <label>Category:</label>
                            <SelectPaginate
                            selectName={'Kategori'}
                            source={'category'}
                            itemLabel={['name', 'kode']}
                            handleSelectChange={category => setNewItem({...newItem, category})}
                            />
                        </div>
                        <div className="mb-5 ">
                            <label>Status:</label>
                            <Select 
                                options={statuses} 
                                value={newItem.status} 
                                onChange={status => setNewItem({ ...newItem, status })}
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label>Brand:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border'>
                            <input 
                                type="text" 
                                name="brand" 
                                value={newItem.brand} 
                                onChange={e => setNewItem({ ...newItem, brand: e.target.value })}
                                className="w-full p-2 border rounded placeholder:text-gray-400 placeholder:font-inter placeholder:font-light "
                                maxLength={80}
                                placeholder='Nama Brand'
                                required
                            />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label>Type Monitor:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border'>
                            <input 
                                type="text" 
                                name="typeMonitor" 
                                value={newItem.typeMonitor} 
                                onChange={e => setNewItem({ ...newItem, typeMonitor: e.target.value })}
                                maxLength={80}
                                placeholder='Tipe Monitor'
                                className="w-full p-2 border rounded placeholder:text-gray-400 placeholder:font-inter placeholder:font-light"
                                required
                            />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label>Unit Device:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border'>
                            <input 
                                type="text" 
                                name="unitDevice" 
                                value={newItem.unitDevice} 
                                onChange={e => setNewItem({ ...newItem, unitDevice: e.target.value })}
                                maxLength={255}
                                className="w-full p-2 border rounded placeholder:text-gray-400 placeholder:font-inter placeholder:font-light"
                                placeholder='Nama Unit'
                                required
                            />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label>Date Barang Masuk:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border text-gray-400 font-light font-inter'>
                            <input 
                                type="date" 
                                name="dateBarangMasuk" 
                                value={newItem.dateBarangMasuk} 
                                onChange={e => setNewItem({ ...newItem, dateBarangMasuk: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label>Spek Origin:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border font-light font-inter'>
                            <input 
                                type="text" 
                                name="spekOrigin" 
                                value={newItem.spekOrigin} 
                                onChange={e => setNewItem({ ...newItem, spekOrigin: e.target.value })}
                                maxLength={255}
                                className="w-full p-2 border rounded placeholder:text-gray-400 placeholder:font-inter placeholder:font-light"                            
                                placeholder='Spek Origin'
                                required
                            />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label>Note:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border font-light font-inter'>
                            <input 
                                type="text" 
                                name="spekOrigin" 
                                value={newItem.note} 
                                onChange={e => setNewItem({ ...newItem, note: e.target.value })}
                                maxLength={255}
                                className="w-full p-2 border rounded placeholder:text-gray-400 placeholder:font-inter placeholder:font-light"                            
                                placeholder='Note'
                            />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label>Image:</label>
                            <div className='bg-white p-2 rounded-md border-solid border-gray-300 border font-light font-inter'>
                            <input 
                                type="file" 
                                id="img" 
                                name="img" 
                                accept="image/jpeg, image/png"
                                onChange={handleFileImageChange}
                                ref={fileInputRef} 
                                />
                            </div>
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
                </div>
            </div>
        </>
    );
}

export default newFormItemCard;
