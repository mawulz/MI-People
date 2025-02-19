import React, { useState } from 'react';
import { useAuth } from '../../auth/authContext'
import { Navbar, NavLeft, NavRight, NavTitle, Link } from 'framework7-react'

function customNavbar({ title }){
    const {role} = useAuth()

    return (
        <Navbar className='w-100'>
            <NavLeft>
              <Link icon="icon-bars" panelOpen="left" />
            </NavLeft>
            <NavTitle>{title}</NavTitle>
            <NavRight>
              <Link icon="icon-plus" />
            </NavRight>
        </Navbar>
    );
}

export default customNavbar;