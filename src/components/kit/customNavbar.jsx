import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/authContext'
import { Navbar, NavLeft, NavRight, NavTitle, Link } from 'framework7-react'
import { useNavigate } from 'react-router-dom';
import CustomSidebar from './customSidebar';
import 'boxicons/css/boxicons.min.css';

function customNavbar({ title }){
    const {role} = useAuth()
    const [openSidebar, setOpenSidebar] = useState(false)
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    }

    return (
        <>
        <Navbar className='!border !fixed border-black !border-x-0'>
            <NavLeft>
                <button aria-label='open-sidebar' className='!bg-transparent mx-2' onClick={() => setOpenSidebar(!openSidebar)}>
                    <i className="bx bx-menu text-black bx-sm" style={{fontWeight: '300'}}></i>
                </button>
            </NavLeft>
            <NavTitle className='!ml-0 !font-extrabold'>{title}</NavTitle>
            <NavRight className='!ml-0 border-l-1 h-full'>
                <Link onClick={logout} className='ml-2'>Log out</Link>
            </NavRight>
        </Navbar>
        { openSidebar &&
            <CustomSidebar navOpen={openSidebar} setNavOpen={setOpenSidebar} />
        }
        </>
    );
}

export default customNavbar;