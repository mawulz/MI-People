import { Page, Block } from 'framework7-react'
import Navbar from '../kit/customNavbar'
import React, { useState, useEffect } from 'react'
import useAuth from '../../useAuth';
import api from '../../api/api';
import barangIcon from '../../assets/package-regular-120.png'
import departmentIcon from '../../assets/building-regular-120.png'
import LogoMI from '../../assets/baru.png'
import divisiIcon from '../../assets/briefcase-regular-120.png'
import userIcon from '../../assets/user-circle-regular-120.png'
import MRIcon from '../../assets/spreadsheet-regular-120.png'
import RAIcon from '../../assets/cog-regular-120.png'
import Loader from '../kit/Loader';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { role, name } = useAuth();
    const [items, setItems] = useState({});
    const [barang, setBarang] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contentVisible, setContentVisible] = useState(false)
    const [showPending, setShowPending] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            setShowPending(prev => !prev)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async() => {
        try {
            setLoading(true)
            const response = await api.get('dashboard/admin')
            setItems(response.data)
        } catch (error) {

        } finally {
            setLoading(false)
            setTimeout(() => setContentVisible(true), 50)
        }
    };



    return (
        <>
            <Navbar title={'Dashboard'}/>
            <div className={`transition-opacity duration-700 ${contentVisible ? 'opacity-100' : 'opacity-0'} place-items-center p-12 m-5`}>
                <p className='text-center font-extrabold text-4xl'>Welcome, {name}!</p>
                {/* <img src={LogoMI} className='max-w-50' alt="" /> */}
                <div className="bg-slate-200 max-w-3xl shadow-xl mt-10">
                    <div className='bg-gray-800 py-[0.2px] px-5'>
                        <p className='text-white font-semibold text-xl'>Menu</p>
                    </div>
                    <div className="content p-5 grid grid-cols-3 gap-4">
                        <div className="barang bg-teal-500">
                            <div className="barang-content flex justify-between items-center p-5">
                                <div className="left-side text-white items-start">
                                    <p className={`text-3xl font-bold text-center !m-0`}>{items.barang}</p>
                                    <p className='font-medium text-center !m-0'>Barang</p>
                                </div>
                                    <img src={barangIcon} className='opacity-50 max-w-20' alt="" />
                            </div>
                        </div>
                        {
                            role === 'admin' ?
                            (
                                <>
                                    <div className="department bg-cyan-500">
                                        <div className="department-content flex justify-between items-center z-10 overflow-hidden p-5">
                                            <div className="left-side text-white items-start">
                                                <p className={`text-3xl font-bold text-center !m-0`}>{items.department}</p>
                                                <p className='font-medium text-center !m-0'>Department</p>
                                            </div>
                                                <img src={departmentIcon} className='opacity-50 max-w-20' alt="" />
                                        </div>
                                    </div>
                                    <div className="divisi bg-violet-400 ">
                                        <div className="divisi-content flex justify-between items-center z-10 overflow-hidden p-5">
                                            <div className="left-side text-white items-start ">
                                                <p className='text-3xl font-bold text-center !m-0'>{items.divisi}</p>
                                                <p className='font-medium text-center !m-0'>Divisi</p>
                                            </div>
                                                <img src={divisiIcon} className='opacity-50 max-w-20' alt="" />
                                        </div>
                                    </div>
                                    <div className="user bg-red-400 ">
                                        <div className="user-content flex justify-between items-center z-10 overflow-hidden p-5">
                                            <div className="left-side w-20 text-white items-start ">
                                                <p className='text-3xl font-bold text-center !m-0'>{items.user}</p>
                                                <p className='font-medium text-center !m-0'>User</p>
                                            </div>
                                                <img src={userIcon} className='opacity-50 max-w-20' alt="" />
                                        </div>
                                    </div>
                                    <div className="MR bg-orange-400">
                                        <div className="MR-content flex justify-between items-center overflow-hidden p-5">
                                        <div className={`left-side text-white flex flex-col items-start `}>
                                                <div className={`total-mr-count duration-1000 ${showPending ? 'opacity-100' : 'opacity-0'}`}>
                                                    <p className='text-center max-sm:text-2xl text-3xl font-bold !m-0 overflow-hidden whitespace-nowrap max-sm:text-ellipsis'>{items.makerequest}</p>
                                                    <p className='font-medium w-full text-center !m-0'>Make Request</p>
                                                </div>
                                                <div className={`teks -z-0 absolute text-white flex flex-col items-start justify-center transition-opacity duration-1000 ${showPending ? 'opacity-0' : 'opacity-100'}`}>
                                                        <p className='text-center max-sm:text-2xl text-3xl font-bold !m-0 overflow-hidden whitespace-nowrap max-sm:text-ellipsis'>{items.mrPending}</p>
                                                        <p className=' text-center font-medium !m-0'>MR Pending</p>
                                                </div>
                                            </div>
                                            <div className='right-side w-max overflow-hidden flex items-center justify-end'>
                                                <img src={MRIcon} className={`max-w-20 opacity-50`} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="billing bg-emerald-400">
                                        <div className="relative billing-content flex justify-between items-center z-10 overflow-hidden p-5">
                                            <div className={`left-side text-white flex flex-col items-start`}>
                                                <div className={`total-billing-count -z-10 duration-1000 ${showPending ? 'opacity-100' : 'opacity-0'}`}>
                                                    <p className='text-center max-sm:text-2xl text-3xl !m-0 font-bold overflow-hidden whitespace-nowrap  max-sm:text-ellipsis'>{items.billing}</p>
                                                    <p className='text-center font-medium !m-0 w-full'>Billing</p>
                                                </div>
                                                <div className={`teks -z-10 absolute text-white flex flex-col items-start justify-center transition-opacity duration-1000 ${showPending ? 'opacity-0' : 'opacity-100'}`}>
                                                        <p className='!m-0 text-center max-sm:text-2xl text-3xl font-bold overflow-hidden whitespace-nowrap '>{items.billing3MonthWarning}</p>
                                                        <p className='!m-0 text-center font-medium'>Billing Expire</p>
                                                </div>
                                            </div>
                                            <div className='right-side relative w-max overflow-hidden flex items-center justify-end'>
                                                <img src={RAIcon} className={`max-w-20 transition-opacity duration-1000 opacity-50`} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                            :
                            (
                                <div>
                                    <p>tes</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <p className='font-light'>@MI People</p>
            </div>
        </>
    )
}

export default Dashboard;