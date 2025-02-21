import React, { lazy } from 'react'
import { Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/authContext';
import './App.css'
import { App } from 'framework7-react';
import Login from './login/Login'
import RequireAuth from '../auth/requireAuth'

const Dashboard = lazy(() => import('../components/dashboard/dashboard'));
const ListDepartment = lazy(() => import('../components/department/listDepartment'));

function testApp() {
  const f7params = {
    name: 'project-test',
    theme: 'auto'
  };

  return (
    <React.StrictMode>
      <AuthProvider>
        <App {...f7params}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route element={<RequireAuth allowedRoles={['admin', 'user']}/>}>
                <Route path='/dashboard' element={<Dashboard/>}/>
              </Route>
              <Route element={<RequireAuth allowedRoles={'admin'}/>}>
                <Route path='/list-department' element={<ListDepartment/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </App>
      </AuthProvider>
    </React.StrictMode>
  )
}

export default testApp
