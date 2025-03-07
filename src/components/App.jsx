import React, { lazy } from 'react'
import { Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/authContext';
import './App.css'
import { App } from 'framework7-react';
import Login from './login/Login'
import RequireAuth from '../auth/requireAuth'

const Dashboard = lazy(() => import('./dashboard/dashboard'));
const ListDepartment = lazy(() => import('../components/department/listDepartment'));
const ListDivisi = lazy(() => import('../components/divisi/listDivisi'));
const UpdateDepartment = lazy(() => import('../components/department/updateDepartment'));
const UpdateDivisi = lazy(() => import('../components/divisi/updateDivisi'))
const RestoreDepartment = lazy(() => import('../components/department/restoreDepartment'));
const RestoreDivisi = lazy(() => import('../components/divisi/restoreDivisi'));
const Profile = lazy(() => import('./profile/userProfile'))
const Items = lazy(() => import('../components/barang/listItem'))

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
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/barang' element={<Items/>}/>
              </Route>
              <Route element={<RequireAuth allowedRoles={'admin'}/>}>
                <Route path='/department' element={<ListDepartment/>}/>
                <Route path='/department/update-department/:id' element={<UpdateDepartment/>}/>
                <Route path='/department/restore-department' element={<RestoreDepartment/>} />

                <Route path='/divisi' element={<ListDivisi/>}/>
                <Route path='/divisi/restore-divisi' element={<RestoreDivisi/>}/>
                <Route path='/divisi/update-divisi/:id' element={<UpdateDivisi/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </App>
      </AuthProvider>
    </React.StrictMode>
  )
}

export default testApp
