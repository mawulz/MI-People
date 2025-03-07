import React, { useState, useEffect } from 'react'
import useAuth from '../../useAuth';
import { useNavigate } from 'react-router-dom';

const CustomSidebar = ({ navOpen, setNavOpen }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [opens, setOpens] = useState(false)
    const { name, email, role } = useAuth();
    const handleNavigation = useNavigate()

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (navOpen) {
            setTimeout(() => {
                setOpens(true);
            }, 100);
        }

    }, [navOpen]);

    // useEffect(() => {
    //     const body = document.getElementById('layouts')
    //     if (body) {
    //         if (opens) {
    //             body.classList.add(`!overflow-y-hidden`)
    //         } else {
    //             body.classList.remove(`!overflow-y-hidden`)
    //         }
    //     }
    // }, [opens])

    const isActive = (path) => location.pathname.startsWith(path);
    return (
        <>
            <div className={`fixed inset-0 bg-black transition-opacity duration-350 z-50
            ${opens ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
                onClick={() => [setOpens(false), setTimeout(() => setNavOpen(false), 350)]}
            />
            <div className={`!fixed bg-gray-900 hidden-scrollbar absolute top-0 left-0 z-1000 border h-screen transition-all ease-in-out duration-300 ${opens ? 'w-80 overflow-y-scroll max-h-full' : 'w-0'} overflow-hidden`}>
                <div className="navbar grid grid-cols-2">
                    {/* <h2 className="ms-4 font-bold font-inter text-white text-xl mt-5">INVENTORY</h2> */}
                    <button className='col-start-2 btn-sm !w-20 justify-self-end !bg-transparent' onClick={() => [setOpens(false), setTimeout(() => setNavOpen(false), 350)]}>
                        <i class='bx bx-x bx-sm p-1'></i>
                    </button>
                </div>
                <div className="bottom-nav flex flex-col font-inter mt-1">
                    <button className="w-100 text-start" onClick={role === 'user' ? () => handleNavigation('/dashboard') : () => handleNavigation('/dashboard') }>
                        <div className={`flex items-center w-60 mb-1 pb-1 rounded-r-full ${isActive('/dashboard') ? 'bg-coklat-mi text-white' : ''}  active:bg-coklat-mi active:text-white pt-2`}>
                            <i className="bx bxs-dashboard text-3xl ms-5 me-4"></i>
                            <p className="text-lg font-medium">Dashboard</p>
                        </div>
                    </button>
                    <button className="w-100 text-start" onClick={() => handleNavigation('/profile')}>
                        <div className={`flex items-center w-60 mb-1 pb-1 rounded-r-full ${isActive('/profile') ? 'bg-coklat-mi text-white' : ''}  active:bg-coklat-mi active:text-white pt-2`}>
                            <i className="bx bx-user text-3xl ms-5 me-4"></i>
                            <p className="text-lg font-medium">Profile</p>
                        </div>
                    </button>
                    <button className="w-100 text-start" onClick={role === 'user' ? () => handleNavigation('/barang') : () => handleNavigation('/barang')}>
                        <div className={`flex items-center mb-1 w-60 py-1 rounded-r-full ${isActive('/barang') ? 'bg-coklat-mi text-white' : ''}  active:bg-coklat-mi active:text-white`}>
                            <i className="bx bx-package text-3xl ms-5 me-4"></i>
                            <p className="text-lg font-medium">{role === 'user' ? 'Barang Anda' : 'Barang'}</p>
                        </div>
                    </button>
                    {/* Jika Bukan Admin Tidak Muncul */}
                    {
                        role == 'admin' && 
                        <div className={`hidden-to-user `}>
                            <button className="w-100 text-start" onClick={() => handleNavigation('/department')}>
                                <div className={`flex items-center mb-1 w-60 py-1 rounded-r-full ${isActive('/department') ? 'bg-coklat-mi text-white' : ''} active:bg-coklat-mi active:text-white`}>
                                    <i className="bx bx-building text-3xl ms-5 me-4"></i>
                                    <p className="text-lg font-medium">Department</p>
                                </div>
                            </button>
                            <button className="w-100 text-start" onClick={() => handleNavigation('/divisi')}>
                                <div className={`flex items-center mb-1 w-60 py-1 rounded-r-full ${isActive('/divisi') ? 'bg-coklat-mi text-white' : ''} active:bg-coklat-mi active:text-white`}>
                                    <i className="bx bx-briefcase text-3xl ms-5 me-4"></i>
                                    <p className="text-lg font-medium">Divisi</p>
                                </div>
                            </button>
                        </div>
                    }
                                        
                    {/* <button disabled className="w-100 text-start !bg-gray-800" onClick={role === 'user' ? () => handleNavigation('/make-request/personal-make-request') :() => handleNavigation('/make-request/list-make-request')}>
                        <div className={`flex items-center mb-1 w-60 py-1 rounded-r-full ${isActive('/make-request') ? 'bg-coklat-mi text-white' : ''} active:bg-coklat-mi active:text-white`}>
                            <i className="bx bx-message-add text-3xl ms-5 me-4"></i>
                            <p className="text-lg font-medium">{role == 'user' ? 'Make Request' : 'Data MR'}</p>
                        </div>
                    </button> */}
                </div>
            </div>
        </>
    )
}


export default CustomSidebar