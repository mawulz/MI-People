import React, { useState } from 'react';
import { useAuth } from '../../auth/authContext'
import { Navbar, NavLeft, NavRight, NavTitle, Link } from 'framework7-react'
import { useNavigate } from 'react-router-dom';

function customNavbar({ title }){
    const {role} = useAuth()
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    }

    return (
        <Navbar className='!border border-black'>
            <NavLeft>
                <Link onClick={() => navigate('/dashboard')}>Dashboard</Link>
            </NavLeft>
            <NavTitle className='!ml-0 !font-bold'>{title}</NavTitle>
            <NavRight className='!ml-0 border-l-1 h-full'>
                <Link onClick={logout} className='ml-2'>Log out</Link>
            </NavRight>
        </Navbar>
    );
}

export default customNavbar;